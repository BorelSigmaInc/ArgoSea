"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageMotion() {
  const path = usePathname();
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 700);
    return () => window.clearTimeout(t);
  }, [path]);

  return <div className={`at-page-flash ${flash ? "is-on" : ""}`} aria-hidden="true" />;
}
