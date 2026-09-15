import Link from "next/link";
import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import MuxMedia from "../../components/atalanta/MuxMedia";
import LiveStatus from "../../components/atalanta/LiveStatus";
import { SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Platform",
  description: "Maersat platform — mathematical rigor at mission speed for maritime, energy, space, and defense.",
  alternates: { canonical: "/platform/" },
};

export default function PlatformPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Maersat Platform</p>
        <h1>Mathematical rigor at mission speed.</h1>
        <p>
          Maersat combines AI, formal methods, and digital engineering to make mathematical guarantees practical at the pace systems operate. It enables teams to design, verify, and deploy complex systems with assurance, reducing risk while saving time, money, and lives.
        </p>
        <LiveStatus />
      </article>

      <MuxMedia className="at-wide" playbackId="HKOB6iVRc3od8ISoK9zLlnTnSG9g1ENQO3kDX4CEJXM" />

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> Overview</div>
        <div className="at-copy">
          <p>Maersat enables system architects, engineers, and operators to reason about complex systems end-to-end. It brings mathematical guarantees into decision-making workflows, allowing teams to identify failure modes and verify system behavior as conditions evolve.</p>
        </div>
      </section>

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> The Approach</div>
        <div className="at-copy">
          <p><b style={{ color: "#fcfaf3" }}>How It Works</b></p>
          <p><b style={{ color: "#fcfaf3" }}>The Maersat Advantage — Unleash the Power of Proof.</b> Maersat brings formal methods to a broader set of stakeholders, enabling cross-functional teams to reason collaboratively about complex systems.</p>
          <p><b style={{ color: "#fcfaf3" }}>Connect mission to implementation.</b> Maersat connects mission intent to hardware design and software implementation so guarantees hold as requirements evolve.</p>
          <p><b style={{ color: "#fcfaf3" }}>Apply the right method to every problem.</b> From model checkers to theorem provers, Maersat selects the best approach for each part of the system.</p>
          <p>
            <Link className="at-cta" href="/contact">Request a Demo</Link>
            {" · "}
            <Link className="at-cta" href="/update/">Maer Pricing</Link>
            {" · "}
            <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            {" · "}
            <Link className="at-cta" href="/marine-mis/">Open Marine</Link>
          </p>
        </div>
      </section>

      <section className="at-section" id="capabilities">
        <div className="at-side"><span className="at-sq" /> Live capabilities</div>
        <div className="at-copy">
          <p><b style={{ color: "#fcfaf3" }}>Marine MIS.</b> Track a satellite-aware AIS picture, search vessels and ports, and keep a working fleet list. API-verified positions overlay the live map when the backend is reachable.</p>
          <p><b style={{ color: "#fcfaf3" }}>Maer.</b> Subscribe for API volume, risk screening, and verification capacity — Starter through Pro+.</p>
          <p><b style={{ color: "#fcfaf3" }}>Proof, not just telemetry.</b> Formal safety checks and quantum-verified routing run on the ArgoSea API. Job-level QPU detail stays on the internal console, not this site.</p>
        </div>
      </section>
      <Footer />
    </Shell>
  );
}
