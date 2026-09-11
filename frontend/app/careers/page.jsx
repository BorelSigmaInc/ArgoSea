import Link from "next/link";
import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import MuxMedia from "../../components/atalanta/MuxMedia";
import { JOBS } from "../../lib/atalanta/content";

export const metadata = {
  title: "Careers | Atalanta",
  description: "We’re recruiting a team of modern-day Argonauts.",
};

export default function CareersPage() {
  const groups = [...new Set(JOBS.map((j) => j.group))];

  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Careers</p>
        <h1>We’re recruiting a team of modern-day Argonauts.</h1>
        <p>
          Atalanta is in search of exceptional engineers, mathematicians, strategists, and builders committed to solving the hardest, highest-stakes problems in the world. We move fast, but we do so with discipline and logic. We think from first principles and execute with autonomy and accountability.
        </p>
      </article>

      <MuxMedia className="at-wide" playbackId="37lv401ynz6Eknh34YYe5Cs8NjV3W2YJNC3dcFG6ruZY" />

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> How We Work</div>
        <div className="at-copy">
          <p>Atalanta takes its name from the mythological Greek heroine, a swift and fearless competitor who defied expectations and joined the Argonauts on a mission few thought possible. Her spirit of speed, precision, and resilience shapes how we work.</p>
          <p>You may be a good fit for Atalanta if you are insatiably curious in the face of discomfort, are a coalition builder who sees progress as a positive-sum game, and believe that the alchemy of interdisciplinary expertise can solve seemingly impossible problems.</p>
        </div>
      </section>

      <article className="at-inner">
        <p className="at-kicker">Open Roles</p>
        {groups.map((g) => (
          <div key={g}>
            <p className="at-group">{g}</p>
            {JOBS.filter((j) => j.group === g).map((j) => (
              <div key={j.title} className="at-job">
                <p className="at-meta">{j.type} · {j.location}</p>
                <h3>{j.title}</h3>
                <p>{j.blurb}</p>
                <Link className="at-cta" href="/contact">Apply</Link>
              </div>
            ))}
          </div>
        ))}
        <p className="at-kicker" style={{ marginTop: 64 }}>Join Us</p>
        <p>We’re building the tools needed for the world’s most important systems to be understood and trusted. If you want to help shape that future, we invite you to apply.</p>
      </article>
      <Footer />
    </Shell>
  );
}
