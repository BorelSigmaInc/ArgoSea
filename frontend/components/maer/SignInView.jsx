"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../../components/atalanta/Logo";
import MuxMedia from "../../components/atalanta/MuxMedia";
import { maerFetch, writeSession } from "../../lib/maer/session";

const LOGIN_PLAYBACK_ID = "MH4N028gpYMpL9wghh6o4qaOVoM8Z9XD936Ro00YGUkd8";

export default function SignInView() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function continueEmail(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await maerFetch("/maer/login/", { method: "POST", body: { email, password: "" } });
      setName(data.name || "");
      setStep("password");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitPassword(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await maerFetch("/maer/login/", { method: "POST", body: { email, password } });
      writeSession(data);
      const next = params.get("next") || data.user?.home || "/marine-maer/api-doc/";
      router.push(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="maer-login">
      <div className="maer-login-main">
        <div className="maer-login-left">
      <Link href="/" className="maer-login-bar">
        <Logo />
        Maersat
      </Link>
        <section className="maer-login-copy">
          <h1>Log in to Maersat</h1>
          {step === "email" ? (
            <form onSubmit={continueEmail}>
              <p>
                Use your Maersat ID to open Marine Maer — the catalog, estimator, and partner operations console.
              </p>
              <div className="maer-field">
                <label htmlFor="maer-id">Maersat ID</label>
                <input
                  id="maer-id"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
              {error && <p className="maer-error">{error}</p>}
              <button className="maer-btn" type="submit" disabled={busy}>
                {busy ? "Checking…" : "Continue"}
              </button>
              <p>
                Don’t have a Maersat ID?{" "}
                <Link href="/contact/">Create a Maersat ID</Link>
              </p>
              <p style={{ fontSize: 12, color: "#525252" }}>
                Demo: partner@maersat.com · user@maersat.com · ops@maersat.com
              </p>
            </form>
          ) : (
            <form onSubmit={submitPassword}>
              <p>
                Welcome{name ? `, ${name}` : ""}. Enter the password for <b>{email}</b>.
              </p>
              <div className="maer-field">
                <label htmlFor="maer-pw">Password</label>
                <input
                  id="maer-pw"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="maer-error">{error}</p>}
              <button className="maer-btn" type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Log in"}
              </button>
              <p>
                <button type="button" className="maer-btn ghost" onClick={() => setStep("email")}>
                  Back
                </button>
              </p>
            </form>
          )}
        </section>
      <footer className="maer-login-foot">
        <a href="https://www.maersat.com/privacy-policy/">Privacy</a>
        <a href="https://www.maersat.com/terms-of-use/">Terms</a>
        <a href="https://www.maersat.com/contact/">Need help?</a>
      </footer>
        </div>
        <aside className="maer-login-aside" aria-hidden="true">
          <MuxMedia className="maer-login-mux" playbackId={LOGIN_PLAYBACK_ID} />
        </aside>
      </div>
    </div>
  );
}
