"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CheckoutButton } from "@/app/tarifs/CheckoutButton";

const HOUSE_1 = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80";
const HOUSE_2 = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80";
const HOUSE_3 = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80";
const HOUSE_4 = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80";

/* ── Icons ───────────────────────────────────────────────────── */
function IcoHouse({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IcoFB() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
function IcoIG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="50%" stopColor="#e6683c"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="#e6683c" stroke="none"/>
    </svg>
  );
}

/* ── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,10,15,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcoHouse size={16} color="white" />
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Studio <span style={{ color: "#a78bfa" }}>Immo</span></span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#features" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Fonctionnalités</a>
          <Link href="/tarifs" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Tarifs</Link>
          <a href="#" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Ressources</a>
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/connexion" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Connexion</Link>
          <Link href="/inscription" style={{
            background: "#7C3AED", color: "white", borderRadius: "100px",
            padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none",
          }}>
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Section 1 : Hero ────────────────────────────────────────── */
function SectionHero() {
  return (
    <section style={{ background: "#0a0a0f", padding: "80px 40px 100px", width: "100%" }}>
      <div style={{ maxWidth: "100%", display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "32px", alignItems: "start" }}>

        {/* Colonne gauche : titre + CTA */}
        <div style={{ paddingTop: "16px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "24px",
            fontSize: "12px", color: "#a78bfa", fontWeight: 600,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#a78bfa"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Propulsé par GPT-4o
          </div>

          <h1 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.035em", marginBottom: "20px" }}>
            Une annonce.{" "}
            <span style={{ display: "block" }}>Des <span style={{ color: "#7C3AED" }}>semaines</span></span>
            de contenu.
          </h1>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "32px" }}>
            Studio Immo transforme chaque mandat en stratégie sociale complète — posts Facebook, Instagram, Stories et visuels PNG — en 15 secondes.
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
            <Link href="/inscription" style={{
              background: "#7C3AED", color: "white", borderRadius: "10px",
              padding: "13px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none",
              boxShadow: "0 0 24px rgba(124,58,237,0.35)",
            }}>
              Essayer gratuitement →
            </Link>
            <a href="#demo" style={{
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
              padding: "13px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none",
            }}>
              Voir un exemple
            </a>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {["Sans carte bancaire", "Prêt en quelques secondes", "Annulation à tout moment"].map(b => (
              <span key={b} style={{
                display: "flex", alignItems: "center", gap: "5px",
                fontSize: "11.5px", color: "rgba(255,255,255,0.45)",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Colonne centre : input card */}
        <div style={{
          background: "#111118", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "22px",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            1. Vos photos & description
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[HOUSE_1, HOUSE_2, HOUSE_3, HOUSE_4].map((src, i) => (
              <img key={i} src={src} alt="bien" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "10px" }} />
            ))}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px", padding: "10px 12px", marginBottom: "16px",
          }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Belle villa avec vue mer, 4 pièces, 120m², terrasse…</p>
          </div>

          {/* Flèche */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>
            </div>
          </div>

          {/* Badge Studio Immo */}
          <div style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.08) 100%)",
            border: "1px solid rgba(124,58,237,0.25)", borderRadius: "12px", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <IcoHouse size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>Studio Immo prépare vos contenus</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>IA en cours de traitement…</p>
            </div>
            <span style={{
              background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700,
            }}>
              15s
            </span>
          </div>
        </div>

        {/* Colonne droite : output card */}
        <div style={{
          background: "#111118", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "22px",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            2. Contenus prêts à publier
          </p>

          {/* Réseaux sociaux */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[
              { icon: <IcoFB />, label: "Facebook" },
              { icon: <IcoIG />, label: "Instagram" },
              { icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#e60023"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              ), label: "Pinterest" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "8px", padding: "6px 10px",
              }}>
                {icon}
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Mini-cards résultats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "Post Facebook", color: "#1877f2" },
              { label: "Post Instagram", color: "#bc1888" },
              { label: "Story", color: "#f59e0b" },
              { label: "Visuel PNG", color: "#10b981" },
            ].map(({ label, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px", padding: "10px", minHeight: "64px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{label}</span>
                </div>
                <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                  {[60, 80, 45, 70].map((w, i) => (
                    <div key={i} style={{ height: "4px", width: `${w}%`, background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                  ))}
                </div>
                <div style={{
                  marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "3px",
                  background: `${color}22`, borderRadius: "4px", padding: "2px 6px",
                }}>
                  <IcoCheck />
                  <span style={{ fontSize: "9px", color, fontWeight: 700 }}>Prêt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 2 : Tabs demo ───────────────────────────────────── */
const TABS = ["Facebook", "Instagram", "Stories", "Visuels"] as const;

function SectionTabs() {
  const [active, setActive] = useState<typeof TABS[number]>("Facebook");
  return (
    <section id="demo" style={{ background: "#ffffff", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          À partir d'un seul bien
        </p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginBottom: "36px" }}>
          Tous vos formats en une fois
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "36px", borderBottom: "1px solid #e5e7eb", paddingBottom: "0" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 22px", fontSize: "14px", fontWeight: 600,
                color: active === tab ? "#7C3AED" : "#6b7280",
                borderBottom: `2px solid ${active === tab ? "#7C3AED" : "transparent"}`,
                marginBottom: "-1px", transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {/* Card Facebook */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "14px 14px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0 }}>A</div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0 }}>Agence Immo</p>
                  <p style={{ fontSize: "10px", color: "#6b7280", margin: 0 }}>Il y a 2 heures · 🌐</p>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginBottom: "12px" }}>
                ✨ Nouveau mandat exclusif ! Belle villa lumineuse de 120m², 4 chambres, vue dégagée. Idéale famille. Prix : 385 000€. Visitez vite !
              </p>
            </div>
            <img src={HOUSE_1} alt="maison" style={{ width: "100%", height: "140px", objectFit: "cover" }} />
            <div style={{ padding: "10px 14px", borderTop: "1px solid #f3f4f6", display: "flex", gap: "14px" }}>
              {[["👍", "124"], ["💬", "18"], ["↗️", "34"]].map(([ico, n]) => (
                <span key={n} style={{ fontSize: "11px", color: "#6b7280" }}>{ico} {n}</span>
              ))}
            </div>
          </div>

          {/* Card Instagram */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <img src={HOUSE_2} alt="maison" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#f09433,#bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>A</div>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0 }}>agence_immo_officiel</p>
              </div>
              <p style={{ fontSize: "11.5px", color: "#374151", lineHeight: 1.55, marginBottom: "8px" }}>
                🏡 Villa de rêve disponible dès maintenant ! 120m², 4 chambres, terrasse. Lien en bio pour visiter. #immobilier #realestate #villa
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[["❤️", "892"], ["💬", "47"]].map(([ico, n]) => (
                  <span key={n} style={{ fontSize: "11px", color: "#6b7280" }}>{ico} {n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card Story */}
          <div style={{
            background: "linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)",
            border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px",
            minHeight: "260px", padding: "20px 16px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            overflow: "hidden", position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HOUSE_3})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                {[70, 100, 40].map((w, i) => (
                  <div key={i} style={{ height: "2px", flex: w, background: i === 0 ? "#7C3AED" : "rgba(255,255,255,0.25)", borderRadius: "2px" }} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>A</div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "white", margin: 0 }}>agence_immo</p>
              </div>
            </div>
            <div style={{ position: "relative", textAlign: "center" }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Nouveau bien</p>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "8px" }}>Villa<br/>120m²</p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#a78bfa", marginBottom: "12px" }}>385 000 €</p>
              <div style={{ background: "#7C3AED", borderRadius: "20px", padding: "7px 18px", display: "inline-block", fontSize: "11px", fontWeight: 700, color: "white" }}>
                Voir l'annonce ↗
              </div>
            </div>
          </div>

          {/* Card Visuel PNG */}
          <div style={{
            background: "white", border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "16px", overflow: "hidden",
          }}>
            <div style={{ background: "#1e1b4b", padding: "10px 14px", display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IcoHouse size={12} color="white" />
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "white", margin: 0 }}>Agence Immo</p>
              <span style={{ marginLeft: "auto", background: "#7C3AED", color: "white", borderRadius: "10px", fontSize: "9px", fontWeight: 700, padding: "2px 8px" }}>Coup de cœur</span>
            </div>
            <img src={HOUSE_4} alt="maison" style={{ width: "100%", height: "120px", objectFit: "cover" }} />
            <div style={{ padding: "10px 14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#111", marginBottom: "4px" }}>Villa lumineuse — Vue mer</p>
              <p style={{ fontSize: "10px", color: "#6b7280", marginBottom: "8px" }}>Cannes · 120 m² · 4 pièces</p>
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", color: "#6b7280" }}>📍 Cannes</span>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#1e1b4b" }}>385 000 €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 3 : Comparaison ─────────────────────────────────── */
function SectionComparison() {
  const OLD = [
    ["Sélection des photos", "10 min"],
    ["Création du visuel", "15 min"],
    ["Rédaction des textes", "10 min"],
    ["Adaptation des formats", "5 min"],
    ["Publications", "5 min"],
    ["Total", "45 min"],
  ];
  const NEW = [
    ["Importez vos photos", "5 sec"],
    ["Ajoutez une description", "10 sec"],
    ["Studio Immo prépare", "—"],
    ["Publiez partout", "—"],
    ["", ""],
    ["Total", "15 sec"],
  ];
  return (
    <section style={{ background: "#0a0a0f", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "40px", alignItems: "center" }}>

        {/* Titre gauche */}
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Gain de temps
          </p>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Gagnez un temps précieux.{" "}
            <span style={{ color: "#7C3AED" }}>Concentrez-vous sur vos clients.</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: "16px" }}>
            Chaque bien publié sans Studio Immo vous coûte 45 minutes. Avec nous, c'est 15 secondes.
          </p>
        </div>

        {/* Tableau ancienne méthode */}
        <div style={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>⏱️</span>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: 0 }}>L'ancienne méthode</p>
          </div>
          {OLD.map(([label, time], i) => (
            <div
              key={i}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 18px",
                borderTop: i === 5 ? "1px solid rgba(255,255,255,0.1)" : "none",
                background: i === 5 ? "rgba(255,255,255,0.03)" : "transparent",
              }}
            >
              <span style={{ fontSize: "12.5px", color: i === 5 ? "white" : "rgba(255,255,255,0.55)", fontWeight: i === 5 ? 700 : 400 }}>{label}</span>
              <span style={{ fontSize: "12.5px", color: i === 5 ? "#ef4444" : "rgba(255,255,255,0.4)", fontWeight: i === 5 ? 700 : 400 }}>{time}</span>
            </div>
          ))}
        </div>

        {/* Tableau Studio Immo */}
        <div style={{ background: "linear-gradient(160deg, #4c1d95 0%, #3b0764 100%)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", top: "50%", left: "-28px", transform: "translateY(-50%)",
            width: "50px", height: "50px", borderRadius: "50%",
            background: "#0a0a0f", border: "2px solid rgba(124,58,237,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 800, color: "#a78bfa", zIndex: 1,
          }}>
            VS
          </div>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IcoHouse size={13} color="white" />
            </div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: 0 }}>Avec Studio Immo</p>
          </div>
          {NEW.map(([label, time], i) => (
            <div
              key={i}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 18px",
                borderTop: i === 5 ? "1px solid rgba(255,255,255,0.15)" : "none",
                background: i === 5 ? "rgba(0,0,0,0.2)" : "transparent",
                visibility: label === "" ? "hidden" : "visible",
              }}
            >
              <span style={{ fontSize: "12.5px", color: i === 5 ? "white" : "rgba(255,255,255,0.75)", fontWeight: i === 5 ? 700 : 400 }}>{label}</span>
              <span style={{ fontSize: "12.5px", color: i === 5 ? "#a78bfa" : "rgba(255,255,255,0.6)", fontWeight: i === 5 ? 700 : 400 }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 4 : Découvrez ───────────────────────────────────── */
function SectionSteps() {
  const STEPS = [
    {
      n: "1", title: "Nouveau bien",
      sub: "Renseignez titre, ville, surface, prix, description et photos en quelques secondes.",
      screen: (
        <svg viewBox="0 0 280 160" style={{ width: "100%", borderRadius: "10px" }}>
          <rect width="280" height="160" fill="#111118"/>
          <rect x="12" y="12" width="100" height="8" rx="3" fill="rgba(124,58,237,0.4)"/>
          <rect x="12" y="28" width="256" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          <rect x="20" y="36" width="80" height="6" rx="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="12" y="72" width="256" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          <rect x="20" y="80" width="120" height="6" rx="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="12" y="116" width="80" height="28" rx="8" fill="#7C3AED"/>
          <rect x="22" y="125" width="60" height="6" rx="2" fill="rgba(255,255,255,0.8)"/>
        </svg>
      ),
    },
    {
      n: "2", title: "Résultats générés",
      sub: "L'IA produit 5 campagnes complètes avec accroches, textes FB/IG/Story et idées visuelles.",
      screen: (
        <svg viewBox="0 0 280 160" style={{ width: "100%", borderRadius: "10px" }}>
          <rect width="280" height="160" fill="#111118"/>
          {[0,1,2,3,4].map(i => (
            <g key={i}>
              <rect x="12" y={12 + i * 28} width="256" height="22" rx="6" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.2)" strokeWidth="1"/>
              <rect x="20" y={19 + i * 28} width="10" height="10" rx="5" fill="#7C3AED"/>
              <rect x="36" y={21 + i * 28} width="80" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
              <rect x="36" y={28 + i * 28} width="130" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
            </g>
          ))}
        </svg>
      ),
    },
    {
      n: "3", title: "Dashboard",
      sub: "Retrouvez tous vos biens, téléchargez vos visuels et suivez vos performances.",
      screen: (
        <svg viewBox="0 0 280 160" style={{ width: "100%", borderRadius: "10px" }}>
          <rect width="280" height="160" fill="#0a0a0f"/>
          <rect x="0" y="0" width="60" height="160" fill="#111118"/>
          {[0,1,2,3].map(i => (
            <rect key={i} x="8" y={16 + i * 32} width="44" height="22" rx="6" fill={i === 0 ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)"}/>
          ))}
          {[0,1,2,3].map(i => (
            <rect key={i} x="72" y={16 + i * 36} width={[120,90,110,80][i]} height="20" rx="5" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.2)" strokeWidth="1"/>
          ))}
          <rect x="72" y="160" width="0" height="0"/>
        </svg>
      ),
    },
  ];
  return (
    <section id="features" style={{ background: "#f9fafb", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Comment ça marche
        </p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginBottom: "56px" }}>
          Découvrez Studio Immo
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {STEPS.map(({ n, title, sub, screen }) => (
            <div key={n} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "24px", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {n}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h3>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.65, marginBottom: "16px" }}>{sub}</p>
              {screen}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 5 : 4 features ──────────────────────────────────── */
function SectionFeatures() {
  const FEATURES = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: "Gagnez du temps",
      desc: "45 minutes de travail ramenées à 15 secondes. Chaque bien traité instantanément par l'IA.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      title: "Soyez plus visible",
      desc: "Des contenus optimisés pour chaque réseau social augmentent l'engagement de vos annonces.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: "Valorisez chaque bien",
      desc: "Visuels 1080×1350 px avec votre logo, vos photos et les infos du bien. Qualité professionnelle.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      ),
      title: "100% immobilier",
      desc: "Formules spécialisées, vocabulaire métier, formats adaptés aux annonces immobilières.",
    },
  ];
  return (
    <section style={{ background: "#0a0a0f", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "48px" }}>
          Tout ce dont vous avez besoin
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", marginBottom: "16px" }}>
                {icon}
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "8px" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 6 : Tarifs ──────────────────────────────────────── */
function SectionPricing() {
  const { isSignedIn } = useAuth();
  const isLoggedIn = isSignedIn ?? false;

  const PLANS = [
    {
      id: "solo" as const,
      name: "Solo", price: "39", period: "/mois",
      desc: "L'essentiel pour les agents indépendants.",
      features: ["10 biens par mois", "5 campagnes par bien", "Tous les formats", "Support email"],
      highlight: false,
    },
    {
      id: "equipe" as const,
      name: "Agence", price: "79", period: "/mois",
      badge: "Le plus populaire",
      desc: "Puissance illimitée pour les agences et équipes.",
      features: ["30 biens par mois", "5 campagnes par bien", "Calendrier de publication", "Support prioritaire"],
      highlight: true,
    },
    {
      id: "free" as const,
      name: "Essai gratuit", price: "0", period: " — 7 jours",
      desc: "Testez Studio Immo sans engagement ni carte bancaire.",
      features: ["3 biens inclus", "Toutes les fonctionnalités", "Aucune carte requise", "Accès immédiat"],
      highlight: false,
    },
  ];
  return (
    <section id="tarifs" style={{ background: "#f9fafb", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginBottom: "10px" }}>
          Des formules simples et transparentes.
        </h2>
        <p style={{ textAlign: "center", fontSize: "15px", color: "#7C3AED", fontWeight: 600, marginBottom: "48px" }}>
          Sans engagement · Résiliation en un clic
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                background: plan.highlight ? "linear-gradient(160deg, #4c1d95 0%, #3b0764 100%)" : "white",
                border: plan.highlight ? "1px solid rgba(124,58,237,0.5)" : "1px solid #e5e7eb",
                borderRadius: "20px", padding: "28px",
                boxShadow: plan.highlight ? "0 0 40px rgba(124,58,237,0.25)" : "0 1px 8px rgba(0,0,0,0.06)",
              }}
            >
              {"badge" in plan && plan.badge && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  background: "#7C3AED", color: "white", borderRadius: "20px",
                  padding: "4px 14px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}
              <p style={{ fontSize: "13px", fontWeight: 600, color: plan.highlight ? "rgba(255,255,255,0.7)" : "#6b7280", marginBottom: "8px" }}>{plan.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6px" }}>
                <span style={{ fontSize: "48px", fontWeight: 800, color: plan.highlight ? "white" : "#111827", letterSpacing: "-0.05em", lineHeight: 1 }}>{plan.price}€</span>
                <span style={{ fontSize: "14px", color: plan.highlight ? "rgba(255,255,255,0.5)" : "#6b7280" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.5)" : "#6b7280", lineHeight: 1.6, marginBottom: "22px" }}>{plan.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.8)" : "#374151" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: plan.highlight ? "rgba(255,255,255,0.15)" : "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: plan.highlight ? "white" : "#a78bfa" }}>
                      <IcoCheck />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id === "free" ? (
                <Link
                  href="/inscription"
                  style={{
                    display: "block", textAlign: "center",
                    background: "#7C3AED", color: "white", border: "none",
                    borderRadius: "8px", padding: "12px 24px",
                    fontSize: "14px", fontWeight: 700, textDecoration: "none",
                    width: "100%", boxSizing: "border-box",
                  } as React.CSSProperties}
                >
                  Créer mon compte →
                </Link>
              ) : plan.id === "solo" ? (
                <CheckoutButton
                  plan="solo"
                  isLoggedIn={isLoggedIn}
                  isCurrentPlan={false}
                  accent={false}
                  buttonStyle={{ background: "transparent", color: "#7C3AED", border: "2px solid #7C3AED", borderRadius: "8px", padding: "12px 24px", width: "100%", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                />
              ) : (
                <CheckoutButton
                  plan="equipe"
                  isLoggedIn={isLoggedIn}
                  isCurrentPlan={false}
                  accent={true}
                  buttonStyle={{ background: "white", color: "#7C3AED", border: "none", borderRadius: "8px", padding: "12px 24px", width: "100%", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#0a0a0f", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcoHouse size={14} color="white" />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>Studio Immo</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginLeft: "12px" }}>© 2026 Studio Immo · Tous droits réservés</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "24px" }}>
          {[["Fonctionnalités", "#features"], ["Tarifs", "/tarifs"], ["À propos", "#"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>

        {/* Legal */}
        <div style={{ display: "flex", gap: "20px" }}>
          {[["Mentions légales", "/mentions-legales"], ["CGU", "/cgu"], ["CGV", "/cgv"], ["Confidentialité", "/confidentialite"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", fontFamily: "inherit" }}>
      <Navbar />
      <SectionHero />
      <SectionTabs />
      <SectionComparison />
      <SectionSteps />
      <SectionFeatures />
      <SectionPricing />
      <Footer />
    </div>
  );
}
