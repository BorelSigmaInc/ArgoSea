import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer className="at-footer" id="contact">
      <div className="at-footer-grid">
        <div />
        <div>
          <h3>
            <span className="at-mark">Get in touch</span>
            <br />
            We’d love to hear from you.
          </h3>
          <ContactForm />
          <p className="at-copyr">
            COPYRIGHT 2026
            <br />
            ATALANTA TECHNOLOGIES INC.
          </p>
          <div className="at-socials">
            <a className="at-link" href="https://www.linkedin.com/company/atalanta-technologies/" target="_blank" rel="noreferrer">
              <span className="at-icon" aria-hidden="true">/</span> LinkedIn
            </a>
            <a className="at-link" href="https://x.com/AtalantaTech" target="_blank" rel="noreferrer">
              <span className="at-icon" aria-hidden="true">/</span> X
            </a>
            <a className="at-link" href="https://www.youtube.com/@AtalantaTech" target="_blank" rel="noreferrer">
              <span className="at-icon" aria-hidden="true">/</span> YouTube
            </a>
          </div>
        </div>
        <nav className="at-footer-nav" aria-label="Footer">
          <Link className="at-link" href="/argo"><span className="at-icon" aria-hidden="true">/</span> Argo</Link>
          <Link className="at-link" href="/articles"><span className="at-icon" aria-hidden="true">/</span> Learn</Link>
          <Link className="at-link" href="/careers"><span className="at-icon" aria-hidden="true">/</span> Careers</Link>
          <Link className="at-link" href="/contact"><span className="at-icon" aria-hidden="true">/</span> Contact Us</Link>
          <Link className="at-link" href="/privacy-policy"><span className="at-icon" aria-hidden="true">/</span> Privacy</Link>
          <Link className="at-link" href="/terms-of-use"><span className="at-icon" aria-hidden="true">/</span> Terms</Link>
        </nav>
      </div>
      <div className="at-wordmark" aria-hidden="true">ATALANTA</div>
    </footer>
  );
}
