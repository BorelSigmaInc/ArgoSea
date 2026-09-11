"use client";

import { useState } from "react";

export default function ContactForm({ compact = false }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="at-success">
        <p><span className="at-mark">Inquiry received!</span></p>
        <p>We’ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      className={`at-form ${compact ? "compact" : "default"}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {compact ? (
        <>
          <label className="at-field">
            <input name="name" required placeholder="Full Name" autoComplete="name" aria-label="Full Name" />
          </label>
          <label className="at-field">
            <input name="email" type="email" required placeholder="Email Address" autoComplete="email" aria-label="Email Address" />
          </label>
          <label className="at-field">
            <input name="company" required placeholder="Company Name" autoComplete="organization" aria-label="Company Name" />
          </label>
          <label className="at-field">
            <textarea name="message" required placeholder="Enter message..." aria-label="Message" rows={4} />
          </label>
        </>
      ) : (
        <>
          <label className="at-field-default">
            <span className="at-label">Full Name</span>
            <input name="name" required placeholder=" " autoComplete="name" aria-label="Full Name" />
          </label>
          <label className="at-field-default">
            <span className="at-label">Email Address</span>
            <input name="email" type="email" required placeholder=" " autoComplete="email" aria-label="Email Address" />
          </label>
          <label className="at-field-default">
            <span className="at-label">Company Name</span>
            <input name="company" required placeholder=" " autoComplete="organization" aria-label="Company Name" />
          </label>
          <label className="at-field-default">
            <span className="at-label">Message</span>
            <textarea name="message" required placeholder=" " aria-label="Message" />
          </label>
        </>
      )}
      <button className="at-submit" type="submit">Submit</button>
    </form>
  );
}
