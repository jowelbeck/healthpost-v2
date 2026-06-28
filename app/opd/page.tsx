"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Patient = {
  id: string;
  patient_name: string;
  age: string;
  gender: string;
  phone: string;
  complaint: string;
  urgency: string;
  status: string;
  token_number: number;
  doctor_notes: string;
  created_at: string;
};

function urgencyColor(u: string) {
  if (u === "high") return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
  if (u === "medium") return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
}

export default function OPDPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  // Form
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [complaint, setComplaint] = useState("");
  const [urgency, setUrgency] = useState("medium");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      loadQueue();
    });
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const { data } = await supabase.from("opd_queue").select("*").order("created_at", { ascending: true });
    if (data) setQueue(data);
    setLoading(false);
  };

  const registerPatient = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const token = queue.length + 1;
    await supabase.from("opd_queue").insert({
      user_id: user!.id,
      patient_name: patientName,
      age, gender, phone, complaint, urgency,
      token_number: token,
      status: "waiting",
    });
    setPatientName(""); setAge(""); setGender(""); setPhone(""); setComplaint(""); setUrgency("medium");
    setShowForm(false);
    setSaving(false);
    loadQueue();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("opd_queue").update({ status }).eq("id", id);
    loadQueue();
  };

  const filtered = filter === "all" ? queue : queue.filter(p => p.status === filter);
  const waiting = queue.filter(p => p.status === "waiting").length;
  const seen = queue.filter(p => p.status === "seen").length;
  const admitted = queue.filter(p => p.status === "admitted").length;

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🏥 OPD — Outpatient Queue</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Register Patient
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Waiting", value: waiting, color: "#d97706", bg: "#fffbeb" },
            { label: "Seen today", value: seen, color: "#16a34a", bg: "#f0fdf4" },
            { label: "Admitted", value: admitted, color: "#1a3556", bg: "#dbeafe" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px", border: `1px solid ${s.color}22` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "waiting", "seen", "admitted"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filter === f ? 700 : 400, background: filter === f ? "#1a3556" : "#e2e8f0", color: filter === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f}
            </button>
          ))}
        </div>

        {/* Queue */}
        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading queue...</div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏥</div>
              <div>No patients in queue</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Register first patient</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(p => {
                const uc = urgencyColor(p.urgency);
                return (
                  <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
                    <div style={{ background: "#1a3556", color: "#fff", borderRadius: 8, padding: "8px 14px", fontWeight: 800, fontSize: 18, minWidth: 48, textAlign: "center" }}>
                      #{p.token_number}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3556" }}>{p.patient_name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{p.age} yrs · {p.gender} · {p.phone}</div>
                      <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>📋 {p.complaint}</div>
                    </div>
                    <div style={{ background: uc.bg, color: uc.color, border: `1px solid ${uc.border}`, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const }}>
                      {p.urgency}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                      {p.status === "waiting" && (
                        <>
                          <button onClick={() => updateStatus(p.id, "seen")} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✓ Seen</button>
                          <button onClick={() => updateStatus(p.id, "admitted")} style={{ background: "#1a3556", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🛏️ Admit</button>
                        </>
                      )}
                      {p.status === "seen" && <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 13 }}>✓ Seen</span>}
                      {p.status === "admitted" && <span style={{ color: "#1a3556", fontWeight: 600, fontSize: 13 }}>🛏️ Admitted</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Register patient modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>Register Patient</h2>
            {[
              { label: "Full name *", value: patientName, set: setPatientName, placeholder: "John Mensah" },
              { label: "Age", value: age, set: setAge, placeholder: "35" },
              { label: "Phone", value: phone, set: setPhone, placeholder: "+233 20 000 0000" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Chief complaint *</label>
              <textarea value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Describe the main symptoms or reason for visit" rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Urgency</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["low", "medium", "high"].map(u => (
                  <button key={u} onClick={() => setUrgency(u)} style={{ flex: 1, padding: "8px", borderRadius: 7, border: `2px solid ${urgency === u ? urgencyColor(u).color : "#e2e8f0"}`, background: urgency === u ? urgencyColor(u).bg : "#fff", color: urgency === u ? urgencyColor(u).color : "#64748b", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" as const, fontSize: 13 }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={registerPatient} disabled={!patientName || !complaint || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                {saving ? "Registering..." : "Register Patient →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
