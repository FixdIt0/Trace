import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Landing({ onNavigate }: Props) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Nav onNavigate={onNavigate} />

      {/* Subtle grid bg */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Glow orb */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,140,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Hero */}
      <div style={{
        position: "relative", zIndex: 2, paddingTop: 180,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        animation: "fadeUp 0.8s ease-out",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 20,
          background: "rgba(99,140,255,0.08)", border: "1px solid rgba(99,140,255,0.15)",
          fontSize: 12, color: "#638cff", fontWeight: 500, marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#638cff", animation: "pulse 2s infinite" }} />
          Now scanning 400+ platforms
        </div>

        <h1 style={{
          fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
          maxWidth: 700, marginBottom: 24,
        }}>
          Digital footprint<br />
          <span style={{ color: "#638cff" }}>intelligence</span>
        </h1>

        <p style={{
          fontSize: 17, color: "#6b6e7b", lineHeight: 1.7, maxWidth: 480, marginBottom: 48,
          fontFamily: "'Source Serif 4', serif",
        }}>
          Trace maps a username across 400+ social networks, forums, and platforms in seconds.
          Enterprise-grade OSINT for digital investigations.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 80 }}>
          <button
            onClick={() => onNavigate("search")}
            style={{
              padding: "14px 32px", fontSize: 14, fontWeight: 600,
              background: "#638cff", color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", letterSpacing: "0.02em",
              boxShadow: "0 0 40px rgba(99,140,255,0.25)",
              transition: "all 0.2s",
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
          >View Documentation</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 64, padding: "32px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          {[
            { n: "400+", l: "Platforms" },
            { n: "12M+", l: "Scans completed" },
            { n: "<8s", l: "Avg. scan time" },
            { n: "99.7%", l: "Accuracy rate" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "#4a4d58", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 960, margin: "100px auto 0", padding: "0 40px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
        background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden",
      }}>
        {[
          { icon: "◎", title: "Real-time scanning", desc: "Results stream live as each platform is checked. Watch accounts appear in real-time." },
          { icon: "⬡", title: "Deep web coverage", desc: "Forums, niche platforms, developer sites, gaming networks. Not just mainstream social media." },
          { icon: "◈", title: "Exportable reports", desc: "Generate PDF intelligence reports with timestamps, confidence scores, and direct links." },
          { icon: "△", title: "API access", desc: "Integrate Trace into your existing workflow with our REST and WebSocket APIs." },
          { icon: "◇", title: "Batch processing", desc: "Investigate multiple usernames simultaneously. Queue up to 50 targets per scan." },
          { icon: "▣", title: "Historical data", desc: "Access cached results and track username changes over time with our archive." },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "36px 32px", background: "rgba(10,11,15,0.8)",
            borderRight: i % 3 !== 2 ? "1px solid rgba(255,255,255,0.03)" : "none",
            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none",
          }}>
            <div style={{ fontSize: 20, color: "#638cff", marginBottom: 16 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, letterSpacing: "0.01em" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#4a4d58", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Trusted by */}
      <div style={{
        position: "relative", zIndex: 2, textAlign: "center", padding: "100px 40px 60px",
      }}>
        <div style={{ fontSize: 11, color: "#2e3040", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 24 }}>
          TRUSTED BY INVESTIGATORS WORLDWIDE
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, opacity: 0.2 }}>
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
          <span style={{ cursor: "pointer" }}>Contact</span>
        </div>
      </footer>
    </div>
  );
}
