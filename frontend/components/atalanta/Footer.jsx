"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_NAV = [
  { href: "/argo", label: "Argo" },
  { href: "/articles", label: "Learn" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-use", label: "Terms" },
];

const SOCIALS = [
  { href: "https://www.linkedin.com/company/atalanta-technologies/", label: "LinkedIn" },
  { href: "https://x.com/AtalantaTech", label: "X" },
  { href: "https://www.youtube.com/@AtalantaTech", label: "YouTube" },
];

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
      if (rects.length) {
        gsap.from(rects, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".at-pattern-footer", start: "top 75%", scrub: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="at-footer" ref={footerRef}>
      <div className="at-footer-pattern" aria-hidden="true">
        <div className="at-pattern-footer">
          <svg viewBox="0 0 1728 1002" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <p className="at-copyr">
              COPYRIGHT 2026
              <br />
              ATALANTA TECHNOLOGIES INC.
            </p>
            <div className="at-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="at-link light" href={s.href} target="_blank" rel="noreferrer">
                  <NavIcon active={false} />
                  {s.label}
                </a>
              ))}
            </div>
            <a className="at-link at-credit" href="https://www.alright.studio" target="_blank" rel="noreferrer">
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
                  className="at-link"
                  href={item.href}
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

      <div className="at-wordmark" aria-hidden="true">
        <img src="/media/atalanta-wordmark.svg" alt="" />
      </div>
      <div className="at-wordmark mobile" aria-hidden="true">
        <svg viewBox="0 0 23 25" fill="none">
          <path d="M10.6381 0H10.5881H7.97835V5.31958H10.6381V0.14167L16.4452 16.4893H11.1701V13.8323H5.31995V16.4893H2.66016V19.6811H5.31995V16.4921H11.1701V19.1491H17.3911L19.4689 24.9993H22.869L13.9854 0H10.6381Z" fill="currentColor" />
        </svg>
      </div>
    </footer>
  );
}
