"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function MuxMedia({ playbackId, className }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const src = `https://stream.mux.com/${playbackId}.m3u8`;
  const poster = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1920&fit_mode=preserve`;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.removeAttribute("controls");

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", tryPlay);
      return () => video.removeEventListener("loadedmetadata", tryPlay);
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: -1,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      return () => hls.destroy();
    }

    return undefined;
  }, [src]);

  return (
    <div className={`${className} at-mux media-overlay ${ready ? "is-ready" : ""}`}>
      <img className="at-mux-poster" src={poster} alt="" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        autoPlay
        poster={poster}
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        onCanPlay={(e) => {
          e.currentTarget.controls = false;
          setReady(true);
        }}
      />
      <div className="at-mux-mask" aria-hidden="true" />
    </div>
  );
}
