"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const psychologists = [
  { name: "Dr. Leila Morgan", specialty: "Anxiety & stress", location: "Brooklyn, NY", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85" },
  { name: "Dr. Samuel Okafor", specialty: "Trauma & recovery", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=85" },
  { name: "Dr. Maya Chen", specialty: "Couples therapy", location: "Austin, TX", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=85" },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    router.push(`/directory${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
  }

  const matches = search
    ? psychologists.filter((psychologist) => `${psychologist.name} ${psychologist.specialty} ${psychologist.location}`.toLowerCase().includes(search.toLowerCase()))
    : psychologists;

  return (
    <main>
      <section className="hero-shell">
        <nav className="site-nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Mendwell home"><span className="brand-mark">+</span> mendwell</a>
          <div className="nav-links"><a href="/directory">Find a psychologist</a><a href="#how-it-works">How it works</a><a href="#about">About us</a></div>
          <a className="provider-link" href="/account">My care space <span aria-hidden="true">↗</span></a>
        </nav>

        <div className="hero-content" id="top">
          <p className="eyebrow">Care that meets you where you are</p>
          <h1>Find your way<br /><em>back to well.</em></h1>
          <p className="hero-copy">Connect with licensed psychologists who understand your story and have the tools to help you write what comes next.</p>
          <form className="search-panel" onSubmit={handleSearch}>
            <label className="search-field"><span className="field-icon" aria-hidden="true">⌕</span><span><small>What would you like help with?</small><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try anxiety, relationships, grief..." /></span></label>
            <label className="search-field location-field"><span className="field-icon" aria-hidden="true">⌖</span><span><small>Where?</small><input placeholder="City or online" /></span></label>
            <button className="search-button" type="submit">Search <span aria-hidden="true">→</span></button>
          </form>
          {submitted && <p className="search-feedback" role="status">{matches.length ? `Showing ${matches.length} matching professionals below.` : "No exact matches yet. Try a broader search."}</p>}
          <div className="hero-note"><span className="avatar-stack" aria-hidden="true"><i /><i /><i /></span><span>Join 12,000+ people taking their next step</span></div>
          <div className="hero-tools"><a href="/professionals/apply">Professional registration <span aria-hidden="true">↗</span></a><a href="/admin">Admin dashboard <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-sun" /><div className="art-line line-one" /><div className="art-line line-two" /><div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" /><span className="art-caption">A gentler place to begin</span></div>
      </section>

      <section className="trust-strip" id="how-it-works"><div><strong>12k+</strong><span>people supported</span></div><div><strong>2,400</strong><span>licensed professionals</span></div><div><strong>4.9/5</strong><span>average experience</span></div><p>“The first step felt<br /><em>lighter</em> than I expected.”</p></section>

      <section className="directory-section" id="directory"><div className="section-heading"><div><p className="eyebrow">A considered match</p><h2>Professionals<br /><em>you can trust.</em></h2></div><a className="text-link" href="/directory">Explore the directory <span aria-hidden="true">↗</span></a></div><div className="profile-grid">{matches.map((psychologist) => <article className="profile-card" key={psychologist.name}><div className="profile-image" style={{ backgroundImage: `url(${psychologist.image})` }}><span className="verified">✓ Verified</span></div><div className="profile-body"><p className="specialty">{psychologist.specialty}</p><h3>{psychologist.name}</h3><p className="location">⌖ {psychologist.location} · Online available</p><a href="/directory">View profile <span aria-hidden="true">→</span></a></div></article>)}</div></section>

      <section className="closing-section" id="about"><p className="eyebrow">You don&apos;t have to figure it out alone</p><h2>There is room for<br /><em>how you feel.</em></h2><a className="dark-button" href="#directory">Find your match <span aria-hidden="true">→</span></a></section>
    </main>
  );
}
