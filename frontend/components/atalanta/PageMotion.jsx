"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const DUR = { sm: 0.3 };

export default function PageMotion() {
  const path = usePathname();
  const panelRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const cells = Array.from(document.querySelectorAll("[data-pattern-cell]"));
    cells.sort((a, b) => Number(b.dataset.row || 0) - Number(a.dataset.row || 0));

    if (first.current) {
      first.current = false;
      gsap.set(panel, { y: "100%" });
      gsap.set(cells, { opacity: 0 });
      return undefined;
    }

    const enter = gsap.timeline();
    enter.to(panel, { y: "0%", duration: DUR.sm, ease: "power2.inOut" });
    if (cells.length) {
      gsap.set(cells, { opacity: 0 });
      enter.to(
        cells,
        {
          opacity: 1,
          duration: DUR.sm,
          stagger: { each: DUR.sm / cells.length },
        },
        "<0.15",
      );
    }

    const exit = gsap.timeline({ delay: DUR.sm + 0.05 });
    if (cells.length) {
      exit.to(cells, {
        opacity: 0,
        duration: DUR.sm,
        stagger: { each: DUR.sm / cells.length },
      });
    }
    exit.to(
      panel,
      {
        y: "-100%",
        duration: DUR.sm,
        ease: "power2.inOut",
        onComplete: () => gsap.set(panel, { y: "100%" }),
      },
      "<0.2",
    );

    return () => {
      enter.kill();
      exit.kill();
    };
  }, [path]);

  return <div id="page-transition" ref={panelRef} className="at-page-transition" aria-hidden="true" />;
}
