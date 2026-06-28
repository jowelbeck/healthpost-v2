"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Admission = {
  id: string;
  patient_name: string;
  age: string;
  gender: string;
  phone: string;
  diagnosis: string;
  ward: string;
  bed_number: string;
  doctor: string;
  status: string;
  admitted_at: string;
  discharged_at: string;
  notes: string;
};

const WARDS = ["General Ward", "Male Ward", "Female Ward", "Paediatric Ward", "Maternity Ward", "ICU", "Surgical Ward", "Private Room"];

export default function AdmissionsPage() {
  const router = useRouter();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("admitted");

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [ward, setWard] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [doctor, setDoctor] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      loadAdmissions();
    });
  }, []);

  const loadAdmissions = async () => {
    setLoading(true);
    const { data } = await supabase.from("admissions").select("*").order("admitted_at", { ascending: false });
    if (data) setAdmissions(data);
    setLoading(false);
  };

  const admitPatient = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("admissions").insert({
      user_id: user!.id,
      patient_name: patientName,
      age, gender, phone, diagnosis, ward,
      bed_number: bedNumber,
      doctor, notes,
      status: "admitted",
    });
    setPatientName(""); setAge(""); setGender(""); setPhone(""); setDiagnosis(""); setWard(""); setBedNumber(""); setDoctor(""); setNotes("");
    setShowForm(false);
    setSaving(false);
    loadAdmissions();
  };

  const discharge = async (id: string) => {
    await supabase.from("admissions").update({ status: "discharged", discharged_at: new Date().toISOString() }).eq("id", id);
    loadAdmissions();
  };

  const filtered = filter === "all" ? admissions : admissions.filter(a => a.status === filter);
  const currentAdmitted = admissions.filter(a => a.status === "admitted").length;
  const discharged = admissions.filter(a => a.status === "discharged").length;

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🛏️ Admissions</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Admit Patient
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Currently Admitted", value: currentAdmitted, color: "#1a3556", bg: "#dbeafe" },
            { label: "Discharged", value: discharged, color: "#16a34a", bg: "#f0fdf4" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "admitted", "discharged"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: filter === f ? 700 : 400, background: filter === f ? "#1a3556" : "#e2e8f0", color: filter === f ? "#fff" : "#64748b", fontSize: 13, textTransform: "capitalize" as const }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛏️</div>
              <div>No admissions found</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Admit first patient</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(a => (
                <div key={a.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3556" }}>{a.patient_name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{a.age} yrs · {a.gender} · {a.phone}</div>
                      <div style={{ fontSize: 13, color: "#334155", marginTop: 6 }}>🩺 {a.diagnosis}</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>🛏️ {a.ward} — Bed {a.bed_number} · Dr. {a.doctor}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Admitted: {new Date(a.admitted_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ background: a.status === "admitted" ? "#dbeafe" : "#f0fdf4", color: a.status === "admitted" ? "#1a3556" : "#16a34a", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const }}>
                        {a.status}
                      </span>
                      {a.status === "admitted" && (
                        <button onClick={() => discharge(a.id)} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                          Discharge →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>Admit Patient</h2>
            {[
              { label: "Full name *", value: patientName, set: setPatientName, placeholder: "John Mensah" },
              { label: "Age", value: age, set: setAge, placeholder: "45" },
              { label: "Phone", value: phone, set: setPhone, placeholder: "+233 20 000 0000" },
              { label: "Diagnosis *", value: diagnosis, set: setDiagnosis, placeholder: "Malaria with complications" },
              { label: "Bed number", value: bedNumber, set: setBedNumber, placeholder: "B12" },
              { label: "Doctor", value: doctor, set: setDoctor, placeholder: "Dr. Ama Owusu" },
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
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Ward *</label>
              <select value={ward} onChange={e => setWard(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select ward...</option>
                {WARDS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={admitPatient} disabled={!patientName || !diagnosis || !ward || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                {saving ? "Admitting..." : "Admit Patient →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
