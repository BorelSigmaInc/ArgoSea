"use client";

import Link from "next/link";
import { DOC_NAV, DOC_PAGES } from "../../lib/maer/docs";
import CloudShell from "./CloudShell";

export default function ApiDocView({ topic = "overview" }) {
  const page = DOC_PAGES[topic] || DOC_PAGES.overview;
  return (
    <CloudShell crumb={<><Link href="/marine-maer/api-doc/">Docs</Link> / Marine Maer / {page.title}</>}>
      <div className="maer-docs">
        <aside className="maer-sidenav">
          {DOC_NAV.map((group) => (
            <div key={group.heading}>
              <h3>{group.heading}</h3>
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/marine-maer/api-doc/${item.id}/`}
                  data-on={item.id === topic ? "true" : "false"}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <article className="maer-doc">
          <p style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#525252" }}>
            Maersat Cloud documentation
          </p>
          <h1>{page.title}</h1>
          <p className="dek">{page.dek}</p>
          {page.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
          {topic === "api" && (
            <pre className="maer-code">{`curl -s https://marine.maersat.com/api/proxy/health/
curl -s -X POST https://marine.maersat.com/api/proxy/maer/login/ \\
  -H 'content-type: application/json' \\
  -d '{"email":"partner@maersat.com","password":"Maer-Console-2026"}'`}</pre>
          )}
          <p>
            <Link href="/marine-mis/centerx:27.8/centery:44.0/zoom:3/">Open live Marine MIS</Link>
            {" · "}
            <Link href="/marine-maer/sign-in/">Sign in</Link>
          </p>
        </article>
      </div>
    </CloudShell>
  );
}
