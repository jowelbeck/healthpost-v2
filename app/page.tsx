"use client";
import { useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const fr = lang === "fr";

  return (
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", minHeight: "100vh" }}>
      
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, height: 68 }}>
        <a href="/"><img src="/logo-dark.svg" alt="Healthpost" style={{ height: 52 }} /></a>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="/pricing" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{fr ? "Tarifs" : "Pricing"}</a>
          <a href="/login" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{fr ? "Connexion" : "Log in"}</a>
          <button onClick={() => setLang(fr ? "en" : "fr")} style={{ background: "#f1f5f9", border: "none", color: "#475569", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{fr ? "EN" : "FR"}</button>
          <a href="/signup" style={{ background: "#1a3556", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>{fr ? "Essai gratuit" : "Start free trial"}</a>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #0f1f33 0%, #1a3556 50%, #1e4d7b 100%)", padding: "100px 48px 80px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)", borderRadius: 24, padding: "6px 16px", fontSize: 13, color: "#4fc3f7", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: "#4fc3f7", borderRadius: "50%", display: "inline-block" }} />
            {fr ? "Concu pour l Afrique et au-dela" : "Built for Africa and beyond"}
          </div>
          <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1.5px" }}>
            {fr ? "Le systeme d exploitation pour votre hopital." : "The operating system for your hospital."}
          </h1>
          <p style={{ fontSize: 20, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>
            {fr ? "Dossiers patients, IA clinique, OPD, pharmacie, admissions et facturation en un seul endroit." : "Patient records, clinical AI, OPD, pharmacy, admissions, and billing — all in one place."}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "16px 36px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              {fr ? "Commencer gratuitement" : "Start free trial →"}
            </a>
            <a href="/pricing" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1px solid rgba(255,255,255,0.2)" }}>
              {fr ? "Voir les tarifs" : "View pricing"}
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            {fr ? "Aucune carte bancaire requise · 3 premiers mois gratuits" : "No credit card required · First 3 months free"}
          </p>
        </div>
      </section>

      <section style={{ background: "#1a3556", padding: "28px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { num: "9", label: fr ? "Modules integres" : "Integrated modules" },
            { num: "2", label: fr ? "Langues" : "Languages" },
            { num: "< 60s", label: fr ? "Evaluation IA" : "AI assessment" },
            { num: "100%", label: fr ? "Pour l Afrique" : "Built for Africa" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#4fc3f7", marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 12 }}>MODULES</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#0f1f33", marginBottom: 16 }}>
              {fr ? "Tout ce dont votre etablissement a besoin" : "Everything your facility needs"}
            </h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
              {fr ? "9 modules integres, concus pour fonctionner ensemble." : "9 integrated modules, built to work seamlessly together."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { icon: "🏥", title: fr ? "Consultations externes" : "OPD Management", desc: fr ? "File d attente, triage et flux de consultation" : "Smart queue, triage, and consultation flow", color: "#dbeafe" },
              { icon: "🛏️", title: fr ? "Admissions" : "Admissions", desc: fr ? "Gestion des lits et allocation des salles" : "Bed management and ward allocation", color: "#dcfce7" },
              { icon: "💊", title: fr ? "Pharmacie" : "Pharmacy", desc: fr ? "Stock, distribution et alertes peremption" : "Stock, dispensing, and expiry alerts", color: "#fef9c3" },
              { icon: "🧠", title: fr ? "IA Clinique" : "Clinical AI", desc: fr ? "Diagnostics differentiels et notes SOAP" : "Differential diagnoses and SOAP notes", color: "#f3e8ff" },
              { icon: "👤", title: fr ? "Dossiers Patients" : "Patient Records", desc: fr ? "Historique medical complet" : "Complete medical history and logs", color: "#ffedd5" },
              { icon: "📅", title: fr ? "Rendez-vous" : "Appointments", desc: fr ? "Planification et rappels" : "Scheduling and reminders", color: "#e0f2fe" },
              { icon: "💰", title: fr ? "Facturation" : "Billing", desc: fr ? "Factures et rapports financiers" : "Invoices and financial reports", color: "#fce7f3" },
              { icon: "🔬", title: fr ? "Laboratoire" : "Lab Results", desc: fr ? "Resultats et interpretation IA" : "Results and AI interpretation", color: "#f0fdf4" },
              { icon: "📊", title: fr ? "Analytique" : "Analytics", desc: fr ? "Flux de patients et tendances" : "Patient flow and clinical trends", color: "#faf5ff" },
            ].map(m => (
              <div key={m.title} style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0" }}>
                <div style={{ width: 48, height: 48, background: m.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{m.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0f1f33", marginBottom: 8 }}>{m.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #0f1f33, #1a3556)", padding: "80px 48px", textAlign: "center" as const, color: "#fff" }}>
        <img src="/logo-dark.svg" alt="Healthpost" style={{ height: 60, marginBottom: 32 }} />
        <h2 style={{ fontSize: 44, fontWeight: 900, marginBottom: 16, letterSpacing: "-1px" }}>
          {fr ? "Pret a transformer votre hopital ?" : "Ready to transform your hospital?"}
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
          {fr ? "Rejoignez les etablissements de sante qui font confiance a Healthpost." : "Join healthcare facilities across Africa that trust Healthpost."}
        </p>
        <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "18px 48px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 18, display: "inline-block" }}>
          {fr ? "Commencer gratuitement" : "Start free trial →"}
        </a>
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          {fr ? "Aucune carte bancaire · 3 mois gratuits · Annulez a tout moment" : "No credit card · 3 months free · Cancel anytime"}
        </p>
      </section>

      <footer style={{ background: "#0a1628", padding: "40px 48px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
          <div>
            <img src="/logo-dark.svg" alt="Healthpost" style={{ height: 40, marginBottom: 8, opacity: 0.8 }} />
            <div>© {new Date().getFullYear()} Healthpost · healthpost.africa</div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{fr ? "Tarifs" : "Pricing"}</a>
            <a href="/login" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{fr ? "Connexion" : "Log in"}</a>
            <a href="/signup" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{fr ? "S inscrire" : "Sign up"}</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
