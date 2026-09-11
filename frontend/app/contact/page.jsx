import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";

export const metadata = { title: "Contact Us | Atalanta" };

export default function ContactPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Get in touch</p>
        <h1>Get in touch.</h1>
        <p>We’d love to hear from you.</p>
      </article>
      <Footer />
    </Shell>
  );
}
