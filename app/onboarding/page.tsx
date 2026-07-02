"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");

  const handleComplete = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("facilities").upsert({
        user_id: user.id,
        name: facilityName,
        type: facilityType,
        country,
        role,
      }, { onConflict: "user_id" });
    }
    router.push("/dashboard");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 480, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo-icon.svg" alt="Healthpost" style={{ width: 64, height: 64, marginBottom: 8 }} />
          <h1 style={{ color: "#1a3556", fontSize: 22, fontWeight: 800, margin: 0 }}>Set up your facility</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Step {step} of 2</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            {[1,2].map(s => (
              <div key={s} style={{ width: 40, height: 4, borderRadius: 2, background: s <= step ? "#1a3556" : "#e2e8f0" }} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Facility name</label>
              <input value={facilityName} onChange={e => setFacilityName(e.target.value)} placeholder="Accra General Hospital" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Facility type</label>
              <select value={facilityType} onChange={e => setFacilityType(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select type...</option>
                <option>General Hospital</option>
                <option>Private Clinic</option>
                <option>Polyclinic</option>
                <option>Specialist Centre</option>
                <option>Community Health Centre</option>
                <option>Teaching Hospital</option>
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select country...</option>
                <option>Ghana</option>
                <option>Nigeria</option>
                <option>Kenya</option>
                <option>South Africa</option>
                <option>Tanzania</option>
                <option>Uganda</option>
                <option>Senegal</option>
                <option>Côte d'Ivoire</option>
                <option>Other</option>
              </select>
            </div>
            <button onClick={() => setStep(2)} disabled={!facilityName || !facilityType || !country} style={{ width: "100%", background: "#1a3556", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Your role</label>
              {["Doctor / GP", "Specialist", "Nurse", "Pharmacist", "Hospital Administrator", "Other"].map(r => (
                <div key={r} onClick={() => setRole(r)} style={{ padding: "12px 16px", border: `2px solid ${role === r ? "#1a3556" : "#e2e8f0"}`, borderRadius: 8, marginBottom: 8, cursor: "pointer", background: role === r ? "#f0f7ff" : "#fff", fontWeight: role === r ? 600 : 400, color: "#1a3556" }}>
                  {r}
                </div>
              ))}
            </div>
            <button onClick={handleComplete} disabled={!role || loading} style={{ width: "100%", background: "#1a3556", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              {loading ? "Setting up..." : "Enter Healthpost →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
