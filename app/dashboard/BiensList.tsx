"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface BienRow {
  id: string;
  titre: string;
  ville: string;
  prix: string | null;
  surface: string | null;
  created_at: string;
  latestGenId: string | null;
  photo_principale_url: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function BiensList() {
  const [biens, setBiens] = useState<BienRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBiens = useCallback(async () => {
    try {
      const res = await fetch("/api/biens", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBiens(data.biens ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBiens();
    window.addEventListener("focus", fetchBiens);
    return () => window.removeEventListener("focus", fetchBiens);
  }, [fetchBiens]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-white/40 text-sm">
      Chargement…
    </div>
  );

  if (biens.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{ background: "rgba(255,255,255,0.06)" }}>🏠</div>
      <p className="text-sm font-medium text-white/60">Aucun bien créé pour le moment</p>
      <p className="text-xs text-white/30">Ajoutez votre premier mandat pour générer 5 campagnes IA en 2 minutes.</p>
      <Link href="/nouveau-bien"
        className="mt-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-black"
        style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
        Créer mon premier bien
      </Link>
    </div>
  );

  return (
    <div>
      {biens.map((bien, i) => (
        <div key={bien.id}
          className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-150 hover:bg-white/[0.08] ${i < biens.length - 1 ? "border-b border-b-white/[0.06]" : ""}`}>

          {bien.photo_principale_url ? (
            <img src={bien.photo_principale_url} alt={bien.titre}
              className="h-16 w-24 flex-shrink-0 rounded-xl object-cover" />
          ) : (
            <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" }}>🏠</div>
          )}

          <Link href={`/biens/${bien.id}`} className="min-w-0 flex-1">
            <p className="truncate text-base font-bold leading-snug" style={{ color: "#f6c344" }}>
              {bien.titre}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-14 justify-center">
              <span className="rounded-md px-2 py-0.5 text-lg font-medium text-white/80"
                style={{ background: "rgba(255,255,255,0.10)" }}>
                📍 {bien.ville}
              </span>
              {bien.surface && (
                <span className="rounded-md px-2 py-0.5 text-lg font-medium text-white/70"
                  style={{ background: "rgba(255,255,255,0.07)" }}>
                  {bien.surface}
                </span>
              )}
              {bien.prix && (
                <span className="rounded-md px-2 py-0.5 text-lg font-semibold text-amber-300"
                  style={{ background: "rgba(251,191,36,0.12)" }}>
                  {bien.prix}
                </span>
              )}
            </div>
          </Link>

          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="hidden text-[11px] text-white/24 sm:block">{formatDate(bien.created_at)}</span>
            <Link href={`/biens/${bien.id}`}
              className="rounded-lg border border-white/14 bg-transparent px-3 py-1.5 text-[11px] font-medium text-white/45 transition-all hover:border-white/25 hover:text-white/75">
              Détails
            </Link>
            {bien.latestGenId && (
              <Link href={`/biens/${bien.id}/generations/${bien.latestGenId}`}
                className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-black transition-all"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                Résultats
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
