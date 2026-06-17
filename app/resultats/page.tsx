"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
  analysePhotos?: string;
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

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "SI";
}

const ONGLETS: { key: Onglet; label: string }[] = [
  { key: "facebook",  label: "Facebook"  },
  { key: "instagram", label: "Instagram" },
  { key: "story",     label: "Story"     },
];

/* ── Photo album (style Facebook) ───────────────────────────── */
function PhotoAlbum({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  const maxShow = 4;
  const shown = photos.slice(0, maxShow);
  const extra = Math.max(0, photos.length - maxShow);
  const n = shown.length;

  const img = (src: string, h: string, style?: CSSProperties) => (
    <img src={src} alt="" style={{ width: "100%", height: h, maxHeight: h, objectFit: "cover", display: "block", ...style }} />
  );

  if (n === 1) return img(shown[0], "220px");

  if (n === 2) return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
      {shown.map((p, i) => <div key={i}>{img(p, "180px")}</div>)}
    </div>
  );

  if (n === 3) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {img(shown[0], "160px")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        {img(shown[1], "120px")}
        {img(shown[2], "120px")}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {img(shown[0], "160px")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
        {shown.slice(1).map((p, i) => {
          const isLast = i === 2 && extra > 0;
          return (
            <div key={i} style={{ position: "relative" }}>
              {img(p, "100px")}
              {isLast && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: 700, color: "white" }}>+{extra}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── CampagneCard ────────────────────────────────────────────── */
function CampagneCard({
  pub, index, photos, photoPrincipale, agence, logo, onUpdate, datePlanifiee, onPlanifier,
}: {
  pub: Publication; index: number; photos: string[]; photoPrincipale: number;
  agence: Agence | null; logo: string;
  onUpdate: (field: Onglet, value: string) => Promise<void>;
  datePlanifiee?: string;
  onPlanifier: (date: string) => Promise<void>;
}) {
  const [onglet, setOnglet]               = useState<Onglet>("facebook");
  const [copieId, setCopieId]             = useState<string | null>(null);
  const [planifie, setPlanifie]           = useState(false);
  const [datePicker, setDatePicker]       = useState(false);
  const [date, setDate]                   = useState(() => {
    if (datePlanifiee) return toDateTimeLocal(datePlanifiee);
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
  });
  const [dateSauvegardee, setDateSauvegardee] = useState(datePlanifiee ?? "");
  const [saving, setSaving]               = useState(false);
  const [erreurPlanif, setErreurPlanif]   = useState(false);
  const [editing, setEditing]             = useState(false);
  const [editValue, setEditValue]         = useState("");
  const [editSaving, setEditSaving]       = useState(false);
  const [editSaved,   setEditSaved]       = useState(false);

  useEffect(() => {
    if (datePlanifiee) { setDateSauvegardee(datePlanifiee); setDate(toDateTimeLocal(datePlanifiee)); }
  }, [datePlanifiee]);

  const cover = photos[photoPrincipale] ?? photos[0];
  const orderedPhotos = cover
    ? [cover, ...photos.filter((_, i) => i !== photoPrincipale)].filter(Boolean)
    : photos.filter(Boolean);

  const nomAgence = agence?.nomAgence || "Studio Immo";
  const initials  = getInitials(nomAgence);

  function copier(texte: string, id: string) {
    navigator.clipboard.writeText(texte).catch(() => {});
    setCopieId(id); setTimeout(() => setCopieId(null), 2000);
  }

  function changerOnglet(o: Onglet) { setEditing(false); setOnglet(o); }

  function demarrerEdition() { setEditValue(pub[onglet]); setEditing(true); }

  async function validerEdition() {
    const field = onglet;
    const value = editValue;
    setEditing(false);
    setEditSaving(true);
    try {
      await onUpdate(field, value);
      setEditSaved(true);
      setTimeout(() => setEditSaved(false), 2000);
    } catch { /* état local déjà mis à jour */ }
    finally { setEditSaving(false); }
  }

  async function confirmerPlanif() {
    setErreurPlanif(false);
    if (!date) return;
    setSaving(true);
    try {
      await onPlanifier(date);
      setDateSauvegardee(date); setPlanifie(true); setDatePicker(false);
      setTimeout(() => setPlanifie(false), 4000);
    } catch (e) {
      console.error("[confirmerPlanif] erreur:", e);
      setErreurPlanif(true);
    } finally { setSaving(false); }
  }

  return (
    <div className="animate-fade-up" style={{ background: "#ffffff", border: "1.5px solid #E0E0E8", borderRadius: "14px", overflow: "hidden" }}>

      {/* Publication header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{pub.jourPublication}</p>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>{pub.titre}</h2>
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px", marginBottom: 0 }}>{pub.objectif}</p>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Network tabs */}
        <div style={{ display: "flex", gap: "2px", background: "#F3F4F6", borderRadius: "8px", padding: "3px" }}>
          {ONGLETS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => changerOnglet(key)}
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
                background: onglet === key ? "#ffffff" : "transparent",
                color: onglet === key ? "#111827" : "#9CA3AF",
                border: onglet === key ? "1px solid #E0E0E8" : "1px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Post preview */}
        <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E5E7EB", maxWidth: "100%" }}>
          {/* Agency header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderBottom: "1px solid #F3F4F6" }}>
            {logo ? (
              <img src={logo} alt={nomAgence} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "contain", background: "#F3F4F6", padding: "2px", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{nomAgence}</p>
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>Page · Immobilier</p>
            </div>
          </div>

          {/* Post text */}
          <div style={{ padding: "12px 14px", borderBottom: orderedPhotos.length > 0 ? "1px solid #F3F4F6" : "none" }}>
            {editing ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={{ width: "100%", resize: "vertical", background: "transparent", outline: "none", fontSize: "14px", color: "#111827", lineHeight: 1.6, minHeight: "120px", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "8px", fontFamily: "inherit" }}
                autoFocus
              />
            ) : (
              <p style={{ fontSize: "14px", color: "#111827", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
                {pub[onglet]}
              </p>
            )}
          </div>

          {orderedPhotos.length > 0 && <PhotoAlbum photos={orderedPhotos} />}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
            <button onClick={demarrerEdition} className="btn" style={{ background: "#ffffff", border: "1px solid #E0E0E8", color: "#374151", padding: "9px 14px" }}>
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
              background: copieId === `${index}-${onglet}` ? "var(--ok-10)" : "#7C3AED",
              color:      copieId === `${index}-${onglet}` ? "var(--ok)" : "#ffffff",
              border:     copieId === `${index}-${onglet}` ? "1px solid rgba(34,197,94,0.2)" : "none",
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
            className="btn"
            style={{
              background: "#ffffff",
              padding: "9px 14px",
              color:  planifie || dateSauvegardee ? "var(--ok)" : "#374151",
              border: dateSauvegardee && !planifie ? "1px solid rgba(34,197,94,0.3)" : "1px solid #E0E0E8",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {planifie ? "✓ Planifié" : dateSauvegardee ? "Replanifier" : "Planifier"}
          </button>

          <button
            className="btn"
            style={{ background: "#F3F4F6", color: "#9CA3AF", border: "1px solid #E0E0E8", padding: "9px 14px", cursor: "not-allowed" }}
            title="Intégration Meta disponible prochainement"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
            Publier
            <span style={{ background: "#E5E7EB", color: "#9CA3AF", fontSize: "9px", borderRadius: "4px", padding: "1px 5px" }}>
              Bientôt
            </span>
          </button>
        </div>

        {(editSaving || editSaved) && (
          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: editSaved ? "var(--ok)" : "#9CA3AF" }}>
            {editSaved ? (
              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Sauvegardé ✓</>
            ) : "Enregistrement…"}
          </p>
        )}

        {dateSauvegardee && !datePicker && !planifie && (
          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--ok)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Planifié le {formatDatePlanifiee(dateSauvegardee)}
          </p>
        )}

        {datePicker && (
          <div className="animate-scale-in" style={{ background: "#F3F4F6", border: "1px solid #E0E0E8", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280", margin: 0 }}>Date et heure de publication</p>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={(() => { const n = new Date(); n.setMinutes(n.getMinutes() - n.getTimezoneOffset()); return n.toISOString().slice(0, 16); })()}
              className="input text-sm"
            />
            {erreurPlanif && (
              <p style={{ fontSize: "12px", color: "var(--err)", margin: 0 }}>La sauvegarde a échoué. Réessayez.</p>
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
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────────── */
export default function ResultatsPage() {
  const router = useRouter();
  const [data,            setData]            = useState<ResultatIA | null>(null);
  const [photos,          setPhotos]          = useState<string[]>([]);
  const [bien,            setBien]            = useState<Bien | null>(null);
  const [agence,          setAgence]          = useState<Agence | null>(null);
  const [logo,            setLogo]            = useState("");
  const [photoPrincipale, setPhotoPrincipale] = useState(0);
  const [photosToast,     setPhotosToast]     = useState(false);
  const [generationId,    setGenerationId]    = useState<string | null>(null);
  const [planifications,  setPlanifications]  = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("studio_immo_resultat");
    if (!saved) { router.replace("/nouveau-bien"); return; }

    const savedPhotos = sessionStorage.getItem("studio_immo_photos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      const photosUrls = localStorage.getItem("studio_immo_photos_urls");
      const urls: string[] = photosUrls ? JSON.parse(photosUrls) : [];
      if (urls.length > 0) setPhotos(urls);
      else setPhotosToast(true);
    }

    setData(JSON.parse(saved));
    const b     = localStorage.getItem("studio_immo_bien");
    const a     = localStorage.getItem("studio_immo_agence");
    const l     = sessionStorage.getItem("studio_immo_logo") || localStorage.getItem("studio_immo_logo");
    const idx   = localStorage.getItem("studio_immo_photo_principale");
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
    const resp = await fetch(`/api/generations/${generationId}/planification`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_index: index, date_planifiee: date }),
    });
    if (!resp.ok) throw new Error("Échec de la sauvegarde");
    setPlanifications((prev) => ({ ...prev, [index]: date }));
  }

  async function updatePublication(index: number, field: Onglet, value: string): Promise<void> {
    setData((prev) => {
      if (!prev) return prev;
      const publications = prev.publications.map((p, i) => i === index ? { ...p, [field]: value } : p);
      return { ...prev, publications };
    });

    try {
      const savedStr = localStorage.getItem("studio_immo_resultat");
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.publications?.[index]) {
          saved.publications[index][field] = value;
          localStorage.setItem("studio_immo_resultat", JSON.stringify(saved));
        }
      }
    } catch { /* ignore */ }

    if (!generationId) return;
    const resp = await fetch(`/api/generations/${generationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_index: index, field, value }),
    });
    if (!resp.ok) throw new Error("Échec de la sauvegarde");
  }

  if (!data) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#F4F3F7" }}>
        <div style={{ textAlign: "center" }}>
          <div className="animate-spin" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #E5E7EB", borderTopColor: "#7C3AED", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Chargement…</p>
        </div>
      </div>
    );
  }

  const coverPhoto = photos[photoPrincipale] ?? photos[0];
  const infoLine = [
    bien?.ville,
    bien?.surface,
    bien?.afficherPrix !== false ? bien?.prix : null,
  ].filter(Boolean).join(" · ");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* Topbar */}
      <header style={{ height: "52px", flexShrink: 0, background: "#1E1B2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "26px", height: "26px", background: "#7C3AED", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
            Studio <span style={{ color: "#A78BFA" }}>Immo</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/nouveau-bien" style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            ← Nouveau bien
          </Link>
          <Link href="/dashboard" style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 600, color: "#ffffff", background: "#7C3AED", borderRadius: "8px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main row */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left sidebar */}
        <aside style={{ width: "320px", flexShrink: 0, background: "#1E1B2E", overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column" }}>

          {/* Label */}
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Stratégie générée
          </p>

          {/* Titre bien */}
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", lineHeight: 1.3, marginBottom: "8px" }}>
            {bien?.titre || "Votre bien"}
          </h1>

          {/* Ville · surface · prix */}
          {infoLine && (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
              {infoLine}
            </p>
          )}

          {/* Badge campagnes */}
          <div style={{ marginBottom: "16px" }}>
            <span style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "20px", fontSize: "11px", padding: "3px 10px" }}>
              {data.publications?.length} campagnes
            </span>
          </div>

          {/* Photo principale */}
          {coverPhoto ? (
            <img src={coverPhoto} alt="" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", marginBottom: "16px", flexShrink: 0 }} />
          ) : (
            <div style={{ width: "100%", height: "140px", background: "#2D2B3D", borderRadius: "10px", marginBottom: "16px", flexShrink: 0 }} />
          )}

          {/* Separator */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }} />

          {/* Profil acheteur */}
          {data.profilAcheteur && (
            <>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>Profil acheteur</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>{data.profilAcheteur}</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }} />
            </>
          )}

          {/* Points forts */}
          {(data.pointsForts?.length ?? 0) > 0 && (
            <>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Points forts</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", padding: 0, listStyle: "none" }}>
                {data.pointsForts.map((p, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{p}</span>
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }} />
            </>
          )}

          {/* Stratégie */}
          {data.strategie && (
            <>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>Stratégie</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{data.strategie}</p>
            </>
          )}
        </aside>

        {/* Right column */}
        <main style={{ flex: 1, background: "#F4F3F7", overflowY: "auto", padding: "24px 20px" }}>

          {/* Photos toast */}
          {photosToast && (
            <div style={{ background: "var(--warn-10)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize: "13px", color: "var(--warn)", margin: 0 }}>
                Les photos ne sont plus disponibles après un rechargement. Retournez sur le formulaire pour les remettre.
              </p>
            </div>
          )}

          {/* Campaigns */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.publications?.map((pub, idx) => (
              <CampagneCard
                key={idx}
                pub={pub}
                index={idx}
                photos={photos}
                photoPrincipale={photoPrincipale}
                agence={agence}
                logo={logo}
                onUpdate={(field, value) => updatePublication(idx, field, value)}
                datePlanifiee={planifications[idx]}
                onPlanifier={(date) => planifier(idx, date)}
              />
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", paddingTop: "20px" }}>
            <Link href="/nouveau-bien" className="btn" style={{ padding: "11px 20px", background: "#ffffff", border: "1px solid #E0E0E8", color: "#374151" }}>
              ← Créer un autre bien
            </Link>
            <Link href="/dashboard" className="btn" style={{ padding: "11px 20px", background: "#ffffff", border: "1px solid #E0E0E8", color: "#374151" }}>
              Retour au dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
