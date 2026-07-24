import { useState, type ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";

type SiteLayoutProps = {
  brand_text?: string;
  footer_copy?: string;
  header_enabled?: boolean;
  footer_enabled?: boolean;
};

export function SanctuaryLayout({
  eyebrow,
  title,
  intro,
  showHero = true,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  showHero?: boolean;
  children: ReactNode;
}) {
  const { site } = usePage().props as { site?: SiteLayoutProps };
  const brand = site?.brand_text || "SOUL SANCTUARY";
  const footerCopy =
    site?.footer_copy ||
    `© ${new Date().getFullYear()} Sanctuary of the Veil Keepers · All rights reserved`;
  const showHeader = site?.header_enabled !== false;
  const showFooter = site?.footer_enabled !== false;

  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "/reflections", label: "Reflections" },
    { href: "/offerings", label: "Offerings" },
    { href: "/the-animals", label: "The Animals" },
    { href: "/the-sophia-scrolls", label: "The Sophia Scrolls" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="sanctuary-page">
      <style>{sanctuaryCss}</style>
      {showHeader && (
        <header className="sk-nav">
          <Link href="/" className="sk-brand">
            <svg width="28" height="28" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <circle cx="30" cy="30" r="26" stroke="#e2542f" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="30" cy="30" r="14" stroke="#d4af6a" strokeWidth="1" />
              <line x1="30" y1="4" x2="30" y2="56" stroke="#e2542f" strokeWidth="0.5" opacity="0.5" />
              <line x1="4" y1="30" x2="56" y2="30" stroke="#e2542f" strokeWidth="0.5" opacity="0.5" />
            </svg>
            <span>{brand}</span>
          </Link>

          <nav className="sk-nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>

          <button
            className="sk-hamburger"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </header>
      )}

      {showHeader && menuOpen && (
        <div className="sk-mobile-menu">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
        </div>
      )}

      <main className="sk-main">
        {showHero && (
          <div className="sk-hero-text">
            {eyebrow && <p className="sk-eyebrow">{eyebrow}</p>}
            <h1 className="sk-title">{title}</h1>
            {intro && <p className="sk-intro">{intro}</p>}
          </div>
        )}
        <div className="sk-content">{children}</div>
      </main>

      {showFooter && (
        <footer className="sk-footer">
          <Link href="/" className="sk-brand" style={{ justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <circle cx="30" cy="30" r="26" stroke="#e2542f" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="30" cy="30" r="14" stroke="#d4af6a" strokeWidth="1" />
            </svg>
            <span style={{ fontSize: 11 }}>{brand}</span>
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1rem" }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 12, color: "#9b8878", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </nav>
          <p style={{ marginTop: "1.5rem", fontSize: 11, color: "#9b8878" }}>
            {footerCopy}
          </p>
        </footer>
      )}
    </div>
  );
}

const sanctuaryCss = `
.sanctuary-page {
  font-family: "Cormorant Garamond", Georgia, serif;
  background: #faf1e2;
  color: #2a1a0e;
  min-height: 100vh;
}
.sanctuary-page h1,
.sanctuary-page h2,
.sanctuary-page h3,
.sanctuary-page h4 {
  font-family: "Cinzel", serif;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.sk-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 64px; background: rgba(250,241,226,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(210,175,106,0.2); }
.sk-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: #e2542f; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; font-family: "Cinzel", serif; }
.sk-nav-links { display: flex; gap: 2rem; }
.sk-nav-links a { font-family: "Jost", sans-serif; font-size: 14px; text-decoration: none; color: #4a2e1a; letter-spacing: 0.04em; transition: color 0.2s; }
.sk-nav-links a:hover { color: #e2542f; }
.sk-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.sk-hamburger span { display: block; width: 22px; height: 1.5px; background: #4a2e1a; }
@media (max-width: 768px) { .sk-nav-links { display: none; } .sk-hamburger { display: flex; } }
.sk-mobile-menu { position: fixed; inset: 64px 0 0 0; background: #faf1e2; z-index: 99; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
.sk-mobile-menu a { font-family: "Cinzel", serif; font-size: 20px; text-decoration: none; color: #2a1a0e; letter-spacing: 0.06em; }
.sk-main { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem 6rem; }
.sk-hero-text { text-align: center; padding: 3rem 0 4rem; }
.sk-eyebrow { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #e2542f; margin-bottom: 1.2rem; }
.sk-title { font-family: "Cinzel", serif; font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 600; line-height: 1.1; color: #2a1a0e; margin: 0 0 1.4rem; letter-spacing: 0.02em; }
.sk-intro { font-family: "Cormorant Garamond", serif; font-size: 1.15rem; line-height: 1.75; color: #5a3a20; max-width: 620px; margin: 0 auto; font-style: italic; font-weight: 500; }
.sk-content { font-family: "Jost", sans-serif; font-size: 1.05rem; line-height: 1.85; font-weight: 400; }
.sk-content p { font-family: "Jost", sans-serif; }
.sk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; }
.sk-card { background: #fff8ee; border: 1px solid rgba(210,175,106,0.3); border-radius: 6px; padding: 2rem; }
.sk-card h3 { font-family: "Cinzel", serif; font-size: 1.3rem; font-weight: 600; margin: 0.5rem 0; letter-spacing: 0.02em; }
.sk-card p { font-family: "Jost", sans-serif; font-size: 13.5px; line-height: 1.65; }
.sk-tag { font-family: "Cinzel", serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #e2542f; }
.sk-btn { display: inline-block; padding: 0.65rem 1.8rem; background: #2a1a0e; color: #f5ede0; font-family: "Jost", sans-serif; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border-radius: 2px; border: none; cursor: pointer; transition: background 0.2s; }
.sk-btn:hover { background: #e2542f; }
.sk-btn.ghost { background: transparent; color: #2a1a0e; border: 1px solid #2a1a0e; }
.sk-btn.ghost:hover { background: #2a1a0e; color: #f5ede0; }
.sk-form { display: flex; flex-direction: column; gap: 1.2rem; max-width: 560px; }
.sk-form label { display: block; font-family: "Jost", sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #7c5c3a; margin-bottom: 0.3rem; }
.sk-form input, .sk-form textarea, .sk-form select { width: 100%; padding: 0.65rem 0.9rem; border: 1px solid #d4af6a; border-radius: 3px; background: #fff8ee; font-family: "Jost", sans-serif; font-size: 1rem; color: #2a1a0e; box-sizing: border-box; }
.sk-form textarea { min-height: 120px; resize: vertical; }
.sk-note { font-family: "Cormorant Garamond", serif; font-size: 0.95rem; color: #9b8878; font-style: italic; }
.sk-footer { background: #1a0f06; color: #9b8878; text-align: center; padding: 3rem 2rem; margin-top: 4rem; }
.sk-footer nav a { font-family: "Jost", sans-serif; }
.sk-footer p { font-family: "Jost", sans-serif; }
`;
