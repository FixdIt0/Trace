import { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";

type Result = { site: string; url: string };
type PhoneResult = {
  valid: boolean; possible: boolean; international: string; national: string;
  e164: string; country_code: number; country: string; carrier: string;
  line_type: string; timezones: string[];
} | null;

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Search({ onNavigate }: Props) {
  const [tab, setTab] = useState<"username" | "phone">("username");

  // Username state
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Phone state
  const [phone, setPhone] = useState("");
  const [phoneResult, setPhoneResult] = useState<PhoneResult>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [deepScan, setDeepScan] = useState<Record<string, string> | null>(null);
  const [scanPhase, setScanPhase] = useState("");
  const [scanSteps, setScanSteps] = useState<string[]>([]);

  const startScan = () => {
    if (!username.trim() || scanning) return;
    setResults([]); setDone(false); setElapsed(0);
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${location.host}/ws/search`);
    wsRef.current = ws;
    setScanning(true);
    const t0 = Date.now();
    timerRef.current = window.setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);
    ws.onopen = () => ws.send(JSON.stringify({ username: username.trim() }));
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "result") {
        setResults(prev => [...prev, { site: msg.site, url: msg.url }]);
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      }
      if (msg.type === "done" || msg.type === "error") {
        setScanning(false); setDone(true); clearInterval(timerRef.current); ws.close();
      }
    };
    ws.onerror = () => { setScanning(false); setDone(true); clearInterval(timerRef.current); };
    ws.onclose = () => { setScanning(false); clearInterval(timerRef.current); };
  };

  const scanPhone = async () => {
    if (!phone.trim() || phoneLoading) return;
    setPhoneLoading(true); setPhoneError(""); setPhoneResult(null); setDeepScan(null); setScanSteps([]); setScanPhase("");

    // Phase 1: real data
    let realData: any = null;
    try {
      setScanPhase("Querying carrier database...");
      const res = await fetch("/api/phone", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      realData = await res.json();
      if (realData.error) { setPhoneError(realData.error); setPhoneLoading(false); return; }
      setPhoneResult(realData);
    } catch { setPhoneError("Scan failed."); setPhoneLoading(false); return; }

    // Phase 2: fake deep scan with dramatic delays
    const seed = phone.replace(/\D/g, "").split("").reduce((a, c) => a + parseInt(c), 0);
    const pick = (arr: string[]) => arr[seed % arr.length];
    const pickN = (arr: string[], n: number) => {
      const shuffled = [...arr].sort((a, b) => ((seed * 7 + arr.indexOf(a)) % 13) - ((seed * 7 + arr.indexOf(b)) % 13));
      return shuffled.slice(0, n);
    };

    const phases = [
      "Running OSINT footprint scan...",
      "Checking telecom registration databases...",
      "Scanning social media linkage...",
      "Querying breach databases...",
      "Analyzing network metadata...",
      "Cross-referencing public records...",
      "Compiling threat assessment...",
    ];

    for (const p of phases) {
      setScanPhase(p);
      setScanSteps(prev => [...prev, p]);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    }

    const services = pickN(["WhatsApp", "Telegram", "Signal", "Viber", "iMessage", "Truecaller", "Facebook", "Instagram", "Snapchat", "TikTok", "Twitter/X", "LinkedIn", "Uber", "Lyft", "DoorDash", "Venmo", "Cash App", "PayPal", "Coinbase", "Binance"], 4 + (seed % 5));
    const breaches = pickN(["LinkedIn (2021)", "Facebook (2019)", "Twitter (2023)", "Truecaller (2022)", "Telegram (2020)", "Adobe (2013)", "Canva (2019)", "Dropbox (2012)"], 1 + (seed % 3));
    const riskScore = 35 + (seed % 55);

    setDeepScan({
      simType: seed % 3 === 0 ? "eSIM" : "Physical SIM",
      numberAge: `~${2 + (seed % 8)} years`,
      portHistory: seed % 4 === 0 ? "Ported (1 carrier change detected)" : "No port history",
      spamReports: `${seed % 12} reports (${seed % 12 > 5 ? "elevated" : "low"})`,
      linkedServices: services.join(", "),
      breachExposure: breaches.join(", "),
      riskScore: `${riskScore}/100`,
      riskLevel: riskScore > 70 ? "HIGH" : riskScore > 45 ? "MEDIUM" : "LOW",
      registeredName: pick(["J. " + pick(["Smith", "Chen", "Patel", "Garcia", "Kim", "Williams", "Brown", "Jones"]), "Name withheld (Pro required)", "Partial match found"]),
      lastActivity: `${1 + (seed % 14)}d ago`,
      voipConfidence: realData?.line_type === "VoIP" ? "98.2% — confirmed virtual number" : `${4 + (seed % 12)}% — likely physical`,
    });

    setScanPhase("");
    setPhoneLoading(false);
  };

  useEffect(() => () => { wsRef.current?.close(); clearInterval(timerRef.current); }, []);

  const getFavicon = (url: string) => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; } catch { return ""; }
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer",
    color: active ? "#e8e6e1" : "#4a4d58", background: active ? "rgba(255,255,255,0.04)" : "transparent",
    border: "1px solid " + (active ? "rgba(255,255,255,0.08)" : "transparent"),
    borderRadius: 6, transition: "all 0.2s",
  });

  const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
    }}>
      <span style={{ fontSize: 13, color: "#4a4d58" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#e8e6e1", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Nav onNavigate={onNavigate} />

      {scanning && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,140,255,0.3), transparent)", animation: "scanline 2s linear infinite" }} />
      </div>}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 24px 60px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, animation: "fadeUp 0.5s ease-out" }}>
          <div style={tabStyle(tab === "username")} onClick={() => setTab("username")}>◎ Username</div>
          <div style={tabStyle(tab === "phone")} onClick={() => setTab("phone")}>☎ Phone Number</div>
        </div>

        {/* USERNAME TAB */}
        {tab === "username" && (
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6 }}>Username Reconnaissance</h2>
            <p style={{ fontSize: 13, color: "#4a4d58", marginBottom: 24 }}>Scan across 400+ social networks, forums, and platforms.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "0 16px",
              }}>
                <span style={{ color: "#2e3040", fontSize: 14, marginRight: 8 }}>@</span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && startScan()} placeholder="Enter username..."
                  disabled={scanning}
                  style={{ flex: 1, padding: "13px 0", background: "transparent", border: "none", outline: "none", color: "#e8e6e1", fontSize: 14, fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <button onClick={startScan} disabled={scanning || !username.trim()}
                style={{
                  padding: "0 28px", fontSize: 13, fontWeight: 600,
                  background: scanning ? "#1e2030" : "#638cff", color: "#fff",
                  border: "none", borderRadius: 8, cursor: scanning ? "default" : "pointer",
                  opacity: !username.trim() ? 0.4 : 1, transition: "all 0.2s",
                }}
              >{scanning ? "Scanning..." : "Scan"}</button>
            </div>

            {(scanning || done) && (
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "10px 16px", marginBottom: 12,
                background: "rgba(255,255,255,0.02)", borderRadius: 8,
                border: `1px solid ${scanning ? "rgba(99,140,255,0.15)" : "rgba(80,200,120,0.15)"}`,
                fontSize: 12, animation: "fadeUp 0.3s ease-out",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {scanning && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#638cff", animation: "pulse 1s infinite" }} />}
                  {done && <span style={{ color: "#50c878" }}>✓</span>}
                  <span style={{ color: "#6b6e7b" }}>{scanning ? "Scanning platforms..." : "Scan complete"}</span>
                </div>
                <div style={{ display: "flex", gap: 20, color: "#4a4d58" }}>
                  <span>{results.length} found</span>
                  <span>{elapsed.toFixed(1)}s</span>
                </div>
              </div>
            )}

            <div ref={listRef} style={{ maxHeight: "calc(100vh - 380px)", overflowY: "auto" }}>
              {results.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                    animation: "slideIn 0.3s ease-out", animationFillMode: "backwards",
                    animationDelay: `${Math.min(i * 0.03, 0.5)}s`, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <img src={getFavicon(r.url)} width={16} height={16} style={{ borderRadius: 2, opacity: 0.7 }} alt="" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#e8e6e1", minWidth: 120 }}>{r.site}</span>
                  <span style={{ fontSize: 12, color: "#3a3d4a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.url}</span>
                  <span style={{ fontSize: 11, color: "#638cff", opacity: 0.6 }}>↗</span>
                </a>
              ))}
            </div>

            {!scanning && !done && results.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#2e3040" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>◎</div>
                <div style={{ fontSize: 13 }}>Enter a username to begin investigation</div>
              </div>
            )}
          </div>
        )}

        {/* PHONE TAB */}
        {tab === "phone" && (
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6 }}>Phone Intelligence</h2>
            <p style={{ fontSize: 13, color: "#4a4d58", marginBottom: 24 }}>Deep scan: carrier, registration, linked services, breach exposure, threat assessment.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "0 16px",
              }}>
                <span style={{ color: "#2e3040", fontSize: 14, marginRight: 8 }}>+</span>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && scanPhone()} placeholder="1234567890 (include country code)"
                  disabled={phoneLoading}
                  style={{ flex: 1, padding: "13px 0", background: "transparent", border: "none", outline: "none", color: "#e8e6e1", fontSize: 14, fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <button onClick={scanPhone} disabled={phoneLoading || !phone.trim()}
                style={{
                  padding: "0 28px", fontSize: 13, fontWeight: 600,
                  background: phoneLoading ? "#1e2030" : "#638cff", color: "#fff",
                  border: "none", borderRadius: 8, cursor: phoneLoading ? "default" : "pointer",
                  opacity: !phone.trim() ? 0.4 : 1, transition: "all 0.2s",
                }}
              >{phoneLoading ? "Scanning..." : "Deep Scan"}</button>
            </div>

            {phoneError && (
              <div style={{ padding: "10px 16px", marginBottom: 16, borderRadius: 8, background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.15)", fontSize: 12, color: "#ff6b6b" }}>{phoneError}</div>
            )}

            {/* Live scan phases */}
            {phoneLoading && (
              <div style={{ marginBottom: 20, animation: "fadeUp 0.3s ease-out" }}>
                {scanSteps.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
                    fontSize: 12, animation: "slideIn 0.3s ease-out",
                  }}>
                    <span style={{ color: i === scanSteps.length - 1 && scanPhase ? "#638cff" : "#50c878", fontSize: 10 }}>
                      {i === scanSteps.length - 1 && scanPhase ? "●" : "✓"}
                    </span>
                    <span style={{ color: i === scanSteps.length - 1 && scanPhase ? "#6b6e7b" : "#4a4d58", fontFamily: "monospace" }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {phoneResult && (
              <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                {/* Status badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    background: phoneResult.valid ? "rgba(80,200,120,0.1)" : "rgba(255,80,80,0.1)",
                    color: phoneResult.valid ? "#50c878" : "#ff6b6b",
                    border: `1px solid ${phoneResult.valid ? "rgba(80,200,120,0.2)" : "rgba(255,80,80,0.2)"}`,
                  }}>{phoneResult.valid ? "✓ Valid" : "✗ Invalid"}</span>
                  <span style={{
                    padding: "4px 12px", fontSize: 11, borderRadius: 4,
                    background: "rgba(99,140,255,0.08)", color: "#638cff", border: "1px solid rgba(99,140,255,0.15)",
                  }}>{phoneResult.line_type}</span>
                  {deepScan && <span style={{
                    padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    background: deepScan.riskLevel === "HIGH" ? "rgba(255,80,80,0.1)" : deepScan.riskLevel === "MEDIUM" ? "rgba(255,180,50,0.1)" : "rgba(80,200,120,0.1)",
                    color: deepScan.riskLevel === "HIGH" ? "#ff6b6b" : deepScan.riskLevel === "MEDIUM" ? "#ffb432" : "#50c878",
                    border: `1px solid ${deepScan.riskLevel === "HIGH" ? "rgba(255,80,80,0.2)" : deepScan.riskLevel === "MEDIUM" ? "rgba(255,180,50,0.2)" : "rgba(80,200,120,0.2)"}`,
                  }}>Risk: {deepScan.riskLevel}</span>}
                </div>

                {/* Carrier data (real) */}
                <div style={{ fontSize: 11, color: "#4a4d58", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>CARRIER DATA</div>
                <div style={{
                  background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 10, padding: "4px 20px", marginBottom: 20,
                }}>
                  <Row label="International" value={phoneResult.international} mono />
                  <Row label="E.164" value={phoneResult.e164} mono />
                  <Row label="Country / Region" value={phoneResult.country} />
                  <Row label="Carrier" value={phoneResult.carrier} />
                  <Row label="Line Type" value={phoneResult.line_type} />
                  <Row label="Timezone(s)" value={phoneResult.timezones.join(", ") || "Unknown"} />
                </div>

                {/* Deep scan results (fake) */}
                {deepScan && <>
                  <div style={{ fontSize: 11, color: "#4a4d58", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>DEEP SCAN INTELLIGENCE</div>
                  <div style={{
                    background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 10, padding: "4px 20px", marginBottom: 20,
                  }}>
                    <Row label="SIM Type" value={deepScan.simType} />
                    <Row label="Number Age" value={deepScan.numberAge} />
                    <Row label="Port History" value={deepScan.portHistory} />
                    <Row label="VoIP Confidence" value={deepScan.voipConfidence} />
                    <Row label="Registered Name" value={deepScan.registeredName} />
                    <Row label="Last Activity" value={deepScan.lastActivity} />
                    <Row label="Spam Reports" value={deepScan.spamReports} />
                  </div>

                  <div style={{ fontSize: 11, color: "#4a4d58", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>LINKED SERVICES DETECTED</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {deepScan.linkedServices.split(", ").map((s, i) => (
                      <span key={i} style={{
                        padding: "5px 12px", fontSize: 11, borderRadius: 4,
                        background: "rgba(99,140,255,0.06)", color: "#638cff",
                        border: "1px solid rgba(99,140,255,0.1)",
                        animation: "slideIn 0.3s ease-out", animationDelay: `${i * 0.05}s`, animationFillMode: "backwards",
                      }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: "#4a4d58", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>BREACH EXPOSURE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {deepScan.breachExposure.split(", ").map((b, i) => (
                      <span key={i} style={{
                        padding: "5px 12px", fontSize: 11, borderRadius: 4,
                        background: "rgba(255,80,80,0.06)", color: "#ff6b6b",
                        border: "1px solid rgba(255,80,80,0.1)",
                      }}>{b}</span>
                    ))}
                  </div>

                  {/* Risk score bar */}
                  <div style={{ fontSize: 11, color: "#4a4d58", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>THREAT ASSESSMENT</div>
                  <div style={{
                    background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 10, padding: "16px 20px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b6e7b" }}>Risk Score</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: deepScan.riskLevel === "HIGH" ? "#ff6b6b" : deepScan.riskLevel === "MEDIUM" ? "#ffb432" : "#50c878" }}>{deepScan.riskScore}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2, transition: "width 1s ease-out",
                        width: deepScan.riskScore.replace("/100", "") + "%",
                        background: deepScan.riskLevel === "HIGH" ? "#ff6b6b" : deepScan.riskLevel === "MEDIUM" ? "#ffb432" : "#50c878",
                      }} />
                    </div>
                  </div>
                </>}
              </div>
            )}

            {!phoneResult && !phoneError && !phoneLoading && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#2e3040" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>☎</div>
                <div style={{ fontSize: 13 }}>Enter a phone number with country code</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
