import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";

export const metadata = { title: "Terms of Use | Atalanta" };

export default function TermsPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Terms</p>
        <h1>Terms of Use</h1>
        <p>Each time you use this Site you agree to the Site Terms then in effect. You must be at least 18 (or the age of majority where you live).</p>
        <p><b style={{ color: "#fcfaf3" }}>License.</b> Atalanta grants a limited, personal, non-transferable license for compliant use. Prohibited use terminates the grant.</p>
        <p><b style={{ color: "#fcfaf3" }}>Prohibited uses include</b> malware or DDoS, disrupting the Site, sharing access, undermining the Privacy Policy or security, violating export/sanctions law, and uploading Site content into an AI model.</p>
        <p>Information you send via the Site is treated as non-confidential except as described in the Privacy Policy.</p>
        <p>
          <a className="at-cta" href="https://www.atalanta.tech/terms-of-use/" target="_blank" rel="noreferrer">
            Full terms on atalanta.tech
          </a>
        </p>
      </article>
      <Footer />
    </Shell>
  );
}
