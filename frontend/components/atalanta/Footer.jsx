import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer className="at-footer" id="contact">
      <div className="at-footer-grid">
        <div />
        <div>
          <h3>Get in touch</h3>
          <p className="at-fine">We’d love to hear from you.</p>
          <ContactForm />
          <p className="at-copyr">Copyright 2026 · Atalanta Technologies Inc. · local preview</p>
          <div className="at-socials">
            <a className="at-link" href="https://www.linkedin.com/company/atalanta-technologies/" target="_blank" rel="noreferrer">/ LinkedIn</a>
            <a className="at-link" href="https://x.com/AtalantaTech" target="_blank" rel="noreferrer">/ X</a>
            <a className="at-link" href="https://www.youtube.com/@AtalantaTech" target="_blank" rel="noreferrer">/ YouTube</a>
          </div>
        </div>
        <nav className="at-footer-nav" aria-label="Footer">
          <Link className="at-link" href="/argo">/ Argo</Link>
          <Link className="at-link" href="/articles">/ Learn</Link>
          <Link className="at-link" href="/careers">/ Careers</Link>
          <Link className="at-link" href="/contact">/ Contact Us</Link>
          <Link className="at-link" href="/privacy-policy">/ Privacy</Link>
          <Link className="at-link" href="/terms-of-use">/ Terms</Link>
          <Link className="at-link" href="/en/ais/home/centerx:13.2/centery:13.8/zoom:3">/ Live Map</Link>
        </nav>
      </div>
      <div className="at-wordmark">ATALANTA</div>
    </footer>
  );
}
