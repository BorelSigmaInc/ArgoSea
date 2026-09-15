"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "../../lib/atalanta/content";
import Logo from "./Logo";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_NAV = [
  { href: "/marine-mis", label: "Marine" },
  { href: "/marine-maer/sign-in", label: "Console" },
  { href: "/update", label: "Update" },
  { href: "/platform", label: "Platform" },
  { href: "/articles", label: "Learn" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-use", label: "Terms" },
];

const SOCIALS = [
  { href: "https://www.linkedin.com/company/maersat", label: "LinkedIn" },
  { href: "https://x.com/maersat", label: "X" },
  { href: "https://www.youtube.com/@Maersat", label: "YouTube" },
];

/** Matches original navigation-button icon: idle `/`, active square. */
function NavIcon({ active }) {
  return (
    <span className="at-nav-icon" aria-hidden="true">
      <span className={`at-nav-icon-idle${active ? " is-hide" : ""}`}>/</span>
      <span className={`at-nav-icon-active${active ? " is-show" : ""}`}>
        <svg viewBox="0 0 8 8" fill="none"><rect width="8" height="8" fill="currentColor" /></svg>
      </span>
    </span>
  );
}

export default function Footer() {
  const raw = usePathname() || "/";
  const path = raw.length > 1 ? raw.replace(/\/$/, "") : "/";
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const root = footerRef.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
      const rects = root.querySelectorAll(".at-pattern-footer rect");
      if (!rects.length) return;
      gsap.from(rects, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: root.querySelector(".at-pattern-footer"),
          start: "top 75%",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="at-footer" ref={footerRef}>
      <div className="at-footer-pattern" aria-hidden="true">
        <div className="at-pattern-footer">
          <svg viewBox="0 0 1728 1002" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
            <g className="animate-wrapper">
              <g opacity="0.05">
                <rect width="285" height="148" transform="matrix(-1 0 0 1 854 674)" fill="white" />
                <rect x="1566" y="674" width="142" height="328" fill="white" />
                <rect x="20" y="822" width="265" height="180" fill="white" />
                <rect x="1281" y="338" width="285" height="336" fill="white" />
                <rect width="141" height="121.515" transform="matrix(-1 0 0 1 710 337.719)" fill="white" />
                <rect width="139" height="138" transform="matrix(-1 0 0 1 1705 200)" fill="white" />
                <rect x="854" y="822" width="233" height="180" fill="white" />
                <rect width="142" height="215" transform="matrix(-1 0 0 1 569 459)" fill="white" />
                <rect width="142" height="148" transform="matrix(-1 0 0 1 427 674)" fill="white" />
                <rect width="194" height="148" transform="matrix(-1 0 0 1 1281 674)" fill="white" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className="at-section-layout at-footer-layout">
        <div className="at-sidebar">
          <div className="at-footer-meta">
            <p className="at-copyr text-link">
              COPYRIGHT 2026
              <br />
              MAERSAT TECHNOLOGIES INC.
            </p>
            <div className="at-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="at-link light" href={s.href} target="_blank" rel="noreferrer">
                  <NavIcon active={false} />
                  {s.label}
                </a>
              ))}
            </div>
            <a className="at-link at-credit" href={SITE.domain} target="_blank" rel="noreferrer">
              Site Credit
            </a>
          </div>
        </div>
        <div className="at-main">
          <nav className="at-footer-nav" aria-label="Footer">
            {FOOTER_NAV.map((item) => {
              const active = item.href === "/"
                ? path === "/"
                : path.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  className="at-link light"
                  href={item.href}
                  data-footer-nav-item
                  data-href={item.href}
                  data-state={active ? "active" : "idle"}
                >
                  <NavIcon active={active} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop wordmark — logo M + rest of name, full-bleed like source */}
      <div className="at-wordmark" aria-hidden="true">
        <div className="at-wordmark-lockup">
          <span className="at-wordmark-m"><Logo /></span>
          <span className="at-wordmark-rest">aersat</span>
        </div>
      </div>

      {/* Mobile wordmark — monogram only (original uses letter mark) */}
      <div className="at-wordmark mobile" aria-hidden="true">
        <Logo />
      </div>
    </footer>
  );
}
