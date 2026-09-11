"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const SESSION_KEY = "marine-logo-splash-seen";

function initialPhase() {
  if (typeof window === "undefined") return "show";
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1" ? "done" : "show";
  } catch {
    return "show";
  }
}

export default function LogoSplash() {
  const [phase, setPhase] = useState(initialPhase);

  useEffect(() => {
    if (phase === "done") return undefined;

    const hideTimer = window.setTimeout(() => setPhase("hide"), 1800);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2600);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`at-logo-splash ${phase === "hide" ? "is-out" : "is-in"}`} aria-hidden="true">
      <div className="at-logo-splash-mark">
        <Logo />
      </div>
      <p className="at-logo-splash-name">Maersat</p>
    </div>
  );
}
