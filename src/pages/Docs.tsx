import { useState } from "react";
import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

const TOC = [
  "Overview", "Architecture", "Username Scan API", "Phone Intelligence API",
  "Response Types", "Rate Limits & Pricing", "Supported Platforms", "$TRACE Token", "Legal",
];

export default function Docs({ onNavigate }: Props) {
  const [active, setActive] = useState("Overview");

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const H = ({ id, children }: { id: string; children: string }) => (
    <h3 id={id} style={{
      fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14,
      paddingTop: 48, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>{children}</h3>
  );

  const P = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: 14, color: "#6b6e7b", lineHeight: 1.8, fontFamily: "'Source Serif 4', serif", marginBottom: 12 }}>{children}</p>
  );

  const Code = ({ children, title }: { children: string; title?: string }) => (
    <div style={{ margin: "14px 0" }}>
      {title && <div style={{
        fontSize: 10, color: "#3a3d4a", letterSpacing: "0.08em", fontWeight: 500,
        padding: "6px 16px", background: "rgba(255,255,255,0.025)", borderRadius: "8px 8px 0 0",
        border: "1px solid rgba(255,255,255,0.04)", borderBottom: "none",
      }}>{title}</div>}
      <pre style={{
        background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: title ? "0 0 8px 8px" : 8, padding: "14px 18px",
        fontSize: 12, color: "#8b8ea0", fontFamily: "'SF Mono', 'Fira Code', monospace",
        overflowX: "auto", lineHeight: 1.7,
      }}>{children}</pre>
    </div>
  );

  const Badge = ({ children, color = "#638cff" }: { children: string; color?: string }) => (
    <span style={{
      padding: "2px 8px", fontSize: 10, fontWeight: 600, borderRadius: 3, marginRight: 6,
      background: `${color}15`, color, border: `1px solid ${color}25`,
    }}>{children}</span>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <Nav onNavigate={onNavigate} />

      {/* Sidebar TOC */}
      <div style={{
        position: "fixed", top: 56, left: 0, bottom: 0, width: 220, padding: "32px 24px",
        borderRight: "1px solid rgba(255,255,255,0.03)", overflowY: "auto",
        background: "rgba(10,11,15,0.95)",
      }}>
        <div style={{ fontSize: 10, color: "#2e3040", letterSpacing: "0.12em", fontWeight: 500, marginBottom: 16 }}>ON THIS PAGE</div>
        {TOC.map(t => (
          <div key={t} onClick={() => scrollTo(t)}
            style={{
              fontSize: 12, padding: "6px 10px", marginBottom: 2, borderRadius: 4, cursor: "pointer",
              color: active === t ? "#e8e6e1" : "#3a3d4a",
              background: active === t ? "rgba(99,140,255,0.06)" : "transparent",
              borderLeft: `2px solid ${active === t ? "#638cff" : "transparent"}`,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (active !== t) e.currentTarget.style.color = "#6b6e7b"; }}
            onMouseLeave={e => { if (active !== t) e.currentTarget.style.color = "#3a3d4a"; }}
          >{t}</div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, flex: 1, maxWidth: 720, padding: "100px 48px 80px", animation: "fadeUp 0.6s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "rgba(99,140,255,0.06)", border: "1px solid rgba(99,140,255,0.1)",
            fontSize: 11, color: "#638cff", fontWeight: 500,
          }}>v2.4.0</div>
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "rgba(80,200,120,0.06)", border: "1px solid rgba(80,200,120,0.1)",
            fontSize: 11, color: "#50c878", fontWeight: 500,
          }}>Stable</div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Trace Documentation</h1>
        <p style={{ fontSize: 15, color: "#4a4d58", marginBottom: 0, fontFamily: "'Source Serif 4', serif" }}>
          Complete reference for the Trace OSINT intelligence platform.
        </p>

        {/* Overview */}
        <H id="Overview">Overview</H>
        <P>Trace is a digital footprint intelligence platform that combines two battle-tested OSINT engines into a single, real-time scanning interface:</P>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
          <div style={{ padding: "16px 18px", borderRadius: 8, background: "rgba(99,140,255,0.03)", border: "1px solid rgba(99,140,255,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#638cff", marginBottom: 4 }}>Sherlock Engine</div>
            <div style={{ fontSize: 12, color: "#4a4d58", lineHeight: 1.6 }}>Username reconnaissance across 400+ social networks, forums, developer platforms, and gaming sites.</div>
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 8, background: "rgba(140,99,255,0.03)", border: "1px solid rgba(140,99,255,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#8c63ff", marginBottom: 4 }}>PhoneInfoga Engine</div>
            <div style={{ fontSize: 12, color: "#4a4d58", lineHeight: 1.6 }}>Phone number intelligence — carrier ID, geolocation, VoIP detection, breach exposure, linked service discovery.</div>
          </div>
        </div>
        <P>Designed for licensed investigators, corporate security teams, and law enforcement. All data sourced from publicly accessible platforms and databases.</P>

        {/* Architecture */}
        <H id="Architecture">Architecture</H>
        <P>Trace uses a split architecture optimized for real-time streaming:</P>
        <Code title="SYSTEM DIAGRAM">{`┌─────────────┐     WebSocket      ┌──────────────────┐
│   Browser    │ ◄──────────────── │   FastAPI Server  │
│   (React)    │ ──────────────► │                  │
└─────────────┘     REST API       │  ┌────────────┐  │
                                   │  │  Sherlock   │  │
                                   │  │  (Python)   │  │
                                   │  └────────────┘  │
                                   │  ┌────────────┐  │
                                   │  │ PhoneInfoga │  │
                                   │  │ (libphone)  │  │
                                   │  └────────────┘  │
                                   └──────────────────┘`}</Code>
        <P>Username scans use WebSocket for real-time result streaming. Phone scans use a standard REST endpoint since results are returned as a single payload after the deep scan completes.</P>

        {/* Username API */}
        <H id="Username Scan API">Username Scan API</H>
        <P>Connect via WebSocket to receive results as they're discovered. Each platform is checked concurrently — results stream in as fast as each site responds.</P>
        <Code title="CONNECT">{`wss://your-domain.com/ws/search`}</Code>
        <Code title="SEND PAYLOAD">{`{
  "username": "target_user"
}`}</Code>
        <P>The server will push messages for each discovered account:</P>
        <Code title="RESULT MESSAGE">{`{
  "type": "result",
  "site": "Instagram",
  "url": "https://instagram.com/target_user",
  "count": 12
}`}</Code>
        <Code title="COMPLETION MESSAGE">{`{
  "type": "done",
  "total": 47,
  "username": "target_user"
}`}</Code>
        <Code title="JAVASCRIPT EXAMPLE">{`const ws = new WebSocket("wss://trace.app/ws/search");

ws.onopen = () => {
  ws.send(JSON.stringify({ username: "target" }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case "result":
      console.log(\`Found: \${data.site} → \${data.url}\`);
      break;
    case "done":
      console.log(\`Scan complete. \${data.total} accounts found.\`);
      ws.close();
      break;
    case "error":
      console.error(data.message);
      break;
  }
};`}</Code>

        {/* Phone API */}
        <H id="Phone Intelligence API">Phone Intelligence API</H>
        <P>REST endpoint for phone number intelligence. Include the country code. The deep scan runs carrier validation, OSINT footprinting, breach cross-referencing, and threat assessment.</P>
        <Code title="REQUEST">{`POST /api/phone
Content-Type: application/json

{
  "phone": "+14155552671"
}`}</Code>
        <Code title="RESPONSE">{`{
  "valid": true,
  "international": "+1 415-555-2671",
  "national": "(415) 555-2671",
  "e164": "+14155552671",
  "country_code": 1,
  "country": "United States",
  "carrier": "T-Mobile",
  "line_type": "Mobile",
  "timezones": ["America/Los_Angeles"]
}`}</Code>
        <P>The web interface runs an additional deep scan layer on top of the base carrier data, including linked service detection, breach exposure checks, and risk scoring.</P>

        {/* Response Types */}
        <H id="Response Types">Response Types</H>
        <div style={{ margin: "16px 0" }}>
          {[
            { type: "result", desc: "A matching account was found on a platform", fields: "site, url, count" },
            { type: "done", desc: "Scan completed for all platforms", fields: "total, username" },
            { type: "error", desc: "Invalid input or server error", fields: "message" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12,
            }}>
              <code style={{ color: "#638cff", fontFamily: "monospace", minWidth: 60 }}>{r.type}</code>
              <span style={{ color: "#6b6e7b", flex: 1 }}>{r.desc}</span>
              <span style={{ color: "#3a3d4a", fontFamily: "monospace", fontSize: 11 }}>{r.fields}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <H id="Rate Limits & Pricing">Rate Limits & Pricing</H>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, margin: "16px 0" }}>
          {[
            { tier: "Free", price: "$0", scans: "10/day", features: ["Username scan", "Phone scan", "1 concurrent", "Web UI only"] },
            { tier: "Pro", price: "$49/mo", scans: "500/day", badge: true, features: ["Everything in Free", "Batch scanning (50)", "PDF reports", "5 concurrent", "API access", "Priority queue"] },
            { tier: "Enterprise", price: "$499/mo", scans: "Unlimited", features: ["Everything in Pro", "Historical archive", "Dedicated support", "50 concurrent", "Custom integrations", "SLA guarantee"] },
          ].map((p, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 10, position: "relative",
              background: i === 1 ? "rgba(99,140,255,0.03)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${i === 1 ? "rgba(99,140,255,0.15)" : "rgba(255,255,255,0.04)"}`,
            }}>
              {p.badge && <div style={{
                position: "absolute", top: -8, right: 12, padding: "2px 8px", fontSize: 9,
                background: "#638cff", color: "#fff", borderRadius: 4, fontWeight: 600, letterSpacing: "0.05em",
              }}>POPULAR</div>}
              <div style={{ fontSize: 11, color: "#4a4d58", marginBottom: 4 }}>{p.tier}</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: "#3a3d4a", marginBottom: 16 }}>{p.scans} scans</div>
              {p.features.map((f, j) => (
                <div key={j} style={{ fontSize: 12, color: "#5a5d6b", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#50c878", fontSize: 10 }}>✓</span> {f}
                </div>
              ))}
            </div>
          ))}
        </div>
        <P>Hold 100,000+ $TRACE tokens to unlock lifetime Pro access at no additional cost. Token balance is verified on-chain via Solana RPC.</P>

        {/* Platforms */}
        <H id="Supported Platforms">Supported Platforms</H>
        <P>Trace indexes accounts across 400+ platforms. Major platforms include:</P>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "12px 0" }}>
          {["Instagram", "Twitter/X", "TikTok", "GitHub", "Reddit", "LinkedIn", "YouTube", "Twitch", "Discord", "Steam", "Spotify", "Pinterest", "Tumblr", "Medium", "DeviantArt", "SoundCloud", "Dribbble", "Behance", "HackerNews", "StackOverflow", "Keybase", "Telegram", "Mastodon", "Bluesky", "Threads", "Snapchat", "Signal", "Coinbase", "OpenSea", "Roblox"].map(p => (
              <span key={p} style={{ padding: "3px 9px", fontSize: 10, color: "#4a4d58", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 3 }}>{p}</span>
          ))}
          <span style={{ padding: "3px 9px", fontSize: 10, color: "#638cff" }}>+370 more</span>
        </div>
        <P>Phone intelligence covers all international numbers across 195 countries. Carrier databases are updated weekly.</P>

        {/* Token */}
        <H id="$TRACE Token">$TRACE Token</H>
        <P>$TRACE is the native utility token of the Trace platform, deployed on Solana.</P>
        <div style={{
          padding: "16px 20px", borderRadius: 8, margin: "12px 0",
          background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
            <span style={{ color: "#4a4d58" }}>Contract Address</span>
            <span style={{ color: "#638cff", fontFamily: "monospace", fontSize: 11 }}>F8Kq...pump</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
            <span style={{ color: "#4a4d58" }}>Network</span>
            <span style={{ color: "#e8e6e1" }}>Solana</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
            <span style={{ color: "#4a4d58" }}>Pro Threshold</span>
            <span style={{ color: "#e8e6e1" }}>100,000 $TRACE</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
            <span style={{ color: "#4a4d58" }}>Burn Mechanism</span>
            <span style={{ color: "#e8e6e1" }}>0.1% of scan fees burned per transaction</span>
          </div>
        </div>

        {/* Legal */}
        <H id="Legal">Legal & Compliance</H>
        <P>Trace only accesses publicly available information. No private databases, no credential stuffing, no dark web scraping. All queries are logged with timestamps for audit compliance.</P>
        <P>Usage must comply with applicable local, state, and federal laws. Trace is intended for authorized investigations only. Unauthorized surveillance, harassment, or stalking is strictly prohibited and will result in immediate account termination and referral to law enforcement.</P>
        <div style={{
          padding: "14px 18px", borderRadius: 8, margin: "16px 0",
          background: "rgba(255,180,50,0.04)", border: "1px solid rgba(255,180,50,0.1)",
          fontSize: 12, color: "#b89a3a", lineHeight: 1.6,
        }}>
          ⚠ By using Trace, you confirm that you have lawful authority to investigate the target identifiers and that your use complies with all applicable regulations.
        </div>

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 11, color: "#1e2030", display: "flex", justifyContent: "space-between" }}>
          <span>© 2026 Trace Intelligence Ltd.</span>
          <span>Last updated: March 2026</span>
        </div>
      </div>
    </div>
  );
}
