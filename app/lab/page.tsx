"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useHpLang } from "@/lib/useLang";

type LabResult = {
  id: string;
  patient_name: string;
  test_name: string;
  result: string;
  unit: string;
  normal_range: string;
  status: string;
  doctor: string;
  notes: string;
  created_at: string;
};

export default function LabPage() {
  const router = useRouter();
  const { lang, setLang, t } = useHpLang();
  const fr = lang === "fr";
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [facilityId, setFacilityId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("");
  const [unit, setUnit] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [status, setStatus] = useState("normal");
  const [doctor, setDoctor] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data: facility } = await supabase.from("facilities").select("id").eq("user_id", user.id).single();
      const fid = facility?.id || "";
      setFacilityId(fid);
      loadResults(fid);
    });
  }, []);

  const loadResults = async (fid: string) => {
    setLoading(true);
    const { data } = await supabase.from("hp_lab_results").select("*").eq("facility_id", fid).order("created_at", { ascending: false });
    setResults(data ?? []);
    setLoading(false);
  };

  const saveResult = async () => {
    if (!patientName || !testName || !result) return;
    setSaving(true);
    await supabase.from("hp_lab_results").insert({
      facility_id: facilityId,
      patient_name: patientName, test_name: testName, result,
      unit, normal_range: normalRange, status, doctor,
    });
    setPatientName(""); setTestName(""); setResult(""); setUnit(""); setNormalRange(""); setStatus("normal"); setDoctor("");
    setShowForm(false);
    loadResults(facilityId);
    setSaving(false);
  };

  const statusColor = (s: string) => {
    if (s === "normal") return { bg: "#f0fdf4", color: "#16a34a" };
    if (s === "abnormal") return { bg: "#fef2f2", color: "#dc2626" };
    if (s === "borderline") return { bg: "#fffbeb", color: "#d97706" };
    return { bg: "#f1f5f9", color: "#475569" };
  };

  const commonTests = ["Full Blood Count", "Malaria RDT", "Blood Glucose", "Urine Analysis", "Liver Function Test", "Renal Function Test", "HIV Test", "Hepatitis B", "Pregnancy Test", "Widal Test"];

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard"><img src="/logo-dark.svg" alt="Healthpost" style={{ height: 32 }} /></a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🔬 {fr ? "Laboratoire" : "Lab Results"}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setLang(fr ? "en" : "fr")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{fr ? "EN" : "FR"}</button>
          <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ {fr ? "Ajouter" : "Add result"}</button>
        </div>
      </header>
      <div style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total", value: results.length, icon: "🔬", color: "#f0f9ff" },
            { label: fr ? "Anormal" : "Abnormal", value: results.filter(r => r.status === "abnormal").length, icon: "⚠️", color: "#fef2f2" },
            { label: fr ? "Aujourd hui" : "Today", value: results.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length, icon: "📅", color: "#f0fdf4" },
          ].map(s => (
            <div key={s.label} style={{ background: s.color, borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1a3556" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ color: "#1a3556", fontSize: 16, fontWeight: 700, margin: 0 }}>{fr ? "Ajouter un resultat" : "Add lab result"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{fr ? "Selection rapide" : "Quick select"}</label>
              <select onChange={e => setTestName(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }}>
                <option value="">{fr ? "Selectionner..." : "Select test..."}</option>
                {commonTests.map(tt => <option key={tt}>{tt}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[
                { label: fr ? "Patient *" : "Patient name *", value: patientName, set: setPatientName, placeholder: "John Mensah" },
                { label: fr ? "Nom du test *" : "Test name *", value: testName, set: setTestName, placeholder: "Full Blood Count" },
                { label: fr ? "Resultat *" : "Result *", value: result, set: setResult, placeholder: "14.2" },
                { label: fr ? "Unite" : "Unit", value: unit, set: setUnit, placeholder: "g/dL" },
                { label: fr ? "Plage normale" : "Normal range", value: normalRange, set: setNormalRange, placeholder: "12-16 g/dL" },
                { label: fr ? "Medecin" : "Doctor", value: doctor, set: setDoctor, placeholder: "Dr. Ama" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{fr ? "Statut" : "Status"}</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }}>
                <option value="normal">Normal</option>
                <option value="abnormal">{fr ? "Anormal" : "Abnormal"}</option>
                <option value="borderline">{fr ? "Limite" : "Borderline"}</option>
                <option value="pending">{fr ? "En attente" : "Pending"}</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveResult} disabled={saving} style={{ background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {saving ? (fr ? "Enregistrement..." : "Saving...") : (fr ? "Enregistrer" : "Save")}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{fr ? "Annuler" : "Cancel"}</button>
            </div>
          </div>
        )}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ color: "#1a3556", fontSize: 15, fontWeight: 700, margin: 0 }}>{fr ? "Resultats" : "Lab results"}</h3>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>{fr ? "Chargement..." : "Loading..."}</div>
          ) : results.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
              <div style={{ fontWeight: 600 }}>{fr ? "Aucun resultat" : "No lab results yet"}</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}>+ {fr ? "Ajouter" : "Add first result"}</button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[fr ? "Patient" : "Patient", "Test", fr ? "Resultat" : "Result", fr ? "Plage" : "Range", "Status", fr ? "Medecin" : "Doctor", fr ? "Date" : "Date"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{r.patient_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{r.test_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700 }}>{r.result} {r.unit}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>{r.normal_range || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: statusColor(r.status).bg, color: statusColor(r.status).color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{r.doctor || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
