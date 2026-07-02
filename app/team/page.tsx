"use client";
import { useHpLang } from "@/lib/useLang";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export default function TeamPage() {
  const router = useRouter();
  const { lang, setLang, t } = useHpLang();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityId, setFacilityId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor / GP");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data: facility } = await supabase.from("facilities").select("id").eq("user_id", user.id).single();
      if (!facility) { router.push("/dashboard"); return; }
      setFacilityId(facility.id);
      loadStaff(facility.id);
    });
  }, []);

  const loadStaff = async (fid: string) => {
    setLoading(true);
    const { data } = await supabase.from("hp_staff").select("*").eq("facility_id", fid).order("created_at", { ascending: false });
    setStaff(data ?? []);
    setLoading(false);
  };

  const addStaff = async () => {
    if (!name || !email) { setError("Name and email are required."); return; }
    setSaving(true);
    setError("");
    const { error: err } = await supabase.from("hp_staff").insert({
      facility_id: facilityId,
      name, email, role, status: "active",
    });
    if (err) { setError(err.message); setSaving(false); return; }
    setName(""); setEmail(""); setRole("Doctor / GP");
    setShowForm(false);
    loadStaff(facilityId);
    setSaving(false);
  };

  const removeStaff = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    await supabase.from("hp_staff").delete().eq("id", id);
    loadStaff(facilityId);
  };

  const roleColor = (r: string) => {
    if (r.includes("Doctor") || r.includes("Specialist")) return { bg: "#e0f2fe", color: "#0369a1" };
    if (r.includes("Nurse")) return { bg: "#f0fdf4", color: "#16a34a" };
    if (r.includes("Pharmacist")) return { bg: "#fef9c3", color: "#854d0e" };
    if (r.includes("Admin")) return { bg: "#f3e8ff", color: "#7e22ce" };
    return { bg: "#f1f5f9", color: "#475569" };
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>{t.back}</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>👥 Team Management</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Add staff
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 900, margin: "0 auto" }}>
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", marginBottom: 24 }}>
            <h3 style={{ color: "#1a3556", marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Add staff member</h3>
            {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Full name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Ama Mensah" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Email *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ama@hospital.com" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }}>
                {["Doctor / GP", "Specialist", "Nurse", "Pharmacist", "Hospital Administrator", "Other"].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addStaff} disabled={saving} style={{ background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {saving ? "Saving..." : "Add staff member"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#1a3556", fontSize: 16, fontWeight: 700, margin: 0 }}>Staff members</h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>{staff.length} total</span>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
          ) : staff.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No staff yet</div>
              <div style={{ fontSize: 13 }}>Add your first staff member to get started</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Name", "Email", "Role", "Added", ""].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left" as const, fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{s.name}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{s.email}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: roleColor(s.role).bg, color: roleColor(s.role).color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.role}</span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8" }}>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <button onClick={() => removeStaff(s.id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Remove</button>
                    </td>
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
