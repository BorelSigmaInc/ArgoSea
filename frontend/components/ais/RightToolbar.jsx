"use client";

import {
  SearchIcon,
  LayersIcon,
  FilterIcon,
  HeartIcon,
  PlayIcon,
  CloudIcon,
  GearIcon,
  PlusIcon,
  MinusIcon,
  RefreshIcon,
} from "./icons";

const TOOLS = [
  { id: "search", label: "Search", Icon: SearchIcon },
  { id: "layers", label: "Layers", Icon: LayersIcon },
  { id: "filters", label: "Vessel filters", Icon: FilterIcon },
  { id: "fleet", label: "My fleets", Icon: HeartIcon },
  { id: "playback", label: "Playback", Icon: PlayIcon },
  { id: "weather", label: "Weather", Icon: CloudIcon },
  { id: "settings", label: "Settings", Icon: GearIcon },
];

export default function RightToolbar({
  active,
  onToggle,
  vesselCount,
  countdown,
  onRefresh,
  onZoomIn,
  onZoomOut,
}) {
  return (
    <aside className="ais-toolbar" aria-label="Live map toolbar">
      {TOOLS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? "on" : ""}
          title={label}
          aria-label={label}
          onClick={() => onToggle(id)}
        >
          <Icon />
        </button>
      ))}

      <div className="ais-toolbar-gap" />

      <button type="button" title="Zoom in" aria-label="Zoom in" onClick={onZoomIn}>
        <PlusIcon />
      </button>
      <button type="button" title="Zoom out" aria-label="Zoom out" onClick={onZoomOut}>
        <MinusIcon />
      </button>

      <div className="ais-toolbar-stats" title="Vessels in coverage">
        {vesselCount.toLocaleString()}
      </div>
      <button
        type="button"
        className="ais-toolbar-refresh"
        title="Refresh live positions"
        onClick={onRefresh}
      >
        <RefreshIcon />
        <span>{countdown}s</span>
      </button>
    </aside>
  );
}
