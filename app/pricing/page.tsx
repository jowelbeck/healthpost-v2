"use client";

export default function PricingPage() {
  const plans = [
    {
      name: "Clinic",
      price: "GHS 1,490",
      period: "per month",
      desc: "Perfect for small clinics and private practices",
      features: [
        "Up to 5 doctor accounts",
        "OPD queue management",
        "Patient records",
        "Clinical AI support",
        "Pharmacy management",
        "Billing & invoicing",
        "Email support",
      ],
      planCode: process.env.NEXT_PUBLIC_PAYSTACK_CLINIC_PLAN,
      link: "https://paystack.shop/pay/-igf3jxqbg",
      featured: false,
    },
    {
      name: "Hospital",
      price: "GHS 2,990",
      period: "per month",
      desc: "For hospitals and large multi-department facilities",
      features: [
        "Up to 20 doctor accounts",
        "OPD queue management",
        "Admissions & bed management",
        "Patient records",
        "Clinical AI support",
        "In-house pharmacy",
        "Lab results",
        "Billing & invoicing",
        "Analytics dashboard",
        "Priority support",
      ],
      planCode: process.env.NEXT_PUBLIC_PAYSTACK_HOSPITAL_PLAN,
      link: "https://paystack.shop/pay/ucet7qg3oh",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "GHS 5,990",
      period: "per month",
      desc: "For hospital chains and large healthcare networks",
      features: [
        "Unlimited accounts",
        "All Hospital features",
        "Multi-branch support",
        "Custom integrations",
        "Dedicated support",
        "Staff training",
        "SLA guarantee",
      ],
      planCode: process.env.NEXT_PUBLIC_PAYSTACK_ENTERPRISE_PLAN,
      link: "https://paystack.shop/pay/m9uqe4b0gb",
      featured: false,
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ color: "#fff", fontWeight: 700, fontSize: 20, textDecoration: "none" }}>🏥 Healthpost</a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/login" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14 }}>Log in</a>
          <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "7px 18px", borderRadius: 7, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>Sign up free</a>
        </div>
      </header>

      <div style={{ padding: "60px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ color: "#1a3556", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Simple, transparent pricing</h1>
          <p style={{ color: "#64748b", fontSize: 16 }}>Start free for 3 months. No credit card required. Cancel anytime.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: "#fff", borderRadius: 16, padding: 32, border: p.featured ? "2px solid #1a3556" : "1px solid #e2e8f0", boxShadow: p.featured ? "0 8px 32px rgba(26,53,86,0.12)" : "0 2px 8px rgba(0,0,0,0.05)", position: "relative" as const }}>
              {p.featured && (
                <div style={{ position: "absolute" as const, top: -14, left: "50%", transform: "translateX(-50%)", background: "#1a3556", color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4fc3f7", marginBottom: 6, textTransform: "uppercase" as const }}>{p.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#1a3556" }}>{p.price}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{p.period}</div>
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>{p.desc}</div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                {p.features.map(f => (
                  <li key={f} style={{ padding: "6px 0", fontSize: 14, color: "#334155", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center" as const, background: p.featured ? "#1a3556" : "#f0f7ff", color: p.featured ? "#fff" : "#1a3556", padding: "12px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                Start free trial →
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, padding: 24, background: "#f0f7ff", borderRadius: 12 }}>
          <p style={{ color: "#1a3556", fontSize: 15, fontWeight: 600, margin: 0 }}>
            🎁 First 10 hospitals get 3 months completely free · No credit card required
          </p>
        </div>
      </div>

      <footer style={{ background: "#1a3556", padding: "24px 32px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 60 }}>
        © 2026 Healthpost — Hospital Operating System for Africa and beyond · healthpost.africa
      </footer>
    </main>
  );
}
