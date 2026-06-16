"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { title: "Le bien",       desc: "Informations et description du mandat" },
  { title: "Votre agence",  desc: "Coordonnées affichées sur les publications" },
  { title: "Les photos",    desc: "Analysées par l'IA pour ancrer les textes" },
];

const INPUT: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E2E0E8",
  borderRadius: "10px",
  padding: "0 15px",
  height: "48px",
  fontSize: "14.5px",
  color: "#15131D",
  background: "white",
  marginBottom: "20px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

function SectionHead({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
      <span style={{
        fontSize: "12px", fontWeight: 600, color: "#15131D",
        textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "#ECEAF0" }} />
    </div>
  );
}

function FieldLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: "13px", color: "#3A3543", fontWeight: 500, marginBottom: "8px",
    }}>
      <span>{children}</span>
      {right && <span style={{ color: "#A8A4B2", fontSize: "12px", fontWeight: 400 }}>{right}</span>}
    </div>
  );
}

export default function NouveauBienPage() {
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [prix, setPrix] = useState("");
  const [surface, setSurface] = useState("");
  const [description, setDescription] = useState("");
  const [nomAgence, setNomAgence] = useState(() => {
    if (typeof window === "undefined") return "";
    try { return JSON.parse(localStorage.getItem("studio_immo_agence") || "{}").nomAgence || ""; } catch { return ""; }
  });
  const [telephone, setTelephone] = useState(() => {
    if (typeof window === "undefined") return "";
    try { return JSON.parse(localStorage.getItem("studio_immo_agence") || "{}").telephone || ""; } catch { return ""; }
  });
  const [afficherPrix, setAfficherPrix] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [logo, setLogo] = useState("");
  const [photoPrincipale, setPhotoPrincipale] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [erreurGeneration, setErreurGeneration] = useState(false);

  const PHOTO_MAX_SIZE = 5 * 1024 * 1024;
  const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const step1Done = titre.trim() !== "" && ville.trim() !== "" && description.trim() !== "";
  const step2Done = step1Done && nomAgence.trim() !== "";
  const currentStep = step2Done ? 3 : step1Done ? 2 : 1;
  const charCount = description.length;
  const isValid = titre.trim() && ville.trim() && description.trim();

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setErreur(""); setErreurGeneration(false);
    const files = Array.from(e.target.files);
    const invalides = files.filter((f) => !PHOTO_TYPES.includes(f.type) || f.size > PHOTO_MAX_SIZE);
    if (invalides.length > 0) {
      setErreur(invalides.length === 1
        ? `1 photo ignorée : format non supporté ou taille supérieure à 5 Mo (${invalides[0].name}).`
        : `${invalides.length} photos ignorées : format non supporté ou taille supérieure à 5 Mo.`);
    }
    const valides = files.filter((f) => PHOTO_TYPES.includes(f.type) && f.size <= PHOTO_MAX_SIZE);
    if (valides.length === 0) return;
    Promise.all(valides.map((f) => new Promise<string>((res) => {
      const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f);
    }))).then((imgs) => setPhotos((prev) => [...prev, ...imgs]));
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (!PHOTO_TYPES.includes(f.type) || f.size > PHOTO_MAX_SIZE) {
      setErreur("Le logo doit être une image JPEG, PNG, WebP ou GIF de moins de 5 Mo."); return;
    }
    const r = new FileReader();
    r.onload = () => { const d = r.result as string; setLogo(d); localStorage.setItem("studio_immo_logo", d); };
    r.readAsDataURL(f);
  }

  function supprimerPhoto(idx: number) {
    setPhotos((p) => p.filter((_, i) => i !== idx));
    if (photoPrincipale === idx) setPhotoPrincipale(0);
    else if (photoPrincipale > idx) setPhotoPrincipale((p) => p - 1);
  }

  function dataUrlToBlob(dataUrl: string): Blob {
    const [header, b64] = dataUrl.split(",");
    const mime = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
    const bytes = atob(b64); const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  async function genererContenus() {
    setErreur(""); setErreurGeneration(false);
    if (!titre.trim() || !ville.trim() || !description.trim()) {
      setErreur("Veuillez remplir le titre, la ville et la description."); return;
    }
    setLoading(true);
    let photosUrls: string[] = [], photoPrincipaleUrl = "", finalPrincipalIdx = photoPrincipale;
    if (photos.length > 0) {
      const results = await Promise.allSettled(photos.map(async (dataUrl) => {
        const blob = dataUrlToBlob(dataUrl); const fd = new FormData();
        fd.append("file", blob, `photo.${blob.type.split("/")[1] || "jpg"}`);
        const r = await fetch("/api/photos", { method: "POST", body: fd });
        const json = await r.json(); if (!r.ok) throw new Error(json.error ?? "upload failed");
        return json.url as string;
      }));
      const ordered = results.map((r) => (r.status === "fulfilled" ? r.value : null));
      photosUrls = ordered.filter((u): u is string => u !== null);
      photoPrincipaleUrl = ordered[photoPrincipale] ?? photosUrls[0] ?? "";
      finalPrincipalIdx = photoPrincipaleUrl ? Math.max(0, photosUrls.indexOf(photoPrincipaleUrl)) : 0;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) setErreur(`${failed} photo${failed > 1 ? "s" : ""} n'ont pas pu être uploadées — la génération continue sans elles.`);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, ville, prix, surface, description, telephone, photosUrls, photoPrincipaleUrl }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setErreurGeneration(true);
        setErreur(data.error ?? "La génération a échoué, merci de réessayer.");
        return;
      }
      localStorage.setItem("studio_immo_resultat", JSON.stringify(data));
      localStorage.setItem("studio_immo_bien", JSON.stringify({ titre, ville, prix, surface, description, afficherPrix }));
      localStorage.setItem("studio_immo_agence", JSON.stringify({ nomAgence, telephone }));
      localStorage.setItem("studio_immo_photo_principale", String(finalPrincipalIdx));
      localStorage.setItem("studio_immo_photos_urls", JSON.stringify(photosUrls));
      localStorage.setItem("studio_immo_photo_principale_url", photoPrincipaleUrl);
      if (data._generationId) localStorage.setItem("studio_immo_generation_id", data._generationId);
      else localStorage.removeItem("studio_immo_generation_id");
      try {
        sessionStorage.setItem("studio_immo_photos", JSON.stringify(photos));
        sessionStorage.setItem("studio_immo_logo", logo);
      } catch { console.warn("sessionStorage saturé"); }
      window.location.href = "/resultats";
    } catch (err) {
      clearTimeout(timeoutId); setErreurGeneration(true);
      setErreur(err instanceof DOMException && err.name === "AbortError"
        ? "La génération a dépassé 90 secondes. Merci de réessayer."
        : "La génération a échoué, merci de réessayer.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ni::placeholder { color: #9A95A8; }
        .ni:focus { border-color: #7C3AED !important; box-shadow: 0 0 0 4px rgba(124,58,237,0.1) !important; outline: none; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "100vh", background: "#FCFCFD", overflow: "hidden" }}>

        {/* ── COLONNE GAUCHE ────────────────────────────────── */}
        <aside style={{
          background: "#15131D", padding: "28px 26px",
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden", height: "100vh",
        }}>
          {/* Halo décoratif */}
          <div style={{
            position: "absolute", top: "-100px", right: "-100px",
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Contenu z-indexé */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "8px", background: "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                </svg>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "white" }}>Studio Immo</span>
            </Link>

            {/* Eyebrow */}
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#8B7FB0", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "48px", marginBottom: 0 }}>
              Nouveau bien
            </p>

            {/* Titre aside */}
            <h2 style={{ fontSize: "25px", fontWeight: 600, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginTop: "14px", marginBottom: 0 }}>
              Transformez votre mandat en campagne
            </h2>

            {/* Sous-titre aside */}
            <p style={{ fontSize: "13.5px", color: "#A39DB8", lineHeight: 1.6, marginTop: "14px", marginBottom: 0 }}>
              L&apos;IA analyse vos photos et vos informations pour produire une stratégie complète, prête à publier.
            </p>

            {/* Stepper vertical */}
            <div style={{ marginTop: "40px" }}>
              {STEPS.map((step, i) => {
                const active = i + 1 === currentStep;
                const done = i + 1 < currentStep;
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={i} style={{ position: "relative", paddingBottom: isLast ? 0 : "26px" }}>
                    {/* Ligne de connexion */}
                    {!isLast && (
                      <div style={{
                        position: "absolute", left: "13px", top: "30px", bottom: "4px", width: "1px",
                        background: active
                          ? "linear-gradient(to bottom, #7C3AED, rgba(255,255,255,0.1))"
                          : "rgba(255,255,255,0.1)",
                      }} />
                    )}
                    <div style={{ display: "flex", gap: "14px" }}>
                      {/* Numéro */}
                      <div style={{
                        width: "27px", height: "27px", borderRadius: "50%", flexShrink: 0,
                        background: active ? "#7C3AED" : done ? "rgba(124,58,237,0.25)" : "#15131D",
                        border: active ? "1px solid #7C3AED" : done ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.15)",
                        color: active || done ? "white" : "#A39DB8",
                        fontSize: "12px", fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: active ? "0 0 0 4px rgba(124,58,237,0.2)" : "none",
                      }}>
                        {done ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : i + 1}
                      </div>
                      {/* Texte */}
                      <div>
                        <p style={{ fontSize: "13.5px", fontWeight: 600, color: active ? "white" : "#6E6885", margin: 0 }}>
                          {step.title}
                        </p>
                        <p style={{ fontSize: "12px", color: "#8B85A0", margin: "2px 0 0" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer aside */}
            <div style={{ marginTop: "auto", paddingTop: "22px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { label: "Campagnes générées", value: "5" },
                { label: "Temps de génération", value: "~15 s" },
                { label: "Crédits utilisés", value: "500" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "9px" }}>
                  <span style={{ color: "#A39DB8", fontSize: "12.5px" }}>{label}</span>
                  <span style={{ color: "white", fontWeight: 600, fontSize: "12.5px" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── COLONNE DROITE ────────────────────────────────── */}
        <main style={{ padding: "40px 48px", overflowY: "auto", height: "100vh" }}>

          {/* Topline */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#15131D" }}>
              Étape {currentStep}{" "}
              <span style={{ color: "#9A95A8", fontWeight: 400 }}>/ 3</span>
            </span>
            <Link href="/dashboard" style={{ fontSize: "13px", color: "#6E6885", textDecoration: "none" }}>
              ← Tableau de bord
            </Link>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#15131D", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
            Renseignez votre mandat
          </h1>
          <p style={{ fontSize: "13.5px", color: "#6E6885", margin: "0 0 32px", lineHeight: 1.5 }}>
            Plus vos informations sont précises, plus la stratégie générée sera percutante.
          </p>

          {/* ── SECTION 1 : Le bien ──────────────────────────── */}
          <section style={{ marginBottom: "36px" }}>
            <SectionHead label="Le bien" />

            <FieldLabel><>Titre <span style={{ color: "#7C3AED" }}>*</span></></FieldLabel>
            <input
              className="ni"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Appartement T3 avec terrasse et vue dégagée"
              style={INPUT}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "16px" }}>
              <div>
                <FieldLabel><>Ville <span style={{ color: "#7C3AED" }}>*</span></></FieldLabel>
                <input className="ni" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Lyon, Paris, Bordeaux…" style={INPUT}/>
              </div>
              <div>
                <FieldLabel>Prix</FieldLabel>
                <input className="ni" value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="320 000 €" style={INPUT}/>
              </div>
              <div>
                <FieldLabel>Surface</FieldLabel>
                <input className="ni" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="68 m²" style={INPUT}/>
              </div>
            </div>

            {/* Toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 0", marginBottom: "20px",
              borderTop: "1px solid #ECEAF0", borderBottom: "1px solid #ECEAF0",
            }}>
              <div>
                <p style={{ fontSize: "14px", color: "#15131D", fontWeight: 500, margin: "0 0 3px" }}>
                  Afficher le prix sur les visuels
                </p>
                <p style={{ fontSize: "12.5px", color: "#8B85A0", margin: 0 }}>
                  Recommandé pour attirer les acheteurs qualifiés
                </p>
              </div>
              <div
                onClick={() => setAfficherPrix((v) => !v)}
                style={{
                  width: "42px", height: "24px", borderRadius: "20px", flexShrink: 0,
                  background: afficherPrix ? "#7C3AED" : "#D6D2E0",
                  position: "relative", cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <div style={{
                  position: "absolute", width: "18px", height: "18px", borderRadius: "50%",
                  background: "white", top: "3px",
                  left: afficherPrix ? "21px" : "3px",
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>

            {/* Description */}
            <FieldLabel right={`${charCount} / 800`}>
              <>Description <span style={{ color: "#7C3AED" }}>*</span></>
            </FieldLabel>
            <textarea
              className="ni"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les points forts du bien : exposition, rénovations, quartier…"
              maxLength={800}
              style={{ ...INPUT, height: "112px", padding: "12px 15px", resize: "none" }}
            />
            <p style={{ fontSize: "12.5px", color: "#8B85A0", marginTop: "-14px", marginBottom: "20px" }}>
              Décrivez l&apos;exposition, les rénovations, le quartier et les prestations.
            </p>
          </section>

          {/* ── SECTION 2 : Votre agence ─────────────────────── */}
          <section style={{ marginBottom: "36px" }}>
            <SectionHead label="Votre agence" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <FieldLabel>Nom de l&apos;agence</FieldLabel>
                <input className="ni" value={nomAgence} onChange={(e) => setNomAgence(e.target.value)} placeholder="Agence Dupont Immobilier" style={INPUT}/>
              </div>
              <div>
                <FieldLabel>Téléphone</FieldLabel>
                <input className="ni" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" style={INPUT}/>
              </div>
            </div>

            {/* Logo upload */}
            <FieldLabel>Logo</FieldLabel>
            <label style={{
              border: "1px dashed #D6D2E0", borderRadius: "12px", padding: "18px",
              textAlign: "center", background: "#FBFAFC",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer", marginBottom: "20px",
            }}>
              {logo ? (
                <img src={logo} alt="Logo" style={{ height: "56px", maxWidth: "160px", objectFit: "contain", borderRadius: "8px" }}/>
              ) : (
                <>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "11px",
                    background: "#F1EDFA", border: "1px solid #E6DEF7",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px",
                  }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#15131D", margin: "0 0 4px" }}>
                    <span style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "underline" }}>Cliquez pour importer</span>
                    {" "}le logo
                  </p>
                  <p style={{ fontSize: "12.5px", color: "#8B85A0", margin: 0 }}>JPG ou PNG · max 2 Mo</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }}/>
            </label>
          </section>

          {/* ── SECTION 3 : Les photos ───────────────────────── */}
          <section style={{ marginBottom: "36px" }}>
            <SectionHead label="Les photos" />

            {/* Zone upload */}
            <label style={{
              border: "1px dashed #D6D2E0", borderRadius: "12px", padding: "18px",
              textAlign: "center", background: "#FBFAFC",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "11px",
                background: "#F1EDFA", border: "1px solid #E6DEF7",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px",
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p style={{ fontSize: "13.5px", color: "#15131D", margin: "0 0 4px" }}>
                Glissez vos photos ou{" "}
                <span style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "underline" }}>parcourez vos fichiers</span>
              </p>
              <p style={{ fontSize: "12.5px", color: "#8B85A0", margin: 0 }}>JPG ou PNG · jusqu&apos;à 10 photos</p>
              <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: "none" }}/>
            </label>

            {/* Miniatures */}
            {photos.length > 0 && (
              <div style={{ display: "flex", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
                {photos.map((photo, idx) => (
                  <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={photo}
                      alt=""
                      onClick={() => setPhotoPrincipale(idx)}
                      style={{
                        width: "84px", height: "64px", borderRadius: "10px",
                        objectFit: "cover", display: "block", cursor: "pointer",
                        border: photoPrincipale === idx ? "2px solid #7C3AED" : "1px solid #E2E0E8",
                      }}
                    />
                    <button
                      onClick={() => supprimerPhoto(idx)}
                      style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: "#15131D", color: "white", fontSize: "11px",
                        border: "2px solid white", cursor: "pointer", lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >×</button>
                  </div>
                ))}
                {/* Bouton + */}
                <label style={{
                  width: "84px", height: "64px", borderRadius: "10px", flexShrink: 0,
                  border: "1px dashed #D6D2E0", background: "#FBFAFC",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#9A95A8", fontSize: "22px", fontWeight: 300,
                }}>
                  +
                  <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: "none" }}/>
                </label>
              </div>
            )}
          </section>

          {/* Erreur */}
          {erreur && (
            <div style={{
              background: "#FEF2F2", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px", padding: "14px 16px", marginBottom: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p style={{ fontSize: "13px", color: "#EF4444", margin: 0 }}>{erreur}</p>
              </div>
              {erreurGeneration && (
                <button
                  onClick={genererContenus}
                  style={{
                    marginTop: "10px", display: "flex", alignItems: "center", gap: "6px",
                    background: "rgba(239,68,68,0.1)", color: "#EF4444",
                    border: "1px solid rgba(239,68,68,0.3)", borderRadius: "7px",
                    padding: "6px 12px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
                  </svg>
                  Relancer la génération
                </button>
              )}
            </div>
          )}

          {/* Footer bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #ECEAF0",
          }}>
            <p style={{ fontSize: "13px", color: "#8B85A0", margin: 0 }}>
              <span style={{ color: "#15131D", fontWeight: 600 }}>500 crédits</span>{" "}
              seront utilisés · génération en ~15 s
            </p>
            <button
              onClick={genererContenus}
              disabled={loading || !isValid}
              style={{
                background: isValid ? "#7C3AED" : "#D6D2E0",
                color: isValid ? "white" : "#9A95A8",
                borderRadius: "11px", padding: "0 28px", height: "50px",
                fontSize: "14.5px", fontWeight: 600, border: "none",
                display: "flex", alignItems: "center", gap: "10px",
                boxShadow: isValid ? "0 6px 20px rgba(124,58,237,0.35)" : "none",
                cursor: loading || !isValid ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
                    display: "inline-block", animation: "spin 0.8s linear infinite",
                  }} />
                  Génération en cours…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Générer ma stratégie
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
