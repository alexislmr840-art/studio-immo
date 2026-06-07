"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Publication {
  titre: string;
  objectif: string;
  reseau: string;
  jourPublication: string;
  accroche: string;
  facebook: string;
  instagram: string;
  story: string;
  ideeVisuelA: string;
  ideeVisuelB: string;
}

interface ResultatIA {
  profilAcheteur: string;
  pointsForts: string[];
  strategie: string;
  publications: Publication[];
}

interface Bien {
  titre: string;
  ville: string;
  prix: string;
  surface: string;
  description: string;
  afficherPrix: boolean;
}

interface Agence {
  nomAgence: string;
  telephone: string;
}

type Onglet = "facebook" | "instagram" | "story";

function CampagneCard({
  publication,
  index,
  photos,
  photoPrincipale,
  bien,
  agence,
  logo,
  onTelecharger,
}: {
  publication: Publication;
  index: number;
  photos: string[];
  photoPrincipale: number;
  bien: Bien | null;
  agence: Agence | null;
  logo: string;
  onTelecharger: (pub: Publication, idx: number, variante: "A" | "B") => void;
}) {
  const [onglet, setOnglet] = useState<Onglet>("facebook");
  const [copiéId, setCopiéId] = useState<string | null>(null);
  const [planifierOuvert, setPlanifierOuvert] = useState(false);
  const [dateChoisie, setDateChoisie] = useState("");
  const [planifié, setPlanifié] = useState(false);

  const cover = photos[photoPrincipale] || photos[0];
  const autresPhotos = photos.filter((_, i) => i !== photoPrincipale);
  const selectedPhotos = [cover, ...autresPhotos].filter(Boolean).slice(0, 4);

  function copier(texte: string, id: string) {
    navigator.clipboard.writeText(texte);
    setCopiéId(id);
    setTimeout(() => setCopiéId(null), 2000);
  }

  function planifier() {
    if (!dateChoisie) return;
    setPlanifié(true);
    setPlanifierOuvert(false);
    setTimeout(() => setPlanifié(false), 3000);
  }

  const ONGLETS: { key: Onglet; label: string }[] = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "story", label: "Story" },
  ];

  const texteActif = publication[onglet];

  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ background: "#111111", border: "1px solid #1f1f1f" }}
    >
      {/* En-tête campagne */}
      <div
        className="flex flex-wrap items-start justify-between gap-4 px-6 py-5"
        style={{ borderBottom: "1px solid #1f1f1f" }}
      >
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#c9a84c", letterSpacing: "0.1em" }}
          >
            {publication.jourPublication}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">{publication.titre}</h2>
          <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {publication.objectif}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          {publication.reseau}
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-5">
        {/* Contenu texte — 3/5 */}
        <div className="lg:col-span-3 p-6" style={{ borderRight: "1px solid #1f1f1f" }}>

          {/* Tabs réseau */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-5"
            style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
          >
            {ONGLETS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setOnglet(key)}
                className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150"
                style={{
                  background: onglet === key ? "#1e1e1e" : "transparent",
                  color: onglet === key ? "#ffffff" : "rgba(255,255,255,0.4)",
                  border: onglet === key ? "1px solid #2a2a2a" : "1px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Texte actif */}
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", minHeight: "180px" }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.8)" }}>
              {texteActif}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copier(texteActif, `${index}-${onglet}`)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
              style={{ background: "#c9a84c", color: "#0a0a0a" }}
            >
              {copiéId === `${index}-${onglet}` ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Copié !
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                  Copier
                </>
              )}
            </button>

            <button
              onClick={() => setPlanifierOuvert(!planifierOuvert)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150"
              style={{ background: "#1a1a1a", color: planifié ? "#4ade80" : "rgba(255,255,255,0.7)", border: "1px solid #2a2a2a" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {planifié ? "✓ Planifié" : "Planifier"}
            </button>

            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold cursor-not-allowed"
              style={{ background: "#141414", color: "rgba(255,255,255,0.25)", border: "1px solid #1f1f1f" }}
              title="Intégration Meta à venir"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
              Publier
              <span
                className="rounded px-1.5 py-0.5 text-xs"
                style={{ background: "#1f1f1f", color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
              >
                Bientôt
              </span>
            </button>
          </div>

          {/* Date picker planification */}
          {planifierOuvert && (
            <div
              className="mt-4 rounded-xl p-4 space-y-3"
              style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}
            >
              <p className="text-xs font-semibold text-white">Choisir une date de publication</p>
              <input
                type="date"
                value={dateChoisie}
                onChange={(e) => setDateChoisie(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                style={{ background: "#161616", border: "1px solid #2a2a2a" }}
              />
              <button
                onClick={planifier}
                disabled={!dateChoisie}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90 disabled:opacity-40"
                style={{ background: "#c9a84c", color: "#0a0a0a" }}
              >
                Confirmer
              </button>
            </div>
          )}
        </div>

        {/* Visuels — 2/5 */}
        <div className="lg:col-span-2 p-5 space-y-4">
          {(["A", "B"] as const).map((variante) => (
            <div
              key={variante}
              className="rounded-xl overflow-hidden"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              {/* Preview header */}
              <div
                className="flex items-center justify-between px-3 py-2.5"
                style={{ background: variante === "A" ? "#172554" : "#0f172a" }}
              >
                {logo ? (
                  <img src={logo} alt="Logo" className="h-7 max-w-20 object-contain rounded" style={{ background: "rgba(255,255,255,0.9)", padding: "2px" }} />
                ) : (
                  <p className="text-xs font-bold text-white">{agence?.nomAgence || "Studio Immo"}</p>
                )}
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ background: "#c9a84c", color: "#0a0a0a" }}
                >
                  {variante === "A" ? "Nouveau bien" : "Coup de cœur"}
                </span>
              </div>

              {/* Photo */}
              {selectedPhotos.length > 0 ? (
                <div className="grid h-36 grid-cols-3 grid-rows-3 gap-0.5">
                  <img src={selectedPhotos[0]} className="col-span-3 row-span-2 h-full w-full object-cover" alt="" />
                  {selectedPhotos.slice(1, 4).map((p, i) => (
                    <img key={i} src={p} className="h-full w-full object-cover" alt="" />
                  ))}
                </div>
              ) : (
                <div className="h-36 flex items-center justify-center text-xs" style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.25)" }}>
                  Aucune photo
                </div>
              )}

              {/* Accroche */}
              <div className="p-3">
                <p className="text-xs font-semibold leading-snug text-white line-clamp-2">
                  {publication.accroche}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {bien?.ville && (
                    <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "#172554", color: "#fff" }}>
                      {bien.ville}
                    </span>
                  )}
                  {bien?.afficherPrix && bien?.prix && (
                    <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: "#c9a84c", color: "#0a0a0a" }}>
                      {bien.prix}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-3 pb-3">
                <button
                  onClick={() => onTelecharger(publication, index, variante)}
                  className="w-full rounded-lg py-2 text-xs font-bold transition-all duration-150 hover:opacity-90"
                  style={{ background: "#c9a84c", color: "#0a0a0a" }}
                >
                  Télécharger {variante}
                </button>
                {(variante === "A" ? publication.ideeVisuelA : publication.ideeVisuelB) && (
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                    💡 {variante === "A" ? publication.ideeVisuelA : publication.ideeVisuelB}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResultatsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultatIA | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [bien, setBien] = useState<Bien | null>(null);
  const [agence, setAgence] = useState<Agence | null>(null);
  const [logo, setLogo] = useState("");
  const [photoPrincipale, setPhotoPrincipale] = useState(0);
  const [photosPerduesToast, setPhotosPerduesToast] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem("studio_immo_resultat");
    if (!savedResult) { router.replace("/nouveau-bien"); return; }

    const savedPhotos = sessionStorage.getItem("studio_immo_photos");
    const savedLogo = sessionStorage.getItem("studio_immo_logo");
    const savedBien = localStorage.getItem("studio_immo_bien");
    const savedAgence = localStorage.getItem("studio_immo_agence");
    const savedIdx = localStorage.getItem("studio_immo_photo_principale");

    setData(JSON.parse(savedResult));
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    else setPhotosPerduesToast(true);
    if (savedBien) setBien(JSON.parse(savedBien));
    if (savedAgence) setAgence(JSON.parse(savedAgence));
    if (savedLogo) setLogo(savedLogo);
    if (savedIdx) setPhotoPrincipale(Number(savedIdx));
  }, [router]);

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    const ratio = Math.max(w / img.width, h / img.height);
    const nw = img.width * ratio, nh = img.height * ratio;
    ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
    const words = text.split(" ");
    let line = "", linesDrawn = 0;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        if (linesDrawn >= maxLines - 1) { ctx.fillText(line.trimEnd() + "…", x, y); return; }
        ctx.fillText(line, x, y);
        line = words[i] + " "; y += lineHeight; linesDrawn++;
      } else { line = testLine; }
    }
    ctx.fillText(line, x, y);
  }

  async function telechargerVisuel(publication: Publication, index: number, variante: "A" | "B") {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080; canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cover = photos[photoPrincipale] || photos[0];
      const autresPhotos = photos.filter((_, i) => i !== photoPrincipale);
      const selectedPhotos = [cover, ...autresPhotos].filter(Boolean).slice(0, 4);

      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = variante === "A" ? "#172554" : "#0f172a"; ctx.fillRect(0, 0, 1080, 150);

      if (logo) { const logoImg = await loadImage(logo); drawCover(ctx, logoImg, 55, 35, 170, 80); }
      else { ctx.fillStyle = "#ffffff"; ctx.font = "bold 44px Arial"; ctx.fillText(agence?.nomAgence || "STUDIO IMMO", 55, 92); }

      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 32px Arial";
      ctx.fillText(variante === "A" ? "NOUVEAU BIEN" : "COUP DE CŒUR", 730, 92);

      if (selectedPhotos.length > 0) {
        const img1 = await loadImage(selectedPhotos[0]); drawCover(ctx, img1, 55, 190, 970, 580);
        for (let i = 1; i < Math.min(selectedPhotos.length, 4); i++) {
          const img = await loadImage(selectedPhotos[i]); drawCover(ctx, img, 55 + (i - 1) * 330, 790, 310, 210);
        }
      }

      ctx.fillStyle = "#172554"; ctx.font = "bold 54px Arial";
      wrapText(ctx, publication.accroche || "Votre futur bien vous attend", 55, 1100, 970, 62, 3);

      ctx.font = "bold 30px Arial";
      if (bien?.ville) { ctx.fillStyle = "#172554"; ctx.fillText(`📍 ${bien.ville}`, 55, 1245); }
      if (bien?.surface) { ctx.fillStyle = "#172554"; ctx.fillText(`🏠 ${bien.surface}`, 360, 1245); }
      if (bien?.afficherPrix && bien?.prix) { ctx.fillStyle = "#f59e0b"; ctx.fillText(`💰 ${bien.prix}`, 610, 1245); }
      if (agence?.telephone) { ctx.fillStyle = "#475569"; ctx.font = "bold 28px Arial"; ctx.fillText(`📞 ${agence.telephone}`, 55, 1310); }

      const link = document.createElement("a");
      link.download = `studio-immo-${index + 1}-${variante}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Erreur lors de la génération du visuel.");
    }
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full" style={{ border: "2px solid #1f1f1f", borderTopColor: "#c9a84c" }} />
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 lg:px-8"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }}
      >
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Studio <span style={{ color: "#c9a84c" }}>Immo</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/nouveau-bien"
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.7)", border: "1px solid #2a2a2a" }}
          >
            ← Nouveau bien
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8 space-y-8">

        {photosPerduesToast && (
          <div
            className="rounded-xl px-5 py-4 text-sm font-medium"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}
          >
            ⚠️ Les photos ne sont plus disponibles après un rechargement. Retournez sur le formulaire pour les remettre.
          </div>
        )}

        {/* Hero */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#c9a84c", letterSpacing: "0.1em" }}
          >
            Stratégie générée
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white tracking-tight">
            {bien?.titre || "Votre bien"}
            {bien?.ville && <span className="ml-2 text-xl font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>— {bien.ville}</span>}
          </h1>
        </div>

        {/* Synthèse */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div
            className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em" }}
            >
              Profil acheteur
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              {data.profilAcheteur}
            </p>
          </div>

          <div
            className="rounded-2xl p-5 lg:col-span-2"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em" }}
            >
              Points forts
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.pointsForts?.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.strategie && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em" }}
            >
              Stratégie de publication
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {data.strategie}
            </p>
          </div>
        )}

        {/* Campagnes */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}
          >
            {data.publications?.length} campagnes
          </p>
          <div className="space-y-5">
            {data.publications?.map((pub, idx) => (
              <CampagneCard
                key={idx}
                publication={pub}
                index={idx}
                photos={photos}
                photoPrincipale={photoPrincipale}
                bien={bien}
                agence={agence}
                logo={logo}
                onTelecharger={telechargerVisuel}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
