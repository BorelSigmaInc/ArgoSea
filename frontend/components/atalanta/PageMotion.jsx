"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageMotion() {
  const path = usePathname();
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(true);
    document.documentElement.classList.add("at-transitioning");
    const hide = window.setTimeout(() => {
      setOn(false);
      document.documentElement.classList.remove("at-transitioning");
    }, 780);
    return () => {
      window.clearTimeout(hide);
      document.documentElement.classList.remove("at-transitioning");
    };
  }, [path]);

  return (
    <>
      <div className={`at-page-flash ${on ? "is-on" : ""}`} aria-hidden="true" />
    </>
  );
}
