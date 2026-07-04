"use client";
import { useState } from "react";

const COUNTRIES = ["Ghana", "Nigeria", "Kenya", "South Africa", "Ethiopia", "Tanzania", "Uganda", "Rwanda", "Ivory Coast", "Senegal", "Cameroon", "Mali", "Burkina Faso", "Benin", "Togo", "Niger", "Egypt", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan", "Mozambique", "Zambia", "Zimbabwe", "Malawi", "Botswana", "Namibia", "Angola", "DRC", "Congo", "Gabon", "Sierra Leone", "Liberia", "Gambia", "USA", "Canada", "Brazil", "Mexico", "India", "Pakistan", "Bangladesh", "Sri Lanka", "Philippines", "Indonesia", "UAE", "Saudi Arabia", "Qatar", "UK", "Germany", "France", "Netherlands", "Australia", "Other"];

export default function DemoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [facility, setFacility] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [facilityType, setFacilityType] = useState("clinic");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !facility) { setError("Please fill in all required fields."); return; }
    setLoading(true);
    setError("");

    await fetch("https://ifryrtxioeyipjjroqsz.supabase.co/rest/v1/vcc_leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcnlydHhpb2V5aXBqanJvcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDI5MDQsImV4cCI6MjA5NzE3ODkwNH0.Z3V93CC6x51QjDifGdLXzG-WJEl1UCh9Ybw02b-X8dY",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcnlydHhpb2V5aXBqanJvcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDI5MDQsImV4cCI6MjA5NzE3ODkwNH0.Z3V93CC6x51QjDifGdLXzG-WJEl1UCh9Ybw02b-X8dY",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        name, email, phone, company: facility, country,
        product_interest: "healthpost",
        source: "demo-request",
        status: "new",
        notes: `Facility type: ${facilityType}. Requested demo via healthpost.africa/demo`,
      }),
    }).catch(() => {});

    setSent(true);
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/"><img src="/logo-dark.svg" alt="Healthpost" style={{ height: 40 }} /></a>
        <a href="/login" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14 }}>Log in</a>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        {sent ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a3556", marginBottom: 12 }}>Demo request received!</h2>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Thank you {name}. We will contact you within 24 hours to schedule your personalised Healthpost demo.
            </p>
            <a href="/" style={{ background: "#1a3556", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>Back to home</a>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, padding: 48, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <img src="/logo-icon.svg" alt="Healthpost" style={{ width: 64, height: 64, marginBottom: 16 }} />
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a3556", marginBottom: 8 }}>Request a Demo</h1>
              <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
                See Healthpost in action. We will walk you through the platform and answer all your questions.
              </p>
            </div>

            {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                { label: "Your name *", value: name, set: setName, placeholder: "Dr. Ama Mensah" },
                { label: "Email *", value: email, set: setEmail, placeholder: "ama@hospital.com", type: "email" },
                { label: "Phone", value: phone, set: setPhone, placeholder: "+233 20 000 0000" },
                { label: "Facility name *", value: facility, set: setFacility, placeholder: "Accra General Hospital" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type || "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Facility type</label>
                <select value={facilityType} onChange={e => setFacilityType(e.target.value)} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}>
                  <option value="clinic">Clinic / Polyclinic</option>
                  <option value="hospital">Hospital</option>
                  <option value="dispensary">Dispensary / Health Centre</option>
                  <option value="maternity">Maternity Home</option>
                  <option value="specialist">Specialist Centre</option>
                  <option value="government">Government / CHPS</option>
                  <option value="ngo">NGO / Mission Hospital</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#1a3556", color: "#fff", padding: "14px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", marginTop: 8 }}>
              {loading ? "Submitting..." : "Request demo →"}
            </button>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#94a3b8" }}>No credit card required · We respond within 24 hours</p>
          </div>
        )}
      </div>
    </main>
  );
}
