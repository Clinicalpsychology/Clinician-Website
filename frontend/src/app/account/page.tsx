"use client";

import { FormEvent, useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"sign-in" | "create">("sign-in");
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <main className="account-page">
    <nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a><a className="provider-link" href="/directory">Find care <span aria-hidden="true">↗</span></a></nav>
    <section className="account-layout">
      <div className="account-welcome"><p className="eyebrow">A private place for your care</p><h1>Keep your<br /><em>next step</em><br />close.</h1><p>Save professionals you connect with, keep track of appointments, and return to your care journey whenever you need.</p></div>
      <div className="account-panel"><div className="account-tabs"><button className={mode === "sign-in" ? "active" : ""} onClick={() => { setMode("sign-in"); setSubmitted(false); }}>Sign in</button><button className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setSubmitted(false); }}>Create account</button></div>{submitted ? <div className="account-success"><span className="success-mark">✓</span><h2>{mode === "sign-in" ? "Welcome back." : "Your account is ready."}</h2><p>This is a demo account flow. Your saved practitioners and appointments will appear here.</p><a className="dark-button" href="/directory">Explore the directory <span aria-hidden="true">→</span></a></div> : <form className="account-form" onSubmit={submit}><label>Email address<input required type="email" placeholder="you@example.com" /></label><label>Password<input required minLength={8} type="password" placeholder="At least 8 characters" /></label>{mode === "create" && <label>Your name<input required type="text" placeholder="How should we greet you?" /></label>}<button className="dark-button" type="submit">{mode === "sign-in" ? "Sign in" : "Create account"}<span aria-hidden="true">→</span></button><p className="form-note">By continuing, you agree to our privacy policy and terms of use.</p></form>}</div>
    </section>
    <section className="account-preview"><div><p className="eyebrow">Your care space</p><h2>Designed for the<br /><em>whole journey.</em></h2></div><div className="preview-items"><div><span>01</span><strong>Saved professionals</strong><p>Keep a shortlist of people whose approach feels right.</p></div><div><span>02</span><strong>Appointments</strong><p>See upcoming sessions and revisit what you have booked.</p></div></div></section>
  </main>;
}
