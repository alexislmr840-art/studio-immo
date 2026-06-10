"use client";

import Link from "next/link";

/* ── Static data ────────────────────────────────────────────── */
const FEATURES = [
  { icon: "✦", title: "5 campagnes IA par bien", desc: "Objectifs, accroches, textes FB/IG/Story — tout est rédigé en 15 secondes." },
  { icon: "◈", title: "Visuels 1080×1350 px", desc: "PNG prêts à publier avec votre logo, vos photos et les infos du bien." },
  { icon: "◉", title: "Profil acheteur ciblé", desc: "L'IA identifie le bon acquéreur et adapte chaque publication." },
  { icon: "⬡", title: "Variantes A/B", desc: "Deux versions de chaque visuel pour maximiser l'impact sur vos réseaux." },
  { icon: "◎", title: "Facebook & Instagram", desc: "Posts longs, courtes captions et stories — formats natifs de chaque réseau." },
  { icon: "✧", title: "Téléchargement immédiat", desc: "Un clic pour télécharger, un clic pour publier. Aucune installation." },
];

const STEPS = [
  { n: "01", title: "Saisissez le bien", desc: "Titre, ville, surface, prix, description et photos en quelques secondes." },
  { n: "02", title: "L'IA génère la stratégie", desc: "GPT-4o analyse le bien et produit 5 campagnes complètes adaptées au marché." },
  { n: "03", title: "Publiez & téléchargez", desc: "Copiez les textes, téléchargez les visuels PNG et publiez sur vos réseaux." },
];

const TESTIMONIALS = [
  {
    quote: "J'ai divisé par 4 le temps passé sur mes posts Instagram. En 20 secondes j'ai une stratégie complète que je n'aurais pas rédigée aussi bien moi-même.",
    name: "Sophie Marchand",
    role: "Agente indépendante — Lyon",
    initiale: "S",
    color: "#7C3AED",
  },
  {
    quote: "L'outil qui manquait au secteur. Mes annonces ont 3× plus d'engagement depuis que j'utilise Studio Immo. Et les visuels sont vraiment professionnels.",
    name: "Thomas Renard",
    role: "Directeur — Renard Immobilier, Bordeaux",
    initiale: "T",
    color: "#0891B2",
  },
  {
    quote: "Notre équipe de 4 agents l'utilise tous les jours. On a multiplié nos mandats sur les réseaux sans embaucher de community manager.",
    name: "Isabelle Fontaine",
    role: "Responsable marketing — Fontaine & Associés",
    initiale: "I",
    color: "#D97706",
  },
];

const PLANS = [
  {
    name: "Solo",
    price: "39",
    desc: "L'essentiel pour les agents qui veulent se démarquer.",
    highlight: false,
    features: ["10 biens par mois", "5 campagnes par bien", "Visuels PNG 1080×1350", "FB, Instagram, Stories", "Logo agence inclus", "1 utilisateur", "Support email"],
    cta: "Commencer avec Solo",
  },
  {
    name: "Équipe",
    price: "79",
    desc: "Puissance illimitée pour les agences et équipes.",
    highlight: true,
    badge: "Le plus populaire",
    features: ["30 biens par mois", "5 campagnes par bien", "Visuels PNG 1080×1350", "FB, Instagram, Stories", "Logo agence inclus", "Jusqu'à 10 utilisateurs", "Historique complet", "Support prioritaire"],
    cta: "Commencer avec Équipe",
  },
];

const FB_POSTS = [
  {
    agency: "Agence Beaumont",
    initial: "B",
    color: "#7C3AED",
    photoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    city: "Lyon 6e",
    surface: "72 m²",
    price: "320 000 €",
    title: "Appartement T3 lumineux",
    text: "✨ Coup de cœur ! T3 traversant double exposition, parquet chêne, cuisine ouverte équipée. Idéal famille. Visite sur RDV.",
    likes: 47,
    comments: 12,
  },
  {
    agency: "Renard Immobilier",
    initial: "R",
    color: "#0369A1",
    photoUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80",
    city: "Bordeaux Caudéran",
    surface: "148 m²",
    price: "580 000 €",
    title: "Maison avec grand jardin",
    text: "🌿 Maison familiale 5 chambres sur 600m² de terrain. Double garage, terrasse couverte. À 10 min du centre. Rare sur ce secteur !",
    likes: 89,
    comments: 23,
  },
  {
    agency: "Côte d'Azur Properties",
    initial: "C",
    color: "#0D9488",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    city: "Nice Promenade",
    surface: "35 m²",
    price: "295 000 €",
    title: "Studio vue mer",
    text: "🌊 Vue imprenable sur la Méditerranée. Terrasse 8m², prestations haut de gamme. Investissement locatif idéal. Rendement 5,2%.",
    likes: 134,
    comments: 41,
  },
  {
    agency: "Fontaine & Associés",
    initial: "F",
    color: "#B91C1C",
    photoUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80",
    city: "Aix-en-Provence",
    surface: "220 m²",
    price: "1 250 000 €",
    title: "Villa contemporaine",
    text: "🏛️ Exception. Villa architecturale 6 pièces, piscine à débordement, vue panoramique Sainte-Victoire. Construction 2022.",
    likes: 201,
    comments: 67,
  },
  {
    agency: "Marchand Paris",
    initial: "M",
    color: "#D97706",
    photoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
    city: "Paris 11e",
    surface: "85 m²",
    price: "750 000 €",
    title: "Loft industriel atypique",
    text: "⚡ Loft d'exception en plein cœur de Paris. Hauteur sous plafond 4m, verrière d'artiste. Coup de cœur garanti.",
    likes: 156,
    comments: 34,
  },
  {
    agency: "Premium Realty",
    initial: "P",
    color: "#7C3AED",
    photoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    city: "Nantes Île de Nantes",
    surface: "110 m²",
    price: "420 000 €",
    title: "Duplex standing neuf",
    text: "🏙️ Duplex neuf RT2020 avec terrasse plein sud 25m². Cuisine Bulthaup, dressing sur mesure. Livraison T4 2025.",
    likes: 73,
    comments: 19,
  },
];

/* ── Facebook post card ─────────────────────────────────────── */
function FbCard({ p }: { p: typeof FB_POSTS[0] }) {
  return (
    <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
      {/* Header */}
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {p.initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#050505", lineHeight: 1.2 }}>{p.agency}</p>
          <p style={{ fontSize: "10px", color: "#65676B", display: "flex", alignItems: "center", gap: "3px" }}>
            Sponsorisé ·{" "}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>
          </p>
        </div>
        <span style={{ fontSize: "17px", color: "#65676B", letterSpacing: "1px", lineHeight: 1 }}>···</span>
      </div>

      {/* Post text */}
      <p style={{ padding: "0 12px 8px", fontSize: "12px", color: "#050505", lineHeight: 1.5 }}>{p.text}</p>

      {/* Photo */}
      <div style={{ height: "155px", position: "relative", overflow: "hidden" }}>
        <img src={p.photoUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 10px 8px", background: "linear-gradient(transparent, rgba(0,0,0,0.72))", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{p.title}</p>
            <p style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.72)" }}>📍 {p.city} · {p.surface}</p>
          </div>
          <p style={{ fontSize: "13px", fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>{p.price}</p>
        </div>
      </div>

      {/* CTA row */}
      <div style={{ padding: "5px 12px 5px", background: "#F0F2F5", borderTop: "1px solid #E4E6EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "10px", color: "#65676B" }}>studioimmo.fr</p>
        <div style={{ padding: "3px 10px", background: "#E7E9EB", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#050505" }}>En savoir plus</div>
      </div>

      {/* Reactions */}
      <div style={{ padding: "3px 12px 0" }}>
        <p style={{ fontSize: "10px", color: "#65676B" }}>👍 {p.likes} · 💬 {p.comments} commentaires</p>
      </div>

      {/* Action bar */}
      <div style={{ padding: "2px 8px 6px", display: "flex", borderTop: "1px solid #E4E6EB", marginTop: "4px" }}>
        {["👍 J'aime", "💬 Commenter", "↗ Partager"].map((a) => (
          <div key={a} style={{ flex: 1, padding: "4px 2px", textAlign: "center", fontSize: "10px", fontWeight: 600, color: "#65676B" }}>{a}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", overflowX: "hidden", fontFamily: "inherit" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,8,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "8px", background: "linear-gradient(135deg, #7C3AED, #9333EA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
              Studio <span style={{ color: "#A78BFA" }}>Immo</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { href: "#fonctionnalites", label: "Fonctionnalités" },
              { href: "#comment", label: "Comment ça marche" },
              { href: "#tarifs", label: "Tarifs" },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                {label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/connexion" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "8px 16px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
              Connexion
            </Link>
            <Link href="/inscription" style={{ fontSize: "13px", fontWeight: 700, color: "#fff", textDecoration: "none", padding: "8px 20px", borderRadius: "999px", background: "linear-gradient(135deg, #7C3AED, #9333EA)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Essai gratuit →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #1a0533 0%, #6b21a8 40%, #c2410c 80%, #ea580c 100%)",
      }}>
        {/* Noise overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", pointerEvents: "none" }} />

        {/* Blobs */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.3) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 30%, transparent 100%)",
        }} />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center" style={{ zIndex: 1, width: "100%" }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8" style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "999px",
            padding: "6px 16px",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80" }} className="animate-pulse" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
              Marketing immobilier automatisé par IA
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(46px, 8vw, 92px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: "24px" }}>
            <span style={{ display: "block", color: "#ffffff" }}>Vos mandats.</span>
            <span style={{ display: "block", background: "linear-gradient(90deg, #FCD34D, #FBBF24, #F9A8D4, #E879F9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Publiés en 15s.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.68)", lineHeight: 1.65, marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px" }}>
            Studio Immo génère des publications Facebook, Instagram et des visuels professionnels
            pour valoriser vos biens — sans agence, sans effort.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <Link href="/inscription" style={{
              fontSize: "15px", fontWeight: 700, color: "#fff", textDecoration: "none",
              padding: "14px 32px", borderRadius: "999px",
              background: "linear-gradient(135deg, #7C3AED, #9333EA)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"; }}>
              Commencer gratuitement →
            </Link>
            <a href="#tarifs" style={{
              fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.85)", textDecoration: "none",
              padding: "14px 32px", borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              transition: "background 0.15s, border-color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}>
              Voir les tarifs
            </a>
          </div>

          {/* Badge no CB */}
          <div className="flex items-center justify-center gap-5">
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Sans carte bancaire
            </span>
            <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              10 générations gratuites
            </span>
            <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 secondes par bien
            </span>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[["S","#7C3AED"],["T","#0891B2"],["I","#D97706"],["M","#059669"],["A","#DC2626"]].map(([l, c], i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", border: "2px solid #1a0533", zIndex: 5 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
              <span style={{ fontWeight: 700, color: "#fff" }}>+200 agents</span> font confiance à Studio Immo
            </p>
          </div>
        </div>
      </section>

      {/* ── DEMO FACEBOOK ──────────────────────────────────────── */}
      <section style={{ background: "#0a0a0a", padding: "96px 0" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A78BFA", background: "rgba(124,58,237,0.12)", padding: "4px 14px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.2)" }}>
              Aperçu en direct
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginTop: "16px", marginBottom: "10px" }}>
              Ce que l'IA génère en 15 secondes
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
              6 publications Facebook prêtes à publier, personnalisées pour chaque bien.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FB_POSTS.map((p) => <FbCard key={p.title} p={p} />)}
          </div>

          <div className="text-center mt-12">
            <Link href="/inscription" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "14px", fontWeight: 700, color: "#fff", textDecoration: "none",
              padding: "12px 28px", borderRadius: "999px",
              background: "linear-gradient(135deg, #7C3AED, #9333EA)",
              boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Générer mes premières publications →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "64px 0" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { val: "5", unit: "", label: "campagnes générées", sub: "par bien immobilier", color: "#A78BFA" },
              { val: "10", unit: "", label: "publications rédigées", sub: "FB + IG + Stories", color: "#34D399" },
              { val: "15", unit: "s", label: "temps de génération", sub: "en moyenne", color: "#FBBF24" },
            ].map(({ val, unit, label, sub, color }) => (
              <div key={label}>
                <div className="flex items-end justify-center gap-0.5 mb-2">
                  <span style={{ fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color }}>{val}</span>
                  <span style={{ fontSize: "24px", fontWeight: 900, color, paddingBottom: "8px" }}>{unit}</span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{label}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="fonctionnalites" style={{ background: "#0d0d0d", padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A78BFA", background: "rgba(124,58,237,0.12)", padding: "4px 14px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.2)" }}>
              Fonctionnalités
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginTop: "16px", marginBottom: "10px" }}>
              Tout ce dont vous avez besoin.{" "}
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Rien de superflu.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", transition: "border-color 0.15s, background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.background = "rgba(124,58,237,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                <div style={{ width: 38, height: 38, borderRadius: "10px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "16px", color: "#A78BFA" }}>
                  {icon}
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{title}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="comment" style={{ background: "#080808", padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A78BFA", background: "rgba(124,58,237,0.12)", padding: "4px 14px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.2)" }}>
              Comment ça marche
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginTop: "16px" }}>
              3 étapes, une stratégie complète.
            </h2>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-3">
            {/* Connector */}
            <div className="absolute top-8 left-1/3 right-1/3 h-px hidden lg:block" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(124,58,237,0.4), transparent)" }} />

            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "16px",
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: 800, color: "#A78BFA",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 0 32px rgba(124,58,237,0.15)",
                  marginBottom: "20px",
                  position: "relative", zIndex: 1,
                }}>
                  {n}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section style={{ background: "#0d0d0d", padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A78BFA", background: "rgba(124,58,237,0.12)", padding: "4px 14px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.2)" }}>
              Témoignages
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginTop: "16px" }}>
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, initiale, color }) => (
              <div key={name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                <p style={{ flex: 1, fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "24px" }}>
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {initiale}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="tarifs" style={{ background: "#080808", padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A78BFA", background: "rgba(124,58,237,0.12)", padding: "4px 14px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.2)" }}>
              Tarifs
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginTop: "16px", marginBottom: "8px" }}>
              Simple. Transparent. Sans surprise.
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
              Sans engagement · Résiliez à tout moment · 14 jours satisfait ou remboursé
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                position: "relative",
                background: plan.highlight ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.highlight ? "0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
              }}>
                {"badge" in plan && plan.badge && (
                  <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #7C3AED, #9333EA)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 16px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: plan.highlight ? "#A78BFA" : "rgba(255,255,255,0.35)", marginBottom: "8px" }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1 }}>{plan.price}€</span>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>/ mois</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{plan.desc}</p>
                </div>

                <ul style={{ flex: 1, marginBottom: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.highlight ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "#A78BFA" : "rgba(255,255,255,0.5)"} strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/tarifs" style={{
                  display: "block", textAlign: "center",
                  fontSize: "14px", fontWeight: 700, color: plan.highlight ? "#fff" : "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  background: plan.highlight ? "linear-gradient(135deg, #7C3AED, #9333EA)" : "rgba(255,255,255,0.06)",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: plan.highlight ? "0 6px 24px rgba(124,58,237,0.4)" : "none",
                  transition: "opacity 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
            ✦ Paiement sécurisé Stripe · Aucun engagement · Accès immédiat
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section style={{
        padding: "96px 0",
        background: "linear-gradient(135deg, #1a0533 0%, #6b21a8 60%, #c2410c 100%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "80vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div className="relative mx-auto max-w-2xl px-6 text-center" style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: "16px", lineHeight: 1.1 }}>
            Prêt à publier en 15 secondes ?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "36px" }}>
            Rejoignez plus de 200 agents immobiliers qui font confiance à Studio Immo.
            <br />Sans carte bancaire. 10 générations gratuites pour commencer.
          </p>
          <Link href="/inscription" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "15px", fontWeight: 700, color: "#7C3AED", textDecoration: "none",
            padding: "14px 36px", borderRadius: "999px",
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}>
            Créer mon compte gratuitement →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div style={{ width: 26, height: 26, borderRadius: "7px", background: "linear-gradient(135deg, #7C3AED, #9333EA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                </svg>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>Studio Immo</span>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: "#fonctionnalites", label: "Fonctionnalités" },
                { href: "#tarifs", label: "Tarifs" },
                { href: "/tarifs", label: "Plans" },
                { href: "/connexion", label: "Connexion" },
                { href: "/inscription", label: "Inscription" },
              ].map(({ href, label }) => (
                <a key={label} href={href} style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              © 2026 Studio Immo · Marketing immobilier automatisé
            </p>
            <div className="flex flex-wrap gap-5">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgu", label: "CGU" },
                { href: "/cgv", label: "CGV" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
