import Nav from "../components/Nav";

type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Docs({ onNavigate }: Props) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 64 }}>
      <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{title}</h3>
      <div style={{ fontSize: 14, color: "#6b6e7b", lineHeight: 1.8, fontFamily: "'Source Serif 4', serif" }}>{children}</div>
    </div>
  );

  const Code = ({ children }: { children: string }) => (
    <pre style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 8, padding: "16px 20px", margin: "16px 0",
      fontSize: 13, color: "#8b8ea0", fontFamily: "'SF Mono', 'Fira Code', monospace",
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

        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>Documentation</h1>
        <p style={{ fontSize: 15, color: "#4a4d58", marginBottom: 64, fontFamily: "'Source Serif 4', serif" }}>
          Everything you need to integrate Trace into your investigation workflow.
        </p>

        <Section title="Overview">
          <p>Trace is a digital footprint intelligence platform that scans over 400 social networks, forums, and online platforms to identify accounts associated with a given username. Results are delivered in real-time via WebSocket streaming.</p>
          <p style={{ marginTop: 12 }}>Designed for law enforcement, corporate security teams, and licensed private investigators.</p>
        </Section>

        <Section title="Quick Start">
          <p>Navigate to the search page and enter a target username. Results begin streaming immediately.</p>
          <Code>{`POST /api/v1/search
Content-Type: application/json
Authorization: Bearer <api_key>

{
  "username": "target_user",
  "timeout": 8,
  "include_nsfw": false
}`}</Code>
          <p>Response streams via WebSocket with each discovered account:</p>
          <Code>{`{
  "type": "result",
  "site": "Instagram",
  "url": "https://instagram.com/target_user",
  "confidence": 0.97,
  "response_time_ms": 142
}`}</Code>
        </Section>

        <Section title="WebSocket API">
          <p>Connect to <code style={{ background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>wss://your-domain/ws/search</code> and send a JSON payload with the target username. Each result is pushed as it's discovered.</p>
          <Code>{`const ws = new WebSocket("wss://trace.app/ws/search");
ws.onopen = () => ws.send(JSON.stringify({ 
  username: "target" 
}));
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  // data.type: "result" | "done" | "error"
};`}</Code>
        </Section>

        <Section title="Rate Limits">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
            background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "hidden", margin: "16px 0",
          }}>
            {[
              ["Plan", "Requests/day", "Concurrent"],
              ["Free", "10", "1"],
              ["Pro — $49/mo", "500", "5"],
              ["Enterprise — $499/mo", "Unlimited", "50"],
            ].map((row, i) => (
              <div key={i} style={{ display: "contents" }}>
                {row.map((cell, j) => (
                  <div key={j} style={{
                    padding: "10px 16px", background: "rgba(10,11,15,0.9)",
                    fontSize: 13, color: i === 0 ? "#4a4d58" : "#6b6e7b",
                    fontWeight: i === 0 ? 600 : 400,
                    fontFamily: i === 0 ? "'Outfit', sans-serif" : "'Source Serif 4', serif",
                  }}>{cell}</div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Supported Platforms">
          <p>Trace currently indexes accounts across 400+ platforms including:</p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12,
          }}>
            {["Instagram", "Twitter/X", "TikTok", "GitHub", "Reddit", "LinkedIn", "YouTube", "Twitch", "Discord", "Steam", "Spotify", "Pinterest", "Tumblr", "Medium", "DeviantArt", "Flickr", "SoundCloud", "Vimeo", "Dribbble", "Behance", "HackerNews", "StackOverflow", "Keybase", "Telegram", "Mastodon", "Bluesky", "Threads", "Snapchat", "WhatsApp", "Signal"].map(p => (
              <span key={p} style={{
                padding: "4px 10px", fontSize: 11, color: "#4a4d58",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 4,
              }}>{p}</span>
            ))}
            <span style={{ padding: "4px 10px", fontSize: 11, color: "#638cff" }}>+370 more</span>
          </div>
        </Section>

        <Section title="Legal & Compliance">
          <p>Trace only accesses publicly available information. No private data, no password databases, no dark web scraping. All queries are logged and auditable.</p>
          <p style={{ marginTop: 12 }}>Usage must comply with applicable local laws. Trace is intended for authorized investigations only. Misuse will result in immediate account termination.</p>
        </Section>

        {/* Footer */}
        <div style={{
          marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.03)",
          fontSize: 12, color: "#2e3040", display: "flex", justifyContent: "space-between",
        }}>
          <span>© 2026 Trace Intelligence Ltd.</span>
          <span>Last updated: March 2026</span>
        </div>
      </div>
    </div>
  );
}
