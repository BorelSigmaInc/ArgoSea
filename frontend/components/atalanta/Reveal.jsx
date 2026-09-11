"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, className = "", mode = "section" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      if (mode === "rich") {
        const items = root.querySelectorAll(".at-copy-reveal > p");
        gsap.set(items, { opacity: 0 });
        gsap.to(items, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: { each: 1 },
          scrollTrigger: { trigger: root, start: "top 75%" },
        });
        return;
      }

      gsap.set(root, { opacity: 0 });
      gsap.to(root, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 80%" },
      });
    }, root);

    return () => ctx.revert();
  }, [mode]);

  return (
    <div ref={ref} className={`at-reveal-gsap ${className}`.trim()}>
      {children}
    </div>
  );
}
