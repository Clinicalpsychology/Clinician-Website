"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const dates = ["Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18"];
const times = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"];

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState("Initial consultation");
  const [format, setFormat] = useState("Video session");
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(times[1]);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) return <main className="directory-page booking-page"><nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a></nav><section className="booking-confirmation"><span className="success-mark">✓</span><p className="eyebrow">Your next step is held</p><h1>You&apos;re booked<br /><em>with Dr. Leila.</em></h1><p>Your fictional appointment is set for {date}, {time}, as a {format.toLowerCase()}. We&apos;ll send a gentle reminder before you meet.</p><a className="dark-button" href="/account">Go to my care space <span aria-hidden="true">→</span></a></section></main>;
  return <main className="directory-page booking-page"><nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a><a className="provider-link" href={`/directory/${id}`}>← Profile</a></nav><section className="booking-layout"><div className="booking-heading"><p className="eyebrow">A simple beginning</p><h1>Make room<br /><em>for yourself.</em></h1><p>Choose a time that feels possible. You can always change it later.</p></div><form className="booking-form" onSubmit={(event) => { event.preventDefault(); setConfirmed(true); }}><div className="booking-professional"><div className="mini-portrait">L</div><div><strong>Dr. Leila Morgan</strong><span>Anxiety &amp; stress · Brooklyn, NY</span></div><b>✓</b></div><label>What would you like to book?<select value={service} onChange={(event) => setService(event.target.value)}><option>Initial consultation</option><option>Individual therapy</option><option>Stress support session</option></select></label><fieldset><legend>How would you like to meet?</legend><div className="choice-grid">{["Video session", "In-person"].map((item) => <button type="button" key={item} className={format === item ? "selected" : ""} onClick={() => setFormat(item)}>{item}<small>{item === "Video session" ? "From wherever you are" : "Brooklyn studio"}</small></button>)}</div></fieldset><fieldset><legend>Choose a day</legend><div className="date-grid">{dates.map((item) => <button type="button" key={item} className={date === item ? "selected" : ""} onClick={() => setDate(item)}>{item}</button>)}</div></fieldset><fieldset><legend>Choose a time</legend><div className="time-grid">{times.map((item) => <button type="button" key={item} className={time === item ? "selected" : ""} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset><button className="dark-button booking-submit" type="submit">Review and hold appointment <span aria-hidden="true">→</span></button><p className="form-note">No payment is required for this fictional demo.</p></form></section></main>;
}
