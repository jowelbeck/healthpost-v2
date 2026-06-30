"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Result = {
  diagnosis: string;
  differentials: string[];
  urgency: string;
  soap_note: string;
  drug_guidance: string;
  red_flags: string[];
  follow_up: string;
};

export default function ClinicalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [caseHistory, setCaseHistory] = useState<any[]>([]);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [vitals, setVitals] = useState("");
  const [historyText, setHistoryText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
    });
    const saved = localStorage.getItem("hp_clinical_history");
    if (saved) setCaseHistory(JSON.parse(saved));
  }, []);

  const analyze = async () => {
    if (!symptoms.trim()) { setError("Please enter symptoms"); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/clinical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ patientName, age, gender, weight, symptoms, duration, vitals, history_text: historyText }),
      });
      if (!res.ok) throw new Error("API error");
      const parsed = await res.json();
      setResult(parsed);
      const entry = { id: Date.now(), patientName, age, gender, symptoms, result: parsed, createdAt: new Date().toISOString() };
      const updated = [entry, ...caseHistory].slice(0, 20);
      setCaseHistory(updated);
      localStorage.setItem("hp_clinical_history", JSON.stringify(updated));
    } catch (err) {
      setError("Analysis failed. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const urgencyColor = (u: string) => {
    if (u === "high") return { bg: "#fef2f2", color: "#dc2626" };
    if (u === "medium") return { bg: "#fffbeb", color: "#d97706" };
    return { bg: "#f0fdf4", color: "#16a34a" };
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🧠 Clinical AI — Decision Support</span>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", marginBottom: 24 }}>
          <h2 style={{ color: "#1a3556", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>New Clinical Assessment</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>AI-powered differential diagnosis based on WHO guidelines and MSD Manual</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              { label: "Patient name", value: patientName, set: setPatientName, placeholder: "John Mensah" },
              { label: "Age", value: age, set: setAge, placeholder: "45" },
              { label: "Gender", value: gender, set: setGender, placeholder: "Male / Female" },
              { label: "Weight (kg)", value: weight, set: setWeight, placeholder: "70" },
              { label: "Duration of symptoms", value: duration, set: setDuration, placeholder: "3 days" },
              { label: "Vitals (BP, Temp, Pulse)", value: vitals, set: setVitals, placeholder: "BP 120/80, Temp 38.5°C" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Chief complaint & symptoms *</label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Describe all symptoms in detail..." rows={4} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const, resize: "vertical" as const }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Relevant medical history</label>
            <textarea value={historyText} onChange={e => setHistoryText(e.target.value)} placeholder="Past medical history, medications, allergies..." rows={2} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const, resize: "vertical" as const }} />
          </div>

          {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

          <button onClick={analyze} disabled={loading || !symptoms} style={{ width: "100%", background: loading ? "#94a3b8" : "#1a3556", color: "#fff", padding: "13px", borderRadius: 9, fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "🧠 Analyzing case..." : "🧠 Analyze Case →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>For clinical decision support only. Doctor must review all recommendations.</p>
        </div>

        {result && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#1a3556", fontSize: 18, fontWeight: 800, margin: 0 }}>Clinical Assessment</h2>
              <span style={{ background: urgencyColor(result.urgency).bg, color: urgencyColor(result.urgency).color, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const }}>
                {result.urgency} urgency
              </span>
            </div>
            <div style={{ background: "#f0f7ff", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3556", marginBottom: 6, textTransform: "uppercase" as const }}>Primary Diagnosis</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a3556" }}>{result.diagnosis}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const }}>Differential Diagnoses</div>
              {result.differentials?.map((d, i) => (
                <div key={i} style={{ padding: "6px 12px", background: "#f8fafc", borderRadius: 6, marginBottom: 6, fontSize: 13, color: "#334155", borderLeft: "3px solid #1a3556" }}>
                  {i + 1}. {d}
                </div>
              ))}
            </div>
            {result.red_flags?.length > 0 && (
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: 14, marginBottom: 16, border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 8, textTransform: "uppercase" as const }}>⚠️ Red Flags</div>
                {result.red_flags.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#dc2626", marginBottom: 4 }}>• {f}</div>
                ))}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const }}>Drug Guidance</div>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: 14, fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{result.drug_guidance}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const }}>SOAP Note</div>
              <pre style={{ background: "#f8fafc", borderRadius: 8, padding: 14, fontSize: 12, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap" as const, fontFamily: "monospace" }}>{result.soap_note}</pre>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 12, fontSize: 13, color: "#16a34a" }}>
              📅 <strong>Follow-up:</strong> {result.follow_up}
            </div>
          </div>
        )}

        {caseHistory.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ color: "#1a3556", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Cases</h3>
            {caseHistory.slice(0, 5).map(h => (
              <div key={h.id} onClick={() => setResult(h.result)} style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a3556" }}>{h.patientName || "Unknown patient"}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{h.symptoms.substring(0, 60)}...</div>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(h.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
