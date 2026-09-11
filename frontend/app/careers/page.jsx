import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import MuxMedia from "../../components/atalanta/MuxMedia";
import { JOBS, SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Careers",
  description: "Join Maersat — we’re recruiting builders committed to maritime intelligence and provable decision-making.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  const groups = [...new Set(JOBS.map((j) => j.group))];
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Careers</p>
        <h1>We’re recruiting a team of modern-day builders.</h1>
        <p>
          Maersat is in search of exceptional engineers, mathematicians, strategists, and builders committed to solving the hardest, highest-stakes problems in the world. We move fast, but we do so with discipline and logic. We think from first principles and execute with autonomy and accountability.
        </p>
      </article>

      <MuxMedia className="at-wide" playbackId="HKOB6iVRc3od8ISoK9zLlnTnSG9g1ENQO3kDX4CEJXM" />

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> Culture</div>
        <div className="at-copy">
          <p>Maersat exists to bring speed, precision, and resilience to mission-critical systems across maritime, energy, space, and defense.</p>
          <p>You may be a good fit for Maersat if you are insatiably curious in the face of discomfort, are a coalition builder who sees progress as a positive-sum game, and believe that the alchemy of interdisciplinary expertise can solve seemingly impossible problems.</p>
          <p>
            Reach us at{" "}
            <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </section>

      <section className="at-section">
        <div className="at-side"><span className="at-sq" /> Open Roles</div>
        <div>
          {groups.map((g) => (
            <div key={g}>
              <p className="at-group">{g}</p>
              {JOBS.filter((j) => j.group === g).map((j) => (
                <div className="at-job" key={j.title}>
                  <p className="at-meta">{j.type} · {j.location}</p>
                  <h3>{j.title}</h3>
                  <p>{j.blurb}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </Shell>
  );
}
