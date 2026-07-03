export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <nav style={{ background: "#1a3556", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/"><img src="/logo-dark.svg" alt="Healthpost" style={{ height: 40 }} /></a>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/signup" style={{ color: "#4fc3f7", textDecoration: "none", fontWeight: 600 }}>Sign up</a>
          <a href="/login" style={{ color: "#fff", textDecoration: "none" }}>Log in</a>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #1a3556 0%, #2d5f8a 100%)", padding: "80px 40px", textAlign: "center", color: "#fff" }}>
        <div style={{ display: "inline-block", background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24, color: "#4fc3f7" }}>
          Hospital Operating System · Clinical Intelligence
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
          Run your clinic or hospital —<br />
          <em style={{ color: "#4fc3f7", fontStyle: "normal" }}>with intelligent clinical support.</em>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 600, margin: "0 auto 32px" }}>
          Healthpost is the hospital operating system for medical professionals — combining patient records, AI clinical support, OPD, admissions, pharmacy, and billing in one place.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/pricing" style={{ color: "#4fc3f7", textDecoration: "none", marginRight: 16, fontSize: 14, fontWeight: 600 }}>Pricing</a>
          <a href="/pricing" style={{ color: "#4fc3f7", textDecoration: "none", marginRight: 16, fontSize: 14, fontWeight: 600 }}>Pricing</a>
          <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>Start free trial →</a>
          <a href="mailto:hi@healthpost.africa" style={{ border: "2px solid rgba(255,255,255,0.4)", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>📅 Book a demo</a>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>No credit card required · First 3 months free · Cancel anytime</p>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, color: "#1a3556", marginBottom: 40 }}>Everything your hospital needs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { icon: "🏥", title: "OPD Management", desc: "Queue management, triage, and consultation flow for outpatient departments", soon: false },
            { icon: "🛏️", title: "Admissions", desc: "Bed management, ward allocation, and patient discharge management", soon: false },
            { icon: "💊", title: "In-house Pharmacy", desc: "Stock management, dispensing, prescriptions, and expiry alerts", soon: false },
            { icon: "🧠", title: "Clinical AI", desc: "AI-powered differential diagnoses, drug guidance, and SOAP notes", soon: false },
            { icon: "👤", title: "Patient Records", desc: "Complete medical history, lab results, and consultation logs", soon: false },
            { icon: "📅", title: "Appointments", desc: "Scheduling, WhatsApp reminders, and calendar management", soon: false },
            { icon: "💰", title: "Billing & Invoicing", desc: "Invoices, payments, insurance tracking, and financial reports", soon: false },
            { icon: "🔬", title: "Lab Results", desc: "Upload and AI interpretation of laboratory test results", soon: false },
            { icon: "📊", title: "Analytics", desc: "Patient flow, revenue, department performance, and clinical trends", soon: false },
          ].map((m) => (
            <div key={m.title} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3556", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#1a3556", padding: "60px 40px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>Ready to run a smarter hospital?</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, fontSize: 16 }}>Designed for medical professionals across Africa and beyond.</p>
        <a href="/pricing" style={{ color: "#4fc3f7", textDecoration: "none", marginRight: 16, fontSize: 14, fontWeight: 600 }}>Pricing</a>
          <a href="/pricing" style={{ color: "#4fc3f7", textDecoration: "none", marginRight: 16, fontSize: 14, fontWeight: 600 }}>Pricing</a>
          <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "16px 40px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 18 }}>Start free trial →</a>
        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>First 10 clinics get 3 months completely free</p>
      </section>

      <footer style={{ background: "#0f1f33", padding: "24px 40px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        © {new Date().getFullYear()} Healthpost — Hospital Operating System for Africa and beyond · healthpost.africa
      </footer>
    </main>
  );
}
