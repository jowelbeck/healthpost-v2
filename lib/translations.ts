export type HpLang = "en" | "fr";

export const hp_t = (lang: HpLang) => ({
  // Navigation
  dashboard: lang === "fr" ? "Tableau de bord" : "Dashboard",
  opd: lang === "fr" ? "Consultations externes" : "OPD",
  admissions: lang === "fr" ? "Admissions" : "Admissions",
  pharmacy: lang === "fr" ? "Pharmacie" : "Pharmacy",
  clinical: lang === "fr" ? "IA Clinique" : "Clinical AI",
  patients: lang === "fr" ? "Patients" : "Patients",
  appointments: lang === "fr" ? "Rendez-vous" : "Appointments",
  billing: lang === "fr" ? "Facturation" : "Billing",
  analytics: lang === "fr" ? "Analytique" : "Analytics",
  team: lang === "fr" ? "Équipe" : "Team",

  // Dashboard
  goodMorning: lang === "fr" ? "Bonjour" : "Good morning",
  goodAfternoon: lang === "fr" ? "Bonjour" : "Good afternoon",
  goodEvening: lang === "fr" ? "Bonsoir" : "Good evening",
  yourFacility: lang === "fr" ? "Votre établissement" : "Your facility",

  // Module descriptions
  opdDesc: lang === "fr" ? "File d'attente & triage" : "Outpatient queue & triage",
  admissionsDesc: lang === "fr" ? "Lits & gestion des salles" : "Beds & ward management",
  pharmacyDesc: lang === "fr" ? "Stock & distribution" : "Stock & dispensing",
  clinicalDesc: lang === "fr" ? "Support diagnostic IA" : "AI diagnosis support",
  patientsDesc: lang === "fr" ? "Dossiers médicaux" : "Medical records",
  appointmentsDesc: lang === "fr" ? "Planification" : "Scheduling",
  billingDesc: lang === "fr" ? "Factures & paiements" : "Invoices & payments",
  analyticsDesc: lang === "fr" ? "Rapports de performance" : "Performance reports",
  teamDesc: lang === "fr" ? "Personnel & rôles" : "Staff & roles",

  // OPD
  addPatient: lang === "fr" ? "+ Ajouter patient" : "+ Add patient",
  patientName: lang === "fr" ? "Nom du patient" : "Patient name",
  chiefComplaint: lang === "fr" ? "Motif de consultation" : "Chief complaint",
  triage: lang === "fr" ? "Triage" : "Triage",
  seen: lang === "fr" ? "Vu" : "Seen",
  admit: lang === "fr" ? "Admettre" : "Admit",
  waiting: lang === "fr" ? "En attente" : "Waiting",
  inProgress: lang === "fr" ? "En cours" : "In progress",

  // Pharmacy
  addDrug: lang === "fr" ? "+ Ajouter médicament" : "+ Add drug",
  drugName: lang === "fr" ? "Nom du médicament" : "Drug name",
  quantity: lang === "fr" ? "Quantité" : "Quantity",
  supplier: lang === "fr" ? "Fournisseur" : "Supplier",
  expiryDate: lang === "fr" ? "Date d'expiration" : "Expiry date",
  dispenseDrug: lang === "fr" ? "Dispenser" : "Dispense",
  lowStock: lang === "fr" ? "Stock faible" : "Low stock",
  expiringSoon: lang === "fr" ? "Expiration proche" : "Expiring soon",

  // Appointments
  bookAppointment: lang === "fr" ? "+ Prendre rendez-vous" : "+ Book appointment",
  doctor: lang === "fr" ? "Médecin" : "Doctor",
  date: lang === "fr" ? "Date" : "Date",
  time: lang === "fr" ? "Heure" : "Time",
  type: lang === "fr" ? "Type" : "Type",
  scheduled: lang === "fr" ? "Planifié" : "Scheduled",
  cancelled: lang === "fr" ? "Annulé" : "Cancelled",

  // Billing
  newInvoice: lang === "fr" ? "+ Nouvelle facture" : "+ New invoice",
  invoiceNumber: lang === "fr" ? "N° facture" : "Invoice number",
  amount: lang === "fr" ? "Montant" : "Amount",
  paid: lang === "fr" ? "Payé" : "Paid",
  unpaid: lang === "fr" ? "Impayé" : "Unpaid",
  totalRevenue: lang === "fr" ? "Revenu total" : "Total revenue",
  outstanding: lang === "fr" ? "En attente" : "Outstanding",

  // Team
  addStaff: lang === "fr" ? "+ Ajouter personnel" : "+ Add staff",
  name: lang === "fr" ? "Nom" : "Name",
  email: lang === "fr" ? "Email" : "Email",
  role: lang === "fr" ? "Rôle" : "Role",
  added: lang === "fr" ? "Ajouté" : "Added",
  remove: lang === "fr" ? "Retirer" : "Remove",

  // General
  save: lang === "fr" ? "Enregistrer" : "Save",
  cancel: lang === "fr" ? "Annuler" : "Cancel",
  loading: lang === "fr" ? "Chargement..." : "Loading...",
  saving: lang === "fr" ? "Enregistrement..." : "Saving...",
  noData: lang === "fr" ? "Aucune donnée" : "No data",
  back: lang === "fr" ? "← Retour" : "← Back",
  logout: lang === "fr" ? "Déconnexion" : "Log out",

  // Clinical AI
  analyzeCase: lang === "fr" ? "Analyser le cas →" : "Analyze case →",
  analyzing: lang === "fr" ? "Analyse en cours..." : "Analyzing...",
  symptoms: lang === "fr" ? "Symptômes *" : "Symptoms *",
  primaryDiagnosis: lang === "fr" ? "Diagnostic principal" : "Primary diagnosis",
  differentials: lang === "fr" ? "Diagnostics différentiels" : "Differential diagnoses",
  urgency: lang === "fr" ? "Urgence" : "Urgency",
  high: lang === "fr" ? "Élevée" : "High",
  medium: lang === "fr" ? "Moyenne" : "Medium",
  low: lang === "fr" ? "Faible" : "Low",
  drugGuidance: lang === "fr" ? "Recommandations médicamenteuses" : "Drug guidance",
  soapNote: lang === "fr" ? "Note SOAP" : "SOAP note",
  followUp: lang === "fr" ? "Suivi" : "Follow-up",
  redFlags: lang === "fr" ? "Signes d'alarme" : "Red flags",
});
