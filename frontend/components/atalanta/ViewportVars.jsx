"use client";

import { useEffect } from "react";

export default function ViewportVars() {
  useEffect(() => {
    const set = () => {
      const vw = document.documentElement.clientWidth / 100;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--vw", `${vw}px`);
      document.documentElement.style.setProperty("--scrollbar", `${scrollbar}px`);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return null;
}
