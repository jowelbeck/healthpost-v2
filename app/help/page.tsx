export default function HelpPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #1e293b; }
        .help-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; text-decoration: none; color: inherit; display: block; transition: border-color 0.15s; }
        .help-card:hover { border-color: #1a3556; }
      `}</style>
      <div style={{ minHeight: "100vh", padding: "60px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <a href="/" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 24, display: "inline-block" }}>← Back to Healthpost</a>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a3556", marginBottom: 8 }}>Help Center</h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            Everything you need to get the most out of Healthpost.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <a href="/faq" className="help-card">
              <div style={{ fontSize: 28, marginBottom: 10 }}>❓</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>FAQ</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Answers to the most common questions about Healthpost, pricing, and how the platform works.</div>
            </a>
            <a href="/contact" className="help-card">
              <div style={{ fontSize: 28, marginBottom: 10 }}>✉️</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Contact us</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Send us a message directly and we'll get back to you as soon as possible.</div>
            </a>
          </div>

          <div className="help-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Getting started</div>
            <ol style={{ paddingLeft: 20, fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              <li><a href="/signup" style={{ color: "#1a3556" }}>Sign up</a> for your free trial — no credit card required</li>
              <li>Complete onboarding: set up your facility details</li>
              <li>Add your first patient, or go straight to the OPD queue</li>
              <li>Invite your team from the <strong>Team</strong> page inside the app</li>
            </ol>
          </div>

          <div className="help-card">
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Still need help?</div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
              Use our <a href="/contact" style={{ color: "#1a3556" }}>contact form</a> and we'll respond as soon as we can.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
