"use client";
import { getHpUserRole, hasHpAccess } from "@/lib/roleCheck";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Item = { name: string; quantity: number; price: number };
type Invoice = {
  id: string;
  patient_name: string;
  items: Item[];
  total: number;
  status: string;
  notes: string;
  created_at: string;
};

const SERVICES = [
  { name: "Consultation", price: 50 },
  { name: "OPD Visit", price: 30 },
  { name: "Admission (per day)", price: 100 },
  { name: "Surgery", price: 500 },
  { name: "Lab Test", price: 40 },
  { name: "X-Ray", price: 80 },
  { name: "Ultrasound", price: 120 },
  { name: "Blood Test", price: 35 },
  { name: "Nursing Care", price: 60 },
  { name: "Medication", price: 25 },
];

export default function BillingPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [patientName, setPatientName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ name: "", quantity: 1, price: 0 }]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      getHpUserRole().then(role => {
        if (!hasHpAccess("billing", role)) { router.push("/dashboard"); return; }
      });
      loadInvoices();
    });
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const { data } = await supabase.from("hp_invoices").select("*").order("created_at", { ascending: false });
    if (data) setInvoices(data);
    setLoading(false);
  };

  const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0 }]);
  const updateItem = (i: number, field: keyof Item, value: string | number) => {
    const updated = [...items];
    (updated[i] as any)[field] = value;
    setItems(updated);
  };
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  const createInvoice = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("hp_invoices").insert({
      user_id: user!.id,
      patient_name: patientName,
      items, total, notes, status: "unpaid",
    });
    setPatientName(""); setNotes(""); setItems([{ name: "", quantity: 1, price: 0 }]);
    setShowForm(false);
    setSaving(false);
    loadInvoices();
  };

  const markPaid = async (id: string) => {
    await supabase.from("hp_invoices").update({ status: "paid" }).eq("id", id);
    loadInvoices();
  };

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.filter(i => i.status === "unpaid").reduce((s, i) => s + i.total, 0);

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>💰 Billing & Invoicing</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + New Invoice
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total invoices", value: invoices.length, color: "#1a3556", bg: "#dbeafe", prefix: "" },
            { label: "Revenue collected", value: totalRevenue.toFixed(2), color: "#16a34a", bg: "#f0fdf4", prefix: "$" },
            { label: "Outstanding", value: outstanding.toFixed(2), color: "#d97706", bg: "#fffbeb", prefix: "$" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.prefix}{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "unpaid", "paid"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filter === f ? 700 : 400, background: filter === f ? "#1a3556" : "#e2e8f0", color: filter === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
              <div>No invoices yet</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Create first invoice</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(inv => (
                <div key={inv.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12, cursor: "pointer" }} onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3556" }}>{inv.patient_name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{new Date(inv.created_at).toLocaleDateString()} · {inv.items?.length || 0} item{inv.items?.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#1a3556" }}>${inv.total?.toFixed(2)}</div>
                      <span style={{ background: inv.status === "paid" ? "#f0fdf4" : "#fffbeb", color: inv.status === "paid" ? "#16a34a" : "#d97706", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const }}>
                        {inv.status}
                      </span>
                      {inv.status === "unpaid" && (
                        <button onClick={e => { e.stopPropagation(); markPaid(inv.id); }} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                          Mark Paid ✓
                        </button>
                      )}
                    </div>
                  </div>
                  {expanded === inv.id && inv.items && (
                    <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 20px", background: "#fafafa" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
                        <thead>
                          <tr>
                            {["Service", "Qty", "Price", "Total"].map(h => (
                              <th key={h} style={{ textAlign: "left" as const, padding: "6px 8px", color: "#64748b", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {inv.items.map((item, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "6px 8px" }}>{item.name}</td>
                              <td style={{ padding: "6px 8px" }}>{item.quantity}</td>
                              <td style={{ padding: "6px 8px" }}>${item.price}</td>
                              <td style={{ padding: "6px 8px", fontWeight: 600 }}>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {inv.notes && <div style={{ marginTop: 10, fontSize: 13, color: "#64748b" }}>📝 {inv.notes}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>New Invoice</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Patient name *</label>
              <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="John Mensah" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Services</label>
              {items.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, marginBottom: 8 }}>
                  <select value={item.name} onChange={e => { const svc = SERVICES.find(s => s.name === e.target.value); updateItem(i, "name", e.target.value); if (svc) updateItem(i, "price", svc.price); }} style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}>
                    <option value="">Select service</option>
                    {SERVICES.map(s => <option key={s.name}>{s.name}</option>)}
                  </select>
                  <input type="number" value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value))} placeholder="Qty" style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }} />
                  <input type="number" value={item.price} onChange={e => updateItem(i, "price", parseFloat(e.target.value))} placeholder="Price" style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }} />
                  <button onClick={() => removeItem(i)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 6, padding: "8px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
              ))}
              <button onClick={addItem} style={{ background: "#f1f5f9", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#1a3556", fontWeight: 600 }}>+ Add service</button>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#1a3556" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#1a3556" }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Insurance, payment method..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={createInvoice} disabled={!patientName || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Creating..." : "Create Invoice →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
