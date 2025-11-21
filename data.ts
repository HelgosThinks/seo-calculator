import { ServiceData, CategoryGroup } from './types';

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: 'init_global', label: 'Initial: OnPage Global / Technisches Setup', type: 'one-time', calculationMethod: 'global' },
  { id: 'init_offpage_global', label: 'Initial: OffPage / Externe Signale', type: 'one-time', calculationMethod: 'global' },
  { id: 'init_single', label: 'Initial: Pro Seite Optimierung', type: 'one-time', calculationMethod: 'per-page' },
  { id: 'run_global', label: 'Laufend: Monitoring & Reporting', type: 'monthly', calculationMethod: 'global' },
  { id: 'run_single', label: 'Laufend: Content Pflege', type: 'monthly', calculationMethod: 'per-page' },
  { id: 'run_offpage_global', label: 'Laufend: Linkaufbau & PR', type: 'monthly', calculationMethod: 'global' },
];

export const RAW_SERVICES_DATA: ServiceData[] = [
  // --- 1. INITIAL ONPAGE / GLOBAL ---
  { id: "arch", name: "Themenstruktur & URL-Logik", category: "init_global", defaultHours: 2.0, presets: ["essential", "advanced", "premium"] },
  { id: "tech_setup", name: "XML-Sitemap, Robots.txt, SSL", category: "init_global", defaultHours: 1.0, presets: ["essential", "advanced", "premium"] },
  { id: "perf", name: "PageSpeed & Core Web Vitals Check", category: "init_global", defaultHours: 3.0, presets: ["essential", "advanced", "premium"] },
  { id: "schema_glob", name: "Globales Schema (Organization, LocalBiz)", category: "init_global", defaultHours: 1.0, presets: ["essential", "advanced", "premium"] },
  { id: "ux_setup", name: "Setup UX-Tools (Heatmaps/Clarity)", category: "init_global", defaultHours: 0.5, presets: ["advanced", "premium"] },

  // --- 2. INITIAL OFFPAGE / GLOBAL ---
  { id: "gbp_setup", name: "Google Business Profil Setup", category: "init_offpage_global", defaultHours: 2.5, presets: ["essential", "advanced", "premium"] },
  { id: "dir_sub", name: "Eintragung Branchenverzeichnisse", category: "init_offpage_global", defaultHours: 2.0, presets: ["advanced", "premium"] },
  { id: "bl_audit", name: "Backlink-Audit (Status Quo)", category: "init_offpage_global", defaultHours: 1.5, presets: ["advanced", "premium"] },

  // --- 3. INITIAL ONPAGE / PRO SEITE (Variabel) ---
  { id: "meta", name: "Meta-Daten (Title/Desc.)", category: "init_single", defaultHours: 0.3, presets: ["essential", "advanced", "premium"] },
  { id: "content_struct", name: "Content-Struktur & Semantik", category: "init_single", defaultHours: 0.5, presets: ["essential", "advanced", "premium"] },
  { id: "ki_opt", name: "KI-Optimierung (Answer Targets)", category: "init_single", defaultHours: 0.5, presets: ["essential", "advanced", "premium"] },
  { id: "eeat", name: "E-E-A-T (Autoren, Quellen)", category: "init_single", defaultHours: 0.3, presets: ["essential", "advanced", "premium"] },
  { id: "faq", name: "FAQ-Blöcke & Schema", category: "init_single", defaultHours: 0.4, presets: ["essential", "advanced", "premium"] },
  { id: "int_link", name: "Interne Verlinkung Strategie", category: "init_single", defaultHours: 0.3, presets: ["advanced", "premium"] },

  // --- 4. LAUFENDE PFLEGE (Global & Single) ---
  { id: "mon_tech", name: "Technisches Monitoring", category: "run_global", defaultHours: 0.5, presets: ["advanced", "premium"] },
  { id: "rep", name: "Reporting & Analyse", category: "run_global", defaultHours: 1.0, presets: ["advanced", "premium"] },
  { id: "cont_upd", name: "Content Freshness Updates", category: "run_single", defaultHours: 0.2, presets: ["premium"] },
  { id: "link_build", name: "Aktiver Linkaufbau", category: "run_offpage_global", defaultHours: 4.0, presets: ["premium"] }
];