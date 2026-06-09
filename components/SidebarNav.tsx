"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

interface Props {
  prenom: string;
  initiale: string;
  email?: string;
}

const NAV_GROUPS = [
  {
    label: null,
    items: [
      {
        href: "/dashboard",
        label: "Vue d'ensemble",
        exact: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        ),
      },
      {
        href: "/dashboard/biens",
        label: "Mes biens",
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
        ),
      },
      {
        href: "/dashboard/statistiques",
        label: "Statistiques",
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Compte",
    items: [
      {
        href: "/dashboard/abonnement",
        label: "Abonnement",
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        ),
      },
      {
        href: "/dashboard/parametres",
        label: "Paramètres",
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ),
      },
      {
        href: "/dashboard/profil",
        label: "Profil",
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
    ],
  },
];

export default function SidebarNav({ prenom, initiale, email }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function isActive(item: { href: string; exact: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className="hidden lg:flex w-60 flex-shrink-0 flex-col h-screen sticky top-0 select-none"
      style={{ background: "var(--bg-1)", borderRight: "1px solid var(--border-s)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid var(--border-s)" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
            style={{ background: "var(--gold)", boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">
            Studio <span style={{ color: "var(--gold)" }}>Immo</span>
          </span>
        </Link>
      </div>

      {/* CTA Nouveau bien */}
      <div className="px-4 py-3">
        <Link
          href="/nouveau-bien"
          className="btn btn-primary w-full text-xs"
          style={{ padding: "9px 14px" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau bien
        </Link>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="label px-2 mb-1.5" style={{ color: "var(--txt-4)" }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-all duration-150"
                    style={{
                      color: active ? "#fff" : "var(--txt-3)",
                      background: active ? "var(--gold-10)" : "transparent",
                      borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
                    }}
                  >
                    <span style={{ color: active ? "var(--gold)" : "var(--txt-4)", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade banner */}
      <div className="px-4 py-3">
        <Link
          href="/tarifs"
          className="block rounded-[12px] p-3.5 transition-all duration-200 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.06) 100%)",
            border: "1px solid var(--gold-20)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--gold)" }}>Passer à Pro</p>
          </div>
          <p style={{ fontSize: "11px", color: "var(--txt-4)", lineHeight: 1.4 }}>
            Jusqu'à 10 biens/mois dès 39€/mois
          </p>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border-s)", paddingTop: "14px" }}>
        <Link href="/dashboard/profil" className="flex items-center gap-2.5 mb-3 group">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform group-hover:scale-105"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            {initiale}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">{prenom}</p>
            {email && <p className="text-[11px] truncate" style={{ color: "var(--txt-4)" }}>{email}</p>}
          </div>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150"
          style={{ background: "var(--bg-2)", color: "var(--txt-3)", border: "1px solid var(--border-s)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--txt-3)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
