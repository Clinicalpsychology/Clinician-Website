"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Profile = {
  id: number; bio?: string; years_experience?: number; hourly_rate?: number; license_verified: boolean; accepting_new_clients: boolean;
  user: { first_name?: string; last_name?: string; profile_picture_url?: string };
  specializations: string[]; languages: string[]; clinic_locations: { street_address?: string; city: string; state_province?: string; country: string }[];
  services: { service_name: string; service_description?: string; delivery_method: string; price?: number }[];
  education: { institution_name: string; degree: string; field_of_study?: string; graduation_year?: number }[];
  average_rating?: number; total_reviews: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${apiUrl}/psychologists/${id}`);
        if (!response.ok) throw new Error("Profile not found");
        const payload = await response.json() as { data: Profile };
        setProfile(payload.data);
      } catch { setError("We could not find that professional profile."); }
      finally { setLoading(false); }
    }
    if (id) void loadProfile();
  }, [id]);

  if (loading) return <main className="directory-page"><div className="directory-state profile-loading"><span className="loader" /><span>Opening profile...</span></div></main>;
  if (error || !profile) return <main className="directory-page"><nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a></nav><div className="directory-state profile-loading"><strong>{error}</strong><a className="text-button" href="/directory">Back to directory <span aria-hidden="true">↗</span></a></div></main>;

  const name = `${profile.user.first_name || "Licensed"} ${profile.user.last_name || "professional"}`;
  const location = profile.clinic_locations[0];
  return <main className="directory-page profile-page">
    <nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a><a className="provider-link" href="/account">My care space <span aria-hidden="true">↗</span></a></nav>
    <section className="profile-hero"><div className="profile-portrait" style={profile.user.profile_picture_url ? { backgroundImage: `url(${profile.user.profile_picture_url})` } : undefined}><span>{profile.user.first_name?.[0] || "P"}</span></div><div className="profile-intro"><p className="eyebrow">{profile.license_verified ? "Verified professional" : "Professional profile"}</p><h1>{name}</h1><p className="profile-role">{profile.specializations.join(" · ") || "Psychological support"}</p><p className="profile-location">⌖ {location ? `${location.city}${location.state_province ? `, ${location.state_province}` : ""}` : "Online sessions available"}</p><div className="profile-actions"><a className="dark-button" href={`/book/${profile.id}`}>Request a consultation <span aria-hidden="true">→</span></a><span className="availability">{profile.accepting_new_clients ? "● Accepting new clients" : "Currently at capacity"}</span></div></div></section>
    <section className="profile-layout"><div className="profile-main"><div className="profile-section"><p className="eyebrow">A little about their approach</p><p className="profile-bio">{profile.bio || "This professional creates a thoughtful, practical space for meaningful progress."}</p></div><div className="profile-section"><p className="eyebrow">Services offered</p><div className="service-list">{profile.services.length ? profile.services.map((service) => <div className="service-row" key={service.service_name}><div><h2>{service.service_name}</h2><p>{service.service_description || `${service.delivery_method.replace("_", " ")} sessions`}</p></div>{service.price && <strong>${service.price}</strong>}</div>) : <p className="profile-bio">Service details are available when you request a consultation.</p>}</div></div></div><aside className="profile-aside"><div className="profile-fact"><strong>{profile.years_experience || "—"}</strong><span>years experience</span></div><div className="profile-fact"><strong>{profile.average_rating ? `★ ${profile.average_rating}` : "New"}</strong><span>{profile.total_reviews ? `${profile.total_reviews} reviews` : "on Mendwell"}</span></div><div className="profile-aside-section"><p className="eyebrow">Languages</p><p>{profile.languages.join(" · ") || "English"}</p></div><div className="profile-aside-section"><p className="eyebrow">Education</p>{profile.education.map((item) => <p key={`${item.institution_name}-${item.degree}`}>{item.degree}{item.field_of_study ? `, ${item.field_of_study}` : ""}<br /><small>{item.institution_name}</small></p>)}</div></aside></section>
    <section className="profile-contact" id="contact"><p className="eyebrow">Take the next small step</p><h2>Start a conversation<br /><em>when you&apos;re ready.</em></h2><a className="dark-button" href="mailto:hello@mendwell.example">Request a consultation <span aria-hidden="true">→</span></a></section>
  </main>;
}