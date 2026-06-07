"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

interface Props {
  prenom: string;
  initiale: string;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/nouveau-bien",
    label: "Nouveau bien",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    exact: false,
  },
  {
    href: "/dashboard/statistiques",
    label: "Statistiques",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    exact: false,
  },
  {
    href: "/dashboard/parametres",
    label: "Paramètres",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    exact: false,
  },
];

export default function SidebarNav({ prenom, initiale }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className="hidden lg:flex w-64 flex-shrink-0 flex-col h-screen sticky top-0"
      style={{ background: "#0d0d0d", borderRight: "1px solid #1a1a1a" }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          Studio{" "}
          <span style={{ color: "#c9a84c" }}>Immo</span>
        </Link>
        <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Marketing immobilier IA
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent",
              }}
            >
              <span style={{ color: active ? "#c9a84c" : "rgba(255,255,255,0.35)" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4" style={{ borderTop: "1px solid #1a1a1a", marginTop: "16px" }}>
          <Link
            href="/tarifs"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
            style={{ color: "#c9a84c", background: "rgba(201,168,76,0.08)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Passer à Pro
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #1a1a1a" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            {initiale}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{prenom}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
              Plan Gratuit
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="rounded-md p-1.5 transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            title="Se déconnecter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
