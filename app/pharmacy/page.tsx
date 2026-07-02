"use client";
import { getHpUserRole, hasHpAccess } from "@/lib/roleCheck";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Drug = {
  id: string;
  drug_name: string;
  generic_name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  expiry_date: string;
  supplier: string;
  unit_price: number;
};

type Dispensing = {
  id: string;
  patient_name: string;
  drug_name: string;
  quantity: number;
  doctor: string;
  notes: string;
  dispensed_at: string;
};

const CATEGORIES = ["Antibiotics", "Analgesics", "Antimalarials", "Antihypertensives", "Antiretrovirals", "Vitamins", "IV Fluids", "Vaccines", "Other"];

export default function PharmacyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"stock"|"dispense"|"history">("stock");
  const [stock, setStock] = useState<Drug[]>([]);
  const [history, setHistory] = useState<Dispensing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [showDispense, setShowDispense] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add drug form
  const [drugName, setDrugName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  // Dispense form
  const [dispPatient, setDispPatient] = useState("");
  const [dispDrug, setDispDrug] = useState("");
  const [dispQty, setDispQty] = useState("");
  const [dispDoctor, setDispDoctor] = useState("");
  const [dispNotes, setDispNotes] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      getHpUserRole().then(role => {
        if (!hasHpAccess("pharmacy", role)) { router.push("/dashboard"); return; }
      });
      loadData();
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [{ data: s }, { data: h }] = await Promise.all([
      supabase.from("pharmacy_stock").select("*").order("drug_name"),
      supabase.from("pharmacy_dispensing").select("*").order("dispensed_at", { ascending: false }),
    ]);
    if (s) setStock(s);
    if (h) setHistory(h);
    setLoading(false);
  };

  const addDrug = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("pharmacy_stock").insert({
      user_id: user!.id,
      drug_name: drugName, generic_name: genericName, category,
      quantity: parseInt(quantity), unit, reorder_level: parseInt(reorderLevel),
      expiry_date: expiryDate, supplier, unit_price: parseFloat(unitPrice),
    });
    setDrugName(""); setGenericName(""); setCategory(""); setQuantity(""); setUnit(""); setReorderLevel("10"); setExpiryDate(""); setSupplier(""); setUnitPrice("");
    setShowAddDrug(false);
    setSaving(false);
    loadData();
  };

  const dispenseDrug = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    // Deduct from stock
    const drug = stock.find(d => d.drug_name === dispDrug);
    if (drug) {
      await supabase.from("pharmacy_stock").update({ quantity: drug.quantity - parseInt(dispQty) }).eq("id", drug.id);
    }
    await supabase.from("pharmacy_dispensing").insert({
      user_id: user!.id,
      patient_name: dispPatient, drug_name: dispDrug,
      quantity: parseInt(dispQty), doctor: dispDoctor, notes: dispNotes,
    });
    setDispPatient(""); setDispDrug(""); setDispQty(""); setDispDoctor(""); setDispNotes("");
    setShowDispense(false);
    setSaving(false);
    loadData();
  };

  const lowStock = stock.filter(d => d.quantity <= d.reorder_level);
  const expiringSoon = stock.filter(d => {
    if (!d.expiry_date) return false;
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>💊 Pharmacy</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowDispense(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Dispense</button>
          <button onClick={() => setShowAddDrug(true)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>+ Add Drug</button>
        </div>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Alerts */}
        {lowStock.length > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
            ⚠️ <strong>{lowStock.length} drug{lowStock.length > 1 ? "s" : ""} low on stock:</strong> {lowStock.map(d => d.drug_name).join(", ")}
          </div>
        )}
        {expiringSoon.length > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#d97706", fontSize: 14 }}>
            ⏰ <strong>{expiringSoon.length} drug{expiringSoon.length > 1 ? "s" : ""} expiring within 30 days:</strong> {expiringSoon.map(d => d.drug_name).join(", ")}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total drugs", value: stock.length, color: "#1a3556", bg: "#dbeafe" },
            { label: "Low stock", value: lowStock.length, color: "#dc2626", bg: "#fef2f2" },
            { label: "Dispensed today", value: history.filter(h => new Date(h.dispensed_at).toDateString() === new Date().toDateString()).length, color: "#16a34a", bg: "#f0fdf4" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["stock", "dispense", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: tab === t ? 700 : 400, background: tab === t ? "#1a3556" : "#e2e8f0", color: tab === t ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {t === "dispense" ? "Dispensing" : t === "history" ? "History" : "Stock"}
            </button>
          ))}
        </div>

        {/* Stock tab */}
        {tab === "stock" && (
          loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> :
          stock.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
              <div>No drugs in stock</div>
              <button onClick={() => setShowAddDrug(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Add first drug</button>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Drug Name", "Category", "Quantity", "Unit", "Expiry", "Price", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left" as const, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stock.map((d, i) => {
                    const isLow = d.quantity <= d.reorder_level;
                    return (
                      <tr key={d.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontWeight: 600, color: "#1a3556", fontSize: 14 }}>{d.drug_name}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>{d.generic_name}</div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.category}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: isLow ? "#dc2626" : "#1a3556" }}>{d.quantity}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.unit}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : "—"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>${d.unit_price}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: isLow ? "#fef2f2" : "#f0fdf4", color: isLow ? "#dc2626" : "#16a34a", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {isLow ? "LOW" : "OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* History tab */}
        {tab === "history" && (
          history.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>No dispensing history yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map(h => (
                <div key={h.id} style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a3556" }}>{h.patient_name}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{h.drug_name} · {h.quantity} units · Dr. {h.doctor}</div>
                    {h.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{h.notes}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(h.dispensed_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Add Drug Modal */}
      {showAddDrug && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>Add Drug to Stock</h2>
            {[
              { label: "Drug name *", value: drugName, set: setDrugName, placeholder: "Amoxicillin 500mg" },
              { label: "Generic name", value: genericName, set: setGenericName, placeholder: "Amoxicillin" },
              { label: "Quantity *", value: quantity, set: setQuantity, placeholder: "100", type: "number" },
              { label: "Unit", value: unit, set: setUnit, placeholder: "tablets / vials / bottles" },
              { label: "Reorder level", value: reorderLevel, set: setReorderLevel, placeholder: "10", type: "number" },
              { label: "Expiry date", value: expiryDate, set: setExpiryDate, placeholder: "", type: "date" },
              { label: "Supplier", value: supplier, set: setSupplier, placeholder: "Supplier name" },
              { label: "Unit price ($)", value: unitPrice, set: setUnitPrice, placeholder: "2.50", type: "number" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type || "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAddDrug(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={addDrug} disabled={!drugName || !quantity || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Adding..." : "Add to Stock →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {showDispense && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440 }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>Dispense Drug</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Patient name *</label>
              <input value={dispPatient} onChange={e => setDispPatient(e.target.value)} placeholder="John Mensah" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Drug *</label>
              <select value={dispDrug} onChange={e => setDispDrug(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select drug...</option>
                {stock.filter(d => d.quantity > 0).map(d => (
                  <option key={d.id} value={d.drug_name}>{d.drug_name} ({d.quantity} {d.unit} available)</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Quantity *</label>
              <input type="number" value={dispQty} onChange={e => setDispQty(e.target.value)} placeholder="10" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Doctor</label>
              <input value={dispDoctor} onChange={e => setDispDoctor(e.target.value)} placeholder="Dr. Ama Owusu" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
              <input value={dispNotes} onChange={e => setDispNotes(e.target.value)} placeholder="Take twice daily after meals" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDispense(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={dispenseDrug} disabled={!dispPatient || !dispDrug || !dispQty || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Dispensing..." : "Dispense →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
