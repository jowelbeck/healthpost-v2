"use client";
import { useHpLang } from "@/lib/useLang";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  patient_name: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
  created_at: string;
};

export default function AppointmentsPage() {
  const router = useRouter();
  const { lang, setLang, t } = useHpLang();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [facilityId, setFacilityId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [patientName, setPatientName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Consultation");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data: facility } = await supabase.from("facilities").select("id").eq("user_id", user.id).single();
      const fid = facility?.id || "";
      setFacilityId(fid);
      loadAppointments(fid);
    });
  }, []);

  const loadAppointments = async (fid: string) => {
    setLoading(true);
    const { data } = await supabase.from("hp_appointments").select("*").eq("facility_id", fid).order("date", { ascending: true }).order("time", { ascending: true });
    setAppointments(data ?? []);
    setLoading(false);
  };

  const saveAppointment = async () => {
    if (!patientName || !date || !time) return;
    setSaving(true);
    await supabase.from("hp_appointments").insert({
      facility_id: facilityId,
      patient_name: patientName, doctor, date, time, type, notes, status: "scheduled",
    });
    setPatientName(""); setDoctor(""); setDate(""); setTime(""); setType("Consultation"); setNotes("");
    setShowForm(false);
    loadAppointments(facilityId);
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("hp_appointments").update({ status }).eq("id", id);
    loadAppointments(facilityId);
  };

  const filtered = appointments.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterDate && a.date !== filterDate) return false;
    return true;
  });

  const statusColor = (s: string) => {
    if (s === "scheduled") return { bg: "#e0f2fe", color: "#0369a1" };
    if (s === "seen") return { bg: "#f0fdf4", color: "#16a34a" };
    if (s === "cancelled") return { bg: "#fef2f2", color: "#dc2626" };
    return { bg: "#f1f5f9", color: "#475569" };
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.date === today && a.status === "scheduled").length;
  const totalScheduled = appointments.filter(a => a.status === "scheduled").length;

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#1a3556", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>{t.back}</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📅 Appointments</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#4fc3f7", color: "#1a3556", border: "none", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Book appointment
        </button>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Today", value: todayAppts, icon: "📅", color: "#e0f2fe" },
            { label: "Scheduled", value: totalScheduled, icon: "🕐", color: "#f0fdf4" },
            { label: "Total", value: appointments.length, icon: "📋", color: "#faf5ff" },
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: "#1a3556", fontSize: 16, fontWeight: 700, margin: 0 }}>Book appointment</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[
                { label: "Patient name *", value: patientName, set: setPatientName, placeholder: "John Mensah" },
                { label: "Doctor", value: doctor, set: setDoctor, placeholder: "Dr. Ama Asante" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Time *</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }}>
                  {["Consultation", "Follow-up", "Procedure", "Lab", "Antenatal", "Child Welfare", "Emergency", "Other"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, boxSizing: "border-box" as const }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveAppointment} disabled={saving || !patientName || !date || !time} style={{ background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {saving ? "Saving..." : "Book appointment"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "10px 24px", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const }}>
            <h3 style={{ color: "#1a3556", fontSize: 15, fontWeight: 700, margin: 0, flex: 1 }}>Appointments</h3>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ padding: "7px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "7px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13 }}>
              <option value="all">All status</option>
              <option value="scheduled">Scheduled</option>
              <option value="seen">Seen</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {filterDate && <button onClick={() => setFilterDate("")} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12, cursor: "pointer", color: "#64748b" }}>Clear</button>}
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No appointments</div>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 12, background: "#1a3556", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}>Book first appointment</button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Patient", "Doctor", "Date", "Time", "Type", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{a.patient_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{a.doctor || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{new Date(a.date + "T00:00:00").toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{a.time}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{a.type}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: statusColor(a.status).bg, color: statusColor(a.status).color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {a.status === "scheduled" && (
                          <>
                            <button onClick={() => updateStatus(a.id, "seen")} style={{ background: "#f0fdf4", color: "#16a34a", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Seen</button>
                            <button onClick={() => updateStatus(a.id, "cancelled")} style={{ background: "#fef2f2", color: "#dc2626", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                          </>
                        )}
                      </div>
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
