"use client";

import { useState } from "react";

interface Notif {
  id: number;
  type: "success" | "info" | "warning";
  title: string;
  body: string;
  date: string;
  read: boolean;
}

const INITIAL: Notif[] = [
  {
    id: 1,
    type: "success",
    title: "Stratégie générée avec succès",
    body: "5 campagnes et 10 publications ont été créées pour votre bien. Téléchargez vos visuels depuis la page résultats.",
    date: "Aujourd'hui",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Bienvenue sur Studio Immo",
    body: "Découvrez toutes les fonctionnalités de la plateforme. Créez votre premier bien pour générer votre première stratégie.",
    date: "Il y a 1j",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Crédits bientôt épuisés",
    body: "Il vous reste moins de 3 générations ce mois-ci. Passez au plan Solo ou Équipe pour des générations illimitées.",
    date: "Il y a 3j",
    read: true,
  },
];

const TYPE_STYLES = {
  success: { bg: "var(--ok-10)", border: "rgba(34,197,94,0.2)", color: "var(--ok)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
  info:    { bg: "var(--blue-10)", border: "rgba(59,130,246,0.2)", color: "var(--blue)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  warning: { bg: "var(--warn-10)", border: "rgba(245,158,11,0.2)", color: "var(--warn)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const unreadCount = notifs.filter((n) => !n.read).length;

  function markAll() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: number) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "700px" }}>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Activité</p>
            <h1 className="font-bold text-white tracking-tight flex items-center gap-3" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
              Notifications
              {unreadCount > 0 && (
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "var(--gold)", color: "#0a0a0a" }}
                >
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAll} className="btn btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }}>
              Tout marquer comme lu
            </button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                 style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-1.5" style={{ fontSize: "15px" }}>Aucune notification</h3>
            <p style={{ fontSize: "13px", color: "var(--txt-4)" }}>Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifs.map((n) => {
              const style = TYPE_STYLES[n.type];
              return (
                <div
                  key={n.id}
                  className="card flex items-start gap-4 p-4 transition-all duration-200"
                  style={{ opacity: n.read ? 0.55 : 1 }}
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{n.title}</p>
                      {!n.read && <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }}/>}
                    </div>
                    <p style={{ fontSize: "12.5px", color: "var(--txt-3)", lineHeight: 1.6 }}>{n.body}</p>
                    <p className="mt-1.5" style={{ fontSize: "11px", color: "var(--txt-4)" }}>{n.date}</p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-3)]"
                    style={{ color: "var(--txt-4)" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
