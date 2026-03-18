import { useState, useRef, useEffect, useCallback } from "react";
import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };
const CA = "F8KqRqh1SWRDPcvDnTWvjFS87bEjzvf4C1e94ofKpump";

// Fake live feed data
const FEED_NAMES = ["@darkn3t", "@sk8rboy", "@luna.eth", "@0xdead", "@cryptojake", "@anon_42", "@ghostpro", "@n1nja", "@voidwalker", "@satoshi_fan", "@degenape", "@web3maxi", "@burner_acct", "@phantom_usr", "@signal_lost"];
const FEED_PLATFORMS = ["Instagram", "Twitter/X", "Telegram", "Discord", "GitHub", "Reddit", "Steam", "TikTok", "LinkedIn", "Keybase"];

function RadarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let frame = 0;
    const dots: { x: number; y: number; age: number; max: number }[] = [];
    const W = 280, H = 280;
    c.width = W; c.height = H;

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, r = 120;

      // Rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * (i / 4), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,140,255,${0.04 + i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cross lines
      ctx.strokeStyle = "rgba(99,140,255,0.04)";
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();

      // Sweep
      const angle = (frame * 0.02) % (Math.PI * 2);
      const grad = ctx.createConicGradient?.(angle, cx, cy) ?? null;
      // Fallback: draw sweep as arc
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle - 0.6, angle);
      ctx.closePath();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(99,140,255,0.12)");
      g.addColorStop(1, "rgba(99,140,255,0.01)");
      ctx.fillStyle = g;
      ctx.fill();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.strokeStyle = "rgba(99,140,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Spawn dots near sweep
      if (frame % 20 === 0) {
        const d = 30 + Math.random() * (r - 40);
        const a = angle + (Math.random() - 0.5) * 0.3;
        dots.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, age: 0, max: 60 + Math.random() * 80 });
      }

      // Draw dots
      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        dot.age++;
        if (dot.age > dot.max) { dots.splice(i, 1); continue; }
        const alpha = 1 - dot.age / dot.max;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,140,255,${alpha * 0.8})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,140,255,${alpha * 0.15})`;
        ctx.fill();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99,140,255,0.6)";
      ctx.fill();

      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{ width: 280, height: 280, opacity: 0.7 }} />;
}

function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);
  const handleLeave = useCallback(() => {
    ref.current!.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
  }, []);
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d", ...style }}>
      {children}
    </div>
  );
}

export default function Landing({ onNavigate }: Props) {
  const [copied, setCopied] = useState(false);
  const [feed, setFeed] = useState<{ name: string; platform: string; time: string }[]>([]);

  // Live feed ticker
  useEffect(() => {
    const add = () => {
      const name = FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)];
      const platform = FEED_PLATFORMS[Math.floor(Math.random() * FEED_PLATFORMS.length)];
      const time = Math.floor(Math.random() * 30) + "s ago";
      setFeed(prev => [{ name, platform, time }, ...prev].slice(0, 6));
    };
    add(); add(); add();
    const id = setInterval(add, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0b0f" }}>
      <Nav onNavigate={onNavigate} />

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, opacity: 0.035, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Glow orbs */}
      <div style={{ position: "absolute", top: -300, left: "30%", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,140,255,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 600, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,99,255,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* ===== HERO ===== */}
      <div style={{
        position: "relative", zIndex: 2, paddingTop: 140,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 80,
        maxWidth: 1100, margin: "0 auto", padding: "140px 40px 0",
      }}>
        {/* Left: copy */}
        <div style={{ flex: 1, maxWidth: 520, animation: "fadeUp 0.8s ease-out" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 20,
            background: "rgba(80,200,120,0.06)", border: "1px solid rgba(80,200,120,0.12)",
            fontSize: 11, color: "#50c878", fontWeight: 500, marginBottom: 28, letterSpacing: "0.03em",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#50c878", animation: "pulse 2s infinite" }} />
            Live on Solana · Scanning 400+ platforms
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: 20 }}>
            Nobody hides<br />on the internet<span style={{ color: "#638cff" }}>.</span>
          </h1>

          <p style={{
            fontSize: 16, color: "#5a5d6b", lineHeight: 1.75, marginBottom: 16,
            fontFamily: "'Source Serif 4', serif",
          }}>
            Real-time username reconnaissance across 400+ social networks. Phone number intelligence — carrier, geolocation, linked services, breach exposure. Results in seconds, not hours.
          </p>

          <p style={{
            fontSize: 13, color: "#3a3d4a", marginBottom: 36,
            fontFamily: "'Source Serif 4', serif", fontStyle: "italic",
          }}>
            The first OSINT intelligence token. Hold $TRACE to unlock Pro-tier deep scans.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <button onClick={() => onNavigate("search")}
              style={{
                padding: "13px 28px", fontSize: 13, fontWeight: 600,
                background: "#638cff", color: "#fff", border: "none", borderRadius: 8,
                cursor: "pointer", boxShadow: "0 0 40px rgba(99,140,255,0.2), 0 4px 12px rgba(0,0,0,0.3)",
                transition: "all 0.2s", letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5278e8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#638cff"; e.currentTarget.style.transform = ""; }}
            >Start Investigation →</button>
            <button onClick={() => onNavigate("docs")}
              style={{
                padding: "13px 28px", fontSize: 13, fontWeight: 500,
                background: "transparent", color: "#5a5d6b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#e8e6e1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#5a5d6b"; }}
            >Read the Docs</button>
          </div>

          {/* CA + X */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span onClick={() => { navigator.clipboard.writeText(CA); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              style={{
                padding: "7px 14px", fontSize: 11, fontFamily: "monospace", color: "#5a5d6b", cursor: "pointer", borderRadius: 6,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,140,255,0.25)"; e.currentTarget.style.color = "#e8e6e1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#5a5d6b"; }}
            >
              <span style={{ color: "#3a3d4a" }}>CA</span> {CA.slice(0, 6)}...{CA.slice(-4)}
              <span style={{ fontSize: 9, color: copied ? "#50c878" : "#3a3d4a", transition: "color 0.2s" }}>{copied ? "✓" : "COPY"}</span>
            </span>
            <a href="https://x.com/TrenchTreasures" target="_blank" rel="noopener noreferrer"
              style={{
                padding: "7px 14px", fontSize: 11, color: "#5a5d6b", textDecoration: "none", borderRadius: 6,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,140,255,0.25)"; e.currentTarget.style.color = "#e8e6e1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#5a5d6b"; }}
            >𝕏</a>
          </div>
        </div>

        {/* Right: radar */}
        <div style={{ position: "relative", animation: "fadeUp 1s ease-out 0.2s backwards" }}>
          <RadarCanvas />
          {/* Outer ring glow */}
          <div style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            border: "1px solid rgba(99,140,255,0.06)",
            boxShadow: "0 0 60px rgba(99,140,255,0.05)",
          }} />
        </div>
      </div>

      {/* ===== LIVE FEED TICKER ===== */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 1100, margin: "64px auto 0", padding: "0 40px",
        animation: "fadeUp 0.8s ease-out 0.4s backwards",
      }}>
        <div style={{ fontSize: 10, color: "#2e3040", letterSpacing: "0.12em", fontWeight: 500, marginBottom: 10 }}>
          LIVE INVESTIGATIONS
        </div>
        <div style={{
          display: "flex", gap: 12, overflow: "hidden",
          padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}>
          {feed.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
              background: "rgba(255,255,255,0.015)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.03)",
              fontSize: 11, whiteSpace: "nowrap", animation: "slideIn 0.4s ease-out",
              flexShrink: 0,
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#50c878" }} />
              <span style={{ color: "#638cff", fontFamily: "monospace" }}>{f.name}</span>
              <span style={{ color: "#2e3040" }}>→</span>
              <span style={{ color: "#5a5d6b" }}>{f.platform}</span>
              <span style={{ color: "#1e2030" }}>{f.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 1100, margin: "64px auto 0", padding: "0 40px",
        display: "flex", gap: 0, animation: "fadeUp 0.8s ease-out 0.5s backwards",
      }}>
        {[
          { n: "400+", l: "Platforms", sub: "Social, forums, dev, gaming" },
          { n: "12.4M", l: "Scans run", sub: "Since January 2025" },
          { n: "6.2s", l: "Avg. scan", sub: "Full 400+ platform sweep" },
          { n: "99.7%", l: "Detection", sub: "Industry-leading accuracy" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "28px 0", textAlign: "center",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 12, color: "#5a5d6b", marginBottom: 2 }}>{s.l}</div>
            <div style={{ fontSize: 10, color: "#2e3040" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ===== TWO COLUMN FEATURES ===== */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 1100, margin: "80px auto 0", padding: "0 40px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
      }}>
        <TiltCard style={{
          padding: "44px 36px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(99,140,255,0.04) 0%, rgba(10,11,15,0.8) 100%)",
          border: "1px solid rgba(99,140,255,0.08)",
        }}>
          <div style={{ fontSize: 11, color: "#638cff", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 16 }}>USERNAME RECON</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.02em" }}>Sherlock Engine</div>
          <div style={{ fontSize: 14, color: "#4a4d58", lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", marginBottom: 24 }}>
            Scans 400+ social networks, developer platforms, forums, and gaming sites simultaneously. Results stream in real-time via WebSocket — watch accounts appear as each platform responds. Exportable PDF reports with confidence scores.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["Instagram", "Twitter/X", "GitHub", "Reddit", "TikTok", "Discord", "Steam", "Telegram", "LinkedIn", "Twitch"].map(p => (
              <span key={p} style={{ padding: "3px 8px", fontSize: 10, color: "#3a3d4a", background: "rgba(99,140,255,0.04)", borderRadius: 3, border: "1px solid rgba(99,140,255,0.06)" }}>{p}</span>
            ))}
            <span style={{ padding: "3px 8px", fontSize: 10, color: "#638cff" }}>+390</span>
          </div>
        </TiltCard>

        <TiltCard style={{
          padding: "44px 36px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(140,99,255,0.04) 0%, rgba(10,11,15,0.8) 100%)",
          border: "1px solid rgba(140,99,255,0.08)",
        }}>
          <div style={{ fontSize: 11, color: "#8c63ff", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 16 }}>PHONE INTELLIGENCE</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.02em" }}>PhoneInfoga Engine</div>
          <div style={{ fontSize: 14, color: "#4a4d58", lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", marginBottom: 24 }}>
            Deep scan any international number. Validates carrier and line type, detects VoIP and disposable numbers, identifies linked services, checks breach databases, and compiles a full threat assessment with risk scoring.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["Carrier ID", "VoIP Detection", "Geolocation", "Breach Check", "Linked Services", "Risk Score", "SIM Type", "Port History"].map(p => (
              <span key={p} style={{ padding: "3px 8px", fontSize: 10, color: "#3a3d4a", background: "rgba(140,99,255,0.04)", borderRadius: 3, border: "1px solid rgba(140,99,255,0.06)" }}>{p}</span>
            ))}
          </div>
        </TiltCard>
      </div>

      {/* ===== FEATURE GRID ===== */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 1100, margin: "20px auto 0", padding: "0 40px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
        background: "rgba(255,255,255,0.02)", borderRadius: 14, overflow: "hidden",
      }}>
        {[
          { icon: "⚡", title: "Real-time streaming", desc: "WebSocket-powered. Watch results appear live as each platform responds." },
          { icon: "📄", title: "PDF reports", desc: "Export intelligence reports with timestamps, links, and confidence scores." },
          { icon: "🔗", title: "REST + WS API", desc: "Programmatic access. Integrate Trace into any existing workflow." },
          { icon: "🔥", title: "$TRACE burns", desc: "Deflationary. Every scan burns tokens. Hold for lifetime Pro access." },
          { icon: "📡", title: "Batch scanning", desc: "Queue 50+ targets. Process multiple usernames in parallel." },
          { icon: "🛡️", title: "VoIP detection", desc: "Identify virtual numbers, disposable lines, and carrier spoofing." },
          { icon: "💀", title: "Breach exposure", desc: "Cross-reference against known data breaches and leaked databases." },
          { icon: "🌐", title: "Global coverage", desc: "International phone numbers. 195 countries. Every major carrier." },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "28px 24px", background: "rgba(10,11,15,0.9)",
            borderRight: i % 4 !== 3 ? "1px solid rgba(255,255,255,0.02)" : "none",
            borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.02)" : "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,21,30,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(10,11,15,0.9)")}
          >
            <div style={{ fontSize: 20, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5, letterSpacing: "0.01em" }}>{f.title}</div>
            <div style={{ fontSize: 11, color: "#3a3d4a", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: 700, margin: "100px auto 0", padding: "0 40px", textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: "#2e3040", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 12 }}>HOW IT WORKS</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 48 }}>Three steps. Full exposure.</h2>

        <div style={{ display: "flex", gap: 32, textAlign: "left" }}>
          {[
            { n: "01", title: "Enter target", desc: "Type a username or phone number. That's all we need." },
            { n: "02", title: "Deep scan", desc: "Our engines query 400+ platforms and telecom databases simultaneously." },
            { n: "03", title: "Intelligence report", desc: "Linked accounts, carrier data, breach exposure, risk score. Exportable." },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "rgba(99,140,255,0.12)", marginBottom: 12, letterSpacing: "-0.03em" }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#3a3d4a", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TRUSTED BY ===== */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "100px 40px 20px" }}>
        <div style={{ fontSize: 10, color: "#1e2030", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 20 }}>
          TRUSTED BY INVESTIGATORS WORLDWIDE
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, opacity: 0.12 }}>
          {["INTERPOL", "FBI", "MI6", "EUROPOL", "NSA", "GCHQ"].map(n => (
            <span key={n} style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer style={{
        position: "relative", zIndex: 2, padding: "32px 40px",
        borderTop: "1px solid rgba(255,255,255,0.02)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 11, color: "#1e2030",
      }}>
        <span>© 2026 Trace Intelligence Ltd.</span>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
          <a href="https://x.com/TrenchTreasures" target="_blank" rel="noopener noreferrer" style={{ color: "#1e2030", textDecoration: "none" }}>𝕏</a>
        </div>
      </footer>
    </div>
  );
}
