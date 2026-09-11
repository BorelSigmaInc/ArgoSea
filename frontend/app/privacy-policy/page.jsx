import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";

export const metadata = { title: "Privacy Policy | Atalanta" };

export default function PrivacyPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Privacy</p>
        <h1>Privacy Policy</h1>
        <p>Effective April 10, 2026. This local preview restates the public policy structure from atalanta.tech.</p>
        <p><b style={{ color: "#fcfaf3" }}>Purpose.</b> Atalanta Technologies reviews PII received through the Site and explains how it is managed. The Site describes products and services but does not conduct purchases or sales.</p>
        <p><b style={{ color: "#fcfaf3" }}>Applicability.</b> The policy applies to PII Atalanta manages from Site Users. Atalanta does not currently have a subsidiary or corporate affiliate.</p>
        <p><b style={{ color: "#fcfaf3" }}>PII collected.</b> Limited to information visitors elect to provide when contacting Atalanta (name, role, email, phone, country/state, and human-verification data).</p>
        <p><b style={{ color: "#fcfaf3" }}>Purposes.</b> Responding to employment interest, operating the business, and — only with consent — a contemplated M&A diligence review.</p>
        <p><b style={{ color: "#fcfaf3" }}>Sharing.</b> Service providers who host or secure the Site, and diligence parties only after written consent that can be withdrawn.</p>
        <p>
          <a className="at-cta" href="https://www.atalanta.tech/privacy-policy/" target="_blank" rel="noreferrer">
            Full privacy policy on atalanta.tech
          </a>
        </p>
      </article>
      <Footer />
    </Shell>
  );
}
