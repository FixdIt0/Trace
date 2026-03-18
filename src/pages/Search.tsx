import { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";

type Result = { site: string; url: string };
type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Search({ onNavigate }: Props) {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  const startScan = () => {
    if (!username.trim() || scanning) return;
    setResults([]);
    setDone(false);
    setElapsed(0);

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
        setScanning(false);
        setDone(true);
        clearInterval(timerRef.current);
        ws.close();
      }
    };
    ws.onerror = () => { setScanning(false); setDone(true); clearInterval(timerRef.current); };
    ws.onclose = () => { setScanning(false); clearInterval(timerRef.current); };
  };

  useEffect(() => () => { wsRef.current?.close(); clearInterval(timerRef.current); }, []);

  const getFavicon = (url: string) => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; } catch { return ""; }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Nav onNavigate={onNavigate} />

      {/* Scanline effect when active */}
      {scanning && <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden",
      }}>
        <div style={{
          width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,140,255,0.3), transparent)",
          animation: "scanline 2s linear infinite",
        }} />
      </div>}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 24px 60px" }}>
        {/* Search input */}
        <div style={{ marginBottom: 48, animation: "fadeUp 0.6s ease-out" }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Username Investigation
          </h2>
          <p style={{ fontSize: 14, color: "#4a4d58", marginBottom: 28 }}>
            Enter a username to scan across 400+ platforms.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "0 16px", transition: "border-color 0.2s",
            }}>
              <span style={{ color: "#2e3040", fontSize: 14, marginRight: 8 }}>@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startScan()}
                placeholder="Enter username..."
                disabled={scanning}
                style={{
                  flex: 1, padding: "14px 0", background: "transparent", border: "none", outline: "none",
                  color: "#e8e6e1", fontSize: 14, fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>
            <button
              onClick={startScan}
              disabled={scanning || !username.trim()}
              style={{
                padding: "0 28px", fontSize: 13, fontWeight: 600,
                background: scanning ? "#1e2030" : "#638cff", color: "#fff",
                border: "none", borderRadius: 8, cursor: scanning ? "default" : "pointer",
                transition: "all 0.2s", letterSpacing: "0.02em",
                opacity: !username.trim() ? 0.4 : 1,
              }}
            >{scanning ? "Scanning..." : "Scan"}</button>
          </div>
        </div>

        {/* Status bar */}
        {(scanning || done) && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px", marginBottom: 16,
            background: "rgba(255,255,255,0.02)", borderRadius: 8,
            border: `1px solid ${scanning ? "rgba(99,140,255,0.15)" : done && results.length > 0 ? "rgba(80,200,120,0.15)" : "rgba(255,255,255,0.04)"}`,
            fontSize: 12, animation: "fadeUp 0.3s ease-out",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {scanning && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#638cff", animation: "pulse 1s infinite" }} />}
              {done && <span style={{ color: "#50c878" }}>✓</span>}
              <span style={{ color: "#6b6e7b" }}>
                {scanning ? `Scanning platforms...` : `Scan complete`}
              </span>
            </div>
            <div style={{ display: "flex", gap: 20, color: "#4a4d58" }}>
              <span>{results.length} found</span>
              <span>{elapsed.toFixed(1)}s</span>
            </div>
          </div>
        )}

        {/* Results list */}
        <div ref={listRef} style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto" }}>
          {results.map((r, i) => (
            <a
              key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.02)",
                animation: "slideIn 0.3s ease-out", animationFillMode: "backwards",
                animationDelay: `${Math.min(i * 0.03, 0.5)}s`,
                transition: "background 0.15s",
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

        {/* Empty state */}
        {!scanning && !done && results.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 0", color: "#2e3040",
            animation: "fadeUp 0.6s ease-out",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>◎</div>
            <div style={{ fontSize: 13 }}>Enter a username to begin investigation</div>
          </div>
        )}
      </div>
    </div>
  );
}
