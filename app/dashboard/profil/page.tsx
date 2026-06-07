"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilPage() {
  const { user, isLoaded } = useUser();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const initiale = user?.firstName?.charAt(0)?.toUpperCase() ?? "A";
  const nom = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Agent";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  if (!isLoaded) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full animate-spin" style={{ border: "2px solid var(--bg-4)", borderTopColor: "var(--gold)" }}/>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div className="mx-auto space-y-6" style={{ maxWidth: "640px" }}>

        <div>
          <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Mon compte</p>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
            Profil
          </h1>
        </div>

        {/* Avatar & infos */}
        <div className="card p-6">
          <div className="flex items-center gap-5 mb-6">
            <div
              className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold"
              style={{ background: "var(--gold)", color: "#0a0a0a", boxShadow: "0 4px 16px rgba(201,168,76,0.3)" }}
            >
              {initiale}
            </div>
            <div>
              <h2 className="font-bold text-white" style={{ fontSize: "18px" }}>{nom}</h2>
              <p style={{ fontSize: "13px", color: "var(--txt-4)" }}>{email}</p>
              <div className="badge badge-gold mt-1.5">Plan Gratuit</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label">Prénom</label>
              <input className="input" defaultValue={user?.firstName ?? ""} disabled
                     style={{ opacity: 0.6, cursor: "not-allowed" }}/>
            </div>
            <div className="space-y-1.5">
              <label className="label">Nom</label>
              <input className="input" defaultValue={user?.lastName ?? ""} disabled
                     style={{ opacity: 0.6, cursor: "not-allowed" }}/>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="label">Email</label>
              <input className="input" defaultValue={email} disabled
                     style={{ opacity: 0.6, cursor: "not-allowed" }}/>
              <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>
                Modifiable depuis votre espace Clerk → Menu utilisateur
              </p>
            </div>
          </div>
        </div>

        {/* Stats profil */}
        <div className="card p-5">
          <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Activité du compte</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Membre depuis", val: createdAt },
              { label: "Plan actuel", val: "Gratuit" },
              { label: "Générations", val: "10 max/mois" },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
                <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{val}</p>
                <p className="label mt-1" style={{ color: "var(--txt-4)", fontSize: "10px" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sécurité */}
        <div className="card p-5">
          <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Sécurité</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl p-3.5"
                 style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                     style={{ background: "var(--ok-10)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white" style={{ fontSize: "13px" }}>Email vérifié</p>
                  <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>{email}</p>
                </div>
              </div>
              <span className="badge badge-ok">Actif</span>
            </div>

            <button
              onClick={handleSave}
              className="btn btn-secondary w-full"
              style={{ padding: "11px" }}
            >
              {saved ? "✓ Informations sauvegardées" : "Gérer via Clerk →"}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card p-5" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
          <h2 className="font-semibold mb-4" style={{ fontSize: "14px", color: "var(--err)" }}>Zone sensible</h2>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginBottom: "16px" }}>
            La suppression de votre compte est définitive. Toutes vos données seront effacées.
          </p>
          <button
            className="btn btn-danger"
            onClick={() => alert("Veuillez contacter le support pour supprimer votre compte.")}
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </main>
  );
}
