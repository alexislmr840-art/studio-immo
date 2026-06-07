"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  plan: string;
  prenom: string;
  nom: string;
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" /><path d="M3 12v9h18v-9" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-6" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconCrown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 19l2-9 4 4 4-8 4 8 4-4 2 9H2z" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: <IconHome /> },
  { href: "/nouveau-bien", label: "Biens", icon: <IconBuilding /> },
  { href: "/dashboard/statistiques", label: "Statistiques", icon: <IconChart /> },
  { href: "/dashboard/parametres", label: "Paramètres", icon: <IconSettings /> },
];

export default function Sidebar({ plan, prenom, nom }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen flex-col border-r border-white/[0.06] transition-all duration-300"
      style={{
        width: expanded ? "240px" : "68px",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
      }}
    >
      {/* Logo + burger */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
        {expanded && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M3 12L12 3l9 9v9H3v-9z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide text-white">Studio Immo</span>
          </div>
        )}
        {!expanded && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M3 12L12 3l9 9v9H3v-9z" />
            </svg>
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          style={{ marginLeft: expanded ? "0" : "auto" }}
        >
          <IconMenu />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150"
              style={{
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                color: active ? "#c9a84c" : "rgba(255,255,255,0.45)",
                borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent",
              }}
              title={!expanded ? item.label : undefined}
            >
              <span className="flex-shrink-0" style={{ color: active ? "#c9a84c" : "rgba(255,255,255,0.4)" }}>
                {item.icon}
              </span>
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bloc Premium / plan */}
      <div className="p-3 border-t border-white/[0.06]">
        {plan === "free" ? (
          <Link href="/tarifs" className="block rounded-xl p-3 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="flex items-center gap-2 text-amber-400">
              <IconCrown />
              {expanded && <span className="text-xs font-bold">Passez à Premium</span>}
            </div>
            {expanded && (
              <>
                <p className="mt-1 text-[11px] text-white/40">Plus d&apos;outils, plus de visibilité.</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                  <span>Découvrir</span>
                  <IconChevron />
                </div>
              </>
            )}
          </Link>
        ) : (
          <div className="rounded-xl p-3" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <div className="flex items-center gap-2 text-amber-400">
              <IconCrown />
              {expanded && <span className="text-xs font-bold">{plan === "equipe" ? "Plan Équipe" : "Plan Solo"}</span>}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
