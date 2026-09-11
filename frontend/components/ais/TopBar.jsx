"use client";

import Link from "next/link";
import { SearchIcon } from "./icons";
import Logo from "../atalanta/Logo";

export default function TopBar({ query, onQuery, onSearch }) {
  return (
    <header className="ais-topbar">
      <Link href="/en/ais/home/centerx:13.2/centery:13.8/zoom:3" className="ais-brand">
        <span className="ais-brand-logo"><Logo /></span>
        <span className="ais-brand-name">MarineMIS</span>
        <span className="ais-brand-sub">Live Map</span>
      </Link>

      <form
        className="ais-search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search vessels, ports, places"
          aria-label="Search vessels, ports, places"
        />
      </form>

      <nav className="ais-nav">
        <Link href="/en/ais/home/centerx:13.2/centery:13.8/zoom:3" className="active">
          Map
        </Link>
        <Link href="/quantum">Services</Link>
        <a href="#filters">Data</a>
        <a href="#layers">Intelligence</a>
        <Link href="/quantum">QPU</Link>
      </nav>

      <div className="ais-top-actions">
        <button type="button" className="ais-ghost">Help</button>
        <button type="button" className="ais-login">Log in</button>
      </div>
    </header>
  );
}
