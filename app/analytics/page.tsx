"use client";
import { getHpUserRole, hasHpAccess } from "@/lib/roleCheck";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalOPD: 0,
    totalAdmitted: 0,
    totalDischarged: 0,
    totalRevenue: 0,
    outstandingRevenue: 0,
    totalInvoices: 0,
    drugsLowStock: 0,
    opdToday: 0,
    admissionsToday: 0,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const role = await getHpUserRole();
      if (!hasHpAccess("analytics", role)) { router.push("/dashboard"); return; }
      loadStats();
    });
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const today = new Date().toDateString();

    const [
      { count: patients },
      { data: opd },
      { data: admissions },
      { data: invoices },
      { data: stock },
    ] = await Promise.all([
      supabase.from("hp_patients").select("*", { count: "exact", head: true }),
      supabase.from("opd_queue").select("status, created_at"),
      supabase.from("admissions").select("status, admitted_at"),
      supabase.from("hp_invoices").select("total, status"),
      supabase.from("pharmacy_stock").select("quantity, reorder_level"),
    ]);

    const totalRevenue = invoices?.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0) ?? 0;
    const outstandingRevenue = invoices?.filter(i => i.status === "unpaid").reduce((s, i) => s + i.total, 0) ?? 0;
    const drugsLowStock = stock?.filter(d => d.quantity <= d.reorder_level).length ?? 0;
    const opdToday = opd?.filter(o => new Date(o.created_at).toDateString() === today).length ?? 0;
    const admissionsToday = admissions?.filter(a => new Date(a.admitted_at).toDateString() === today).length ?? 0;

    setStats({
      totalPatients: patients ?? 0,
      totalOPD: opd?.length ?? 0,
      totalAdmitted: admissions?.filter(a => a.status === "admitted").length ?? 0,
      totalDischarged: admissions?.filter(a => a.status === "discharged").length ?? 0,
      totalRevenue,
      outstandingRevenue,
      totalInvoices: invoices?.length ?? 0,
      drugsLowStock,
      opdToday,
      admissionsToday,
    });
    setLoading(false);
  };

  const cards = [
    { icon: "👤", label: "Total Patients", value: stats.totalPatients, color: "#1a3556", bg: "#dbeafe" },
    { icon: "🏥", label: "OPD Visits Today", value: stats.opdToday, color: "#7c3aed", bg: "#f3e8ff" },
    { icon: "🛏️", label: "Currently Admitted", value: stats.totalAdmitted, color: "#0369a1", bg: "#e0f2fe" },
    { icon: "✅", label: "Discharged", value: stats.totalDischarged, color: "#16a34a", bg: "#f0fdf4" },
    { icon: "💰", label: "Revenue Collected", value: `$${stats.totalRevenue.toFixed(2)}`, color: "#16a34a", bg: "#f0fdf4" },
    { icon: "⏳", label: "Outstanding", value: `$${stats.outstandingRevenue.toFixed(2)}`, color: "#d97706", bg: "#fffbeb" },
    { icon: "🧾", label: "Total Invoices", value: stats.totalInvoices, color: "#1a3556", bg: "#dbeafe" },
    { icon: "⚠️", label: "Low Stock Drugs", value: stats.drugsLowStock, color: "#dc2626", bg: "#fef2f2" },
    { icon: "🏥", label: "Total OPD Visits", value: stats.totalOPD, color: "#1a3556", bg: "#f8fafc" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📊 Analytics</span>
        </div>
        <button onClick={loadStats} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          ↻ Refresh
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ color: "#1a3556", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Hospital Performance Overview</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Real-time data from all modules</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Loading analytics...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {cards.map(c => (
              <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: "20px 24px", border: `1px solid ${c.color}22` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ color: "#1a3556", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "Register OPD patient", href: "/opd", icon: "🏥" },
              { label: "Admit patient", href: "/admissions", icon: "🛏️" },
              { label: "Dispense drug", href: "/pharmacy", icon: "💊" },
              { label: "Add patient", href: "/patients", icon: "👤" },
              { label: "New invoice", href: "/billing", icon: "💰" },
              { label: "Clinical AI", href: "/clinical", icon: "🧠" },
            ].map(a => (
              <a key={a.label} href={a.href} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0", textDecoration: "none", display: "block", textAlign: "center" as const }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
                <div style={{ fontSize: 13, color: "#1a3556", fontWeight: 600 }}>{a.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
