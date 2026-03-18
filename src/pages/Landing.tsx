import { useState } from "react";
import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

const CA = "F8KqRqh1SWRDPcvDnTWvjFS87bEjzvf4C1e94ofKpump";

export default function Landing({ onNavigate }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Nav onNavigate={onNavigate} />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Glow orbs */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,140,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 400, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,99,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Hero */}
      <div style={{
        position: "relative", zIndex: 2, paddingTop: 160,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        animation: "fadeUp 0.8s ease-out",
      }}>
        {/* Live badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 20,
          background: "rgba(99,140,255,0.08)", border: "1px solid rgba(99,140,255,0.15)",
          fontSize: 12, color: "#638cff", fontWeight: 500, marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#50c878", animation: "pulse 2s infinite" }} />
          Live on Solana
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 740, marginBottom: 24 }}>
          Anyone can be<br />
          <span style={{ color: "#638cff" }}>found</span>
        </h1>

        <p style={{
          fontSize: 17, color: "#6b6e7b", lineHeight: 1.7, maxWidth: 520, marginBottom: 20,
          fontFamily: "'Source Serif 4', serif",
        }}>
          Username reconnaissance across 400+ platforms. Phone number intelligence with carrier, location, and line-type data. Real-time results. No installs.
        </p>

        <p style={{
          fontSize: 13, color: "#4a4d58", marginBottom: 44, maxWidth: 400,
          fontFamily: "'Source Serif 4', serif", fontStyle: "italic",
        }}>
          The first OSINT intelligence token. Hold $TRACE to unlock Pro scans.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          <button
            onClick={() => onNavigate("search")}
            style={{
              padding: "14px 32px", fontSize: 14, fontWeight: 600,
              background: "#638cff", color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", letterSpacing: "0.02em",
              boxShadow: "0 0 40px rgba(99,140,255,0.25)", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#5278e8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#638cff"; e.currentTarget.style.transform = ""; }}
          >Start Investigation</button>
          <button
            onClick={() => onNavigate("docs")}
            style={{
              padding: "14px 32px", fontSize: 14, fontWeight: 500,
              background: "transparent", color: "#6b6e7b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#e8e6e1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6b6e7b"; }}
          >Documentation</button>
        </div>

        {/* CA + X row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
          <span
            onClick={() => { navigator.clipboard.writeText(CA); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            style={{
              padding: "8px 16px", fontSize: 12, fontFamily: "monospace",
              color: "#6b6e7b", cursor: "pointer", borderRadius: 6,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,140,255,0.3)"; e.currentTarget.style.color = "#e8e6e1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#6b6e7b"; }}
          >
            <span style={{ color: "#4a4d58" }}>CA:</span> {CA.slice(0, 4)}...{CA.slice(-4)}
            <span style={{ fontSize: 10, color: copied ? "#50c878" : "#4a4d58" }}>{copied ? "✓ Copied" : "Copy"}</span>
          </span>
          <a href="https://x.com/TrenchTreasures" target="_blank" rel="noopener noreferrer" style={{
            padding: "8px 16px", fontSize: 12, color: "#6b6e7b", textDecoration: "none",
            borderRadius: 6, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,140,255,0.3)"; e.currentTarget.style.color = "#e8e6e1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#6b6e7b"; }}
          >𝕏 <span style={{ color: "#4a4d58" }}>@TrenchTreasures</span></a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 64, padding: "32px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          {[
            { n: "400+", l: "Platforms scanned" },
            { n: "12M+", l: "Investigations run" },
            { n: "<8s", l: "Avg. scan time" },
            { n: "99.7%", l: "Detection rate" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "#4a4d58", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column feature highlight */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 960, margin: "100px auto 0", padding: "0 40px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
      }}>
        {/* Username card */}
        <div style={{
          padding: "40px 36px", borderRadius: 12,
          background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>◎</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Username Recon</div>
          <div style={{ fontSize: 14, color: "#4a4d58", lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", marginBottom: 20 }}>
            Powered by Sherlock. Scans 400+ social networks, forums, developer platforms, and gaming sites. Results stream in real-time as each platform responds.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Instagram", "Twitter/X", "GitHub", "Reddit", "TikTok", "Discord", "Steam", "Telegram"].map(p => (
              <span key={p} style={{ padding: "3px 8px", fontSize: 10, color: "#4a4d58", background: "rgba(255,255,255,0.03)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.04)" }}>{p}</span>
            ))}
            <span style={{ padding: "3px 8px", fontSize: 10, color: "#638cff" }}>+392</span>
          </div>
        </div>

        {/* Phone card */}
        <div style={{
          padding: "40px 36px", borderRadius: 12,
          background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>☎</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Phone Intelligence</div>
          <div style={{ fontSize: 14, color: "#4a4d58", lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", marginBottom: 20 }}>
            Powered by PhoneInfoga. Validates international numbers, identifies carrier and line type, geolocates region, detects VoIP and disposable numbers.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Carrier ID", "Line Type", "VoIP Detection", "Geolocation", "Validation", "Timezone"].map(p => (
              <span key={p} style={{ padding: "3px 8px", fontSize: 10, color: "#4a4d58", background: "rgba(255,255,255,0.03)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.04)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 960, margin: "24px auto 0", padding: "0 40px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
        background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden",
      }}>
        {[
          { icon: "⬡", title: "Real-time streaming", desc: "Watch results appear live via WebSocket as each platform is checked." },
          { icon: "◈", title: "PDF reports", desc: "Export full intelligence reports with timestamps and confidence scores." },
          { icon: "△", title: "REST + WS API", desc: "Integrate into your workflow. Programmatic access for bulk operations." },
          { icon: "◇", title: "Batch scanning", desc: "Queue up to 50 targets per scan. Process multiple usernames simultaneously." },
          { icon: "▣", title: "VoIP detection", desc: "Identify virtual numbers, disposable lines, and carrier spoofing." },
          { icon: "⊡", title: "$TRACE token", desc: "Hold to unlock Pro tier. Deflationary burns on every scan." },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "32px 28px", background: "rgba(10,11,15,0.8)",
            borderRight: i % 3 !== 2 ? "1px solid rgba(255,255,255,0.03)" : "none",
            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none",
          }}>
            <div style={{ fontSize: 18, color: "#638cff", marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: "#4a4d58", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Trusted by */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "100px 40px 20px" }}>
        <div style={{ fontSize: 11, color: "#2e3040", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 24 }}>
          TRUSTED BY INVESTIGATORS WORLDWIDE
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, opacity: 0.15 }}>
          {["INTERPOL", "FBI", "MI6", "EUROPOL", "NSA"].map(n => (
            <span key={n} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 2, padding: "40px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 12, color: "#2e3040",
      }}>
        <span>© 2026 Trace Intelligence Ltd. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
          <a href="https://x.com/TrenchTreasures" target="_blank" rel="noopener noreferrer" style={{ color: "#2e3040", textDecoration: "none" }}>𝕏</a>
        </div>
      </footer>
    </div>
  );
}
