"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo-icon.svg" alt="Healthpost" style={{ width: 64, height: 64, marginBottom: 8 }} />
          <h1 style={{ color: "#1a3556", fontSize: 22, fontWeight: 800, margin: 0 }}>Set new password</h1>
        </div>
        {done ? (
          <div style={{ textAlign: "center", color: "#16a34a", fontWeight: 600 }}>Password updated! Redirecting...</div>
        ) : (
          <>
            {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
            </div>
            <button onClick={handleReset} disabled={loading} style={{ width: "100%", background: "#1a3556", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              {loading ? "Updating..." : "Set new password"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
