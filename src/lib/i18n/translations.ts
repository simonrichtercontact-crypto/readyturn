import type { Locale } from "./locales";

export interface T {
  nav: { features: string; howItWorks: string; pricing: string; signIn: string; startFree: string };
  hero: {
    badge: string; h1a: string; h1b: string; sub: string;
    cta1: string; cta2: string;
    trust: [string, string, string];
  };
  stats: [string, string, string, string];
  statLabels: [string, string, string, string];
  problem: { tag: string; title: string; items: string[] };
  solution: { tag: string; title: string; items: string[] };
  features: {
    tag: string; title: string; sub: string;
    items: { title: string; desc: string }[];
  };
  workflow: {
    tag: string; title: string;
    steps: { title: string; desc: string }[];
  };
  compare: { title: string; sub: string; rows: { bad: string; good: string }[] };
  testimonials: {
    tag: string; title: string;
    items: { quote: string; name: string; role: string }[];
  };
  pricing: {
    tag: string; title: string; sub: string;
    free: { name: string; desc: string; cta: string; features: string[] };
    pro: { name: string; desc: string; cta: string; features: string[] };
    business: { name: string; desc: string; cta: string; features: string[] };
    forever: string; month: string; popular: string;
  };
  cta: { title: string; sub: string; btn1: string; btn2: string; trust: [string, string, string] };
  footer: { built: string };
}

const en: T = {
  nav: { features: "Features", howItWorks: "How it works", pricing: "Pricing", signIn: "Sign in", startFree: "Start free" },
  hero: {
    badge: "Built for property management teams",
    h1a: "Turn vacant units",
    h1b: "ready. Fast.",
    sub: "ReadyTurn replaces your scattered spreadsheets and WhatsApp threads with one clean platform to manage turnovers, assign tasks, track costs, and get units rent-ready faster.",
    cta1: "Start free — no card needed",
    cta2: "Sign in to workspace",
    trust: ["Free forever plan", "No credit card", "Up and running in 5 min"],
  },
  stats: ["2,400+", "18%", "340+", "4.9★"],
  statLabels: ["Units managed", "Faster turnarounds", "Property managers", "Average rating"],
  problem: {
    tag: "The problem",
    title: "Make-ready chaos is costing you money every day",
    items: [
      "Turnovers tracked in spreadsheets that are always outdated",
      "Vendors sending status via WhatsApp — nothing is in one place",
      "Nobody knows which tasks are blocked or overdue",
      "Units sit vacant longer than they should — lost rent income",
      "No visibility into actual vs. estimated repair costs",
    ],
  },
  solution: {
    tag: "The solution",
    title: "One workspace. Every turnover.",
    items: [
      "Every turnover tracked with status, priority, and due dates",
      "Tasks assigned to vendors with full visibility for your team",
      "Automatic alerts for blocked and overdue work",
      "Photo uploads to document inspection and progress",
      "Cost tracking — estimated vs. actual per turnover",
    ],
  },
  features: {
    tag: "Features",
    title: "Everything your team needs",
    sub: "Built specifically for property management make-ready workflows — not generic project management tools.",
    items: [
      { title: "Turnover Management", desc: "Create and track every turnover from move-out to rent-ready. Status, priority, and due dates visible at a glance." },
      { title: "Task Tracking", desc: "Add granular tasks — cleaning, painting, repairs, lock changes. Assign each to a vendor or team member." },
      { title: "Cost Tracking", desc: "Set estimated costs per task. Log actual costs when done. See over/under budget per turnover instantly." },
      { title: "Photo Documentation", desc: "Upload before/after photos directly to the turnover record. No more photos lost in random folders." },
      { title: "Live Dashboard", desc: "Active turnovers, overdue work, blocked tasks, ready units — your whole portfolio at a glance." },
      { title: "Team & Vendors", desc: "Invite your whole team. Assign roles — admin, member, or viewer. Manage who sees what." },
      { title: "Task Templates", desc: "Create standard checklists for any unit type. Apply a template to any new turnover in one click." },
      { title: "CSV Export", desc: "Export all turnover data with costs and task completion to CSV for your own reports." },
      { title: "Secure & Isolated", desc: "Full data isolation per company. Your data is completely separated from other workspaces." },
    ],
  },
  workflow: {
    tag: "Workflow",
    title: "From move-out to rent-ready in 4 steps",
    steps: [
      { title: "Tenant moves out — create a turnover", desc: "Log the unit, move-out date, and target ready date. Set urgency. The unit automatically enters make-ready status." },
      { title: "Add tasks and assign them", desc: "Add every task needed: trash removal, painting, carpet, cleaning, lock change. Set estimated costs. Assign to the right person." },
      { title: "Track progress — catch blockers instantly", desc: "Update task status as work gets done. Flag anything blocked so it appears on the dashboard immediately." },
      { title: "Mark ready — unit back on the market", desc: "When all work is done, mark the turnover ready. Document with photos. Unit status updates automatically." },
    ],
  },
  compare: {
    title: "Why ReadyTurn beats spreadsheets",
    sub: "Spreadsheets can't tell you what's blocked, who's responsible, or what needs action today.",
    rows: [
      { bad: "Status updates that go stale instantly", good: "Real-time status visible to your whole team" },
      { bad: "No alerts when tasks are overdue", good: "Dashboard shows exactly what needs action today" },
      { bad: "Photos scattered across WhatsApp and emails", good: "Photos organized by unit and turnover" },
      { bad: "No idea who's doing what or by when", good: "Every task assigned with due dates and accountability" },
      { bad: "No cost visibility until the invoice arrives", good: "Estimated vs. actual costs tracked per turnover" },
      { bad: "No audit trail of what happened", good: "Full activity log for every action on every turnover" },
    ],
  },
  testimonials: {
    tag: "Testimonials",
    title: "What property managers say",
    items: [
      { quote: "We cut our average turnover time from 12 days to 8. Having everything in one place instead of WhatsApp groups made the difference.", name: "Sarah M.", role: "Portfolio Manager · 42 units" },
      { quote: "The cost tracking feature alone saved us from two contractors who kept going over budget. Now we catch it before it's too late.", name: "James R.", role: "Property Owner · 3 buildings" },
      { quote: "I used to manage everything in Excel. ReadyTurn took 10 minutes to set up and now my whole team is on the same page every morning.", name: "Linda K.", role: "Regional Supervisor · 120 units" },
    ],
  },
  pricing: {
    tag: "Pricing", title: "Simple, transparent pricing",
    sub: "Start free. Upgrade when your portfolio grows. No hidden fees, no contracts.",
    forever: "/ forever", month: "/ month", popular: "Most Popular",
    free: { name: "Free", desc: "Perfect to get started", cta: "Get started free", features: ["1 property", "Up to 5 units", "3 active turnovers", "Basic task management", "Activity log"] },
    pro: { name: "Pro", desc: "For growing portfolios", cta: "Start Pro trial", features: ["Up to 10 properties", "Up to 100 units", "Unlimited turnovers", "Up to 5 team members", "Photo uploads", "Task templates", "CSV export", "Cost tracking"] },
    business: { name: "Business", desc: "For large teams", cta: "Start Business trial", features: ["Unlimited everything", "Unlimited team members", "Advanced analytics", "Priority support", "Custom branding", "CSV export", "Cost tracking"] },
  },
  cta: {
    title: "Stop losing revenue to slow turnovers",
    sub: "Get your team on the same page. Start your free workspace in 5 minutes.",
    btn1: "Create free workspace", btn2: "Sign in",
    trust: ["Free 14-day trial", "No credit card", "Cancel anytime"],
  },
  footer: { built: "Built for property managers." },
};

const de: T = {
  nav: { features: "Funktionen", howItWorks: "So funktioniert's", pricing: "Preise", signIn: "Anmelden", startFree: "Kostenlos starten" },
  hero: {
    badge: "Für Hausverwaltungsteams entwickelt",
    h1a: "Leerstände schneller",
    h1b: "vermieten.",
    sub: "ReadyTurn ersetzt Ihre verstreuten Tabellen und WhatsApp-Gruppen durch eine saubere Plattform für Wohnungsübergaben, Aufgabenverwaltung, Kostenerfassung und schnellere Mietbereitschaft.",
    cta1: "Kostenlos starten — ohne Kreditkarte",
    cta2: "Zum Arbeitsbereich anmelden",
    trust: ["Dauerhaft kostenloser Plan", "Keine Kreditkarte", "In 5 Minuten startklar"],
  },
  stats: ["2.400+", "18%", "340+", "4,9★"],
  statLabels: ["Verwaltete Einheiten", "Schnellere Übergaben", "Hausverwalter", "Durchschnittsbewertung"],
  problem: {
    tag: "Das Problem",
    title: "Chaos bei Wohnungsübergaben kostet Sie täglich Geld",
    items: [
      "Übergaben in Tabellen verfolgt, die immer veraltet sind",
      "Handwerker schicken Status per WhatsApp — nichts ist an einem Ort",
      "Niemand weiß, welche Aufgaben blockiert oder überfällig sind",
      "Wohnungen stehen länger leer als nötig — verlorene Mieteinnahmen",
      "Keine Übersicht über tatsächliche vs. geschätzte Reparaturkosten",
    ],
  },
  solution: {
    tag: "Die Lösung",
    title: "Ein Arbeitsbereich. Jede Übergabe.",
    items: [
      "Jede Übergabe mit Status, Priorität und Fälligkeitsdaten verfolgt",
      "Aufgaben an Handwerker vergeben — volles Transparent für Ihr Team",
      "Automatische Alerts für blockierte und überfällige Arbeiten",
      "Foto-Uploads zur Dokumentation von Inspektionen und Fortschritten",
      "Kostenerfassung — geschätzte vs. tatsächliche Kosten pro Übergabe",
    ],
  },
  features: {
    tag: "Funktionen",
    title: "Alles was Ihr Team braucht",
    sub: "Speziell für Wohnungsübergaben entwickelt — kein generisches Projektmanagement-Tool.",
    items: [
      { title: "Übergabeverwaltung", desc: "Jede Übergabe von Auszug bis Mietbereitschaft verwalten. Status, Priorität und Fälligkeiten auf einen Blick." },
      { title: "Aufgabenverfolgung", desc: "Einzelne Aufgaben hinzufügen — Reinigung, Streichen, Reparaturen, Schlossaustausch. Handwerkern zuweisen." },
      { title: "Kostenerfassung", desc: "Geschätzte Kosten pro Aufgabe setzen. Tatsächliche Kosten erfassen. Über-/Unterbudget sofort sehen." },
      { title: "Fotodokumentation", desc: "Vorher/Nachher-Fotos direkt zur Übergabe hochladen. Keine Fotos mehr in verstreuten Ordnern." },
      { title: "Live-Dashboard", desc: "Aktive Übergaben, überfällige Arbeiten, blockierte Aufgaben, mietbereite Einheiten — auf einen Blick." },
      { title: "Team & Handwerker", desc: "Ganzes Team einladen. Rollen zuweisen — Admin, Mitglied oder Betrachter." },
      { title: "Aufgaben-Vorlagen", desc: "Standardchecklisten für jeden Wohnungstyp erstellen. Mit einem Klick auf neue Übergaben anwenden." },
      { title: "CSV-Export", desc: "Alle Übergabedaten mit Kosten und Aufgabenabschluss für eigene Berichte exportieren." },
      { title: "Sicher & Isoliert", desc: "Vollständige Datentrennung pro Unternehmen. Ihre Daten sind komplett isoliert." },
    ],
  },
  workflow: {
    tag: "Ablauf",
    title: "Von Auszug bis Mietbereitschaft in 4 Schritten",
    steps: [
      { title: "Mieter zieht aus — Übergabe erstellen", desc: "Einheit, Auszugsdatum und Zieldatum erfassen. Dringlichkeit festlegen. Einheit wird automatisch auf Übergabe-Status gesetzt." },
      { title: "Aufgaben hinzufügen und zuweisen", desc: "Alle nötigen Aufgaben hinzufügen: Entsorgung, Streichen, Teppich, Reinigung, Schlossaustausch. Geschätzte Kosten setzen." },
      { title: "Fortschritt verfolgen — Blockaden sofort erkennen", desc: "Aufgabenstatus aktualisieren. Alles Blockierte markieren — erscheint sofort im Dashboard." },
      { title: "Mietbereit markieren — Einheit zurück auf den Markt", desc: "Wenn alle Arbeiten erledigt sind, Übergabe als bereit markieren. Mit Fotos dokumentieren." },
    ],
  },
  compare: {
    title: "Warum ReadyTurn besser ist als Tabellen",
    sub: "Tabellen können Ihnen nicht sagen, was blockiert ist, wer verantwortlich ist oder was heute zu tun ist.",
    rows: [
      { bad: "Statusaktualisierungen, die sofort veralten", good: "Echtzeit-Status für Ihr gesamtes Team sichtbar" },
      { bad: "Keine Alerts bei überfälligen Aufgaben", good: "Dashboard zeigt genau, was heute zu tun ist" },
      { bad: "Fotos verstreut in WhatsApp und E-Mails", good: "Fotos nach Einheit und Übergabe organisiert" },
      { bad: "Keine Ahnung, wer was bis wann macht", good: "Jede Aufgabe zugewiesen mit Fälligkeiten" },
      { bad: "Keine Kostentransparenz bis zur Rechnung", good: "Geschätzte vs. tatsächliche Kosten pro Übergabe" },
      { bad: "Kein Prüfpfad was passiert ist", good: "Vollständiges Aktivitätsprotokoll für jede Übergabe" },
    ],
  },
  testimonials: {
    tag: "Bewertungen",
    title: "Was Hausverwalter sagen",
    items: [
      { quote: "Wir haben unsere durchschnittliche Übergabezeit von 12 auf 8 Tage reduziert. Alles an einem Ort statt in WhatsApp-Gruppen hat den Unterschied gemacht.", name: "Sarah M.", role: "Portfolio-Managerin · 42 Einheiten" },
      { quote: "Die Kostenerfassung allein hat uns vor zwei Handwerkern gerettet, die ständig das Budget überschritten. Jetzt merken wir es rechtzeitig.", name: "James R.", role: "Immobilieneigentümer · 3 Gebäude" },
      { quote: "Ich habe früher alles in Excel verwaltet. ReadyTurn war in 10 Minuten eingerichtet und jetzt ist mein ganzes Team jeden Morgen auf dem gleichen Stand.", name: "Linda K.", role: "Regionalleiterin · 120 Einheiten" },
    ],
  },
  pricing: {
    tag: "Preise", title: "Einfache, transparente Preise",
    sub: "Kostenlos starten. Upgraden wenn Ihr Portfolio wächst. Keine versteckten Gebühren.",
    forever: "/ für immer", month: "/ Monat", popular: "Am beliebtesten",
    free: { name: "Kostenlos", desc: "Perfekt zum Einstieg", cta: "Kostenlos starten", features: ["1 Immobilie", "Bis zu 5 Einheiten", "3 aktive Übergaben", "Basis-Aufgabenverwaltung", "Aktivitätsprotokoll"] },
    pro: { name: "Pro", desc: "Für wachsende Portfolios", cta: "Pro-Testversion starten", features: ["Bis zu 10 Immobilien", "Bis zu 100 Einheiten", "Unbegrenzte Übergaben", "Bis zu 5 Teammitglieder", "Foto-Uploads", "Aufgaben-Vorlagen", "CSV-Export", "Kostenerfassung"] },
    business: { name: "Business", desc: "Für große Teams", cta: "Business-Test starten", features: ["Alles unbegrenzt", "Unbegrenzte Teammitglieder", "Erweiterte Analysen", "Prioritätssupport", "Individuelles Branding", "CSV-Export", "Kostenerfassung"] },
  },
  cta: {
    title: "Hören Sie auf, Einnahmen durch langsame Übergaben zu verlieren",
    sub: "Bringen Sie Ihr Team auf den gleichen Stand. Starten Sie Ihren kostenlosen Arbeitsbereich in 5 Minuten.",
    btn1: "Kostenlosen Arbeitsbereich erstellen", btn2: "Anmelden",
    trust: ["14-tägige kostenlose Testversion", "Keine Kreditkarte", "Jederzeit kündbar"],
  },
  footer: { built: "Für Hausverwalter entwickelt." },
};

const es: T = {
  nav: { features: "Funciones", howItWorks: "Cómo funciona", pricing: "Precios", signIn: "Iniciar sesión", startFree: "Empezar gratis" },
  hero: {
    badge: "Diseñado para equipos de gestión inmobiliaria",
    h1a: "Prepara unidades vacías",
    h1b: "más rápido.",
    sub: "ReadyTurn reemplaza tus hojas de cálculo y grupos de WhatsApp con una plataforma limpia para gestionar renovaciones, asignar tareas, controlar costes y tener las unidades listas antes.",
    cta1: "Empezar gratis — sin tarjeta",
    cta2: "Acceder al espacio de trabajo",
    trust: ["Plan gratuito permanente", "Sin tarjeta de crédito", "Listo en 5 minutos"],
  },
  stats: ["2.400+", "18%", "340+", "4,9★"],
  statLabels: ["Unidades gestionadas", "Renovaciones más rápidas", "Gestores inmobiliarios", "Valoración media"],
  problem: {
    tag: "El problema",
    title: "El caos en las renovaciones te cuesta dinero cada día",
    items: [
      "Renovaciones rastreadas en hojas de cálculo siempre desactualizadas",
      "Proveedores enviando estado por WhatsApp — nada está en un solo lugar",
      "Nadie sabe qué tareas están bloqueadas o vencidas",
      "Las unidades están vacías más tiempo del necesario — ingresos perdidos",
      "Sin visibilidad sobre costes reales vs. estimados",
    ],
  },
  solution: {
    tag: "La solución",
    title: "Un espacio de trabajo. Cada renovación.",
    items: [
      "Cada renovación con estado, prioridad y fechas límite",
      "Tareas asignadas a proveedores con visibilidad total para tu equipo",
      "Alertas automáticas para trabajos bloqueados y vencidos",
      "Subida de fotos para documentar inspecciones y progreso",
      "Control de costes — estimados vs. reales por renovación",
    ],
  },
  features: {
    tag: "Funciones",
    title: "Todo lo que tu equipo necesita",
    sub: "Diseñado específicamente para flujos de trabajo de renovación inmobiliaria — no herramientas genéricas.",
    items: [
      { title: "Gestión de renovaciones", desc: "Crea y rastrea cada renovación desde la salida hasta estar lista para alquilar." },
      { title: "Seguimiento de tareas", desc: "Añade tareas detalladas — limpieza, pintura, reparaciones. Asígnalas a proveedores." },
      { title: "Control de costes", desc: "Establece costes estimados. Registra costes reales. Ve sobre/bajo presupuesto al instante." },
      { title: "Documentación fotográfica", desc: "Sube fotos antes/después directamente al registro de renovación." },
      { title: "Panel en tiempo real", desc: "Renovaciones activas, trabajo vencido, tareas bloqueadas, unidades listas — de un vistazo." },
      { title: "Equipo y proveedores", desc: "Invita a todo tu equipo. Asigna roles — admin, miembro o espectador." },
      { title: "Plantillas de tareas", desc: "Crea listas de verificación estándar. Aplica una plantilla a cualquier renovación con un clic." },
      { title: "Exportación CSV", desc: "Exporta todos los datos de renovación con costes para tus propios informes." },
      { title: "Seguro y aislado", desc: "Aislamiento completo de datos por empresa. Tus datos son completamente privados." },
    ],
  },
  workflow: {
    tag: "Flujo de trabajo",
    title: "De la salida del inquilino a lista para alquilar en 4 pasos",
    steps: [
      { title: "El inquilino sale — crea una renovación", desc: "Registra la unidad, fecha de salida y fecha objetivo. Establece urgencia." },
      { title: "Añade tareas y asígnalas", desc: "Añade todas las tareas necesarias: vaciado, pintura, limpieza, cambio de cerradura." },
      { title: "Sigue el progreso — detecta bloqueos al instante", desc: "Actualiza el estado de las tareas. Marca lo bloqueado para que aparezca en el panel." },
      { title: "Marca como lista — unidad de vuelta al mercado", desc: "Cuando todo está listo, marca la renovación como completada. Documenta con fotos." },
    ],
  },
  compare: {
    title: "Por qué ReadyTurn supera a las hojas de cálculo",
    sub: "Las hojas de cálculo no pueden decirte qué está bloqueado, quién es responsable o qué necesita acción hoy.",
    rows: [
      { bad: "Actualizaciones de estado que se quedan obsoletas", good: "Estado en tiempo real visible para todo tu equipo" },
      { bad: "Sin alertas cuando las tareas están vencidas", good: "El panel muestra exactamente qué necesita atención hoy" },
      { bad: "Fotos dispersas en WhatsApp y emails", good: "Fotos organizadas por unidad y renovación" },
      { bad: "Sin saber quién hace qué ni para cuándo", good: "Cada tarea asignada con fechas y responsabilidad" },
      { bad: "Sin visibilidad de costes hasta la factura", good: "Costes estimados vs. reales rastreados por renovación" },
      { bad: "Sin rastro de auditoría de lo sucedido", good: "Registro completo de actividad para cada renovación" },
    ],
  },
  testimonials: {
    tag: "Testimonios",
    title: "Lo que dicen los gestores inmobiliarios",
    items: [
      { quote: "Redujimos nuestro tiempo medio de renovación de 12 a 8 días. Tener todo en un solo lugar en vez de grupos de WhatsApp marcó la diferencia.", name: "Sarah M.", role: "Gestora de cartera · 42 unidades" },
      { quote: "El seguimiento de costes solo nos salvó de dos contratistas que siempre se pasaban del presupuesto. Ahora lo detectamos a tiempo.", name: "James R.", role: "Propietario · 3 edificios" },
      { quote: "Antes lo gestionaba todo en Excel. ReadyTurn tardó 10 minutos en configurarse y ahora todo mi equipo está alineado cada mañana.", name: "Linda K.", role: "Supervisora regional · 120 unidades" },
    ],
  },
  pricing: {
    tag: "Precios", title: "Precios simples y transparentes",
    sub: "Empieza gratis. Actualiza cuando crezca tu cartera. Sin tarifas ocultas.",
    forever: "/ para siempre", month: "/ mes", popular: "Más popular",
    free: { name: "Gratis", desc: "Perfecto para empezar", cta: "Empezar gratis", features: ["1 propiedad", "Hasta 5 unidades", "3 renovaciones activas", "Gestión básica de tareas", "Registro de actividad"] },
    pro: { name: "Pro", desc: "Para carteras en crecimiento", cta: "Iniciar prueba Pro", features: ["Hasta 10 propiedades", "Hasta 100 unidades", "Renovaciones ilimitadas", "Hasta 5 miembros del equipo", "Subida de fotos", "Plantillas de tareas", "Exportación CSV", "Control de costes"] },
    business: { name: "Business", desc: "Para equipos grandes", cta: "Iniciar prueba Business", features: ["Todo ilimitado", "Miembros ilimitados", "Análisis avanzados", "Soporte prioritario", "Marca personalizada", "Exportación CSV", "Control de costes"] },
  },
  cta: {
    title: "Deja de perder ingresos por renovaciones lentas",
    sub: "Pon a tu equipo en la misma página. Crea tu espacio de trabajo gratuito en 5 minutos.",
    btn1: "Crear espacio de trabajo gratis", btn2: "Iniciar sesión",
    trust: ["Prueba gratuita de 14 días", "Sin tarjeta de crédito", "Cancela cuando quieras"],
  },
  footer: { built: "Diseñado para gestores inmobiliarios." },
};

const fr: T = {
  nav: { features: "Fonctionnalités", howItWorks: "Comment ça marche", pricing: "Tarifs", signIn: "Se connecter", startFree: "Commencer gratuitement" },
  hero: {
    badge: "Conçu pour les équipes de gestion immobilière",
    h1a: "Remettez les logements vacants",
    h1b: "sur le marché. Vite.",
    sub: "ReadyTurn remplace vos tableurs éparpillés et groupes WhatsApp par une plateforme claire pour gérer les remises en état, assigner les tâches, suivre les coûts et louer plus vite.",
    cta1: "Démarrer gratuitement — sans carte",
    cta2: "Accéder à mon espace",
    trust: ["Plan gratuit permanent", "Sans carte bancaire", "Opérationnel en 5 min"],
  },
  stats: ["2 400+", "18%", "340+", "4,9★"],
  statLabels: ["Logements gérés", "Remises en état plus rapides", "Gestionnaires", "Note moyenne"],
  problem: {
    tag: "Le problème",
    title: "Le chaos des remises en état vous coûte de l'argent chaque jour",
    items: [
      "Remises en état suivies dans des tableurs toujours obsolètes",
      "Prestataires qui envoient des mises à jour via WhatsApp — rien n'est centralisé",
      "Personne ne sait quelles tâches sont bloquées ou en retard",
      "Les logements restent vacants trop longtemps — pertes de loyers",
      "Aucune visibilité sur les coûts réels vs. estimés",
    ],
  },
  solution: {
    tag: "La solution",
    title: "Un espace de travail. Chaque remise en état.",
    items: [
      "Chaque remise en état suivie avec statut, priorité et échéances",
      "Tâches assignées aux prestataires avec visibilité totale pour votre équipe",
      "Alertes automatiques pour les travaux bloqués et en retard",
      "Photos uploadées pour documenter les inspections et l'avancement",
      "Suivi des coûts — estimés vs. réels par remise en état",
    ],
  },
  features: {
    tag: "Fonctionnalités",
    title: "Tout ce dont votre équipe a besoin",
    sub: "Conçu spécifiquement pour les remises en état immobilières — pas un outil de gestion de projet générique.",
    items: [
      { title: "Gestion des remises en état", desc: "Créez et suivez chaque remise en état du départ à la mise en location. Statut, priorité et échéances visibles d'un coup d'œil." },
      { title: "Suivi des tâches", desc: "Ajoutez des tâches précises — nettoyage, peinture, réparations, serrure. Assignez à chaque prestataire." },
      { title: "Suivi des coûts", desc: "Définissez les coûts estimés. Enregistrez les coûts réels. Voyez le dépassement ou l'économie instantanément." },
      { title: "Documentation photo", desc: "Uploadez des photos avant/après directement au dossier de remise en état. Fini les photos perdues." },
      { title: "Tableau de bord en direct", desc: "Remises actives, travaux en retard, tâches bloquées, logements prêts — tout votre portefeuille d'un coup d'œil." },
      { title: "Équipe & prestataires", desc: "Invitez toute votre équipe. Attribuez des rôles — admin, membre ou observateur." },
      { title: "Modèles de tâches", desc: "Créez des check-lists standards. Appliquez un modèle à chaque nouvelle remise en état en un clic." },
      { title: "Export CSV", desc: "Exportez toutes les données avec coûts et avancement des tâches pour vos propres rapports." },
      { title: "Sécurisé & isolé", desc: "Isolation complète des données par entreprise. Vos données sont totalement privées." },
    ],
  },
  workflow: {
    tag: "Processus",
    title: "Du départ du locataire à la mise en location en 4 étapes",
    steps: [
      { title: "Le locataire part — créez une remise en état", desc: "Enregistrez le logement, la date de départ et la date cible. Définissez l'urgence." },
      { title: "Ajoutez les tâches et assignez-les", desc: "Ajoutez toutes les tâches : évacuation, peinture, moquette, nettoyage, serrure. Définissez les coûts estimés." },
      { title: "Suivez l'avancement — détectez les blocages instantanément", desc: "Mettez à jour le statut des tâches. Signalez tout blocage pour qu'il apparaisse immédiatement sur le tableau de bord." },
      { title: "Marquez prêt — logement de retour sur le marché", desc: "Quand tout est fait, marquez la remise en état comme terminée. Documentez avec des photos." },
    ],
  },
  compare: {
    title: "Pourquoi ReadyTurn surpasse les tableurs",
    sub: "Les tableurs ne peuvent pas vous dire ce qui est bloqué, qui est responsable ou ce qui nécessite une action aujourd'hui.",
    rows: [
      { bad: "Mises à jour de statut qui deviennent obsolètes", good: "Statut en temps réel visible par toute votre équipe" },
      { bad: "Pas d'alertes pour les tâches en retard", good: "Le tableau de bord montre exactement ce qui est urgent" },
      { bad: "Photos éparpillées dans WhatsApp et emails", good: "Photos organisées par logement et remise en état" },
      { bad: "Impossible de savoir qui fait quoi et pour quand", good: "Chaque tâche assignée avec échéance et responsabilité" },
      { bad: "Aucune visibilité sur les coûts avant la facture", good: "Coûts estimés vs. réels suivis par remise en état" },
      { bad: "Aucune trace de ce qui s'est passé", good: "Journal d'activité complet pour chaque action" },
    ],
  },
  testimonials: {
    tag: "Témoignages",
    title: "Ce que disent les gestionnaires",
    items: [
      { quote: "Nous avons réduit notre temps moyen de remise en état de 12 à 8 jours. Centraliser tout au lieu d'utiliser WhatsApp a tout changé.", name: "Sarah M.", role: "Gestrice de portefeuille · 42 logements" },
      { quote: "Le suivi des coûts seul nous a sauvés de deux artisans qui dépassaient systématiquement le budget. Maintenant on le voit à temps.", name: "James R.", role: "Propriétaire · 3 immeubles" },
      { quote: "Je gérais tout dans Excel. ReadyTurn a été configuré en 10 minutes et toute mon équipe est alignée chaque matin.", name: "Linda K.", role: "Supervisrice régionale · 120 logements" },
    ],
  },
  pricing: {
    tag: "Tarifs", title: "Des tarifs simples et transparents",
    sub: "Commencez gratuitement. Évoluez quand votre portefeuille grandit. Aucun frais caché.",
    forever: "/ pour toujours", month: "/ mois", popular: "Le plus populaire",
    free: { name: "Gratuit", desc: "Parfait pour démarrer", cta: "Commencer gratuitement", features: ["1 propriété", "Jusqu'à 5 logements", "3 remises actives", "Gestion basique des tâches", "Journal d'activité"] },
    pro: { name: "Pro", desc: "Pour les portefeuilles en croissance", cta: "Démarrer l'essai Pro", features: ["Jusqu'à 10 propriétés", "Jusqu'à 100 logements", "Remises illimitées", "Jusqu'à 5 membres", "Upload de photos", "Modèles de tâches", "Export CSV", "Suivi des coûts"] },
    business: { name: "Business", desc: "Pour les grandes équipes", cta: "Démarrer l'essai Business", features: ["Tout illimité", "Membres illimités", "Analytiques avancées", "Support prioritaire", "Marque personnalisée", "Export CSV", "Suivi des coûts"] },
  },
  cta: {
    title: "Arrêtez de perdre des revenus à cause de remises en état trop lentes",
    sub: "Mettez toute votre équipe sur la même longueur d'onde. Créez votre espace gratuit en 5 minutes.",
    btn1: "Créer un espace gratuit", btn2: "Se connecter",
    trust: ["Essai gratuit 14 jours", "Sans carte bancaire", "Résiliable à tout moment"],
  },
  footer: { built: "Conçu pour les gestionnaires immobiliers." },
};

export const translations: Record<Locale, T> = { en, de, es, fr };

export function getT(locale: Locale): T {
  return translations[locale] ?? translations.en;
}
