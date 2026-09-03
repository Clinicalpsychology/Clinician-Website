"use client";

import { FormEvent, useEffect, useState } from "react";

type Psychologist = {
  id: number;
  bio?: string;
  years_experience?: number;
  hourly_rate?: number;
  license_verified: boolean;
  accepting_new_clients: boolean;
  user: { first_name?: string; last_name?: string; profile_picture_url?: string };
  specializations: string[];
  languages: string[];
  clinic_locations: { city: string; state_province?: string; country: string }[];
  average_rating?: number;
  total_reviews: number;
};

type ApiPayload = {
  data: { psychologists: Psychologist[]; pagination: { total: number; page: number; limit: number; pages: number } };
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [online, setOnline] = useState(false);
  const [professionals, setProfessionals] = useState<Psychologist[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfessionals(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ page: "1", limit: "12" });
    if (search.trim()) query.set("search", search.trim());
    if (specialization) query.set("specialization", specialization);
    if (location.trim()) query.set("location", location.trim());
    if (online) query.set("delivery_method", "online");

    try {
      const response = await fetch(`${apiUrl}/psychologists?${query.toString()}`);
      if (!response.ok) throw new Error("The directory is temporarily unavailable.");
      const payload = (await response.json()) as ApiPayload;
      setProfessionals(payload.data.psychologists);
      setTotal(payload.data.pagination.total);
    } catch {
      setError("We could not reach the directory right now. Please try again shortly.");
      setProfessionals([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  // Load the initial directory state once; later searches are user-triggered.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void loadProfessionals(); }, []);

  return (
    <main className="directory-page">
      <nav className="site-nav directory-nav" aria-label="Main navigation">
        <a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a>
        <a className="provider-link" href="/account">My care space <span aria-hidden="true">↗</span></a>
      </nav>
      <section className="directory-intro">
        <p className="eyebrow">A considered match</p>
        <h1>Find someone<br /><em>who gets it.</em></h1>
        <p className="directory-copy">Browse licensed professionals by what you are working through, where you are, and how you would like to meet.</p>
      </section>
      <section className="directory-tools" aria-label="Directory filters">
        <form onSubmit={loadProfessionals} className="filter-form">
          <label><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Anxiety, grief, relationships..." /></label>
          <label><span>Focus</span><select value={specialization} onChange={(event) => setSpecialization(event.target.value)}><option value="">Any focus</option><option value="anxiety">Anxiety</option><option value="depression">Depression</option><option value="trauma">Trauma</option><option value="couples therapy">Couples therapy</option><option value="child psychology">Child psychology</option></select></label>
          <label><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or state" /></label>
          <label className="check-label"><input type="checkbox" checked={online} onChange={(event) => setOnline(event.target.checked)} /><span>Online sessions</span></label>
          <button className="search-button" type="submit">Find care <span aria-hidden="true">→</span></button>
        </form>
      </section>
      <section className="results-section" aria-live="polite">
        <div className="results-header"><p>{loading ? "Finding your matches..." : `${total} professional${total === 1 ? "" : "s"} available`}</p><span>Licensed &amp; reviewed</span></div>
        {loading && <div className="directory-state"><span className="loader" />Preparing thoughtful matches...</div>}
        {!loading && error && <div className="directory-state error-state"><strong>Something interrupted the search.</strong><span>{error}</span><button className="text-button" onClick={() => void loadProfessionals()}>Try again <span aria-hidden="true">↗</span></button></div>}
        {!loading && !error && professionals.length === 0 && <div className="directory-state"><strong>Your directory is ready for its first professionals.</strong><span>No approved profiles match this search yet. Try broadening your filters or check back soon.</span></div>}
        {!loading && !error && professionals.length > 0 && <div className="directory-results">{professionals.map((professional) => <article className="directory-card" key={professional.id}><div className="directory-avatar" style={professional.user.profile_picture_url ? { backgroundImage: `url(${professional.user.profile_picture_url})` } : undefined}><span>{professional.user.first_name?.[0] || "P"}</span>{professional.license_verified && <b>✓</b>}</div><div className="directory-card-content"><p className="specialty">{professional.specializations[0] || "General support"}</p><h2>{professional.user.first_name} {professional.user.last_name}</h2><p className="directory-meta">{professional.clinic_locations[0]?.city || "Online"} · {professional.languages[0] || "English"}</p><p className="directory-bio">{professional.bio || "A licensed professional creating space for thoughtful, practical progress."}</p><div className="directory-card-footer"><span>{professional.average_rating ? `★ ${professional.average_rating} (${professional.total_reviews})` : "New to Mendwell"}</span><a href={`/directory/${professional.id}`}>View profile <span aria-hidden="true">→</span></a></div></div></article>)}</div>}
      </section>
    </main>
  );
}