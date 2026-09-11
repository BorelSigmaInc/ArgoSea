import ContactForm from "./ContactForm";
import MarkWhite from "./MarkWhite";

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
