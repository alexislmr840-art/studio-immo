"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

interface Props {
  prenom: string;
  initiale: string;
  email?: string;
}

/* ── SVG icons ───────────────────────────────────────────────── */
function IcoGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function IcoBuilding() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function IcoSparkles() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M5 3l.6 1.8L7 5.5l-1.4.7L5 8l-.6-1.8L3 5.5l1.4-.7z"/>
      <path d="M19 15l.6 1.8 1.4.7-1.4.7L19 20l-.6-1.8-1.4-.7 1.4-.7z"/>
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IcoCard() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}
function IcoSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function IcoPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IcoStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IcoLogout() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

/* ── Nav data ────────────────────────────────────────────────── */
const MAIN_NAV = [
  { href: "/dashboard",              label: "Vue d'ensemble", exact: true,  badge: null,       icon: <IcoGrid /> },
  { href: "/dashboard/biens",        label: "Mes biens",      exact: false, badge: null,       icon: <IcoBuilding /> },
  { href: "/dashboard/statistiques", label: "Créations",      exact: false, badge: null,       icon: <IcoSparkles /> },
  { href: "/dashboard/calendrier",   label: "Calendrier",     exact: false, badge: "Bientôt",  icon: <IcoCalendar /> },
];

const COMPTE_NAV = [
  { href: "/dashboard/abonnement",  label: "Abonnement", exact: false, icon: <IcoCard /> },
  { href: "/dashboard/parametres",  label: "Paramètres", exact: false, icon: <IcoSettings /> },
];

/* ── Component ───────────────────────────────────────────────── */
export default function SidebarNav({ prenom, initiale, email }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function active(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 select-none flex-shrink-0"
      style={{
        width: "200px",
        background: "#F9FAFB",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #E5E7EB" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "6px",
            background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
            Studio <span style={{ color: "#7C3AED" }}>Immo</span>
          </span>
        </Link>
      </div>

      {/* Nouveau bien CTA */}
      <div style={{ padding: "12px 12px 4px" }}>
        <Link
          href="/nouveau-bien"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            background: "#7C3AED", color: "white", borderRadius: "8px",
            padding: "8px 10px", fontSize: "12px", fontWeight: 600,
            textDecoration: "none", width: "100%", boxSizing: "border-box",
            marginBottom: "12px",
          }}
        >
          <IcoPlus /> Nouveau bien
        </Link>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {MAIN_NAV.map(({ href, label, exact, badge, icon }) => {
            const isAct = active(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 10px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: isAct ? 500 : 400,
                  color: isAct ? "#7C3AED" : "#6B7280",
                  background: isAct ? "#EDE9FE" : "transparent",
                  textDecoration: "none", transition: "background 0.1s, color 0.1s",
                }}
                onMouseEnter={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; (e.currentTarget as HTMLElement).style.color = "#374151"; } }}
                onMouseLeave={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6B7280"; } }}
              >
                <span style={{ color: isAct ? "#7C3AED" : "#9CA3AF", flexShrink: 0 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    background: "#EDE9FE", color: "#7C3AED",
                    fontSize: "9px", fontWeight: 600,
                    borderRadius: "4px", padding: "1px 5px",
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Section COMPTE */}
        <p style={{
          fontSize: "10px", color: "#9CA3AF", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.08em",
          padding: "14px 10px 6px",
        }}>
          Compte
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {COMPTE_NAV.map(({ href, label, exact, icon }) => {
            const isAct = active(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 10px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: isAct ? 500 : 400,
                  color: isAct ? "#7C3AED" : "#6B7280",
                  background: isAct ? "#EDE9FE" : "transparent",
                  textDecoration: "none", transition: "background 0.1s, color 0.1s",
                }}
                onMouseEnter={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; (e.currentTarget as HTMLElement).style.color = "#374151"; } }}
                onMouseLeave={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6B7280"; } }}
              >
                <span style={{ color: isAct ? "#7C3AED" : "#9CA3AF", flexShrink: 0 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Passer à Pro */}
      <div style={{ padding: "8px 12px" }}>
        <Link
          href="/tarifs"
          style={{
            display: "block", textDecoration: "none",
            background: "#EDE9FE", borderRadius: "8px", padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
            <IcoStar />
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#7C3AED", margin: 0 }}>Passer à Pro</p>
          </div>
          <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.4, margin: 0 }}>
            Jusqu'à 30 biens/mois dès 79€/mois
          </p>
        </Link>
      </div>

      {/* User + logout */}
      <div style={{ padding: "10px 12px 16px", borderTop: "1px solid #E5E7EB" }}>
        <Link href="/dashboard/parametres" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", textDecoration: "none" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0,
          }}>
            {initiale}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {prenom}
            </p>
            {email && (
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email}
              </p>
            )}
          </div>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: "6px", width: "100%",
            background: "white", border: "1px solid #E5E7EB", borderRadius: "6px",
            padding: "6px 10px", fontSize: "12px", color: "#6B7280",
            cursor: "pointer", transition: "background 0.1s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
        >
          <IcoLogout /> Se déconnecter
        </button>
      </div>
    </aside>
  );
}
