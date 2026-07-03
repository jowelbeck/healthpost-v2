"use client";
import { useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const fr = lang === "fr";

  const modules = [
    { icon: "🏥", title: fr ? "Consultations Externes" : "OPD Management", desc: fr ? "File d'attente, triage et flux de consultation" : "Queue management, triage, and consultation flow" },
    { icon: "🛏️", title: fr ? "Admissions" : "Admissions", desc: fr ? "Gestion des lits, allocation des salles et sortie des patients" : "Bed management, ward allocation, and patient discharge" },
    { icon: "💊", title: fr ? "Pharmacie" : "Pharmacy", desc: fr ? "Gestion des stocks, distribution et alertes de péremption" : "Stock management, dispensing, and expiry alerts" },
    { icon: "🧠", title: fr ? "IA Clinique" : "Clinical AI", desc: fr ? "Diagnostics différentiels, recommandations médicamenteuses et notes SOAP" : "AI-powered differential diagnoses, drug guidance, and SOAP notes" },
    { icon: "👤", title: fr ? "Dossiers Patients" : "Patient Records", desc: fr ? "Historique médical complet, résultats de laboratoire et journaux de consultation" : "Complete medical history, lab results, and consultation logs" },
    { icon: "📅", title: fr ? "Rendez-vous" : "Appointments", desc: fr ? "Planification, rappels et gestion du calendrier" : "Scheduling, reminders, and calendar management" },
    { icon: "💰", title: fr ? "Facturation" : "Billing & Invoicing", desc: fr ? "Factures, paiements et rapports financiers" : "Invoices, payments, and financial reports" },
    { icon: "🔬", title: fr ? "Résultats de Laboratoire" : "Lab Results", desc: fr ? "Téléchargement et interprétation IA des résultats" : "Upload and AI interpretation of lab results" },
    { icon: "📊", title: fr ? "Analytique" : "Analytics", desc: fr ? "Flux de patients, revenus et tendances cliniques" : "Patient flow, revenue, and clinical trends" },
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <nav style={{ background: "#1a3556", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/"><img src="/logo-dark.svg" alt="Healthpost" style={{ height: 40 }} /></a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => setLang(fr ? "en" : "fr")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {fr ? "EN" : "FR"}
          </button>
          <a href="/signup" style={{ color: "#4fc3f7", textDecoration: "none", fontWeight: 600 }}>{fr ? "S'inscrire" : "Sign up"}</a>
          <a href="/login" style={{ color: "#fff", textDecoration: "none" }}>{fr ? "Connexion" : "Log in"}</a>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #1a3556 0%, #2d5f8a 100%)", padding: "80px 40px", textAlign: "center", color: "#fff" }}>
        <div style={{ display: "inline-block", background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: 24, color: "#4fc3f7" }}>
          {fr ? "Système d'exploitation hospitalier · Intelligence Clinique" : "Hospital Operating System · Clinical Intelligence"}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
          {fr ? "Gérez votre clinique ou hôpital —" : "Run your clinic or hospital —"}<br />
          <em style={{ color: "#4fc3f7", fontStyle: "normal" }}>{fr ? "avec un support clinique intelligent." : "with intelligent clinical support."}</em>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 600, margin: "0 auto 32px" }}>
          {fr ? "Healthpost est le système d'exploitation hospitalier pour les professionnels de santé — dossiers patients, IA clinique, OPD, admissions, pharmacie et facturation en un seul endroit." : "Healthpost is the hospital operating system for medical professionals — combining patient records, AI clinical support, OPD, admissions, pharmacy, and billing in one place."}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
          <a href="/pricing" style={{ color: "#4fc3f7", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{fr ? "Tarifs" : "Pricing"}</a>
          <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "16px 40px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 18 }}>{fr ? "Essai gratuit →" : "Start free trial →"}</a>
        </div>
      </section>

      <section style={{ padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#1a3556", marginBottom: 40 }}>
          {fr ? "Tout ce dont votre établissement a besoin" : "Everything your facility needs"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {modules.map((m) => (
            <div key={m.title} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a3556", marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#1a3556", padding: "60px 40px", textAlign: "center", color: "#fff" }}>
        <img src="/logo-full.svg" alt="Healthpost" style={{ height: 60, marginBottom: 24 }} />
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>{fr ? "Prêt à gérer un hôpital plus intelligent ?" : "Ready to run a smarter hospital?"}</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, fontSize: 16 }}>{fr ? "Conçu pour les professionnels de santé en Afrique et au-delà." : "Designed for medical professionals across Africa and beyond."}</p>
        <a href="/signup" style={{ background: "#4fc3f7", color: "#1a3556", padding: "16px 40px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 18 }}>{fr ? "Commencer gratuitement →" : "Start free trial →"}</a>
        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{fr ? "Les 10 premières cliniques bénéficient de 3 mois gratuits" : "First 10 clinics get 3 months completely free"}</p>
      </section>

      <footer style={{ background: "#0f1f33", padding: "24px 40px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        © {new Date().getFullYear()} Healthpost — {fr ? "Système d'exploitation hospitalier pour l'Afrique et au-delà" : "Hospital Operating System for Africa and beyond"} · healthpost.africa
      </footer>
    </main>
  );
}
