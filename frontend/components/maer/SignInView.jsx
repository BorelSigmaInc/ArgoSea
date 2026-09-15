"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../../components/atalanta/Logo";
import { maerFetch, writeSession } from "../../lib/maer/session";

const LOGIN_PLAYBACK_ID = "MH4N028gpYMpL9wghh6o4qaOVoM8Z9XD936Ro00YGUkd8";
const LOGIN_HLS = `https://stream.mux.com/${LOGIN_PLAYBACK_ID}.m3u8`;
const LOGIN_MP4 = `https://stream.mux.com/${LOGIN_PLAYBACK_ID}/highest.mp4`;

function LoginVideo() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return undefined;

    let hls;
    let started = false;

    const arm = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.playsInline = true;
      video.controls = false;
      video.removeAttribute("controls");
      video.removeAttribute("poster");
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("muted", "");
    };

    const play = () => {
      arm();
      const p = video.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    };

    const loadMp4 = () => {
      video.src = LOGIN_MP4;
      video.load();
      play();
    };

    const loadStream = () => {
      if (started) {
        play();
        return;
      }
      started = true;
      arm();
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          capLevelToPlayerSize: true,
          startLevel: -1,
        });
        hls.loadSource(LOGIN_HLS);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, play);
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal) return;
          hls.destroy();
          hls = undefined;
          loadMp4();
        });
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = LOGIN_HLS;
        play();
        return;
      }
      loadMp4();
    };

    arm();
    video.addEventListener("canplay", play);
    video.addEventListener("playing", arm);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadStream();
      },
      { rootMargin: "80px 0px", threshold: 0.05 },
    );
    io.observe(wrap);
    loadStream();

    const kick = () => play();
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("pageshow", kick);

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("playing", arm);
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pageshow", kick);
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className="maer-login-media">
      <video
        ref={videoRef}
        className="maer-login-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  );
}

export default function SignInView() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hasId = email.trim().length > 0;

  async function continueEmail(e) {
    e.preventDefault();
    if (!hasId) return;
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
          <Link href="/marine-maer/sign-in/" className="maer-login-bar">
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
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
                {error && <p className="maer-error">{error}</p>}
                {hasId && (
                  <button className="maer-btn" type="submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                )}
                <p>
                  Don’t have a Maersat ID?{" "}
                  <a href="https://www.maersat.com/contact/">Create a Maersat ID</a>
                </p>
                <p className="maer-login-demo">
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
                  {busy ? "Signing in…" : "Sign in"}
                </button>
                <p>
                  <button type="button" className="maer-btn ghost" onClick={() => setStep("email")}>
                    Back
                  </button>
                </p>
              </form>
            )}
          </section>
        </div>
        <aside className="maer-login-aside" aria-hidden="true">
          <LoginVideo />
        </aside>
        <footer className="maer-login-foot">
          <a href="https://www.maersat.com/privacy-policy/">Privacy</a>
          <a href="https://www.maersat.com/terms-of-use/">Terms</a>
          <a href="https://www.maersat.com/contact/">Need help?</a>
        </footer>
      </div>
    </div>
  );
}
