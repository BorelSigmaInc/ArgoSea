import ContactForm from "./ContactForm";
import MarkWhite from "./MarkWhite";
import { SITE } from "../../lib/atalanta/content";

export default function ContactSection() {
  return (
    <section className="at-contact-section" id="contact">
      <div className="at-section-layout">
        <div className="at-sidebar" />
        <div className="at-main">
          <div className="at-contact-grid">
            <div className="at-contact-heading">
              <h2>
                <MarkWhite>Get in touch</MarkWhite>
                <br />
                We’d love to hear from you.
              </h2>
              <p className="at-contact-email">
                <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
            <div className="at-contact-form-wrap">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
