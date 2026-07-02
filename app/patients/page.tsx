"use client";
import { getHpUserRole, hasHpAccess } from "@/lib/roleCheck";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Patient = {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  blood_group: string;
  allergies: string;
  emergency_contact: string;
  emergency_phone: string;
  created_at: string;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const role = await getHpUserRole();
      if (!hasHpAccess("patients", role)) { router.push("/dashboard"); return; }
      loadPatients();
    });
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    const { data } = await supabase.from("hp_patients").select("*").order("full_name");
    if (data) setPatients(data);
    setLoading(false);
  };

  const addPatient = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("hp_patients").insert({
      user_id: user!.id,
      full_name: fullName, date_of_birth: dob, gender, phone, email,
      address, blood_group: bloodGroup, allergies,
      emergency_contact: emergencyContact, emergency_phone: emergencyPhone,
    });
    setFullName(""); setDob(""); setGender(""); setPhone(""); setEmail(""); setAddress(""); setBloodGroup(""); setAllergies(""); setEmergencyContact(""); setEmergencyPhone("");
    setShowForm(false);
    setSaving(false);
    loadPatients();
  };

  const filtered = patients.filter(p => p.full_name.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search));

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>👤 Patient Records</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Add Patient
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or phone..." style={{ width: "100%", padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, boxSizing: "border-box" as const, background: "#fff" }} />
        </div>

        <div style={{ marginBottom: 12, fontSize: 13, color: "#64748b" }}>{filtered.length} patient{filtered.length !== 1 ? "s" : ""} found</div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
              <div>{search ? "No patients match your search" : "No patients yet"}</div>
              {!search && <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Add first patient</button>}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelected(p)} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", cursor: "pointer" }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = "#1a3556")}
                  onMouseOut={e => (e.currentTarget.style.borderColor = "#e2e8f0")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ background: "#dbeafe", color: "#1a3556", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
                      {p.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1a3556", fontSize: 15 }}>{p.full_name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{p.gender} · {p.blood_group || "Blood group unknown"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>📞 {p.phone || "—"}</div>
                  {p.allergies && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>⚠️ {p.allergies}</div>}
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Added {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Patient detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ color: "#1a3556", margin: 0, fontSize: 20 }}>{selected.full_name}</h2>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{selected.gender} · DOB: {selected.date_of_birth ? new Date(selected.date_of_birth).toLocaleDateString() : "—"}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b" }}>✕ Close</button>
            </div>
            {[
              { label: "Phone", value: selected.phone },
              { label: "Email", value: selected.email },
              { label: "Address", value: selected.address },
              { label: "Blood Group", value: selected.blood_group },
              { label: "Allergies", value: selected.allergies },
              { label: "Emergency Contact", value: selected.emergency_contact },
              { label: "Emergency Phone", value: selected.emergency_phone },
            ].map(f => f.value && (
              <div key={f.label} style={{ marginBottom: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{f.label.toUpperCase()}</div>
                <div style={{ fontSize: 14, color: "#334155" }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add patient modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
            <h2 style={{ color: "#1a3556", marginBottom: 24, fontSize: 18 }}>Add Patient</h2>
            {[
              { label: "Full name *", value: fullName, set: setFullName, placeholder: "John Mensah" },
              { label: "Date of birth", value: dob, set: setDob, placeholder: "", type: "date" },
              { label: "Phone", value: phone, set: setPhone, placeholder: "+233 20 000 0000" },
              { label: "Email", value: email, set: setEmail, placeholder: "patient@email.com", type: "email" },
              { label: "Address", value: address, set: setAddress, placeholder: "Accra, Ghana" },
              { label: "Allergies", value: allergies, set: setAllergies, placeholder: "Penicillin, Sulfa drugs" },
              { label: "Emergency contact", value: emergencyContact, set: setEmergencyContact, placeholder: "Jane Mensah (Wife)" },
              { label: "Emergency phone", value: emergencyPhone, set: setEmergencyPhone, placeholder: "+233 20 000 0001" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type || "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }} />
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
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Blood group</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 14, boxSizing: "border-box" as const }}>
                <option value="">Select...</option>
                {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#64748b" }}>Cancel</button>
              <button onClick={addPatient} disabled={!fullName || saving} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#1a3556", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Saving..." : "Add Patient →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
