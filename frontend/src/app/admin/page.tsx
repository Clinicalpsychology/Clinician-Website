"use client";

import { useState } from "react";

const initialApplications = [
  { id: 1, name: "Dr. Nina Patel", focus: "Anxiety & stress", location: "Seattle, WA", submitted: "Today", status: "Pending review" },
  { id: 2, name: "Dr. Elias Reed", focus: "Trauma & recovery", location: "Portland, OR", submitted: "Yesterday", status: "Pending review" },
  { id: 3, name: "Dr. Sofia Alvarez", focus: "Relationships", location: "Miami, FL", submitted: "Aug 28", status: "Documents requested" },
];

export default function AdminPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [selected, setSelected] = useState(1);
  const application = applications.find((item) => item.id === selected) || applications[0];
  const updateStatus = (status: string) => setApplications((items) => items.map((item) => item.id === selected ? { ...item, status } : item));

  return <main className="admin-page"><nav className="site-nav admin-nav"><a className="brand" href="/"><span className="brand-mark">+</span> mendwell</a><span className="admin-label">Operations / Review desk</span><a className="provider-link" href="/">Exit <span aria-hidden="true">↗</span></a></nav><section className="admin-shell"><header className="admin-heading"><div><p className="eyebrow">Tuesday, September 3</p><h1>Good morning,<br /><em>Alex.</em></h1></div><p className="admin-note">A quiet overview of the work<br />that needs your attention.</p></header><div className="metric-row"><div><span>Published professionals</span><strong>248</strong><small>↑ 12 this month</small></div><div><span>Awaiting review</span><strong>{applications.filter((item) => item.status === "Pending review").length}</strong><small>Needs your attention</small></div><div><span>Active members</span><strong>12,804</strong><small>↑ 8.4% this month</small></div><div><span>Profile reports</span><strong>04</strong><small>Review within 48 hours</small></div></div><section className="review-desk"><div className="application-list"><div className="desk-title"><h2>Applications</h2><span>{applications.length} open items</span></div>{applications.map((item) => <button className={selected === item.id ? "application-item selected" : "application-item"} key={item.id} onClick={() => setSelected(item.id)}><span className="item-avatar">{item.name.split(" ")[1]?.[0] || "P"}</span><span><strong>{item.name}</strong><small>{item.focus} · {item.location}</small></span><b>{item.status === "Pending review" ? "New" : ""}</b></button>)}</div><div className="application-detail"><div className="detail-top"><span className="status-pill">{application.status}</span><span>Submitted {application.submitted}</span></div><p className="eyebrow">Application {String(application.id).padStart(2, "0")}</p><h2>{application.name}</h2><p className="detail-focus">{application.focus} · {application.location}</p><div className="detail-checks"><div><span>Identity</span><strong>Ready to review</strong><b>✓</b></div><div><span>License document</span><strong>PSY-2026-0{application.id}48.pdf</strong><b>↗</b></div><div><span>Profile information</span><strong>Complete</strong><b>✓</b></div></div><div className="detail-actions"><button className="approve-button" onClick={() => updateStatus("Approved")}>Approve profile <span aria-hidden="true">→</span></button><button className="request-button" onClick={() => updateStatus("Documents requested")}>Request documents</button></div></div></section></section></main>;
}
