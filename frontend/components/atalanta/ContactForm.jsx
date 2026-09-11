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
      <input name="name" required placeholder="Full Name" autoComplete="name" aria-label="Full Name" />
      <input name="email" type="email" required placeholder="Email Address" autoComplete="email" aria-label="Email Address" />
      <input name="company" required placeholder="Company Name" autoComplete="organization" aria-label="Company Name" />
      <textarea name="message" required placeholder="Enter message..." aria-label="Message" />
      <button className="at-submit" type="submit">Submit</button>
    </form>
  );
}
