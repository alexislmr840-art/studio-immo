"use client";

import Link from "next/link";

/* ── Static data ─────────────────────────────────────────────── */
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
  },
  {
    quote: "L'outil qui manquait au secteur. Mes annonces ont 3× plus d'engagement depuis que j'utilise Studio Immo. Et les visuels sont vraiment professionnels.",
    name: "Thomas Renard",
    role: "Directeur — Renard Immobilier, Bordeaux",
    initiale: "T",
  },
  {
    quote: "Notre équipe de 4 agents l'utilise tous les jours. On a multiplié nos mandats sur les réseaux sans embaucher de community manager.",
    name: "Isabelle Fontaine",
    role: "Responsable marketing — Fontaine & Associés",
    initiale: "I",
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
    features: ["30 biens par mois", "5 campagnes par bien", "Visuels PNG 1080×1350", "FB, Instagram, Stories", "Logo agence inclus", "Jusqu'à 10 utilisateurs", "Historique complet", "Support prioritaire"],
    cta: "Commencer avec Équipe",
  },
];

/* ── SVG House Illustration ──────────────────────────────────── */
function HouseIllustration() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0d1a"/>
          <stop offset="100%" stopColor="#080810"/>
        </linearGradient>
        <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>

      {/* Background */}
      <rect width="480" height="360" fill="url(#sky)"/>

      {/* Stars */}
      {[[40,30],[80,20],[150,45],[220,15],[300,35],[380,22],[440,40],[460,15],[20,60]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity="0.5"/>
      ))}

      {/* Moon / ambient glow */}
      <circle cx="400" cy="50" r="30" fill="url(#goldGlow)" filter="url(#blur)"/>

      {/* Ground */}
      <rect x="0" y="300" width="480" height="60" fill="#0f0f0f"/>
      <rect x="0" y="295" width="480" height="8" fill="#141414"/>

      {/* Trees left */}
      <rect x="30" y="220" width="8" height="80" fill="#1a1a1a"/>
      <ellipse cx="34" cy="210" rx="18" ry="28" fill="#151515"/>

      {/* Main house body */}
      <rect x="100" y="180" width="220" height="120" fill="#141414" rx="2"/>
      <rect x="100" y="180" width="220" height="2" fill="#1e1e1e"/>

      {/* Roof */}
      <polygon points="80,180 240,90 400,180" fill="#101010"/>
      <polygon points="80,180 240,90 400,180" fill="none" stroke="#1e1e1e" strokeWidth="1.5"/>

      {/* Chimney */}
      <rect x="310" y="110" width="24" height="50" fill="#131313"/>
      <rect x="307" y="108" width="30" height="6" fill="#1a1a1a"/>

      {/* Chimney smoke */}
      <circle cx="322" cy="90" r="5" fill="#1e1e1e" opacity="0.5"/>
      <circle cx="318" cy="78" r="4" fill="#1e1e1e" opacity="0.35"/>
      <circle cx="325" cy="66" r="3" fill="#1e1e1e" opacity="0.2"/>

      {/* Door */}
      <rect x="195" y="230" width="50" height="70" fill="#0d0d0d" rx="4"/>
      <rect x="195" y="230" width="50" height="70" fill="none" stroke="#222" strokeWidth="1"/>
      {/* Door arch */}
      <path d="M195 250 Q220 230 245 250" fill="#0a0a0a"/>
      {/* Door handle */}
      <circle cx="232" cy="268" r="3" fill="#c9a84c" opacity="0.8"/>

      {/* Window left large */}
      <rect x="116" y="200" width="60" height="50" fill="#0a0a0a" rx="3"/>
      <rect x="116" y="200" width="60" height="50" fill="none" stroke="#222" strokeWidth="1"/>
      {/* Window glow */}
      <rect x="117" y="201" width="58" height="48" fill="#c9a84c" opacity="0.04" rx="2"/>
      <rect x="117" y="201" width="28" height="48" fill="#c9a84c" opacity="0.06" rx="2"/>
      {/* Window cross */}
      <line x1="146" y1="200" x2="146" y2="250" stroke="#1e1e1e" strokeWidth="1"/>
      <line x1="116" y1="225" x2="176" y2="225" stroke="#1e1e1e" strokeWidth="1"/>
      {/* Window light effect */}
      <rect x="118" y="202" width="27" height="22" fill="#c9a84c" opacity="0.08" rx="1"/>

      {/* Window right large */}
      <rect x="264" y="200" width="60" height="50" fill="#0a0a0a" rx="3"/>
      <rect x="264" y="200" width="60" height="50" fill="none" stroke="#222" strokeWidth="1"/>
      <rect x="294" y="200" width="30" height="50" fill="#c9a84c" opacity="0.05" rx="2"/>
      <line x1="294" y1="200" x2="294" y2="250" stroke="#1e1e1e" strokeWidth="1"/>
      <line x1="264" y1="225" x2="324" y2="225" stroke="#1e1e1e" strokeWidth="1"/>
      <rect x="265" y="202" width="28" height="22" fill="#c9a84c" opacity="0.1" rx="1"/>

      {/* Attic window */}
      <rect x="208" y="130" width="44" height="34" fill="#0a0a0a" rx="3"/>
      <ellipse cx="230" cy="130" rx="22" ry="8" fill="#101010"/>
      <rect x="208" y="130" width="44" height="34" fill="none" stroke="#222" strokeWidth="1"/>
      <rect x="209" y="131" width="42" height="32" fill="#c9a84c" opacity="0.06" rx="2"/>

      {/* Path to door */}
      <rect x="205" y="295" width="30" height="10" fill="#161616"/>

      {/* Fence left */}
      {[100,115,130,145,160].map((x,i)=>(
        <g key={i}>
          <rect x={x} y="275" width="6" height="20" fill="#141414" rx="1"/>
          <polygon points={`${x},275 ${x+3},268 ${x+6},275`} fill="#161616"/>
        </g>
      ))}
      <rect x="100" y="280" width="70" height="3" fill="#141414"/>

      {/* Fence right */}
      {[280,295,310,325,340].map((x,i)=>(
        <g key={i}>
          <rect x={x} y="275" width="6" height="20" fill="#141414" rx="1"/>
          <polygon points={`${x},275 ${x+3},268 ${x+6},275`} fill="#161616"/>
        </g>
      ))}
      <rect x="280" y="280" width="70" height="3" fill="#141414"/>

      {/* Tree right */}
      <rect x="420" y="230" width="8" height="70" fill="#1a1a1a"/>
      <ellipse cx="424" cy="220" rx="20" ry="28" fill="#151515"/>

      {/* Lamp post */}
      <rect x="72" y="230" width="4" height="65" fill="#1a1a1a"/>
      <rect x="68" y="228" width="12" height="4" rx="2" fill="#1a1a1a"/>
      <circle cx="74" cy="226" r="5" fill="#c9a84c" opacity="0.15"/>
      <circle cx="74" cy="226" r="3" fill="#c9a84c" opacity="0.4"/>
      {/* Lamp glow on ground */}
      <ellipse cx="74" cy="290" rx="20" ry="4" fill="#c9a84c" opacity="0.04"/>

      {/* Gold glowing accents on house */}
      <rect x="100" y="180" width="220" height="1" fill="#c9a84c" opacity="0.15"/>

      {/* Distant city skyline */}
      <rect x="0" y="260" width="60" height="40" fill="#0d0d0d"/>
      <rect x="10" y="245" width="16" height="55" fill="#0c0c0c"/>
      <rect x="22" y="250" width="12" height="50" fill="#0d0d0d"/>
      <rect x="400" y="255" width="80" height="45" fill="#0d0d0d"/>
      <rect x="440" y="240" width="14" height="60" fill="#0c0c0c"/>
      <rect x="460" y="248" width="20" height="52" fill="#0d0d0d"/>

      {/* Social media floating cards */}
      {/* Card 1 — left */}
      <g transform="translate(18, 80)">
        <rect width="110" height="48" rx="8" fill="#141414" stroke="#222" strokeWidth="0.5"/>
        <rect x="8" y="8" width="16" height="16" rx="3" fill="#c9a84c" fillOpacity="0.15"/>
        <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#c9a84c" fillOpacity="0.5"/>
        <rect x="30" y="10" width="50" height="5" rx="2.5" fill="#1e1e1e"/>
        <rect x="30" y="19" width="34" height="4" rx="2" fill="#161616"/>
        <rect x="8" y="32" width="94" height="3" rx="1.5" fill="#191919"/>
        <rect x="8" y="38" width="70" height="3" rx="1.5" fill="#191919"/>
        <circle cx="95" cy="12" r="6" fill="#c9a84c" fillOpacity="0.12" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.4"/>
        <text x="92" y="16" fontSize="7" fill="#c9a84c" fontWeight="bold">FB</text>
      </g>

      {/* Card 2 — right */}
      <g transform="translate(352, 95)">
        <rect width="110" height="48" rx="8" fill="#141414" stroke="#222" strokeWidth="0.5"/>
        <rect x="8" y="8" width="16" height="16" rx="3" fill="#ec4899" fillOpacity="0.1"/>
        <rect x="11" y="11" width="10" height="10" rx="2" fill="#ec4899" fillOpacity="0.4"/>
        <rect x="30" y="10" width="44" height="5" rx="2.5" fill="#1e1e1e"/>
        <rect x="30" y="19" width="28" height="4" rx="2" fill="#161616"/>
        <rect x="8" y="32" width="94" height="3" rx="1.5" fill="#191919"/>
        <rect x="8" y="38" width="60" height="3" rx="1.5" fill="#191919"/>
        <circle cx="95" cy="12" r="6" fill="#ec4899" fillOpacity="0.1" stroke="#ec4899" strokeWidth="0.5" strokeOpacity="0.4"/>
        <text x="91.5" y="16" fontSize="6.5" fill="#ec4899" fontWeight="bold">IG</text>
      </g>
    </svg>
  );
}

/* ── Product Preview Mockup ──────────────────────────────────── */
function ProductMockup() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--border-s)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border-s)", background: "var(--bg-2)" }}>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }}/>
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }}/>
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }}/>
        </div>
        <div className="flex-1 mx-4">
          <div className="rounded-md h-4 flex items-center justify-center" style={{ background: "var(--bg-3)" }}>
            <span style={{ fontSize: "9px", color: "var(--txt-4)" }}>app.studio-immo.fr/resultats</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2 w-32 rounded skeleton mb-1.5"/>
            <div className="h-4 w-48 rounded" style={{ background: "var(--bg-3)" }}/>
          </div>
          <div className="badge badge-ok">5 campagnes</div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Profil acheteur", val: "Famille 35-45 ans" },
            { label: "Points forts", val: "4 avantages clés" },
            { label: "Stratégie", val: "Publication 5 jours" },
          ].map(({ label, val }) => (
            <div key={label} className="rounded-lg p-2.5" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
              <div className="h-1.5 w-14 rounded mb-1.5" style={{ background: "var(--bg-4)" }}/>
              <div style={{ fontSize: "10px", color: "var(--txt-2)", fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Campaign card */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-s)" }}>
          <div className="px-3 py-2.5 flex items-center justify-between" style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border-s)" }}>
            <div>
              <div className="badge badge-gold mb-1" style={{ fontSize: "9px" }}>Semaine 1 · Lundi</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--txt-1)" }}>Campagne Découverte</div>
            </div>
            <div className="badge badge-muted" style={{ fontSize: "9px" }}>FB + IG</div>
          </div>
          <div className="grid grid-cols-5 gap-0">
            <div className="col-span-3 p-3 space-y-2" style={{ borderRight: "1px solid var(--border-s)" }}>
              {/* Tabs */}
              <div className="flex gap-1">
                {["Facebook", "Instagram", "Story"].map((t, i) => (
                  <div key={t} className="rounded-md px-2 py-0.5" style={{ fontSize: "9px", fontWeight: 600, background: i===0 ? "var(--bg-4)" : "transparent", color: i===0 ? "var(--txt-1)" : "var(--txt-4)" }}>
                    {t}
                  </div>
                ))}
              </div>
              {/* Text lines */}
              {[100, 85, 92, 70, 78, 55].map((w, i) => (
                <div key={i} className="h-1.5 rounded" style={{ width: `${w}%`, background: "var(--bg-3)" }}/>
              ))}
              {/* Copy button */}
              <div className="flex gap-1.5 mt-1">
                <div className="rounded-md px-2 py-1 flex items-center gap-1" style={{ background: "var(--gold)", fontSize: "9px", fontWeight: 700, color: "#0a0a0a" }}>
                  <span>Copier</span>
                </div>
                <div className="rounded-md px-2 py-1" style={{ background: "var(--bg-3)", fontSize: "9px", color: "var(--txt-3)" }}>Planifier</div>
              </div>
            </div>
            <div className="col-span-2 p-2 space-y-1.5">
              {/* Visual preview */}
              {["A", "B"].map((v) => (
                <div key={v} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-s)" }}>
                  <div className="px-1.5 py-1 flex items-center justify-between" style={{ background: "#172554" }}>
                    <div className="h-1.5 w-10 rounded" style={{ background: "rgba(255,255,255,0.3)" }}/>
                    <div className="rounded-full px-1.5 py-0.5" style={{ background: "var(--gold)", fontSize: "7px", fontWeight: 700, color: "#0a0a0a" }}>
                      {v === "A" ? "Nouveau" : "Coup de cœur"}
                    </div>
                  </div>
                  <div className="h-8" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}/>
                  <div className="p-1.5">
                    <div className="h-1 w-full rounded mb-1" style={{ background: "var(--bg-3)" }}/>
                    <div className="rounded-md py-0.5 text-center" style={{ background: "var(--gold)", fontSize: "7px", fontWeight: 700, color: "#0a0a0a" }}>
                      Télécharger {v}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className="glass sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gold)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-white">
              Studio <span style={{ color: "var(--gold)" }}>Immo</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "#fonctionnalites", label: "Fonctionnalités" },
              { href: "#comment", label: "Comment ça marche" },
              { href: "#tarifs", label: "Tarifs" },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="text-sm font-medium transition-colors" style={{ color: "var(--txt-3)" }}
                 onMouseEnter={e => (e.currentTarget.style.color = "var(--txt-1)")}
                 onMouseLeave={e => (e.currentTarget.style.color = "var(--txt-3)")}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/connexion" className="btn btn-ghost text-xs" style={{ padding: "8px 14px" }}>
              Connexion
            </Link>
            <Link href="/connexion" className="btn btn-primary text-xs" style={{ padding: "8px 16px" }}>
              Essai gratuit →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          paddingTop: "100px",
          paddingBottom: "80px",
          background: `
            radial-gradient(ellipse 80% 50% at 15% 60%, rgba(201,168,76,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 30%, rgba(201,168,76,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 60% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 50%),
            var(--bg-base)
          `,
        }}
      >
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left — Copy */}
            <div className="animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6"
                   style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
                <div className="h-1.5 w-1.5 rounded-full animate-pulse-gold" style={{ background: "var(--gold)" }}/>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.04em" }}>
                  Marketing immobilier automatisé par IA
                </span>
              </div>

              <h1
                className="font-bold tracking-tight leading-none mb-6"
                style={{ fontSize: "clamp(38px, 5.5vw, 72px)", letterSpacing: "-0.03em" }}
              >
                <span className="text-white">Vos mandats.</span>
                <br />
                <span className="text-gradient">Publiés en 15s.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--txt-3)" }}>
                Studio Immo génère des publications Facebook, Instagram et des visuels professionnels
                pour valoriser vos biens — sans agence de communication, sans effort.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/connexion" className="btn btn-primary" style={{ padding: "13px 24px", fontSize: "14px" }}>
                  Commencer gratuitement
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                <a href="#tarifs" className="btn btn-secondary" style={{ padding: "13px 24px", fontSize: "14px" }}>
                  Voir les tarifs
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["S","T","I","M","A"].map((l, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2"
                      style={{
                        background: `hsl(${40 + i * 20}, 60%, 25%)`,
                        color: "var(--gold)",
                        boxShadow: "0 0 0 2px var(--bg-base)",
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "var(--txt-3)" }}>
                  <strong className="text-white">+200 agents</strong> utilisent Studio Immo
                </p>
              </div>
            </div>

            {/* Right — Product mockup + house illustration */}
            <div className="relative animate-fade-up delay-300">
              {/* House illustration behind */}
              <div
                className="absolute -bottom-8 -left-8 -right-8 h-56 rounded-2xl overflow-hidden opacity-30"
                style={{ zIndex: 0 }}
              >
                <HouseIllustration />
              </div>

              {/* Product mockup on top */}
              <div className="relative" style={{ zIndex: 1 }}>
                <ProductMockup />
              </div>

              {/* Floating stat cards */}
              <div
                className="absolute -left-8 top-16 animate-float"
                style={{ zIndex: 2, animationDelay: "0.5s" }}
              >
                <div className="rounded-xl px-4 py-3 glass" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
                  <p style={{ fontSize: "10px", color: "var(--txt-4)" }} className="label">Temps moyen</p>
                  <p className="font-bold text-white" style={{ fontSize: "20px" }}>14s</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ok)" }}/>
                    <p style={{ fontSize: "10px", color: "var(--ok)" }}>par stratégie</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-4 bottom-16 animate-float"
                style={{ zIndex: 2, animationDelay: "1.2s" }}
              >
                <div className="rounded-xl px-4 py-3 glass" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
                  <p style={{ fontSize: "10px", color: "var(--txt-4)" }} className="label">Publications</p>
                  <p className="font-bold text-white" style={{ fontSize: "20px" }}>10</p>
                  <p style={{ fontSize: "10px", color: "var(--txt-3)" }}>FB + IG + Stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border-s)", borderBottom: "1px solid var(--border-s)", padding: "20px 0" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p style={{ fontSize: "12px", color: "var(--txt-4)", fontWeight: 600 }}>
              UTILISÉ PAR LES MEILLEURES AGENCES
            </p>
            <div className="flex flex-wrap gap-8">
              {["Renard Immobilier", "Fontaine & Associés", "Agence Marchand", "Premium Realty", "Le Bon Immo"].map((name) => (
                <span key={name} style={{ fontSize: "13px", fontWeight: 600, color: "var(--txt-4)", letterSpacing: "-0.01em" }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { val: "5", unit: "", label: "campagnes générées par bien" },
              { val: "10", unit: "", label: "publications rédigées par bien" },
              { val: "15", unit: "s", label: "temps moyen de génération" },
              { val: "99", unit: "%", label: "de satisfaction client" },
            ].map(({ val, unit, label }) => (
              <div key={label} className="text-center">
                <div className="flex items-end justify-center gap-0.5 mb-1">
                  <span className="font-bold text-white" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {val}
                  </span>
                  <span className="font-bold pb-1" style={{ fontSize: "20px", color: "var(--gold)" }}>{unit}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--txt-4)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-20" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="label mb-3" style={{ color: "var(--gold)" }}>Fonctionnalités</p>
            <h2 className="font-bold text-white tracking-tight" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
              Tout ce dont vous avez besoin.
              <br />
              <span style={{ color: "var(--txt-3)" }}>Rien de superflu.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card card-lift p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                     style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)", color: "var(--gold)" }}>
                  {icon}
                </div>
                <p className="font-semibold text-white mb-1.5" style={{ fontSize: "15px" }}>{title}</p>
                <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="comment" className="py-20" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="label mb-3" style={{ color: "var(--gold)" }}>Comment ça marche</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
              3 étapes, une stratégie complète.
            </h2>
          </div>

          <div className="relative grid gap-8 lg:grid-cols-3">
            {/* Connector line */}
            <div
              className="absolute top-7 left-1/3 right-1/3 h-px hidden lg:block"
              style={{ background: "linear-gradient(90deg, transparent, var(--gold-20), var(--gold-20), transparent)" }}
            />

            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold mb-4 relative z-10"
                  style={{
                    background: "var(--gold-10)",
                    border: "1px solid var(--gold-30)",
                    color: "var(--gold)",
                    fontSize: "18px",
                    letterSpacing: "-0.02em",
                    boxShadow: "0 0 24px rgba(201,168,76,0.1)",
                  }}
                >
                  {n}
                </div>
                <h3 className="font-bold text-white mb-2" style={{ fontSize: "16px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="tarifs" className="py-20" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="label mb-3" style={{ color: "var(--gold)" }}>Tarifs</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
              Simple. Transparent. Sans surprise.
            </h2>
            <p className="mt-3" style={{ fontSize: "15px", color: "var(--txt-3)" }}>
              Sans engagement · Résiliez à tout moment · 14 jours satisfait ou remboursé
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: plan.highlight ? "var(--bg-1)" : "var(--bg-1)",
                  border: plan.highlight ? "1px solid var(--gold-30)" : "1px solid var(--border-s)",
                  boxShadow: plan.highlight ? "var(--shadow-gold)" : "none",
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold"
                    style={{ background: "var(--gold)", color: "#0a0a0a" }}
                  >
                    Le plus populaire
                  </div>
                )}

                <div className="mb-5">
                  <p className="label mb-2" style={{ color: "var(--txt-4)" }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-bold text-white" style={{ fontSize: "48px", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {plan.price}€
                    </span>
                    <span style={{ fontSize: "14px", color: "var(--txt-3)" }}>/ mois</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--txt-3)" }}>{plan.desc}</p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3" style={{ fontSize: "13px", color: "var(--txt-2)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/connexion"
                  className="btn w-full"
                  style={plan.highlight
                    ? { background: "var(--gold)", color: "#0a0a0a", padding: "13px", fontSize: "13px" }
                    : { background: "var(--bg-3)", color: "var(--txt-1)", border: "1px solid var(--border)", padding: "13px", fontSize: "13px" }
                  }
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-6" style={{ fontSize: "12px", color: "var(--txt-4)" }}>
            ✦ Paiement sécurisé · Aucun engagement · Accès immédiat · 10 générations gratuites
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="label mb-3" style={{ color: "var(--gold)" }}>Témoignages</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em" }}>
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, initiale }) => (
              <div key={name} className="card p-6 flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                <p className="flex-1 leading-relaxed mb-5" style={{ fontSize: "14px", color: "var(--txt-2)" }}>
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold text-sm"
                    style={{ background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }}
                  >
                    {initiale}
                  </div>
                  <div>
                    <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{name}</p>
                    <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section
        className="py-24"
        style={{
          borderTop: "1px solid var(--border-s)",
          background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 70%)`,
        }}
      >
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.03em" }}>
            Prêt à publier en 15 secondes ?
          </h2>
          <p className="mb-8" style={{ fontSize: "15px", color: "var(--txt-3)" }}>
            Rejoignez plus de 200 agents immobiliers qui font confiance à Studio Immo.
            <br />Sans carte bancaire. 10 générations gratuites pour commencer.
          </p>
          <Link href="/connexion" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "15px" }}>
            Créer mon compte gratuitement →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="px-6 py-8" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "var(--gold)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Studio Immo</span>
          </div>

          <div className="flex gap-6">
            {[
              { href: "#tarifs", label: "Tarifs" },
              { href: "/tarifs", label: "Plans" },
              { href: "/connexion", label: "Connexion" },
            ].map(({ href, label }) => (
              <a key={label} href={href} className="text-xs transition-colors" style={{ color: "var(--txt-4)" }}
                 onMouseEnter={e => (e.currentTarget.style.color = "var(--txt-2)")}
                 onMouseLeave={e => (e.currentTarget.style.color = "var(--txt-4)")}>
                {label}
              </a>
            ))}
          </div>

          <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>
            © 2026 Studio Immo · Marketing immobilier automatisé
          </p>
        </div>
      </footer>
    </div>
  );
}
