"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard, Building, Sparkles, Calendar,
  CreditCard, Settings, Plus, Star, LogOut,
} from "lucide-react";

interface Props {
  prenom: string;
  initiale: string;
  email?: string;
}

const MAIN_NAV = [
  { href: "/dashboard",              label: "Vue d'ensemble", exact: true,  badge: null,      Icon: LayoutDashboard },
  { href: "/dashboard/biens",        label: "Mes biens",      exact: false, badge: null,      Icon: Building },
  { href: "/dashboard/statistiques", label: "Créations",      exact: false, badge: null,      Icon: Sparkles },
  { href: "/dashboard/calendrier",   label: "Calendrier",     exact: false, badge: "Bientôt", Icon: Calendar },
] as const;

const COMPTE_NAV = [
  { href: "/dashboard/abonnement", label: "Abonnement", exact: false, Icon: CreditCard },
  { href: "/dashboard/parametres", label: "Paramètres", exact: false, Icon: Settings },
] as const;

export default function Sidebar({ prenom, initiale, email }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function act(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0"
      style={{
        width: "200px", height: "100vh", position: "sticky", top: 0,
        background: "#1E1B2E", backgroundColor: "#1E1B2E",
        padding: "16px 12px", overflowY: "auto", gap: "3px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "6px 8px 18px", textDecoration: "none",
        }}
      >
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "#7C3AED", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0, fontSize: "13px", color: "white",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>Studio Immo</span>
      </Link>

      {/* CTA */}
      <Link
        href="/nouveau-bien"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          background: "#7C3AED", color: "white", borderRadius: "9px",
          padding: "9px 12px", fontSize: "12px", fontWeight: 500,
          textDecoration: "none", marginBottom: "14px",
        }}
      >
        <Plus size={13} /> Nouveau bien
      </Link>

      {/* Main nav */}
      <nav style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {MAIN_NAV.map(({ href, label, exact, badge, Icon }) => {
            const active = act(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  padding: "8px 10px", borderRadius: "8px",
                  fontSize: "12.5px", fontWeight: 500,
                  color: active ? "#C4B5FD" : "#9CA3AF",
                  background: active ? "rgba(124,58,237,0.25)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    background: "rgba(124,58,237,0.2)", color: "#A78BFA",
                    fontSize: "9px", fontWeight: 600, borderRadius: "4px",
                    padding: "1px 6px", marginLeft: "auto",
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <p style={{
          fontSize: "10px", color: "#6B7280", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "14px 10px 5px", margin: 0,
        }}>
          Compte
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {COMPTE_NAV.map(({ href, label, exact, Icon }) => {
            const active = act(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  padding: "8px 10px", borderRadius: "8px",
                  fontSize: "12.5px", fontWeight: 500,
                  color: active ? "#C4B5FD" : "#9CA3AF",
                  background: active ? "rgba(124,58,237,0.25)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Passer à Pro */}
      <Link
        href="/tarifs"
        style={{ textDecoration: "none", display: "block", marginTop: "auto", marginBottom: "10px" }}
      >
        <div style={{
          background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: "10px", padding: "11px 12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
            <Star size={12} color="#C4B5FD" />
            <span style={{ fontSize: "11.5px", fontWeight: 500, color: "#C4B5FD" }}>Passer à Pro</span>
          </div>
          <p style={{ fontSize: "10.5px", color: "#6B7280", lineHeight: 1.4, margin: "0 0 8px" }}>
            Jusqu'à 30 biens/mois dès 79€/mois
          </p>
          <div style={{
            background: "#7C3AED", color: "white", fontSize: "11px",
            borderRadius: "7px", padding: "6px", textAlign: "center", fontWeight: 500,
          }}>
            Découvrir →
          </div>
        </div>
      </Link>

      {/* User */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 8px 4px" }}>
        <Link
          href="/dashboard/parametres"
          style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "8px" }}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%", background: "#7C3AED",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 500, color: "white", flexShrink: 0,
          }}>
            {initiale}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {prenom}
            </p>
            {email && (
              <p style={{ fontSize: "10px", color: "#6B7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email}
              </p>
            )}
          </div>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: "6px", width: "100%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px", padding: "6px 10px", fontSize: "11px",
            color: "rgba(255,255,255,0.45)", cursor: "pointer",
          }}
        >
          <LogOut size={11} /> Se déconnecter
        </button>
      </div>
    </aside>
  );
}
