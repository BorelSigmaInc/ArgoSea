"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../components/atalanta/Logo";
import { clearSession, readSession } from "../../lib/maer/session";

const LINKS = [
  { href: "/marine-maer/api-doc/", label: "Docs" },
  { href: "/marine-maer/partners/", label: "Catalog" },
  { href: "/marine-maer/user/", label: "Estimator" },
  { href: "/marine-mis/centerx:27.8/centery:44.0/zoom:3/", label: "Marine MIS" },
];

export default function CloudShell({ crumb, children }) {
  const path = usePathname() || "";
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    setSession(readSession());
  }, [path]);

  return (
    <div className="maer-cloud">
      <header className="maer-top">
        <Link href="/marine-maer/api-doc/" className="maer-top-brand">
          <Logo />
          Maersat Cloud
        </Link>
        <nav aria-label="Console">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-on={path.startsWith(l.href.replace(/\/$/, "")) ? "true" : "false"}>
              {l.label}
            </Link>
          ))}
        </nav>
        <input
          className="maer-top-search"
          placeholder="Search docs, services, tickets"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search console"
        />
        <span className="maer-top-user">{session?.user?.email || "Signed out"}</span>
        {session ? (
          <button
            type="button"
            className="maer-btn ghost"
            onClick={() => {
              clearSession();
              router.push("/marine-maer/sign-in/");
            }}
          >
            Log out
          </button>
        ) : (
          <Link href="/marine-maer/sign-in/">Log in</Link>
        )}
      </header>
      <div className="maer-crumb">{crumb}</div>
      {children}
    </div>
  );
}
