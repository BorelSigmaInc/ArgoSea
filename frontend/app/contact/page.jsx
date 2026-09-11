import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import ContactSection from "../../components/atalanta/ContactSection";

export const metadata = { title: "Contact Us | Atalanta" };

export default function ContactPage() {
  return (
    <Shell>
      <main>
        <ContactSection />
      </main>
      <Footer />
    </Shell>
  );
}
