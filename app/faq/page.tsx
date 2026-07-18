"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is Healthpost?",
    a: "Healthpost is a hospital operating system for medical professionals across Africa — combining OPD queue management with intelligent triage, AI-powered clinical decision support, admissions, patient records, pharmacy, lab, billing, and appointments in one platform.",
  },
  {
    q: "Is the free trial really free?",
    a: "Yes. New facilities get a free trial period, no credit card required. You can cancel anytime with no obligation.",
  },
  {
    q: "How accurate is the AI clinical support?",
    a: "Healthpost's clinical decision support is grounded in trusted medical references. That said, Healthpost is a decision-support tool, not a replacement for professional medical judgment — the attending clinician is always responsible for the final diagnosis and treatment decision.",
  },
  {
    q: "Is patient data secure?",
    a: "Yes. Data is encrypted in transit and at rest, access is scoped per user and facility, and only authorized staff can see patient records. We do not sell or share your data with third parties.",
  },
  {
    q: "How does OPD triage work?",
    a: "Patients are queued and automatically prioritized by urgency based on presenting symptoms, so your clinical team can attend to the most critical cases first.",
  },
  {
    q: "How do I add staff to my facility?",
    a: "Go to the Team page inside the app, enter your colleague's email and role, and send an invite. They'll be added as soon as they accept.",
  },
  {
    q: "Can I use Healthpost on my phone?",
    a: "Yes — Healthpost works in any modern mobile browser, no app install required.",
  },
  {
    q: "How do I cancel or change my plan?",
    a: "Go to Billing inside the app to upgrade, downgrade, or cancel at any time. If you need help, contact us and we'll take care of it.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
      `}</style>
      <div style={{ minHeight: "100vh", padding: "60px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <a href="/" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 24, display: "inline-block" }}>← Back to Healthpost</a>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a3556", marginBottom: 8 }}>Frequently asked questions</h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            Can't find what you're looking for? <a href="/contact" style={{ color: "#1a3556" }}>Contact us</a> directly.
          </p>

          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: "#94a3b8", flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
