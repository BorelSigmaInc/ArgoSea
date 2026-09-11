"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarkWhite from "./MarkWhite";
import MuxMedia from "./MuxMedia";

gsap.registerPlugin(ScrollTrigger);

export default function HeroLanding() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const mediaInner = root.querySelector(".at-media-parallax");

    const ctx = gsap.context(() => {
      gsap.set([".at-hero-wordmark", ".at-hero-heading", ".at-media", ".at-lede"], { opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%" },
      });
      tl.to(".at-hero-wordmark", { opacity: 1, duration: 1, ease: "power2.out" });
      tl.to(".at-hero-heading", { opacity: 1, duration: 1, ease: "power2.out" }, "<0.25");
      tl.to([".at-media", ".at-lede"], { opacity: 1, duration: 1, ease: "power2.out", stagger: { amount: 0.1 } }, "<0.25");

      if (mediaInner) {
        gsap.fromTo(
          mediaInner,
          { y: "-20%" },
          {
            y: "20%",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="at-hero section-hero-landing" ref={ref}>
      <div className="at-hero-wordmark">
        <img
          src="https://cdn.sanity.io/images/pch7hdea/production/0c2fea3bfedf2a1ac3ad885b7f3d1fea27cffbdd-113x25.svg?w=400&fit=max&auto=format"
          alt="Atalanta"
          width={113}
          height={25}
        />
      </div>
      <h1 className="at-hero-title at-hero-heading">
        Provably correct decision-making for{" "}
        <MarkWhite>the world’s most important missions.</MarkWhite>
      </h1>
      <div className="at-hero-stage">
        <div className="at-media media-overlay">
          <div className="at-media-parallax">
            <MuxMedia className="at-media-fill" playbackId="MH4N028gpYMpL9wghh6o4qaOVoM8Z9XD936Ro00YGUkd8" />
          </div>
        </div>
        <p className="at-lede">
          Atalanta is a mathematical AI company that brings speed and rigor to the design, implementation, and verification of complex systems.
        </p>
      </div>
    </section>
  );
}
