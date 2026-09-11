"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { TYPE_BY_ID } from "../../lib/aisConstants";

function drawTriangle(ctx, x, y, size, course, color, selected) {
  const rad = ((course || 0) * Math.PI) / 180;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rad);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, size * 0.75);
  ctx.lineTo(0, size * 0.35);
  ctx.lineTo(-size * 0.7, size * 0.75);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (selected) {
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  ctx.restore();
}

function drawCircle(ctx, x, y, size, color, selected) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  if (selected) {
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
}

function drawDiamond(ctx, x, y, size, color, selected) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.7, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (selected) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.restore();
}

export default function VesselCanvasLayer({
  vessels,
  selectedId,
  showNames,
  onSelect,
}) {
  const map = useMap();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.className = "ais-vessel-canvas";
    const pane = map.getPanes().overlayPane;
    pane.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const hit = (point) => {
      const zoom = map.getZoom();
      const threshold = zoom < 5 ? 7 : 10;
      let best = null;
      let bestD = threshold;
      for (const v of vessels) {
        const p = map.latLngToLayerPoint([v.lat, v.lon]);
        const d = Math.hypot(p.x - point.x, p.y - point.y);
        if (d < bestD) {
          bestD = d;
          best = v;
        }
      }
      return best;
    };

    const redraw = () => {
      const size = map.getSize();
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      canvas.width = size.x;
      canvas.height = size.y;
      canvas.style.width = `${size.x}px`;
      canvas.style.height = `${size.y}px`;
      L.DomUtil.setPosition(canvas, topLeft);

      ctx.clearRect(0, 0, size.x, size.y);
      const zoom = map.getZoom();
      const iconSize = zoom < 4 ? 5.4 : zoom < 6 ? 7 : zoom < 9 ? 9 : 12;
      const bounds = map.getBounds().pad(0.05);

      for (const v of vessels) {
        if (!bounds.contains([v.lat, v.lon])) continue;
        const p = map.latLngToLayerPoint([v.lat, v.lon]);
        const x = p.x - topLeft.x;
        const y = p.y - topLeft.y;
        const meta = TYPE_BY_ID[v.type] || TYPE_BY_ID.unspecified;
        const selected = v.id === selectedId;
        if (v.type === "aton") {
          drawDiamond(ctx, x, y, iconSize, meta.color, selected);
        } else if (v.stopped) {
          drawCircle(ctx, x, y, iconSize, meta.color, selected);
        } else {
          drawTriangle(ctx, x, y, iconSize, v.course_deg, meta.color, selected);
        }
        if (showNames && zoom >= 8) {
          ctx.fillStyle = "#1a1a1a";
          ctx.font = "11px system-ui, sans-serif";
          ctx.fillText(v.name, x + 8, y + 3);
        }
      }
    };

    const onClick = (e) => {
      const layerPoint = map.latLngToLayerPoint(e.latlng);
      const found = hit(layerPoint);
      onSelect(found || null);
    };

    map.on("move zoom viewreset resize", redraw);
    map.on("click", onClick);
    redraw();

    return () => {
      map.off("move zoom viewreset resize", redraw);
      map.off("click", onClick);
      canvas.remove();
    };
  }, [map, vessels, selectedId, showNames, onSelect]);

  return null;
}
