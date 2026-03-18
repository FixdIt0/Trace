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
    setPhoneLoading(true); setPhoneError(""); setPhoneResult(null);
    try {
      const res = await fetch("/api/phone", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (data.error) { setPhoneError(data.error); }
      else { setPhoneResult(data); }
    } catch { setPhoneError("Scan failed. Try again."); }
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
            <p style={{ fontSize: 13, color: "#4a4d58", marginBottom: 24 }}>Validate, geolocate, and identify carrier information for any international number.</p>

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
              >{phoneLoading ? "Scanning..." : "Scan"}</button>
            </div>

            {phoneError && (
              <div style={{
                padding: "10px 16px", marginBottom: 16, borderRadius: 8,
                background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.15)",
                fontSize: 12, color: "#ff6b6b",
              }}>{phoneError}</div>
            )}

            {phoneResult && (
              <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                {/* Status badge */}
                <div style={{
                  display: "flex", gap: 8, marginBottom: 20,
                }}>
                  <span style={{
                    padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    background: phoneResult.valid ? "rgba(80,200,120,0.1)" : "rgba(255,80,80,0.1)",
                    color: phoneResult.valid ? "#50c878" : "#ff6b6b",
                    border: `1px solid ${phoneResult.valid ? "rgba(80,200,120,0.2)" : "rgba(255,80,80,0.2)"}`,
                  }}>{phoneResult.valid ? "✓ Valid" : "✗ Invalid"}</span>
                  <span style={{
                    padding: "4px 12px", fontSize: 11, borderRadius: 4,
                    background: "rgba(99,140,255,0.08)", color: "#638cff",
                    border: "1px solid rgba(99,140,255,0.15)",
                  }}>{phoneResult.line_type}</span>
                </div>

                {/* Data rows */}
                <div style={{
                  background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 10, padding: "4px 20px",
                }}>
                  <Row label="International" value={phoneResult.international} mono />
                  <Row label="National" value={phoneResult.national} mono />
                  <Row label="E.164" value={phoneResult.e164} mono />
                  <Row label="Country Code" value={"+" + phoneResult.country_code} />
                  <Row label="Country / Region" value={phoneResult.country} />
                  <Row label="Carrier" value={phoneResult.carrier} />
                  <Row label="Line Type" value={phoneResult.line_type} />
                  <Row label="Timezone(s)" value={phoneResult.timezones.join(", ") || "Unknown"} />
                </div>
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
