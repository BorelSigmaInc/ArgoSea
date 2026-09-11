"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarkWhite from "./MarkWhite";
import MuxMedia from "./MuxMedia";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    title: (
      <>
        <MarkWhite>Maersat</MarkWhite>
        <br />
        for Marine.
      </>
    ),
    body: null,
    cta: { href: "/platform/", label: "Learn More" },
  },
  {
    title: (
      <>
        <MarkWhite>Maersat</MarkWhite>
        <br />
        for Energy.
      </>
    ),
    body: "Maersat helps energy operators prove the safety of critical infrastructure at operational speed. It verifies that control systems enforce safety constraints, ensures human-in-the-loop workflows are followed, and identifies failure modes before deployment, so that nuclear and grid systems perform correctly as conditions change.",
    playbackId: "DgkKrotT00yqD6Nibngy6ZvhYmPLUSVNH2Mgtt9DsfdE",
  },
  {
    title: (
      <>
        <MarkWhite>Maersat</MarkWhite>
        <br />
        for Space.
      </>
    ),
    body: "Maersat helps space teams prove the resilience of communications and satellite systems in dynamic, contested environments. It verifies that networks maintain connectivity under disruption, identifies failure modes before they occur, and ensures critical links persist under adversarial conditions, so that mission-critical communications continue without interruption.",
    playbackId: "GvYCtK7GtzVrLN02sFzmHwwxuYmtoc02Hl3q01Jg5n01xA00",
  },
  {
    title: (
      <>
        <MarkWhite>Maersat</MarkWhite>
        <br />
        for Defense.
      </>
    ),
    body: "Maersat helps defense organizations prove the security of complex systems with agility. It verifies that data remains isolated across security boundaries, ensures critical constraints are enforced, and identifies unintended system interactions, so that mission systems operate securely as requirements and conditions change.",
    playbackId: "HJX9eT01B4LCaP60201u01QQjuQ00UyKpS5fj00JUrHRW3MnU",
    cta: { href: "/platform/", label: "Learn more" },
  },
];

function SideLabel() {
  return (
    <h2 className="at-square-heading">
      <span className="at-sq" aria-hidden="true" />
      Introducing Maersat
    </h2>
  );
}

export default function StickyCards() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const cards = Array.from(root.querySelectorAll(".at-card-full"));

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const media = card.querySelector(".at-card-media-inner");
        const overlay = card.querySelector(".at-card-overlay");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.05 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            },
          );
        }
        if (overlay) {
          gsap.to(overlay, {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 33%", end: "top top", scrub: true },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="at-cards-full" ref={ref}>
      <div className="at-cards-side">
        <div className="at-cards-side-sticky">
          <SideLabel />
        </div>
      </div>
      <div className="at-cards-stack">
        {CARDS.map((card, i) => (
          <article className="at-card-full" key={i}>
            {card.playbackId && (
              <div className="at-card-media media-overlay">
                <div className="at-card-media-inner">
                  <MuxMedia className="at-media-fill" playbackId={card.playbackId} />
                </div>
              </div>
            )}
            <div className="at-card-overlay" aria-hidden="true" />
            <div className="at-card-content">
              <div className="at-section-layout">
                <div className="at-sidebar">
                  <div className="at-mobile-subheading">
                    <SideLabel />
                  </div>
                </div>
                <div className="at-main">
                  <div className="at-card-copy">
                    <h2>{card.title}</h2>
                    {card.body && <p>{card.body}</p>}
                  </div>
                  {card.cta && (
                    <div className="at-card-cta">
                      <Link className="at-cta-lg" href={card.cta.href}>{card.cta.label}</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
