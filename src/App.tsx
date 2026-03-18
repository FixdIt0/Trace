import { useState } from "react";
import Landing from "./pages/Landing";
import Search from "./pages/Search";
import Docs from "./pages/Docs";

const css = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { background: #0a0b0f; color: #e8e6e1; }
  body { font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }
  ::selection { background: rgba(99,140,255,0.25); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e2030; border-radius: 3px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scanline { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
`;

type Page = "landing" | "search" | "docs";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  return (
    <>
      <style>{css}</style>
      {page === "landing" && <Landing onNavigate={setPage} />}
      {page === "search" && <Search onNavigate={setPage} />}
      {page === "docs" && <Docs onNavigate={setPage} />}
    </>
  );
}
