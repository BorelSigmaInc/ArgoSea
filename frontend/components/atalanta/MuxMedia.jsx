"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function MuxMedia({ playbackId, className }) {
  const wrapRef = useRef(null);
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const hlsSrc = `https://stream.mux.com/${playbackId}.m3u8`;
  const mp4Src = `https://stream.mux.com/${playbackId}/highest.mp4`;
  const poster = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1920&fit_mode=preserve`;

  useEffect(() => {
    const video = ref.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    let hls;
    let destroyed = false;

    const markReady = () => {
      if (!destroyed) setReady(true);
    };

    const tryPlay = () => {
      video.muted = true;
      video.defaultMuted = true;
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(markReady).catch(() => {});
      }
    };

    const wireVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.controls = false;
      video.removeAttribute("controls");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.addEventListener("playing", markReady);
      video.addEventListener("canplay", tryPlay);
    };

    const loadMp4 = () => {
      video.src = mp4Src;
      video.load();
      tryPlay();
    };

    const loadStream = () => {
      // Prefer hls.js: Chrome's native HLS often fails on Mux CDN ("insecure media request").
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          capLevelToPlayerSize: true,
          startLevel: -1,
        });
        hls.loadSource(hlsSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal) return;
          hls.destroy();
          hls = undefined;
          loadMp4();
        });
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsSrc;
        tryPlay();
        return;
      }

      loadMp4();
    };

    wireVideo();

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          if (!video.src && !hls) loadStream();
          tryPlay();
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.05 },
    );
    io.observe(wrap);

    // Kick off immediately for above-the-fold heroes.
    loadStream();

    return () => {
      destroyed = true;
      io.disconnect();
      video.removeEventListener("playing", markReady);
      video.removeEventListener("canplay", tryPlay);
      if (hls) hls.destroy();
    };
  }, [hlsSrc, mp4Src]);

  return (
    <div
      ref={wrapRef}
      className={`${className} at-mux media-overlay ${ready ? "is-ready" : ""}`}
    >
      <img className="at-mux-poster" src={poster} alt="" decoding="async" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster={poster}
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      />
      <div className="at-mux-mask" aria-hidden="true" />
    </div>
  );
}
