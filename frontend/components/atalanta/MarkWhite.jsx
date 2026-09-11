"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MarkWhite({ children, className = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const text = el.textContent || "";
    el.setAttribute("aria-label", text.trim());
    el.innerHTML = "";
    const chars = [];
    for (const ch of text) {
      if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
        continue;
      }
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.display = "inline-block";
      span.style.position = "relative";
      span.setAttribute("aria-hidden", "true");
      el.appendChild(span);
      chars.push(span);
    }

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        color: "var(--at-white)",
        duration: 0.6,
        ease: "power2.out",
        stagger: { each: 0.05, overlap: 0.1 },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [children]);

  return (
    <span ref={ref} className={`at-mark-anim ${className}`.trim()}>
      {children}
    </span>
  );
}
