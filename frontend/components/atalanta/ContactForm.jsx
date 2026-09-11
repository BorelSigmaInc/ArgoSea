"use client";

import { useState } from "react";

export default function ContactForm({ compact = false }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="at-success">
        <p>Inquiry received!</p>
        <p>We’ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      className="at-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input name="name" required placeholder="Full Name" autoComplete="name" />
      <input name="email" type="email" required placeholder="Email Address" autoComplete="email" />
      <input name="company" placeholder="Company Name" autoComplete="organization" />
      <textarea name="message" required placeholder="Message" />
      <button className="at-submit" type="submit">{compact ? "Submit" : "Submit"}</button>
    </form>
  );
}
