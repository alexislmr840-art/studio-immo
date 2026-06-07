"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ParametresPage() {
  const { user } = useUser();
  const [nomAgence, setNomAgence] = useState("");
  const [telephone, setTelephone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("studio_immo_agence");
    if (stored) {
      const parsed = JSON.parse(stored);
      setNomAgence(parsed.nomAgence || "");
      setTelephone(parsed.telephone || "");
    }
  }, []);

  function sauvegarder() {
    localStorage.setItem("studio_immo_agence", JSON.stringify({ nomAgence, telephone }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
            Configuration
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        </div>

        {/* Compte */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="text-sm font-semibold text-white">Compte</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-bold"
                style={{ background: "#c9a84c", color: "#0a0a0a" }}
              >
                {user?.firstName?.charAt(0)?.toUpperCase() ?? "A"}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: "#c9a84c" }}>Plan Gratuit — 10 générations offertes</span>
            </div>
          </div>
        </section>

        {/* Agence */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="text-sm font-semibold text-white">Agence</h2>
            <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Ces informations apparaissent sur vos visuels générés.
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                Nom de l'agence
              </label>
              <input
                value={nomAgence}
                onChange={(e) => setNomAgence(e.target.value)}
                placeholder="Agence Dupont Immobilier"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                Téléphone
              </label>
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
            </div>
            <button
              onClick={sauvegarder}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ background: saved ? "#1a3a1a" : "#c9a84c", color: saved ? "#4ade80" : "#0a0a0a", border: saved ? "1px solid #2d5a2d" : "none" }}
            >
              {saved ? "✓ Enregistré" : "Sauvegarder"}
            </button>
          </div>
        </section>

        {/* Plan */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="text-sm font-semibold text-white">Plan & facturation</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Plan Gratuit</p>
                <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  10 générations par mois · Visuels PNG inclus
                </p>
              </div>
              <a
                href="/tarifs"
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
                style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                Passer à Pro
              </a>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid #2a1a1a" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #2a1a1a" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#f87171" }}>Zone sensible</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              La suppression du compte est irréversible.
            </p>
            <button
              className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150"
              style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
              onClick={() => alert("Fonctionnalité disponible prochainement — contactez le support.")}
            >
              Supprimer mon compte
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
