"use client";

import { useState } from "react";

interface Doc {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  status: "prêt" | "en_cours";
}

const SAMPLE_DOCS: Doc[] = [
  { id: 1, name: "Stratégie_ReseauxSociaux_Lyon.pdf", type: "PDF", size: "1.2 Mo", date: "Aujourd'hui", status: "prêt" },
  { id: 2, name: "Visuels_Campagne_Bordeaux.zip", type: "ZIP", size: "8.4 Mo", date: "Aujourd'hui", status: "prêt" },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: "#ef4444",
  ZIP: "#f59e0b",
  PNG: "#22c55e",
  DOC: "#3b82f6",
};

export default function DocumentsPage() {
  const [docs] = useState<Doc[]>(SAMPLE_DOCS);
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "860px" }}>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Stockage</p>
            <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
              Documents
            </h1>
          </div>
        </div>

        {/* Coming soon note */}
        <div
          className="mb-6 flex items-start gap-4 rounded-2xl p-5"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
               style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold mb-0.5" style={{ fontSize: "13px", color: "var(--gold)" }}>
              Stockage cloud — Bientôt disponible
            </p>
            <p style={{ fontSize: "12px", color: "var(--txt-4)", lineHeight: 1.6 }}>
              Retrouvez ici toutes vos stratégies, visuels et publications. Actuellement, les fichiers sont générés et téléchargés directement sur votre appareil.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="2" strokeLinecap="round"
               className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un document…"
            className="input pl-9"
          />
        </div>

        {/* Storage bar */}
        <div className="card p-4 mb-5 flex items-center gap-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--txt-3)" strokeWidth="1.8" strokeLinecap="round">
            <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
            <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3"/><line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3"/>
          </svg>
          <div className="flex-1">
            <div className="flex justify-between mb-1.5">
              <p style={{ fontSize: "12px", color: "var(--txt-3)" }}>Stockage utilisé</p>
              <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>9.6 Mo / ∞ (local)</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-4)" }}>
              <div className="h-full rounded-full" style={{ width: "15%", background: "var(--gold)" }}/>
            </div>
          </div>
        </div>

        {/* Document list */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ fontSize: "14px", color: "var(--txt-4)" }}>Aucun document trouvé.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 pb-2">
              <div className="flex-1 label">Nom</div>
              <div className="hidden sm:block w-16 text-right label">Taille</div>
              <div className="hidden md:block w-28 text-right label">Date</div>
              <div className="w-20 text-right label">Statut</div>
            </div>

            {filtered.map((doc) => {
              const ext = doc.type;
              const color = TYPE_COLORS[ext] ?? "var(--txt-3)";
              return (
                <div
                  key={doc.id}
                  className="card flex items-center gap-4 px-4 py-3.5 group cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-s)")}
                >
                  {/* Icon */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-bold text-xs"
                       style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                    {ext}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate" style={{ fontSize: "13px" }}>{doc.name}</p>
                  </div>

                  {/* Size */}
                  <p className="hidden sm:block w-16 text-right" style={{ fontSize: "12px", color: "var(--txt-4)" }}>{doc.size}</p>

                  {/* Date */}
                  <p className="hidden md:block w-28 text-right" style={{ fontSize: "12px", color: "var(--txt-4)" }}>{doc.date}</p>

                  {/* Status */}
                  <div className="w-20 text-right">
                    {doc.status === "prêt" ? (
                      <span className="badge badge-ok">Prêt</span>
                    ) : (
                      <span className="badge badge-warn">En cours</span>
                    )}
                  </div>

                  {/* Download */}
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    style={{ color: "var(--txt-4)" }}
                    onClick={() => alert("Téléchargement depuis la page résultats.")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
