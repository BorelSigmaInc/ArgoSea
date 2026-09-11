"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ContactForm from "./ContactForm";
import Logo from "./Logo";
import { UPDATE } from "../../lib/atalanta/content";

const NAV = [
  { href: "/", label: "Home", match: (p) => p === "/" },
  { href: "/argo", label: "Argo", match: (p) => p.startsWith("/argo") },
  { href: "/articles", label: "Learn", match: (p) => p.startsWith("/articles") || p.startsWith("/learn") },
  { href: "/careers", label: "Careers", match: (p) => p.startsWith("/careers") },
];

function NavMark({ active }) {
  if (active) {
    return (
      <span className="at-icon at-icon-sq" aria-hidden="true">
        <svg viewBox="0 0 8 8"><rect width="8" height="8" fill="currentColor" /></svg>
      </span>
    );
  }
  return <span className="at-icon" aria-hidden="true">/</span>;
}

export default function Header() {
  const raw = usePathname() || "/";
  const path = raw.length > 1 ? raw.replace(/\/$/, "") : "/";
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [path]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="at-header">
      <Link href="/" className="at-logo" aria-label="Home">
        <span className="at-logo-sizer"><Logo /></span>
      </Link>

      <nav className="at-nav" aria-label="Primary">
        {NAV.map((item) => {
          const active = item.match(path);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <NavMark active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="at-burger"
        onClick={() => setMobile((v) => !v)}
        aria-label={mobile ? "Close" : "Menu"}
      >
        <NavMark active={mobile} />
        {mobile ? "Close" : "Menu"}
      </button>

      <div className="at-modals">
        <button
          type="button"
          className={`at-modal-btn ${open === "updates" ? "on" : ""}`}
          onClick={() => setOpen(open === "updates" ? null : "updates")}
        >
          <NavMark active />
          Updates <span className="at-badge">1 New</span>
        </button>
        <button
          type="button"
          className={`at-modal-btn ${open === "contact" ? "on" : ""}`}
          onClick={() => setOpen(open === "contact" ? null : "contact")}
        >
          <NavMark active />
          Contact Us
        </button>
      </div>

      {open === "updates" && (
        <div className="at-dropdown" role="dialog" aria-label="Updates">
          <Link href={UPDATE.href} className="at-update" onClick={() => setOpen(null)}>
            <img src={UPDATE.image} alt="" />
            <div>
              <h3>{UPDATE.title}</h3>
              <p>Read the Announcement</p>
            </div>
          </Link>
        </div>
      )}

      {open === "contact" && (
        <div className="at-dropdown" role="dialog" aria-label="Contact">
          <ContactForm compact />
        </div>
      )}

      {mobile && (
        <div className="at-mobile-panel">
          {NAV.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="at-mobile-link">
              / {item.label}
            </Link>
          ))}
          <Link href="/contact" className="at-mobile-link">/ Contact Us</Link>
        </div>
      )}
    </header>
  );
}
