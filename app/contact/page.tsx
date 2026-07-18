"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          email: email.trim(),
          name: name.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send. Please try again.");
      setSent(true);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
        .field label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field textarea { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; font-family: inherit; }
        .field input:focus, .field textarea:focus { border-color: #1a3556; box-shadow: 0 0 0 3px rgba(26,53,86,0.1); background: #fff; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <a href="/" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 24, display: "inline-block" }}>← Back to Healthpost</a>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a3556", marginBottom: 8 }}>Contact us</h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            Questions, feedback, or need help with your account? Send us a message and we'll get back to you.
          </p>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a3556", marginBottom: 8 }}>Message sent</h2>
                <p style={{ fontSize: 14, color: "#64748b" }}>Thanks for reaching out — we'll respond as soon as we can.</p>
              </div>
            ) : (
              <>
                <div className="field">
                  <label>Your name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Ama Owusu" />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hospital.com" />
                </div>
                <div className="field">
                  <label>Subject (optional)</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" />
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
                </div>
                {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{ width: "100%", background: "#1a3556", color: "#fff", padding: 12, borderRadius: 8, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: sending ? 0.6 : 1 }}
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
