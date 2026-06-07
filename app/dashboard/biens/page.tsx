"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Bien {
  id: string;
  titre: string;
  ville: string;
  prix: string;
  surface: string;
  status: "actif" | "vendu" | "en_attente";
  campagnes: number;
  visuels: number;
  isFromStorage?: boolean;
}

type View = "grid" | "list";
type SortKey = "titre" | "ville" | "prix";

const DEMO_BIENS: Bien[] = [];

function StatusBadge({ status }: { status: Bien["status"] }) {
  const map = {
    actif: { label: "Actif", className: "badge-ok" },
    vendu: { label: "Vendu", className: "badge-muted" },
    en_attente: { label: "En attente", className: "badge-warn" },
  };
  const { label, className } = map[status];
  return <span className={`badge ${className}`}>{label}</span>;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
           style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      </div>
      <h3 className="font-semibold text-white mb-2" style={{ fontSize: "16px" }}>
        Aucun bien pour le moment
      </h3>
      <p style={{ fontSize: "13px", color: "var(--txt-4)", maxWidth: "320px", lineHeight: 1.7, marginBottom: "20px" }}>
        Ajoutez votre premier mandat pour que l'IA génère une stratégie complète avec publications et visuels.
      </p>
      <Link href="/nouveau-bien" className="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter un bien
      </Link>
    </div>
  );
}

function BienCardGrid({ bien, onDelete }: { bien: Bien; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="card card-lift overflow-hidden group relative">
      {/* Photo placeholder */}
      <div
        className="h-44 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--bg-3) 0%, var(--bg-4) 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--bg-4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
        </div>
        <div className="absolute top-3 left-3">
          <StatusBadge status={bien.status} />
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-all opacity-0 group-hover:opacity-100"
              style={{ background: "rgba(10,10,10,0.8)", color: "var(--txt-2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-8 rounded-xl p-1 w-40 z-10"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
              >
                <Link href="/resultats" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                      style={{ color: "var(--txt-2)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-3)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                      onClick={() => setMenuOpen(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Voir résultats
                </Link>
                <Link href="/nouveau-bien" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                      style={{ color: "var(--txt-2)" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-3)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                      onClick={() => setMenuOpen(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Nouvelle campagne
                </Link>
                <div className="my-1 divider"/>
                <button
                  onClick={() => { onDelete(bien.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                  style={{ color: "var(--err)" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--err-10)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-0.5 truncate" style={{ fontSize: "14px" }}>{bien.titre}</h3>
        <p style={{ fontSize: "12px", color: "var(--txt-4)", marginBottom: "10px" }}>
          📍 {bien.ville}
          {bien.surface && ` · ${bien.surface}`}
        </p>

        {bien.prix && (
          <p className="font-bold mb-3" style={{ fontSize: "16px", color: "var(--gold)", letterSpacing: "-0.01em" }}>
            {bien.prix}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="text-center">
              <p className="font-bold text-white" style={{ fontSize: "16px" }}>{bien.campagnes}</p>
              <p style={{ fontSize: "9px", color: "var(--txt-4)" }} className="label">campagnes</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white" style={{ fontSize: "16px" }}>{bien.visuels}</p>
              <p style={{ fontSize: "9px", color: "var(--txt-4)" }} className="label">visuels</p>
            </div>
          </div>

          <Link href="/resultats" className="btn btn-secondary" style={{ padding: "7px 12px", fontSize: "12px" }}>
            Voir →
          </Link>
        </div>
      </div>
    </div>
  );
}

function BienRowList({ bien, onDelete }: { bien: Bien; onDelete: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-150 group"
      style={{ background: "var(--bg-1)", border: "1px solid var(--border-s)" }}
      onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--border)")}
      onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border-s)")}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
           style={{ background: "var(--bg-3)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--txt-3)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate" style={{ fontSize: "13px" }}>{bien.titre}</p>
        <p style={{ fontSize: "11.5px", color: "var(--txt-4)" }}>{bien.ville}{bien.surface && ` · ${bien.surface}`}</p>
      </div>

      {/* Price */}
      <div className="hidden sm:block w-28 text-right">
        {bien.prix ? (
          <p className="font-semibold" style={{ fontSize: "14px", color: "var(--gold)" }}>{bien.prix}</p>
        ) : (
          <p style={{ fontSize: "13px", color: "var(--txt-4)" }}>—</p>
        )}
      </div>

      {/* Status */}
      <div className="hidden md:block w-24 text-center">
        <StatusBadge status={bien.status} />
      </div>

      {/* Campagnes */}
      <div className="hidden lg:block w-20 text-center">
        <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{bien.campagnes}</p>
        <p style={{ fontSize: "10px", color: "var(--txt-4)" }}>campagnes</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href="/resultats" className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: "12px" }}>
          Résultats
        </Link>
        <button
          onClick={() => onDelete(bien.id)}
          className="btn btn-ghost"
          style={{ padding: "6px 8px", color: "var(--err)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function BiensPage() {
  const [biens, setBiens] = useState<Bien[]>(DEMO_BIENS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"tous" | Bien["status"]>("tous");
  const [view, setView] = useState<View>("grid");
  const [sort, setSort] = useState<SortKey>("titre");

  useEffect(() => {
    const resultat = localStorage.getItem("studio_immo_resultat");
    const bienData = localStorage.getItem("studio_immo_bien");
    if (resultat && bienData) {
      try {
        const parsed = JSON.parse(resultat);
        const bien = JSON.parse(bienData);
        const nbCampagnes = parsed?.publications?.length ?? 0;
        setBiens([
          {
            id: "local-1",
            titre: bien.titre || "Bien immobilier",
            ville: bien.ville || "—",
            prix: bien.prix || "",
            surface: bien.surface || "",
            status: "actif",
            campagnes: nbCampagnes,
            visuels: nbCampagnes * 2,
            isFromStorage: true,
          },
        ]);
      } catch { /* ignore */ }
    }
  }, []);

  const filtered = biens
    .filter((b) => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.titre.toLowerCase().includes(q) || b.ville.toLowerCase().includes(q);
      const matchStatus = statusFilter === "tous" || b.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sort === "titre") return a.titre.localeCompare(b.titre);
      if (sort === "ville") return a.ville.localeCompare(b.ville);
      return 0;
    });

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce bien et ses données ?")) return;
    setBiens((prev) => prev.filter((b) => b.id !== id));
    if (id === "local-1") {
      localStorage.removeItem("studio_immo_resultat");
      localStorage.removeItem("studio_immo_bien");
    }
  }

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "1100px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Gestion</p>
            <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
              Mes biens
            </h1>
          </div>
          <Link href="/nouveau-bien" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Ajouter un bien
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="2" strokeLinecap="round"
                 className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un bien…"
              className="input pl-9"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
            {(["tous", "actif", "en_attente", "vendu"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
                style={{
                  background: statusFilter === s ? "var(--bg-4)" : "transparent",
                  color: statusFilter === s ? "var(--txt-1)" : "var(--txt-4)",
                }}
              >
                {s === "tous" ? "Tous" : s === "actif" ? "Actifs" : s === "en_attente" ? "En attente" : "Vendus"}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input w-auto text-xs"
            style={{ padding: "9px 12px", minWidth: "120px", cursor: "pointer" }}
          >
            <option value="titre">Trier par nom</option>
            <option value="ville">Trier par ville</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
            {([
              { v: "grid", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
              { v: "list", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg> },
            ] as { v: View; icon: React.ReactNode }[]).map(({ v, icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  background: view === v ? "var(--bg-4)" : "transparent",
                  color: view === v ? "var(--txt-1)" : "var(--txt-4)",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          biens.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="py-16 text-center">
              <p style={{ color: "var(--txt-4)", fontSize: "14px" }}>
                Aucun bien ne correspond à votre recherche.
              </p>
            </div>
          )
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BienCardGrid key={b.id} bien={b} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* List header */}
            <div className="flex items-center gap-4 px-4 pb-2">
              <div className="w-10 flex-shrink-0"/>
              <div className="flex-1 label">Bien</div>
              <div className="hidden sm:block w-28 text-right label">Prix</div>
              <div className="hidden md:block w-24 text-center label">Statut</div>
              <div className="hidden lg:block w-20 text-center label">Activité</div>
              <div className="w-24"/>
            </div>
            {filtered.map((b) => (
              <BienRowList key={b.id} bien={b} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Count */}
        {biens.length > 0 && (
          <p className="mt-5 text-right" style={{ fontSize: "12px", color: "var(--txt-4)" }}>
            {filtered.length} bien{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </main>
  );
}
