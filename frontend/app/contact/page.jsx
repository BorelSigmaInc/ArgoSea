import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import ContactSection from "../../components/atalanta/ContactSection";
import { SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Contact Us",
  description: `Contact Maersat at ${SITE.email} — we'd love to hear from you.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <Shell>
      <main>
        <ContactSection />
        <p className="at-inner" style={{ paddingTop: 0 }}>
          Prefer email?{" "}
          <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </main>
      <Footer />
    </Shell>
  );
}
