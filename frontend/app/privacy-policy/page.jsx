import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import { SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Privacy Policy",
  description: "Maersat privacy policy — how we manage personal information on maersat.com.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Legal</p>
        <h1>Privacy Policy</h1>
        <p>Effective April 10, 2026. This policy explains how Maersat Technologies Inc. manages personal information collected through {SITE.domain.replace("https://", "")}.</p>
        <p><b style={{ color: "#fcfaf3" }}>Purpose.</b> Maersat Technologies reviews PII received through the Site and explains how it is managed. The Site describes products and services but does not conduct purchases or sales.</p>
        <p><b style={{ color: "#fcfaf3" }}>Applicability.</b> The policy applies to PII Maersat manages from Site Users. Maersat does not currently have a subsidiary or corporate affiliate.</p>
        <p><b style={{ color: "#fcfaf3" }}>PII collected.</b> Limited to information visitors elect to provide when contacting Maersat (name, role, email, phone, country/state, and human-verification data).</p>
        <p><b style={{ color: "#fcfaf3" }}>Contact.</b> Questions about this policy: <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        <p>
          <a className="at-cta" href="/privacy-policy/">Privacy Policy</a>
          {" · "}
          <a className="at-cta" href="/terms-of-use/">Terms of Use</a>
        </p>
      </article>
      <Footer />
    </Shell>
  );
}
