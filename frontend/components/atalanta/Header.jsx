"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ContactForm from "./ContactForm";
import Logo from "./Logo";
import { UPDATE } from "../../lib/atalanta/content";

const NAV = [
  { href: "/", label: "Home", match: (p) => p === "/" },
  { href: "/marine-mis", label: "Marine", match: (p) => p.startsWith("/marine-mis") || p.startsWith("/en/ais") },
  { href: "/marine-maer/sign-in", label: "Console", match: (p) => p.startsWith("/marine-maer") },
  { href: "/update", label: "Update", match: (p) => p.startsWith("/update") || p.startsWith("/products/maer") },
  { href: "/platform", label: "Platform", match: (p) => p.startsWith("/platform") || p.startsWith("/argo") },
  { href: "/articles", label: "Learn", match: (p) => p.startsWith("/articles") || p.startsWith("/learn") },
  { href: "/careers", label: "Careers", match: (p) => p.startsWith("/careers") },
];

const MOBILE_NAV = [
  { href: "/marine-mis", label: "Marine" },
  { href: "/marine-maer/sign-in", label: "Console" },
  { href: "/update", label: "Update" },
  { href: "/platform", label: "Platform" },
  { href: "/articles", label: "Learn" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

function NavMark({ active, mode = "nav" }) {
  if (mode === "modal") {
    return (
      <span className={`at-modal-icon${active ? " is-on" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 8 8"><rect width="8" height="8" fill="currentColor" /></svg>
      </span>
    );
  }
  return (
    <span className="at-nav-icon" aria-hidden="true">
      <span className={`at-nav-icon-idle${active ? " is-hide" : ""}`}>/</span>
      <span className={`at-nav-icon-active${active ? " is-show" : ""}`}>
        <svg viewBox="0 0 8 8" fill="none"><rect width="8" height="8" fill="currentColor" /></svg>
      </span>
    </span>
  );
}

export default function Header() {
  const raw = usePathname() || "/";
  const path = raw.length > 1 ? raw.replace(/\/$/, "") : "/";
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef(null);
  const updatesReveal = useRef(null);
  const contactReveal = useRef(null);
  const mobileReveal = useRef(null);
  const updatesBtn = useRef(null);
  const contactBtn = useRef(null);
  const updatesPanel = useRef(null);
  const contactPanel = useRef(null);
  const mobileBtn = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const ctx = gsap.context(() => {
      const logo = header.querySelector("[data-header-logo]");
      const nav = Array.from(header.querySelectorAll("[data-header-nav-item]"));
      const modals = Array.from(header.querySelectorAll("[data-header-modal-item]"));
      const burger = header.querySelector("[data-header-mobile-menu]");
      // Never leave the burger invisible — CSS controls show/hide by breakpoint.
      gsap.set([logo, ...nav, ...modals].filter(Boolean), { opacity: 0, x: -10 });
      if (burger) gsap.set(burger, { opacity: 1, x: 0, clearProps: "transform" });
      const tl = gsap.timeline({
        onComplete: () => {
          header.dataset.animated = "true";
        },
      });
      if (logo) tl.to(logo, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" });
      if (nav.length) tl.to(nav, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.1 } }, "<0.1");
      if (modals.length) {
        tl.to(modals, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.1 } }, "<0.1");
      }
    }, header);

    return () => {
      delete header.dataset.animated;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("at-menu-open", mobile);
    document.body.classList.toggle("at-menu-open", mobile);
    return () => {
      document.documentElement.classList.remove("at-menu-open");
      document.body.classList.remove("at-menu-open");
    };
  }, [mobile]);

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

  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target;
      if (open === "updates") {
        if (!updatesPanel.current?.contains(t) && !updatesBtn.current?.contains(t)) setOpen(null);
      }
      if (open === "contact") {
        if (!contactPanel.current?.contains(t) && !contactBtn.current?.contains(t)) setOpen(null);
      }
      if (mobile) {
        const wrap = document.querySelector("[data-mobile-menu-wrapper]");
        if (!wrap?.contains(t) && !mobileBtn.current?.contains(t)) setMobile(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open, mobile]);

  useEffect(() => {
    const el = updatesReveal.current;
    if (!el) return;
    const tl = gsap.timeline();
    if (open === "updates") tl.to(el, { height: "auto", duration: 1, ease: "expo.out" });
    else tl.to(el, { height: 0, duration: 0.6, ease: "power2.out" });
    return () => tl.kill();
  }, [open]);

  useEffect(() => {
    const el = contactReveal.current;
    if (!el) return;
    const tl = gsap.timeline();
    if (open === "contact") tl.to(el, { height: "auto", duration: 1, ease: "expo.out" });
    else tl.to(el, { height: 0, duration: 0.6, ease: "power2.out" });
    return () => tl.kill();
  }, [open]);

  useEffect(() => {
    const el = mobileReveal.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-mobile-nav-item]");
    const wordmark = el.querySelector("[data-mobile-wordmark]");
    const tl = gsap.timeline();
    if (mobile) {
      tl.to(el, { height: "auto", duration: 1, ease: "expo.out" });
      tl.to(items, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: { amount: 0.1 } }, "<0.1");
      if (wordmark) tl.to(wordmark, { opacity: 1, duration: 1.6, ease: "power2.out" }, "<");
    } else {
      tl.to(items, { y: -5, opacity: 0, duration: 0.3, ease: "power2.out", stagger: { amount: -0.1 } });
      tl.to(el, { height: 0, duration: 0.6, ease: "power2.out" }, "<");
      if (wordmark) tl.to(wordmark, { opacity: 0, duration: 0.1, ease: "power2.out" }, "<");
    }
    return () => tl.kill();
  }, [mobile]);

  const updatesState = open === "updates" ? "active" : open ? "inactive" : "idle";
  const contactState = open === "contact" ? "active" : open ? "inactive" : "idle";

  return (
    <>
      <header className="at-header" ref={headerRef}>
        <Link href="/" className="at-logo" aria-label="Home" data-header-logo>
          <span className="at-logo-sizer"><Logo /></span>
        </Link>

        <nav className="at-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = item.match(path);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-header-nav-item
                data-href={item.href}
                data-state={active ? "active" : "idle"}
                className={active ? "active" : ""}
              >
                <NavMark active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="at-mobile-slot" data-header-mobile-menu>
          <button
            ref={mobileBtn}
            type="button"
            className="at-burger"
            data-state={mobile ? "active" : "idle"}
            data-mobile-menu-button
            onClick={() => {
              setOpen(null);
              setMobile((v) => !v);
            }}
            aria-label={mobile ? "Close" : "Menu"}
          >
            <NavMark active={mobile} mode="modal" />
            {mobile ? "Close" : "Menu"}
          </button>
        </div>

        <div className="at-modals">
          <div className="at-modal-slot" data-header-modal-item>
            <button
              ref={updatesBtn}
              type="button"
              className="at-modal-btn"
              data-state={updatesState}
              onClick={() => {
                setMobile(false);
                setOpen(open === "updates" ? null : "updates");
              }}
            >
              <NavMark active={open === "updates"} mode="modal" />
              Updates <span className="at-badge">1 New</span>
            </button>
            <div className="at-modal-positioner updates">
              <div className="at-modal-revealer" ref={updatesReveal} style={{ height: 0, overflow: "hidden" }}>
                <div className="at-dropdown-panel" ref={updatesPanel} data-state={open === "updates" ? "open" : "closed"}>
                  <Link href={UPDATE.href} className="at-update" onClick={() => setOpen(null)}>
                    <img src={UPDATE.image} alt="" />
                    <div>
                      <h3>{UPDATE.title}</h3>
                      <p className="at-update-cta">Read the Announcement</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="at-modal-divider" aria-hidden="true" />

          <div className="at-modal-slot at-contact-modal" data-header-modal-item>
            <button
              ref={contactBtn}
              type="button"
              className="at-modal-btn"
              data-state={contactState}
              onClick={() => {
                setMobile(false);
                setOpen(open === "contact" ? null : "contact");
              }}
            >
              <NavMark active={open === "contact"} mode="modal" />
              Contact Us
            </button>
            <div className="at-modal-positioner contact">
              <div className="at-modal-revealer" ref={contactReveal} style={{ height: 0, overflow: "hidden" }}>
                <div className="at-dropdown-panel" ref={contactPanel} data-state={open === "contact" ? "open" : "closed"}>
                  <ContactForm compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className="at-mobile-wrapper"
        data-mobile-menu-wrapper
        data-state={mobile ? "open" : "closed"}
      >
        <div className="at-mobile-revealer" ref={mobileReveal} style={{ height: 0, overflow: "hidden" }}>
          <div className="at-mobile-panel">
            <nav data-mobile-menu-nav>
              {MOBILE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="at-mobile-link"
                  data-mobile-nav-item
                  onClick={() => setMobile(false)}
                >
                  <span className="at-mobile-slash">/</span> {item.label}
                </Link>
              ))}
            </nav>
            <div className="at-mobile-updates" data-mobile-nav-item>
              <p className="at-mobile-updates-label">
                Updates <span className="at-badge">1 New</span>
              </p>
              <Link
                href={UPDATE.href}
                className="at-update at-mobile-update"
                onClick={() => setMobile(false)}
              >
                <img src={UPDATE.image} alt="" />
                <div>
                  <h3>{UPDATE.title}</h3>
                  <p className="at-update-cta">Read the Announcement</p>
                </div>
              </Link>
            </div>
            <div className="at-mobile-wordmark" data-mobile-wordmark aria-hidden="true">
              <span className="at-hero-wordmark-text">Maersat</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
