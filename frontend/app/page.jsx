import Link from "next/link";
import Shell from "../components/atalanta/Shell";
import Footer from "../components/atalanta/Footer";
import MuxMedia from "../components/atalanta/MuxMedia";
import Reveal from "../components/atalanta/Reveal";

export const metadata = {
  title: "Home | Atalanta",
  description: "Provably correct decision-making for the world's most important missions.",
};

export default function HomePage() {
  return (
    <Shell>
      <section className="at-hero at-enter">
        <p className="at-kicker">Atalanta</p>
        <h1>Provably correct decision-making for the world’s most important missions.</h1>
        <div className="at-hero-stage">
          <p className="at-lede">
            Atalanta is a mathematical AI company that brings speed and rigor to the design, implementation, and verification of complex systems.
          </p>
          <MuxMedia className="at-media" playbackId="MH4N028gpYMpL9wghh6o4qaOVoM8Z9XD936Ro00YGUkd8" />
        </div>
      </section>

      <Reveal>
        <section className="at-section" id="problem">
          <div className="at-side"><span className="at-sq" /> The Problem</div>
          <div className="at-copy">
            <p>The most important systems in the world are now software-defined and increasingly autonomous. But we cannot yet prove that they will perform correctly in the real world.</p>
            <p>Testing shows how systems behave in known scenarios. It cannot prove the absence of failure in unknown ones.</p>
            <p>Mathematical proof can establish these guarantees, but it has historically been too slow and too specialized to deploy at the speed high-stakes missions demand.</p>
            <p>This creates a widening gap between the software powering these systems and our ability to understand how it will operate.</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="at-section">
          <div className="at-side"><span className="at-sq" /> Introducing Argo</div>
          <div />
        </section>
      </Reveal>

      <Reveal>
        <section className="at-product">
          <h2>Argo</h2>
          <p className="at-sub">The first software understanding platform.</p>
          <Link className="at-cta" href="/argo">Learn More</Link>
          <MuxMedia className="at-wide" playbackId="DgkKrotT00yqD6Nibngy6ZvhYmPLUSVNH2Mgtt9DsfdE" />
        </section>
      </Reveal>

      <Reveal>
        <section className="at-product">
          <h2>Argo <em>for Energy.</em></h2>
          <p className="at-body">
            Argo helps energy operators prove the safety of critical infrastructure at operational speed. It verifies that control systems enforce safety constraints, ensures human-in-the-loop workflows are followed, and identifies failure modes before deployment, so that nuclear and grid systems perform correctly as conditions change.
          </p>
          <MuxMedia className="at-wide" playbackId="GvYCtK7GtzVrLN02sFzmHwwxuYmtoc02Hl3q01Jg5n01xA00" />
        </section>
      </Reveal>

      <Reveal>
        <section className="at-product">
          <h2>Argo <em>for Space.</em></h2>
          <p className="at-body">
            Argo helps space teams prove the resilience of communications and satellite systems in dynamic, contested environments. It verifies that networks maintain connectivity under disruption, identifies failure modes before they occur, and ensures critical links persist under adversarial conditions, so that mission-critical communications continue without interruption.
          </p>
          <MuxMedia className="at-wide" playbackId="HJX9eT01B4LCaP60201u01QQjuQ00UyKpS5fj00JUrHRW3MnU" />
        </section>
      </Reveal>

      <Reveal>
        <section className="at-product">
          <h2>Argo <em>for Defense Systems.</em></h2>
          <p className="at-body">
            Argo helps defense organizations prove the security of complex systems with agility. It verifies that data remains isolated across security boundaries, ensures critical constraints are enforced, and identifies unintended system interactions, so that mission systems operate securely as requirements and conditions change.
          </p>
          <Link className="at-cta" href="/argo">Learn more</Link>
        </section>
      </Reveal>

      <Footer />
    </Shell>
  );
}
