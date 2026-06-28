"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [facility, setFacility] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUser(user);
      supabase.from("facilities").select("*").eq("user_id", user.id).single().then(({ data }) => {
        if (data) setFacility(data);
      });
    });
  }, []);

  const modules = [
    { icon: "🏥", title: "OPD", desc: "Outpatient queue & triage", href: "/opd", color: "#dbeafe" },
    { icon: "🛏️", title: "Admissions", desc: "Beds & ward management", href: "/admissions", color: "#dcfce7" },
    { icon: "💊", title: "Pharmacy", desc: "Stock & dispensing", href: "/pharmacy", color: "#fef9c3" },
    { icon: "🧠", title: "Clinical AI", desc: "AI diagnosis support", href: "/clinical", color: "#f3e8ff" },
    { icon: "👤", title: "Patients", desc: "Medical records", href: "/patients", color: "#ffedd5" },
    { icon: "📅", title: "Appointments", desc: "Scheduling", href: "/appointments", color: "#e0f2fe" },
    { icon: "💰", title: "Billing", desc: "Invoices & payments", href: "/billing", color: "#fce7f3" },
    { icon: "🔬", title: "Lab", desc: "Test results", href: "/lab", color: "#f0fdf4" },
    { icon: "📊", title: "Analytics", desc: "Performance reports", href: "/analytics", color: "#faf5ff" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#1a3556", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏥</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Healthpost</div>
            <div style={{ color: "#4fc3f7", fontSize: 12 }}>{facility?.name || "Your facility"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{user?.email}</span>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            Log out
          </button>
        </div>
      </header>

      {/* Welcome */}
      <div style={{ padding: "32px 32px 0", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ color: "#1a3556", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
          Good morning 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>
          {facility?.name || "Your facility"} · {facility?.type || ""} · {facility?.country || ""}
        </p>

        {/* Modules grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {modules.map(m => (
            <a key={m.title} href={m.href} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", textDecoration: "none", display: "block", transition: "transform 0.15s" }}
              onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3556", marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{m.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
