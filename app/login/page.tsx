"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (forgotMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
      if (error) { setError(error.message); setLoading(false); return; }
      setResetSent(true); setLoading(false); return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo-icon.svg" alt="Healthpost" style={{ width: 64, height: 64, marginBottom: 8 }} />
          <h1 style={{ color: "#1a3556", fontSize: 24, fontWeight: 800, margin: 0 }}>Healthpost</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>
        {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="doctor@hospital.com" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="Your password" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
          </div>

          {resetSent ? (
            <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "12px 14px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 600 }}>Reset link sent! Check your email.</div>
          ) : (
            <button type="submit" disabled={loading} style={{ width: "100%", background: "#1a3556", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              {loading ? "Please wait..." : forgotMode ? "Send reset link →" : "Sign in →"}
            </button>
          )}
          {forgotMode && resetSent === false && (
            <button type="button" onClick={() => setForgotMode(false)} style={{ width: "100%", background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginTop: 8 }}>← Back to login</button>
          )}
          {forgotMode === false && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button type="button" onClick={() => setForgotMode(true)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}>Forgot password?</button>
            </div>
          )}
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
          Don't have an account? <a href="/signup" style={{ color: "#1a3556", fontWeight: 600 }}>Sign up free</a>
        </p>
      </div>
    </main>
  );
}
