import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Docs({ onNavigate }: Props) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 56 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{title}</h3>
      <div style={{ fontSize: 14, color: "#6b6e7b", lineHeight: 1.8, fontFamily: "'Source Serif 4', serif" }}>{children}</div>
    </div>
  );

  const Code = ({ children }: { children: string }) => (
    <pre style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 8, padding: "14px 18px", margin: "14px 0",
      fontSize: 12, color: "#8b8ea0", fontFamily: "'SF Mono', 'Fira Code', monospace",
      overflowX: "auto", lineHeight: 1.6,
    }}>{children}</pre>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav onNavigate={onNavigate} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "120px 24px 80px", animation: "fadeUp 0.6s ease-out" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 14px", borderRadius: 20,
          background: "rgba(99,140,255,0.06)", border: "1px solid rgba(99,140,255,0.1)",
          fontSize: 11, color: "#638cff", fontWeight: 500, marginBottom: 24,
        }}>v2.4.0</div>

        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 10 }}>Documentation</h1>
        <p style={{ fontSize: 14, color: "#4a4d58", marginBottom: 56, fontFamily: "'Source Serif 4', serif" }}>
          Integrate Trace into your investigation workflow. Username recon + phone intelligence.
        </p>

        <Section title="Overview">
          <p>Trace combines two intelligence engines:</p>
          <p style={{ marginTop: 8 }}><strong style={{ color: "#e8e6e1" }}>Username Recon</strong> — Powered by Sherlock (73k+ GitHub stars). Scans 400+ social networks, forums, and platforms to identify accounts associated with a username. Results stream in real-time via WebSocket.</p>
          <p style={{ marginTop: 8 }}><strong style={{ color: "#e8e6e1" }}>Phone Intelligence</strong> — Powered by PhoneInfoga (16k+ GitHub stars). Validates international phone numbers, identifies carrier and line type, detects VoIP/disposable numbers, and geolocates region and timezone.</p>
        </Section>

        <Section title="Username Scan API">
          <p>Connect via WebSocket for real-time streaming results:</p>
          <Code>{`const ws = new WebSocket("wss://trace.app/ws/search");
ws.onopen = () => ws.send(JSON.stringify({ 
  username: "target_user" 
}));
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "result") {
    // { site: "Instagram", url: "https://...", count: 12 }
  }
  if (data.type === "done") {
    // { total: 47, username: "target_user" }
  }
};`}</Code>
        </Section>

        <Section title="Phone Scan API">
          <p>REST endpoint for phone number intelligence:</p>
          <Code>{`POST /api/phone
Content-Type: application/json

{ "phone": "+14155552671" }`}</Code>
          <p style={{ marginTop: 12 }}>Response:</p>
          <Code>{`{
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
        </Section>

        <Section title="Pricing">
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "16px 0",
          }}>
            {[
              { tier: "Free", price: "$0", scans: "10/day", features: ["Username scan", "Phone scan", "1 concurrent"] },
              { tier: "Pro", price: "$49/mo", scans: "500/day", features: ["Everything in Free", "Batch scanning", "PDF reports", "5 concurrent", "API access"] },
              { tier: "Enterprise", price: "$499/mo", scans: "Unlimited", features: ["Everything in Pro", "Historical data", "Priority support", "50 concurrent", "Custom integrations"] },
            ].map((p, i) => (
              <div key={i} style={{
                padding: "24px 20px", borderRadius: 10,
                background: "rgba(255,255,255,0.015)", border: `1px solid ${i === 1 ? "rgba(99,140,255,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}>
                <div style={{ fontSize: 12, color: "#4a4d58", marginBottom: 4 }}>{p.tier}</div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 11, color: "#4a4d58", marginBottom: 16 }}>{p.scans} scans</div>
                {p.features.map((f, j) => (
                  <div key={j} style={{ fontSize: 12, color: "#6b6e7b", padding: "3px 0" }}>✓ {f}</div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12, fontStyle: "italic", fontSize: 13 }}>
            Hold $TRACE tokens to unlock Pro tier at no additional cost. 100k+ tokens = lifetime Pro access.
          </p>
        </Section>

        <Section title="Supported Platforms">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {["Instagram", "Twitter/X", "TikTok", "GitHub", "Reddit", "LinkedIn", "YouTube", "Twitch", "Discord", "Steam", "Spotify", "Pinterest", "Tumblr", "Medium", "DeviantArt", "SoundCloud", "Dribbble", "Behance", "HackerNews", "StackOverflow", "Keybase", "Telegram", "Mastodon", "Bluesky", "Threads"].map(p => (
              <span key={p} style={{ padding: "3px 10px", fontSize: 11, color: "#4a4d58", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 4 }}>{p}</span>
            ))}
            <span style={{ padding: "3px 10px", fontSize: 11, color: "#638cff" }}>+375 more</span>
          </div>
        </Section>

        <Section title="Legal">
          <p>Trace only accesses publicly available information. No private databases, no dark web scraping. All queries are logged and auditable. Usage must comply with applicable local laws.</p>
        </Section>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 12, color: "#2e3040", display: "flex", justifyContent: "space-between" }}>
          <span>© 2026 Trace Intelligence Ltd.</span>
          <span>Last updated: March 2026</span>
        </div>
      </div>
    </div>
  );
}
