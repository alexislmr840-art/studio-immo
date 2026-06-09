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

function toDateTimeLocal(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ""; }
}

function formatDatePlanifiee(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
  } catch { return iso; }
}

const ONGLETS: { key: Onglet; label: string; color: string }[] = [
  { key: "facebook", label: "Facebook", color: "#3b82f6" },
  { key: "instagram", label: "Instagram", color: "#ec4899" },
  { key: "story", label: "Story", color: "var(--gold)" },
];

function CampagneCard({
  pub, index, photos, photoPrincipale, bien, agence, logo, onTelecharger, onUpdate, datePlanifiee, onPlanifier,
}: {
  pub: Publication; index: number; photos: string[]; photoPrincipale: number;
  bien: Bien | null; agence: Agence | null; logo: string;
  onTelecharger: (p: Publication, i: number, v: "A" | "B") => void;
  onUpdate: (field: Onglet, value: string) => void;
  datePlanifiee?: string;
  onPlanifier: (date: string) => Promise<void>;
}) {
  const [onglet, setOnglet] = useState<Onglet>("facebook");
  const [copieId, setCopieId] = useState<string | null>(null);
  const [planifie, setPlanifie] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(() => datePlanifiee ? toDateTimeLocal(datePlanifiee) : "");
  const [dateSauvegardee, setDateSauvegardee] = useState(datePlanifiee ?? "");
  const [saving, setSaving] = useState(false);
  const [erreurPlanif, setErreurPlanif] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const cover = photos[photoPrincipale] || photos[0];
  const autres = photos.filter((_, i) => i !== photoPrincipale);
  const selected = [cover, ...autres].filter(Boolean).slice(0, 4);

  function copier(texte: string, id: string) {
    navigator.clipboard.writeText(texte).catch(() => {});
    setCopieId(id);
    setTimeout(() => setCopieId(null), 2000);
  }

  function changerOnglet(o: Onglet) {
    setEditing(false);
    setOnglet(o);
  }

  function demarrerEdition() {
    setEditValue(pub[onglet]);
    setEditing(true);
  }

  function validerEdition() {
    onUpdate(onglet, editValue);
    setEditing(false);
  }

  async function confirmerPlanif() {
    if (!date) return;
    setSaving(true);
    setErreurPlanif(false);
    try {
      await onPlanifier(date);
      setDateSauvegardee(date);
      setPlanifie(true);
      setDatePicker(false);
      setTimeout(() => setPlanifie(false), 4000);
    } catch {
      setErreurPlanif(true);
    } finally {
      setSaving(false);
    }
  }

  const activeOnglet = ONGLETS.find((o) => o.key === onglet)!;

  return (
    <div className="card overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4" style={{ borderBottom: "1px solid var(--border-s)" }}>
        <div>
          <p className="label mb-1.5" style={{ color: "var(--gold)" }}>{pub.jourPublication}</p>
          <h2 className="font-bold text-white" style={{ fontSize: "16px", letterSpacing: "-0.015em" }}>{pub.titre}</h2>
          <p style={{ fontSize: "12.5px", color: "var(--txt-4)", marginTop: "2px" }}>{pub.objectif}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5">
        {/* Text content — 3/5 */}
        <div className="lg:col-span-3 p-5" style={{ borderRight: "1px solid var(--border-s)" }}>
          {/* Network tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
            {ONGLETS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => changerOnglet(key)}
                className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150"
                style={{
                  background: onglet === key ? "var(--bg-4)" : "transparent",
                  color: onglet === key ? "#fff" : "var(--txt-4)",
                  borderBottom: onglet === key ? `2px solid ${color}` : "2px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Text content */}
          <div
            className="rounded-xl p-4 mb-4 min-h-36"
            style={{ background: "var(--bg-2)", border: editing ? "1px solid var(--gold)" : "1px solid var(--border-s)" }}
          >
            {editing ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
                style={{ color: "var(--txt-2)", minHeight: "120px" }}
                autoFocus
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--txt-2)" }}>
                {pub[onglet]}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <button
                onClick={validerEdition}
                className="btn"
                style={{ background: "var(--ok-10)", color: "var(--ok)", border: "1px solid rgba(34,197,94,0.2)", padding: "9px 16px" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Valider
              </button>
            ) : (
              <button
                onClick={demarrerEdition}
                className="btn btn-secondary"
                style={{ padding: "9px 14px" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modifier
              </button>
            )}

            <button
              onClick={() => copier(pub[onglet], `${index}-${onglet}`)}
              className="btn"
              style={{
                background: copieId === `${index}-${onglet}` ? "var(--ok-10)" : "var(--gold)",
                color: copieId === `${index}-${onglet}` ? "var(--ok)" : "#0a0a0a",
                border: copieId === `${index}-${onglet}` ? "1px solid rgba(34,197,94,0.2)" : "none",
                padding: "9px 16px",
              }}
            >
              {copieId === `${index}-${onglet}` ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copié !</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier</>
              )}
            </button>

            <button
              onClick={() => { setDatePicker(!datePicker); setErreurPlanif(false); }}
              className="btn btn-secondary"
              style={{
                padding: "9px 14px",
                color: planifie || dateSauvegardee ? "var(--ok)" : undefined,
                border: dateSauvegardee && !planifie ? "1px solid rgba(34,197,94,0.3)" : undefined,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {planifie ? "✓ Planifié" : dateSauvegardee ? "Replanifier" : "Planifier"}
            </button>

            <button
              className="btn"
              style={{
                background: "var(--bg-3)",
                color: "var(--txt-4)",
                border: "1px solid var(--border-s)",
                padding: "9px 14px",
                cursor: "not-allowed",
              }}
              title="Intégration Meta disponible prochainement"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
              Publier
              <span className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--bg-4)", color: "var(--txt-4)", fontSize: "9px" }}>
                Bientôt
              </span>
            </button>
          </div>

          {dateSauvegardee && !datePicker && !planifie && (
            <p className="mt-2 flex items-center gap-1.5" style={{ fontSize: "11px", color: "var(--ok)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Planifié le {formatDatePlanifiee(dateSauvegardee)}
            </p>
          )}

          {datePicker && (
            <div
              className="mt-3 rounded-xl p-4 space-y-3 animate-scale-in"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
            >
              <p className="label">Date et heure de publication</p>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="input text-sm"
              />
              {erreurPlanif && (
                <p style={{ fontSize: "12px", color: "var(--err)" }}>
                  La sauvegarde a échoué. Réessayez.
                </p>
              )}
              <button
                onClick={confirmerPlanif}
                disabled={!date || saving}
                className="btn btn-primary"
                style={{ padding: "9px 16px" }}
              >
                {saving ? "Enregistrement…" : "Confirmer"}
              </button>
            </div>
          )}
        </div>

        {/* Visuals — 2/5 */}
        <div className="lg:col-span-2 p-4 space-y-3" style={{ background: "var(--bg-2)" }}>
          {(["A", "B"] as const).map((v) => (
            <div key={v} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-s)" }}>
              {/* Visual header */}
              <div className="flex items-center justify-between px-3 py-2"
                   style={{ background: v === "A" ? "#172554" : "#0f172a" }}>
                {logo ? (
                  <img src={logo} alt="" className="h-6 max-w-20 object-contain rounded"
                       style={{ background: "rgba(255,255,255,0.9)", padding: "2px" }}/>
                ) : (
                  <p className="text-xs font-bold text-white">{agence?.nomAgence || "Studio Immo"}</p>
                )}
                <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{ background: "var(--gold)", color: "#0a0a0a", fontSize: "9px" }}>
                  {v === "A" ? "Nouveau bien" : "Coup de cœur"}
                </span>
              </div>

              {/* Photo */}
              {selected.length > 0 ? (
                <div className="grid h-32 grid-cols-3 grid-rows-3 gap-px" style={{ background: "var(--border-s)" }}>
                  <img src={selected[0]} className="col-span-3 row-span-2 h-full w-full object-cover" alt=""/>
                  {selected.slice(1, 4).map((p, i) => (
                    <img key={i} src={p} className="h-full w-full object-cover" alt=""/>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center" style={{ background: "var(--bg-3)" }}>
                  <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>Aucune photo</p>
                </div>
              )}

              {/* Caption */}
              <div className="p-3">
                <p className="font-semibold text-white text-xs leading-snug line-clamp-2 mb-2">{pub.accroche}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bien?.ville && (
                    <span className="rounded-full px-1.5 py-0.5 text-xs" style={{ background: "#172554", color: "#fff", fontSize: "9px" }}>
                      {bien.ville}
                    </span>
                  )}
                  {bien?.afficherPrix && bien?.prix && (
                    <span className="rounded-full px-1.5 py-0.5 text-xs font-bold" style={{ background: "var(--gold)", color: "#0a0a0a", fontSize: "9px" }}>
                      {bien.prix}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onTelecharger(pub, index, v)}
                  className="btn btn-primary w-full"
                  style={{ padding: "7px", fontSize: "11px" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger {v}
                </button>
              </div>

              {(v === "A" ? pub.ideeVisuelA : pub.ideeVisuelB) && (
                <div className="px-3 pb-3">
                  <p style={{ fontSize: "10px", color: "var(--txt-4)", lineHeight: 1.5 }}>
                    💡 {v === "A" ? pub.ideeVisuelA : pub.ideeVisuelB}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
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
  const [photosToast, setPhotosToast] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [planifications, setPlanifications] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("studio_immo_resultat");
    if (!saved) { router.replace("/nouveau-bien"); return; }

    const savedPhotos = sessionStorage.getItem("studio_immo_photos");
    if (!savedPhotos) setPhotosToast(true);
    else setPhotos(JSON.parse(savedPhotos));

    setData(JSON.parse(saved));
    const b = localStorage.getItem("studio_immo_bien");
    const a = localStorage.getItem("studio_immo_agence");
    const l = sessionStorage.getItem("studio_immo_logo");
    const idx = localStorage.getItem("studio_immo_photo_principale");
    const genId = localStorage.getItem("studio_immo_generation_id");
    if (b) setBien(JSON.parse(b));
    if (a) setAgence(JSON.parse(a));
    if (l) setLogo(l);
    if (idx) setPhotoPrincipale(Number(idx));
    if (genId) {
      setGenerationId(genId);
      fetch(`/api/generations/${genId}/planification`)
        .then((r) => r.ok ? r.json() : [])
        .then((rows: { publication_index: number; date_planifiee: string }[]) => {
          const map: Record<number, string> = {};
          rows.forEach((r) => { map[r.publication_index] = r.date_planifiee; });
          setPlanifications(map);
        })
        .catch(() => {});
    }
  }, [router]);

  async function planifier(index: number, date: string) {
    console.log("[planifier] generationId:", generationId, "index:", index, "date:", date);
    if (!generationId) {
      console.error("[planifier] generationId est null — la génération n'a pas été sauvegardée en base");
      throw new Error("Génération non liée");
    }
    console.log("[planifier] fetch PUT", `/api/generations/${generationId}/planification`);
    const resp = await fetch(`/api/generations/${generationId}/planification`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_index: index, date_planifiee: date }),
    });
    if (!resp.ok) throw new Error("Échec de la sauvegarde");
    setPlanifications((prev) => ({ ...prev, [index]: date }));
  }

  function updatePublication(index: number, field: Onglet, value: string) {
    setData((prev) => {
      if (!prev) return prev;
      const publications = prev.publications.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      );
      return { ...prev, publications };
    });
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = src;
    });
  }

  function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    const ratio = Math.max(w / img.width, h / img.height);
    const nw = img.width * ratio, nh = img.height * ratio;
    ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines: number) {
    const words = text.split(" ");
    let line = "", drawn = 0;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxW && i > 0) {
        if (drawn >= maxLines - 1) { ctx.fillText(line.trimEnd() + "…", x, y); return; }
        ctx.fillText(line, x, y); line = words[i] + " "; y += lh; drawn++;
      } else line = test;
    }
    ctx.fillText(line, x, y);
  }

  async function telechargerVisuel(pub: Publication, index: number, variante: "A" | "B") {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080; canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cover = photos[photoPrincipale] || photos[0];
      const autres = photos.filter((_, i) => i !== photoPrincipale);
      const selected = [cover, ...autres].filter(Boolean).slice(0, 4);

      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = variante === "A" ? "#172554" : "#0f172a"; ctx.fillRect(0, 0, 1080, 150);

      if (logo) { const li = await loadImage(logo); drawCover(ctx, li, 55, 35, 170, 80); }
      else { ctx.fillStyle = "#fff"; ctx.font = "bold 44px Arial"; ctx.fillText(agence?.nomAgence || "STUDIO IMMO", 55, 92); }

      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 32px Arial";
      ctx.fillText(variante === "A" ? "NOUVEAU BIEN" : "COUP DE CŒUR", 730, 92);

      if (selected.length > 0) {
        const img1 = await loadImage(selected[0]); drawCover(ctx, img1, 55, 190, 970, 580);
        for (let i = 1; i < Math.min(selected.length, 4); i++) {
          const img = await loadImage(selected[i]); drawCover(ctx, img, 55 + (i - 1) * 330, 790, 310, 210);
        }
      }

      ctx.fillStyle = "#172554"; ctx.font = "bold 54px Arial";
      wrapText(ctx, pub.accroche || "Votre futur bien vous attend", 55, 1100, 970, 62, 3);

      ctx.font = "bold 30px Arial";
      if (bien?.ville) { ctx.fillStyle = "#172554"; ctx.fillText(`📍 ${bien.ville}`, 55, 1245); }
      if (bien?.surface) { ctx.fillStyle = "#172554"; ctx.fillText(`🏠 ${bien.surface}`, 360, 1245); }
      if (bien?.afficherPrix && bien?.prix) { ctx.fillStyle = "#f59e0b"; ctx.fillText(`💰 ${bien.prix}`, 610, 1245); }
      if (agence?.telephone) { ctx.fillStyle = "#475569"; ctx.font = "bold 28px Arial"; ctx.fillText(`📞 ${agence.telephone}`, 55, 1310); }

      const link = document.createElement("a");
      link.download = `studio-immo-${index + 1}-${variante}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { alert("Erreur lors de la génération du visuel."); }
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full" style={{ border: "2px solid var(--bg-4)", borderTopColor: "var(--gold)" }}/>
          <p style={{ fontSize: "13px", color: "var(--txt-4)" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* Sticky header */}
      <header
        className="glass sticky top-0 z-20 flex items-center justify-between px-6 py-4 lg:px-8"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gold)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            </svg>
          </div>
          <span className="font-bold text-white" style={{ fontSize: "15px" }}>
            Studio <span style={{ color: "var(--gold)" }}>Immo</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/nouveau-bien" className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: "12px" }}>
            ← Nouveau bien
          </Link>
          <Link href="/dashboard" className="btn btn-secondary" style={{ padding: "8px 12px", fontSize: "12px" }}>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8 space-y-6">

        {/* Photos toast */}
        {photosToast && (
          <div className="rounded-xl px-5 py-4 flex items-center gap-3"
               style={{ background: "var(--warn-10)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p style={{ fontSize: "13px", color: "var(--warn)" }}>
              Les photos ne sont plus disponibles après un rechargement. Retournez sur le formulaire pour les remettre.
            </p>
          </div>
        )}

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="label" style={{ color: "var(--gold)" }}>Stratégie générée</p>
            <div className="badge badge-ok">{data.publications?.length} campagnes</div>
          </div>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", letterSpacing: "-0.025em" }}>
            {bien?.titre || "Votre bien"}
            {bien?.ville && (
              <span className="ml-2 font-medium" style={{ color: "var(--txt-3)", fontSize: "0.75em" }}>
                — {bien.ville}
              </span>
            )}
          </h1>
        </div>

        {/* Summary row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5">
            <p className="label mb-3" style={{ color: "var(--txt-4)" }}>Profil acheteur</p>
            <p style={{ fontSize: "13px", color: "var(--txt-2)", lineHeight: 1.7 }}>{data.profilAcheteur}</p>
          </div>
          <div className="card p-5 lg:col-span-2">
            <p className="label mb-3" style={{ color: "var(--txt-4)" }}>Points forts identifiés</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.pointsForts?.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--txt-2)" }}>
                  <svg className="mt-0.5 flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.strategie && (
          <div className="card p-5">
            <p className="label mb-3" style={{ color: "var(--txt-4)" }}>Stratégie de publication</p>
            <p style={{ fontSize: "13px", color: "var(--txt-2)", lineHeight: 1.7 }}>{data.strategie}</p>
          </div>
        )}

        {/* Campaigns */}
        <div className="space-y-4">
          {data.publications?.map((pub, idx) => (
            <CampagneCard
              key={idx}
              pub={pub}
              index={idx}
              photos={photos}
              photoPrincipale={photoPrincipale}
              bien={bien}
              agence={agence}
              logo={logo}
              onTelecharger={telechargerVisuel}
              onUpdate={(field, value) => updatePublication(idx, field, value)}
              datePlanifiee={planifications[idx]}
              onPlanifier={(date) => planifier(idx, date)}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/nouveau-bien" className="btn btn-secondary" style={{ padding: "11px 20px" }}>
            ← Créer un autre bien
          </Link>
          <Link href="/dashboard" className="btn btn-ghost" style={{ padding: "11px 20px" }}>
            Retour au dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
