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

    const ctx = gsap.context(() => {
      const wordmark = root.querySelector(".at-hero-wordmark");
      const heading = root.querySelector(".at-hero-heading");
      const media = root.querySelector(".at-hero-media");
      const text = root.querySelector(".at-hero-text");
      const mediaInner = root.querySelector(".at-media-parallax");

      gsap.set([wordmark, heading, media, text].filter(Boolean), { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });
      if (wordmark) tl.to(wordmark, { opacity: 1, duration: 1, ease: "power2.out" });
      if (heading) tl.to(heading, { opacity: 1, duration: 1, ease: "power2.out" }, "<0.25");
      tl.to([media, text].filter(Boolean), {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: { amount: 0.1 },
      }, "<0.25");

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

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    requestAnimationFrame(refresh);

    return () => ctx.revert();
  }, []);

  return (
    <section className="at-hero section-hero-landing" ref={ref}>
      <div className="at-hero-wordmark logo">
        <span className="at-hero-wordmark-text">Maersat</span>
      </div>

      <div className="at-hero-heading heading">
        <h1 className="at-hero-title">
          Provably correct decision-making for{" "}
          <MarkWhite>the world’s most important missions.</MarkWhite>
        </h1>
      </div>

      <div className="at-hero-stage content">
        <div className="at-hero-media at-media media">
          <div className="at-media-parallax media-inner media-overlay">
            <MuxMedia
              className="at-media-fill"
              playbackId="MH4N028gpYMpL9wghh6o4qaOVoM8Z9XD936Ro00YGUkd8"
            />
          </div>
        </div>
        <div className="at-hero-text text">
          <div className="at-hero-text-content text-content">
            <p className="at-lede">
              Maersat is a mathematical AI company that brings speed and rigor to the design, implementation, and verification of complex systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
