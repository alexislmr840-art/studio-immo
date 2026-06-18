"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckoutButton } from "./CheckoutButton";

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne Studio Immo ?",
    a: "Vous entrez les informations de votre bien et vos photos, et l'IA génère une campagne complète (posts Facebook, Instagram, Stories et visuels) en quelques secondes.",
  },
  {
    q: "Ai-je besoin de compétences techniques ?",
    a: "Non, aucune. Tout est automatique, vous n'avez qu'à copier-coller ou publier directement vos contenus.",
  },
  {
    q: "Puis-je tester gratuitement ?",
    a: "Oui, le plan gratuit vous offre une génération complète, sans carte bancaire requise.",
  },
  {
    q: "Les visuels sont-ils à mon nom ?",
    a: "Oui, le logo de votre agence est automatiquement intégré sur chaque visuel généré.",
  },
  {
    q: "Puis-je résilier à tout moment ?",
    a: "Oui, sans engagement et en un clic depuis votre espace personnel.",
  },
  {
    q: "Les textes sont-ils personnalisés ?",
    a: "Oui, chaque campagne est rédigée sur mesure selon les caractéristiques précises de votre bien.",
  },
];

function CheckIcon() {
  return (
    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  );
}

export default function TarifsPage() {
  const { isSignedIn } = useUser();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div style={{ background: "#F4F3F7", minHeight: "100vh" }}>
      <style>{`
        .tarif-card { transition: all 0.25s ease; }
        .tarif-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(124,58,237,0.12) !important; border-color: #C4B5FD !important; }
        .tarif-card-featured { transition: all 0.25s ease; }
        .tarif-card-featured:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(124,58,237,0.28) !important; }
        .faq-chevron { transition: transform 0.2s ease; flex-shrink: 0; margin-left: 12px; }
        .faq-chevron.open { transform: rotate(180deg); }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E0E0E8", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "28px", height: "28px", background: "#7C3AED", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>
              Studio <span style={{ color: "#7C3AED" }}>Immo</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/connexion" style={{ padding: "8px 14px", fontSize: "13px", fontWeight: 600, color: "#6B7280", textDecoration: "none", borderRadius: "8px" }}>
              Connexion
            </Link>
            <Link href="/connexion" style={{ padding: "8px 16px", fontSize: "13px", fontWeight: 600, background: "#7C3AED", color: "#fff", textDecoration: "none", borderRadius: "8px" }}>
              Essai gratuit →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "56px 32px 100px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2D1B69, #1E1B2E)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=60)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18, filter: "blur(2px)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(30,27,46,0.85))" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{
            display: "inline-block", marginBottom: "20px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: "11px", fontWeight: 600,
            padding: "5px 14px", borderRadius: "20px",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Tarifs
          </span>
          <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: 700, marginBottom: "14px", letterSpacing: "-0.02em" }}>
            Choisissez votre plan
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.7 }}>
            Sans engagement · Résiliation en un clic · 1 génération gratuite pour commencer
          </p>
        </div>
      </div>

      {/* ── Cartes de prix ───────────────────────────────────── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginTop: "-70px", position: "relative", zIndex: 3, marginBottom: "60px" }}>

          {/* Card Gratuit */}
          <div className="tarif-card" style={{ background: "#fff", border: "1.5px solid #E0E0E8", borderRadius: "16px", padding: "28px 22px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Gratuit</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>0€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>Pour tester sans engagement</p>
            <Link
              href="/sign-up"
              style={{ display: "block", textAlign: "center", padding: "11px", background: "#F3F4F6", color: "#374151", borderRadius: "10px", fontSize: "13px", fontWeight: 600, marginBottom: "22px", textDecoration: "none" }}
            >
              Créer mon compte →
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["1 bien inclus", "Toutes les fonctionnalités", "Aucune carte requise", "Accès immédiat"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#374151" }}>
                  <CheckIcon />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Card Solo */}
          <div className="tarif-card" style={{ background: "#fff", border: "1.5px solid #E0E0E8", borderRadius: "16px", padding: "28px 22px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Solo</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>39€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>L&apos;essentiel pour les agents indépendants</p>
            <div style={{ marginBottom: "22px" }}>
              <CheckoutButton
                plan="solo"
                isLoggedIn={isSignedIn ?? false}
                isCurrentPlan={false}
                accent={false}
                buttonStyle={{ width: "100%", padding: "11px", background: "#fff", color: "#7C3AED", border: "1.5px solid #7C3AED", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                label="Choisir Solo"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["10 biens par mois", "5 campagnes par bien", "Visuels PNG 1080×1350", "Facebook, Instagram, Stories", "Logo agence sur visuels", "1 utilisateur"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#374151" }}>
                  <CheckIcon />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Card Équipe (featured) */}
          <div className="tarif-card-featured" style={{ background: "#fff", border: "2px solid #7C3AED", borderRadius: "16px", padding: "28px 22px", position: "relative", boxShadow: "0 8px 24px rgba(124,58,237,0.18)" }}>
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#7C3AED", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
              ★ Le plus populaire
            </div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Équipe</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>79€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>Pour les agences et équipes</p>
            <div style={{ marginBottom: "22px" }}>
              <CheckoutButton
                plan="equipe"
                isLoggedIn={isSignedIn ?? false}
                isCurrentPlan={false}
                accent={true}
                buttonStyle={{ width: "100%", padding: "11px", background: "#7C3AED", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                label="Choisir Équipe →"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { text: "30 biens par mois", bold: false, bientot: false },
                { text: "5 campagnes par bien", bold: false, bientot: false },
                { text: "Visuels PNG 1080×1350", bold: false, bientot: false },
                { text: "Facebook, Instagram, Stories", bold: false, bientot: false },
                { text: "Logo agence sur visuels", bold: false, bientot: false },
                { text: "Jusqu'à 10 utilisateurs", bold: false, bientot: false },
                { text: "Historique des campagnes", bold: false, bientot: false },
                { text: "Analytics réseaux sociaux", bold: true, bientot: true },
                { text: "Support prioritaire", bold: false, bientot: false },
              ].map(({ text, bold, bientot }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#374151", fontWeight: bold ? 600 : 400 }}>
                  <CheckIcon />
                  {text}
                  {bientot && (
                    <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                      Bientôt disponible
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ Accordéon ───────────────────────────────────── */}
        <div style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "60px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: "32px" }}>
            Questions fréquentes
          </h2>
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <div key={i} style={{ background: "#fff", border: "1.5px solid #E0E0E8", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
              <button
                onClick={() => toggle(i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", fontSize: "15px", fontWeight: 600, color: "#111827", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                {q}
                <svg
                  className={`faq-chevron${openIndex === i ? " open" : ""}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openIndex === i && (
                <div style={{ padding: "0 20px 18px", fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #E0E0E8", padding: "24px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "24px", height: "24px", background: "#7C3AED", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>Studio Immo</span>
          </Link>
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>© 2026 Studio Immo · Marketing immobilier automatisé</p>
        </div>
      </footer>
    </div>
  );
}
