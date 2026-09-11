import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import { SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Terms of Use",
  description: "Maersat terms of use for maersat.com.",
  alternates: { canonical: "/terms-of-use/" },
};

export default function TermsPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Legal</p>
        <h1>Terms of Use</h1>
        <p>These Terms govern access to and use of {SITE.domain.replace("https://", "")} operated by {SITE.legalName}.</p>
        <p><b style={{ color: "#fcfaf3" }}>License.</b> Maersat grants a limited, personal, non-transferable license for compliant use. Prohibited use terminates the grant.</p>
        <p><b style={{ color: "#fcfaf3" }}>Contact.</b> <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        <p>
          <a className="at-cta" href="/terms-of-use/">Terms of Use</a>
          {" · "}
          <a className="at-cta" href="/privacy-policy/">Privacy Policy</a>
        </p>
      </article>
      <Footer />
    </Shell>
  );
}
