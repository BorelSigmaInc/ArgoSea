import Link from "next/link";
import { SITE } from "../../lib/atalanta/content";

export const MAER_PLANS = [
  {
    id: "maer",
    name: "Maer",
    price: "$299",
    period: "/mo",
    recommended: false,
    target: "Small operators, indie devs, single-vessel",
    description:
      "Entry maritime intelligence API with 10K calls/mo and quantum verification.",
    paymentUrl: "https://buy.stripe.com/5kQ5kE0r2e4Qe5A6bza7C04",
  },
  {
    id: "maer-pro",
    name: "Maer Pro",
    price: "$449",
    period: "/mo",
    recommended: true,
    target: "Growing fleets, small enterprises",
    description:
      "Professional maritime intelligence with risk screening and 100K calls/mo.",
    paymentUrl: "https://buy.stripe.com/00waEYb5G6Co6D89nLa7C06",
  },
  {
    id: "maer-pro-plus",
    name: "Maer Pro+",
    price: "$499",
    period: "/mo",
    recommended: false,
    target: "Defense, energy, government-adjacent",
    description:
      "Enterprise-grade intelligence with unlimited calls, SLA, and dedicated QPU quota.",
    paymentUrl: "https://buy.stripe.com/28E28sddO8Kw2mS6bza7C05",
  },
];

export const MAER_FEATURES = [
  { name: "Monthly API calls", values: ["10,000", "100,000", "Unlimited (fair use)"] },
  { name: "Seats / users", values: ["1", "10", "Unlimited"] },
  { name: "Vessel tracking", values: ["Real-time", "Real-time", "Real-time + historical 5y"] },
  { name: "Risk & compliance", values: ["Not included", "Sanctions + ownership", "Full 360° + dark ship detection"] },
  { name: "Formal verification (z3)", values: ["1 route/day", "20 routes/day", "Unlimited"] },
  { name: "Quantum verification (QAOA)", values: ["1 job/day", "20 jobs/day", "100 jobs/day + priority queue"] },
  { name: "Refined optimality", values: ["Standard", "Standard", "Standard + error mitigation"] },
  { name: "Data export", values: ["Not included", "CSV", "CSV + Parquet + API stream"] },
  { name: "Support", values: ["Email (48h)", "Email (24h) + Slack", "Dedicated CSM + SLA 99.9%"] },
  { name: "Custom domain", values: ["Not included", "Not included", "Included"] },
  { name: "Audit trail / proof certificates", values: ["Not included", "Included", "Signed + regulator-ready"] },
  { name: "SLA", values: ["Not included", "99.5%", "99.9%"] },
];

function cellTone(value) {
  const v = String(value).toLowerCase();
  if (v === "not included" || v === "no") return "is-off";
  return "is-on";
}

export default function MaerPricing({ backHref = "/platform/", backLabel = "← Back to Platform" }) {
  return (
    <main className="at-maer">
      <article className="at-inner at-maer-intro">
        <p className="at-kicker">
          <Link href={backHref}>{backLabel}</Link>
        </p>
        <p className="at-maer-eyebrow">Maer · Business</p>
        <h1>Maer – Pricing & Feature Matrix</h1>
        <p>
          Three tiers for maritime intelligence — pick the capacity that matches how you decide.
          Differentiation is driven by API volume, verification capacity, compliance depth, and support.
        </p>
      </article>

      {/* Desktop / tablet comparison table */}
      <section className="at-maer-matrix-wrap at-maer-desktop" aria-label="Maer pricing and feature matrix">
        <div className="at-maer-matrix">
          <div className="at-maer-row at-maer-head">
            <div className="at-maer-feature-col">Feature</div>
            {MAER_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`at-maer-plan-col${plan.recommended ? " is-recommended" : ""}`}
              >
                {plan.recommended && <span className="at-maer-badge">Recommended</span>}
                <h2>{plan.name}</h2>
                <p className="at-maer-price">
                  <span>{plan.price}</span>
                  {plan.period}
                </p>
                <p className="at-maer-target">{plan.target}</p>
                <p className="at-maer-desc">{plan.description}</p>
                <a
                  className="at-maer-optin"
                  href={plan.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Opt-in →
                </a>
              </div>
            ))}
          </div>

          {MAER_FEATURES.map((feature) => (
            <div className="at-maer-row" key={feature.name}>
              <div className="at-maer-feature-col">{feature.name}</div>
              {feature.values.map((value, i) => (
                <div
                  key={`${feature.name}-${MAER_PLANS[i].id}`}
                  className={`at-maer-plan-col at-maer-cell ${cellTone(value)}${MAER_PLANS[i].recommended ? " is-recommended" : ""}`}
                >
                  <span className="at-maer-mark" aria-hidden="true">
                    {cellTone(value) === "is-off" ? "✕" : "✓"}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Mobile / narrow: stacked plan cards */}
      <section className="at-maer-cards" aria-label="Maer plans">
        {MAER_PLANS.map((plan, planIndex) => (
          <article
            key={plan.id}
            className={`at-maer-card${plan.recommended ? " is-recommended" : ""}`}
          >
            {plan.recommended && <span className="at-maer-badge">Recommended</span>}
            <h2>{plan.name}</h2>
            <p className="at-maer-price">
              <span>{plan.price}</span>
              {plan.period}
            </p>
            <p className="at-maer-target">{plan.target}</p>
            <p className="at-maer-desc">{plan.description}</p>
            <a
              className="at-maer-optin"
              href={plan.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Opt-in →
            </a>
            <ul className="at-maer-card-features">
              {MAER_FEATURES.map((feature) => {
                const value = feature.values[planIndex];
                const off = cellTone(value) === "is-off";
                return (
                  <li key={feature.name} className={off ? "is-off" : "is-on"}>
                    <span className="at-maer-mark" aria-hidden="true">{off ? "✕" : "✓"}</span>
                    <span>
                      <strong>{feature.name}</strong>
                      <em>{value}</em>
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </section>

      <section className="at-section at-maer-note">
        <div className="at-side"><span className="at-sq" /> Pricing</div>
        <div className="at-copy">
          <p>
            Billed monthly in USD via Stripe. Pro is the mid-market sweet spot; Pro+ sits close to Pro so premium capacity is an easy upgrade.
            Need a custom seat count, air-gapped deployment, or dedicated QPU quota?{" "}
            <Link className="at-cta" href="/contact/">Contact us</Link>
            {" · "}
            <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            {" · "}
            <Link className="at-cta" href="/marine-mis/">Open Marine</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
