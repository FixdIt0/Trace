type Props = { onNavigate: (p: "landing" | "search" | "docs") => void };

export default function Nav({ onNavigate }: Props) {
  const link = (label: string, page: "landing" | "search" | "docs") => (
    <span
      onClick={() => onNavigate(page)}
      style={{
        cursor: "pointer", fontSize: 13, color: "#6b6e7b", letterSpacing: "0.04em",
        transition: "color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.color = "#e8e6e1")}
      onMouseLeave={e => (e.currentTarget.style.color = "#6b6e7b")}
    >{label}</span>
  );

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 56,
      background: "rgba(10,11,15,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: "linear-gradient(135deg, #638cff 0%, #4a6fd4 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "#fff",
        }}>T</div>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.08em", color: "#e8e6e1" }}>TRACE</span>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {link("Search", "search")}
        {link("Documentation", "docs")}
        {link("Pricing", "docs")}
        <button
          onClick={() => onNavigate("search")}
          style={{
            padding: "7px 18px", fontSize: 12, fontWeight: 500,
            background: "#638cff", color: "#fff", border: "none", borderRadius: 6,
            cursor: "pointer", letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#5278e8")}
          onMouseLeave={e => (e.currentTarget.style.background = "#638cff")}
        >Get Started</button>
      </div>
    </nav>
  );
}
