"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type Tab = "agence" | "notifications" | "affichage";

export default function ParametresPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("agence");
  const [nomAgence, setNomAgence] = useState("");
  const [telephone, setTelephone] = useState("");
  const [saved, setSaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [displayPrix, setDisplayPrix] = useState(true);

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

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const TABS: { key: Tab; label: string }[] = [
    { key: "agence", label: "Agence" },
    { key: "notifications", label: "Notifications" },
    { key: "affichage", label: "Affichage" },
  ];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "700px" }}>

        <div className="mb-8">
          <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Configuration</p>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
            Paramètres
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)", display: "inline-flex" }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150"
              style={{
                background: tab === key ? "var(--bg-4)" : "transparent",
                color: tab === key ? "var(--txt-1)" : "var(--txt-4)",
                border: tab === key ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Agence tab ─────────────────────────────────── */}
        {tab === "agence" && (
          <div className="space-y-5 animate-scale-in">
            {/* Compte Clerk */}
            <div className="card p-5">
              <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>
                Compte
              </h2>
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-bold"
                  style={{ background: "var(--gold)", color: "#0a0a0a", fontSize: "16px" }}
                >
                  {user?.firstName?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate" style={{ fontSize: "14px" }}>
                    {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Agent"}
                  </p>
                  <p className="truncate" style={{ fontSize: "12px", color: "var(--txt-4)" }}>
                    {user?.primaryEmailAddress?.emailAddress ?? ""}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--txt-4)", marginTop: "2px" }}>
                    Membre depuis le {createdAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Agence */}
            <div className="card p-5">
              <div className="mb-4">
                <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Informations agence</h2>
                <p style={{ fontSize: "12px", color: "var(--txt-4)", marginTop: "2px" }}>
                  Ces informations apparaissent sur tous vos visuels générés.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="label">Nom de l'agence</label>
                  <input
                    value={nomAgence}
                    onChange={(e) => setNomAgence(e.target.value)}
                    placeholder="Agence Dupont Immobilier"
                    className="input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Téléphone</label>
                  <input
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="input"
                  />
                </div>
                <button
                  onClick={sauvegarder}
                  className="btn"
                  style={saved
                    ? { background: "var(--ok-10)", color: "var(--ok)", border: "1px solid rgba(34,197,94,0.2)", padding: "10px 18px" }
                    : { background: "var(--gold)", color: "#0a0a0a", padding: "10px 18px" }
                  }
                >
                  {saved ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Enregistré</>
                  ) : "Sauvegarder"}
                </button>
              </div>
            </div>

            {/* Plan */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white mb-0.5" style={{ fontSize: "14px" }}>Plan & facturation</h2>
                  <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>Plan Gratuit · 1 bien gratuit</p>
                </div>
                <Link href="/tarifs" className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "12px" }}>
                  Passer à Pro →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Notifications tab ──────────────────────────── */}
        {tab === "notifications" && (
          <div className="space-y-4 animate-scale-in">
            <div className="card p-5">
              <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Préférences de notification</h2>
              <div className="space-y-3">
                {[
                  {
                    label: "Notifications par email",
                    desc: "Recevez un email quand une stratégie est générée.",
                    value: notifEmail,
                    set: setNotifEmail,
                  },
                  {
                    label: "Notifications push",
                    desc: "Alertes en temps réel dans le navigateur.",
                    value: notifPush,
                    set: setNotifPush,
                  },
                ].map(({ label, desc, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl p-4"
                    style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}
                  >
                    <div>
                      <p className="font-medium text-white" style={{ fontSize: "13px" }}>{label}</p>
                      <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>{desc}</p>
                    </div>
                    <button
                      onClick={() => set(!value)}
                      className="flex h-6 w-11 items-center rounded-full transition-all duration-200 flex-shrink-0"
                      style={{
                        background: value ? "var(--gold)" : "var(--bg-4)",
                        padding: "2px",
                        justifyContent: value ? "flex-end" : "flex-start",
                      }}
                    >
                      <div className="h-5 w-5 rounded-full transition-all" style={{ background: value ? "#0a0a0a" : "var(--txt-4)" }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Affichage tab ──────────────────────────────── */}
        {tab === "affichage" && (
          <div className="space-y-4 animate-scale-in">
            <div className="card p-5">
              <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Préférences d'affichage</h2>
              <div
                className="flex items-center justify-between rounded-xl p-4"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}
              >
                <div>
                  <p className="font-medium text-white" style={{ fontSize: "13px" }}>Afficher le prix par défaut</p>
                  <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>Pré-cocher "Afficher le prix" lors de la création d'un bien.</p>
                </div>
                <button
                  onClick={() => setDisplayPrix(!displayPrix)}
                  className="flex h-6 w-11 items-center rounded-full transition-all duration-200 flex-shrink-0"
                  style={{
                    background: displayPrix ? "var(--gold)" : "var(--bg-4)",
                    padding: "2px",
                    justifyContent: displayPrix ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="h-5 w-5 rounded-full transition-all" style={{ background: displayPrix ? "#0a0a0a" : "var(--txt-4)" }}/>
                </button>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-white mb-1" style={{ fontSize: "14px" }}>Thème</h2>
              <p style={{ fontSize: "12px", color: "var(--txt-4)", marginBottom: "12px" }}>Sélectionnez le thème de l'interface.</p>
              <div className="flex gap-2">
                {["Sombre", "Système"].map((t, i) => (
                  <button
                    key={t}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                    style={i === 0
                      ? { background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }
                      : { background: "var(--bg-2)", color: "var(--txt-4)", border: "1px solid var(--border-s)" }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="card p-5 mt-6" style={{ borderColor: "rgba(239,68,68,0.12)" }}>
          <h2 className="font-semibold mb-3" style={{ fontSize: "14px", color: "var(--err)" }}>Zone sensible</h2>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginBottom: "14px" }}>
            La suppression de votre compte est permanente et irréversible.
          </p>
          <button
            className="btn btn-danger"
            onClick={() => alert("Contactez le support pour supprimer votre compte.")}
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </main>
  );
}
