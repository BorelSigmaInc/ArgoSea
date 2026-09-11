import Link from "next/link";
import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import MuxMedia from "../../components/atalanta/MuxMedia";

export const metadata = {
  title: "Argo | Atalanta",
  description: "Mathematical rigor at mission speed.",
};

export default function ArgoPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Argo</p>
        <h1>Mathematical rigor at mission speed.</h1>
        <p>
          Argo combines AI, formal methods, and digital engineering to make mathematical guarantees practical at the pace systems operate. It enables teams to design, verify, and deploy complex systems with assurance, reducing risk while saving time, money, and lives.
        </p>
      </article>

      <MuxMedia className="at-wide" playbackId="HKOB6iVRc3od8ISoK9zLlnTnSG9g1ENQO3kDX4CEJXM" />

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> Overview</div>
        <div className="at-copy">
          <p>Argo enables system architects, engineers, and operators to reason about complex systems end-to-end. It brings mathematical guarantees into decision-making workflows, allowing teams to identify failure modes and verify system behavior as conditions evolve.</p>
        </div>
      </section>

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> The Approach</div>
        <div className="at-copy">
          <p><b style={{ color: "#fcfaf3" }}>How It Works</b></p>
          <p><b style={{ color: "#fcfaf3" }}>The Argo Advantage — Unleash the Power of Proof.</b> Argo brings formal methods to a broader set of stakeholders, enabling cross-functional teams to reason collaboratively about complex systems.</p>
          <p><b style={{ color: "#fcfaf3" }}>Connect mission to implementation.</b> Argo connects mission intent to hardware design and software implementation so guarantees hold as requirements evolve.</p>
          <p><b style={{ color: "#fcfaf3" }}>Apply the right method to every problem.</b> From model checkers to theorem provers, Argo selects the best approach for each part of the system.</p>
          <p>
            <Link className="at-cta" href="/contact">Request a Demo</Link>
            {" · "}
            <Link className="at-cta" href="/en/ais/home/centerx:13.2/centery:13.8/zoom:3">Open Live Map</Link>
          </p>
        </div>
      </section>
      <Footer />
    </Shell>
  );
}
