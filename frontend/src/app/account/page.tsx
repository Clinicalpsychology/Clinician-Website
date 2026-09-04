"use client";

import { FormEvent, useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"sign-in" | "create">("sign-in");
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <main className="account-page account-redesign">
    <nav className="site-nav directory-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a><a className="provider-link" href="/directory">Find care <span aria-hidden="true">↗</span></a></nav>
    <section className="account-stage">
      <div className="account-context"><p className="eyebrow">Your private care space</p><h1>A little room<br /><em>for you.</em></h1><p>Come back to the people, plans, and appointments that help you feel more like yourself.</p><div className="account-quote"><span aria-hidden="true">“</span><p>Care is not a single moment. It is the small decision to keep showing up.</p></div></div>
      <div className={`account-flip-card ${mode === "create" ? "is-signup" : ""}`}>
        <div className="account-form-face"><div className="account-card-top"><span className="form-kicker">Mendwell member</span><span className="card-index">01 / 02</span></div>{submitted ? <div className="account-success"><span className="success-mark">✓</span><p className="eyebrow">You&apos;re in</p><h2>{mode === "sign-in" ? "Welcome back." : "Your space is ready."}</h2><p>This demo account is ready to hold your saved professionals and appointments.</p><a className="dark-button" href="/directory">Explore care <span aria-hidden="true">→</span></a></div> : <><h2>{mode === "sign-in" ? "Welcome back." : "Start your account."}</h2><p className="form-intro">{mode === "sign-in" ? "Pick up where you left off." : "A gentler way to keep your care journey close."}</p><form className="account-form" onSubmit={submit}>{mode === "create" && <label>Your name<input required type="text" placeholder="How should we greet you?" /></label>}<label>Email address<input required type="email" placeholder="you@example.com" /></label><label>Password<input required minLength={8} type="password" placeholder="At least 8 characters" /></label>{mode === "sign-in" && <div className="account-options"><label className="remember-option"><input type="checkbox" /> <span>Keep me signed in</span></label><button type="button" className="forgot-button">Forgot password?</button></div>}{mode === "create" && <label className="remember-option"><input required type="checkbox" /> <span>I agree to the privacy policy and terms.</span></label>}<button className="dark-button account-submit" type="submit">{mode === "sign-in" ? "Sign in" : "Create account"}<span aria-hidden="true">→</span></button></form><div className="account-switch"><span>{mode === "sign-in" ? "New to Mendwell?" : "Already have an account?"}</span><button type="button" onClick={() => { setMode(mode === "sign-in" ? "create" : "sign-in"); setSubmitted(false); }}>{mode === "sign-in" ? "Create an account" : "Sign in"}</button></div></>}</div>
        <div className="account-side-face"><span className="side-symbol" aria-hidden="true">✦</span><p className="eyebrow">A place to begin</p><h2>{mode === "create" ? "Welcome to your care space." : "You do not have to carry it alone."}</h2><p>{mode === "create" ? "Save the people and practices that feel like a good fit." : "Keep the next right step close, even on the days it feels small."}</p><button type="button" className="outline-button" onClick={() => { setMode(mode === "sign-in" ? "create" : "sign-in"); setSubmitted(false); }}>{mode === "sign-in" ? "Create an account" : "Sign in"} <span aria-hidden="true">→</span></button></div>
      </div>
    </section>
    <footer className="account-footer"><span>Confidential by design</span><span>© Mendwell 2026</span><a href="/">Return to home <span aria-hidden="true">↗</span></a></footer>
  </main>;
}
