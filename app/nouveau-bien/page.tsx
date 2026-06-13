"use client";

import { useState } from "react";
import Link from "next/link";

const CARD: React.CSSProperties = {
  background: "white",
  border: "1.5px solid #E0E0E8",
  borderRadius: "14px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "9px",
  border: "1.5px solid #E0E0E8",
  fontSize: "14px",
  color: "#111827",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const LBL: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#374151",
  display: "block",
  marginBottom: "6px",
};

const CARD_HEAD: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "18px 20px 16px",
  borderBottom: "1px solid #F5F5F8",
};

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

  // Dynamic step tracking
  const step1Done = titre.trim() !== "" && ville.trim() !== "" && description.trim() !== "";
  const step2Done = step1Done && nomAgence.trim() !== "";
  const currentStep = step2Done ? 3 : step1Done ? 2 : 1;
  const STEP_NAMES = ["Le bien", "L’agence", "Les photos"];
  const progressPct = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setErreur("");
    setErreurGeneration(false);
    const files = Array.from(e.target.files);
    const invalides = files.filter((f) => !PHOTO_TYPES.includes(f.type) || f.size > PHOTO_MAX_SIZE);
    if (invalides.length > 0) {
      setErreur(
        invalides.length === 1
          ? `1 photo ignorée : format non supporté ou taille supérieure à 5 Mo (${invalides[0].name}).`
          : `${invalides.length} photos ignorées : format non supporté ou taille supérieure à 5 Mo.`
      );
    }
    const valides = files.filter((f) => PHOTO_TYPES.includes(f.type) && f.size <= PHOTO_MAX_SIZE);
    if (valides.length === 0) return;
    const readers = valides.map(
      (f) => new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      })
    );
    Promise.all(readers).then((imgs) => setPhotos((prev) => [...prev, ...imgs]));
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!PHOTO_TYPES.includes(f.type) || f.size > PHOTO_MAX_SIZE) {
      setErreur("Le logo doit être une image JPEG, PNG, WebP ou GIF de moins de 5 Mo.");
      setErreurGeneration(false);
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      const d = r.result as string;
      setLogo(d);
      localStorage.setItem("studio_immo_logo", d);
    };
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
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  async function genererContenus() {
    setErreur("");
    setErreurGeneration(false);
    if (!titre.trim() || !ville.trim() || !description.trim()) {
      setErreur("Veuillez remplir le titre, la ville et la description.");
      return;
    }
    setLoading(true);

    let photosUrls: string[] = [];
    let photoPrincipaleUrl = "";
    let finalPrincipalIdx = photoPrincipale;
    if (photos.length > 0) {
      const results = await Promise.allSettled(
        photos.map(async (dataUrl) => {
          const blob = dataUrlToBlob(dataUrl);
          const fd = new FormData();
          fd.append("file", blob, `photo.${blob.type.split("/")[1] || "jpg"}`);
          const r = await fetch("/api/photos", { method: "POST", body: fd });
          const json = await r.json();
          if (!r.ok) throw new Error(json.error ?? "upload failed");
          return json.url as string;
        })
      );
      const ordered = results.map((r) => (r.status === "fulfilled" ? r.value : null));
      photosUrls = ordered.filter((u): u is string => u !== null);
      photoPrincipaleUrl = ordered[photoPrincipale] ?? photosUrls[0] ?? "";
      finalPrincipalIdx = photoPrincipaleUrl ? Math.max(0, photosUrls.indexOf(photoPrincipaleUrl)) : 0;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        setErreur(`${failed} photo${failed > 1 ? "s" : ""} n'ont pas pu être uploadées — la génération continue sans elles.`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);
    try {
      console.log("photosUrls avant fetch:", photosUrls);
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, ville, prix, surface, description, telephone, photosUrls, photoPrincipaleUrl }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!resp.ok) throw new Error("server");
      const data = await resp.json();
      if (data.error) throw new Error("server");

      localStorage.setItem("studio_immo_resultat", JSON.stringify(data));
      localStorage.setItem("studio_immo_bien", JSON.stringify({ titre, ville, prix, surface, description, afficherPrix }));
      localStorage.setItem("studio_immo_agence", JSON.stringify({ nomAgence, telephone }));
      localStorage.setItem("studio_immo_photo_principale", String(finalPrincipalIdx));
      localStorage.setItem("studio_immo_photos_urls", JSON.stringify(photosUrls));
      localStorage.setItem("studio_immo_photo_principale_url", photoPrincipaleUrl);
      console.log("[nouveau-bien] _generationId reçu de l'API:", data._generationId);
      if (data._generationId) {
        localStorage.setItem("studio_immo_generation_id", data._generationId);
        console.log("[nouveau-bien] generation_id sauvegardé dans localStorage:", data._generationId);
      } else {
        localStorage.removeItem("studio_immo_generation_id");
        console.error("[nouveau-bien] _generationId est null — la génération n'a PAS été sauvegardée en base Supabase");
      }

      try {
        sessionStorage.setItem("studio_immo_photos", JSON.stringify(photos));
        sessionStorage.setItem("studio_immo_logo", logo);
      } catch { console.warn("sessionStorage saturé"); }

      window.location.href = "/resultats";
    } catch (err) {
      clearTimeout(timeoutId);
      setErreurGeneration(true);
      if (err instanceof DOMException && err.name === "AbortError") {
        setErreur("La génération a dépassé 90 secondes. Merci de réessayer.");
      } else {
        setErreur("La génération a échoué, merci de réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }

  const isValid = titre.trim() && ville.trim() && description.trim();
  const charCount = description.length;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F8" }}>

      {/* Topbar */}
      <header style={{ background: "white", borderBottom: "1.5px solid #E0E0E8", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 32px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px", background: "#7C3AED",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>Studio Immo</span>
          </Link>

          {/* Step indicator */}
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#374151", whiteSpace: "nowrap" }}>
            Étape {currentStep} / 3 — {STEP_NAMES[currentStep - 1]}
          </span>

          {/* Dashboard link */}
          <Link href="/dashboard" style={{
            fontSize: "12.5px", fontWeight: 500, color: "#7C3AED", textDecoration: "none",
          }}>
            ← Tableau de bord
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "#F0EEF8" }}>
          <div style={{
            height: "100%", width: `${progressPct}%`, background: "#7C3AED",
            transition: "width 0.3s ease", borderRadius: "0 2px 2px 0",
          }} />
        </div>
      </header>

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 28px 80px" }}>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
          {[1, 2, 3].map((step, i) => {
            const active = step === currentStep;
            const done = step < currentStep;
            return (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <div style={{
                    width: "48px", height: "2px",
                    background: done ? "#7C3AED" : "#E0E0E8",
                    margin: "0 4px", transition: "background 0.3s",
                  }} />
                )}
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: active || done ? "#7C3AED" : "#F0EEF8",
                  border: active || done ? "none" : "1.5px solid #E0E0E8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 600,
                  color: active || done ? "white" : "#9CA3AF",
                  transition: "all 0.3s", flexShrink: 0,
                }}>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : step}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Nouveau bien</p>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Renseignez votre mandat</h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>L&apos;IA génère une stratégie complète en ~15 secondes.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── Card 1 : Le bien ────────────────────────────────── */}
          <div style={CARD}>
            <div style={CARD_HEAD}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px", background: "#F3F0FF",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 }}>Le bien</h2>
                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Informations principales du mandat</p>
              </div>
            </div>

            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Titre */}
              <div>
                <label style={LBL}>Titre <span style={{ color: "#7C3AED" }}>*</span></label>
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Appartement T3 avec terrasse et vue dégagée"
                  style={INPUT}
                />
              </div>

              {/* Ville / Prix / Surface */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={LBL}>Ville <span style={{ color: "#7C3AED" }}>*</span></label>
                  <input value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Lyon" style={INPUT}/>
                </div>
                <div>
                  <label style={LBL}>Prix</label>
                  <input value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="320 000 €" style={INPUT}/>
                </div>
                <div>
                  <label style={LBL}>Surface</label>
                  <input value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="68 m²" style={INPUT}/>
                </div>
              </div>

              {/* Toggle Afficher le prix */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", background: "#FAFAFA",
                borderRadius: "10px", border: "1.5px solid #E0E0E8",
              }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: "0 0 1px" }}>Afficher le prix</p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>Visible sur les visuels générés</p>
                </div>
                <div
                  onClick={() => setAfficherPrix((v) => !v)}
                  style={{
                    width: "34px", height: "18px", borderRadius: "9px",
                    background: afficherPrix ? "#7C3AED" : "#E0E0E8",
                    position: "relative", cursor: "pointer",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", width: "14px", height: "14px", borderRadius: "50%",
                    background: "white", top: "2px",
                    left: afficherPrix ? "18px" : "2px",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ ...LBL, margin: 0 }}>Description <span style={{ color: "#7C3AED" }}>*</span></label>
                  <span style={{ fontSize: "11px", color: charCount > 50 ? "#059669" : "#9CA3AF" }}>
                    {charCount} caractères
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez les points forts du bien : exposition, vue, rénovation, quartier, prestations, état général…"
                  style={{ ...INPUT, resize: "vertical" }}
                />
                <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px", marginBottom: 0 }}>
                  ✨ Plus la description est précise, meilleure sera la stratégie générée.
                </p>
              </div>
            </div>
          </div>

          {/* ── Card 2 : L'agence ──────────────────────────────── */}
          <div style={CARD}>
            <div style={CARD_HEAD}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px", background: "#F0F9FF",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 }}>L&apos;agence</h2>
                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Apparaît sur vos publications</p>
              </div>
            </div>

            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Nom agence / Téléphone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={LBL}>Nom agence</label>
                  <input value={nomAgence} onChange={(e) => setNomAgence(e.target.value)} placeholder="Agence Dupont" style={INPUT}/>
                </div>
                <div>
                  <label style={LBL}>Téléphone</label>
                  <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" style={INPUT}/>
                </div>
              </div>

              {/* Logo drop zone */}
              <div>
                <label style={LBL}>Logo agence</label>
                <label style={{
                  display: "block", border: "1.5px dashed #C4B5FD",
                  borderRadius: "10px", padding: "20px", textAlign: "center",
                  cursor: "pointer", background: "#FAFBFF",
                }}>
                  {logo ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src={logo} alt="Logo" style={{
                        height: "56px", maxWidth: "160px", objectFit: "contain", borderRadius: "8px",
                      }}/>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "8px", background: "#F3F0FF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 8px",
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 2px" }}>Cliquez pour importer votre logo</p>
                      <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>PNG, JPG · max 5 Mo</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }}/>
                </label>
              </div>
            </div>
          </div>

          {/* ── Card 3 : Photos ────────────────────────────────── */}
          <div style={CARD}>
            <div style={CARD_HEAD}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px", background: "#FFF7ED",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 }}>Photos du bien</h2>
                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
                  {photos.length === 0
                    ? "Ajoutez vos photos pour ancrer l’IA dans le réel"
                    : `${photos.length} photo${photos.length > 1 ? "s" : ""} ajoutée${photos.length > 1 ? "s" : ""} · ★ = photo principale`}
                </p>
              </div>
            </div>

            <div style={{ padding: "28px" }}>
              {photos.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {photos.map((photo, idx) => (
                    <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                      <img src={photo} alt="" style={{
                        width: "72px", height: "54px", objectFit: "cover", borderRadius: "8px",
                        border: photoPrincipale === idx ? "2px solid #7C3AED" : "2px solid transparent",
                        display: "block",
                      }}/>
                      <button
                        onClick={() => setPhotoPrincipale(idx)}
                        style={{
                          position: "absolute", top: "3px", left: "3px",
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: photoPrincipale === idx ? "#7C3AED" : "rgba(0,0,0,0.55)",
                          color: "white", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "9px", lineHeight: "1",
                        }}
                        title="Photo principale"
                      >★</button>
                      <button
                        onClick={() => supprimerPhoto(idx)}
                        style={{
                          position: "absolute", top: "3px", right: "3px",
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: "rgba(239,68,68,0.85)",
                          color: "white", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: "bold", lineHeight: "1",
                        }}
                      >×</button>
                    </div>
                  ))}
                  {/* Add more */}
                  <label style={{
                    width: "72px", height: "54px", borderRadius: "8px",
                    border: "1.5px dashed #C4B5FD",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", background: "#FAFBFF", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: "none" }}/>
                  </label>
                </div>
              ) : (
                <label style={{
                  display: "block", border: "1.5px dashed #D1D5DB",
                  borderRadius: "10px", padding: "28px 20px",
                  textAlign: "center", cursor: "pointer", background: "#FAFAFA",
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px", background: "#FFF7ED",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 10px",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 2px" }}>Importez vos photos</p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 12px" }}>JPEG, PNG · plusieurs fichiers acceptés</p>
                  <span style={{
                    fontSize: "12px", fontWeight: 500, color: "#7C3AED",
                    padding: "6px 14px", borderRadius: "7px",
                    background: "#F3F0FF", display: "inline-block",
                  }}>
                    Choisir des fichiers
                  </span>
                  <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: "none" }}/>
                </label>
              )}
            </div>
          </div>

          {/* Error */}
          {erreur && (
            <div style={{
              background: "#FEF2F2", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "10px", padding: "14px 16px",
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
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "7px", padding: "6px 12px",
                    fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
                  </svg>
                  Relancer la génération
                </button>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={genererContenus}
            disabled={loading || !isValid}
            style={{
              width: "100%", padding: "15px", borderRadius: "12px", border: "none",
              background: isValid ? "#7C3AED" : "#E0E0E8",
              color: isValid ? "white" : "#9CA3AF",
              fontSize: "15px", fontWeight: 600,
              cursor: loading || !isValid ? "not-allowed" : "pointer",
              boxShadow: isValid ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
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
              "✨ Générer ma stratégie"
            )}
          </button>

          {!isValid && (
            <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
              Titre, ville et description sont obligatoires pour générer la stratégie.
            </p>
          )}

          <p style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF", margin: 0 }}>
            500 crédits seront utilisés · génération en ~15s
          </p>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
