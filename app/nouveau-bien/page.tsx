"use client";

import { useState } from "react";
import Link from "next/link";

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

  const PHOTO_MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
  const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

    // Upload des photos vers Supabase Storage
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
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, ville, prix, surface, description, photosUrls, photoPrincipaleUrl }),
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
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* Header */}
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
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: "var(--txt-3)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Tableau de bord
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 lg:px-8">

        {/* Title */}
        <div className="mb-8">
          <p className="label mb-1.5" style={{ color: "var(--gold)" }}>Nouveau bien</p>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>
            Renseignez votre mandat
          </h1>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginTop: "6px" }}>
            L'IA génère une stratégie complète en ~15 secondes.
          </p>
        </div>

        <div className="space-y-5">

          {/* ── Informations du bien ──────────────────── */}
          <section className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-s)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                     style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
                  <span style={{ fontSize: "12px" }}>01</span>
                </div>
                <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Informations du bien</h2>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="label">
                  Titre <span style={{ color: "var(--gold)" }}>*</span>
                </label>
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Appartement T3 avec terrasse et vue dégagée"
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">
                  Ville <span style={{ color: "var(--gold)" }}>*</span>
                </label>
                <input
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="Lyon, Paris, Bordeaux…"
                  className="input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="label">Prix</label>
                  <input value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="320 000 €" className="input"/>
                </div>
                <div className="space-y-1.5">
                  <label className="label">Surface</label>
                  <input value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="68 m²" className="input"/>
                </div>
              </div>

              <label
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-150"
                style={{ background: "var(--bg-2)", border: `1px solid ${afficherPrix ? "var(--gold-20)" : "var(--border-s)"}` }}
              >
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded transition-all"
                  style={{ background: afficherPrix ? "var(--gold)" : "var(--bg-4)", border: afficherPrix ? "none" : "1px solid var(--border)" }}
                >
                  {afficherPrix && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <input type="checkbox" checked={afficherPrix} onChange={(e) => setAfficherPrix(e.target.checked)} className="sr-only"/>
                <span className="text-sm font-medium text-white">Afficher le prix sur les visuels</span>
              </label>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="label">
                    Description <span style={{ color: "var(--gold)" }}>*</span>
                  </label>
                  <span style={{ fontSize: "11px", color: charCount > 50 ? "var(--ok)" : "var(--txt-4)" }}>
                    {charCount} caractères
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez les points forts du bien : exposition, vue, rénovation, quartier, prestations, état général…"
                  className="input"
                  style={{ resize: "vertical" }}
                />
                <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>
                  Plus la description est précise, meilleure sera la stratégie générée.
                </p>
              </div>
            </div>
          </section>

          {/* ── Agence ───────────────────────────────── */}
          <section className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-s)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                     style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
                  <span style={{ fontSize: "12px", color: "#818cf8" }}>02</span>
                </div>
                <div>
                  <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Agence</h2>
                  <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>Apparaît sur vos visuels générés</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="label">Nom agence</label>
                  <input value={nomAgence} onChange={(e) => setNomAgence(e.target.value)} placeholder="Agence Dupont" className="input"/>
                </div>
                <div className="space-y-1.5">
                  <label className="label">Téléphone</label>
                  <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className="input"/>
                </div>
              </div>

              <div
                className="rounded-xl px-4 py-5 text-center"
                style={{ background: "var(--bg-2)", border: "2px dashed var(--border)" }}
              >
                <div className="mb-2 flex justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="label mb-2">Logo agence</p>
                <input type="file" accept="image/*" onChange={handleLogo} style={{ fontSize: "12px", color: "var(--gold)" }}/>
                {logo && (
                  <div className="mt-3 flex justify-center">
                    <img src={logo} alt="Logo" className="h-14 max-w-32 rounded-lg object-contain"
                         style={{ background: "var(--bg-3)", padding: "6px" }}/>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Photos ───────────────────────────────── */}
          <section className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-s)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                     style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  <span style={{ fontSize: "12px", color: "#34d399" }}>03</span>
                </div>
                <div>
                  <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Photos du bien</h2>
                  <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>★ = photo principale sur les visuels</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div
                className="rounded-xl px-4 py-6 text-center mb-4 cursor-pointer transition-all duration-150"
                style={{ background: "var(--bg-2)", border: "2px dashed rgba(201,168,76,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")}
              >
                <div className="mb-2 flex justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p style={{ fontSize: "12px", color: "var(--txt-3)", marginBottom: "8px" }}>
                  Importez vos photos (JPEG, PNG · plusieurs fichiers acceptés)
                </p>
                <input type="file" multiple accept="image/*" onChange={handlePhotos}
                       style={{ fontSize: "12px", color: "var(--gold)" }}/>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img src={photo} alt="" className="h-24 w-full rounded-xl object-cover" style={{ border: photoPrincipale === idx ? "2px solid var(--gold)" : "2px solid transparent" }}/>
                      <button
                        onClick={() => setPhotoPrincipale(idx)}
                        className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all"
                        style={{
                          background: photoPrincipale === idx ? "var(--gold)" : "rgba(0,0,0,0.7)",
                          color: photoPrincipale === idx ? "#0a0a0a" : "#fff",
                        }}
                        title="Photo principale"
                      >★</button>
                      <button
                        onClick={() => supprimerPhoto(idx)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
                      >×</button>
                      {photoPrincipale === idx && (
                        <div className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-xs font-bold"
                             style={{ background: "var(--gold)", color: "#0a0a0a" }}>
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Error */}
          {erreur && (
            <div className="rounded-xl px-5 py-4"
                 style={{ background: "var(--err-10)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <div className="flex items-start gap-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--err)" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p style={{ fontSize: "13px", color: "var(--err)" }}>{erreur}</p>
              </div>
              {erreurGeneration && (
                <button
                  onClick={genererContenus}
                  className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "rgba(239,68,68,0.15)", color: "var(--err)", border: "1px solid rgba(239,68,68,0.3)" }}
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
            className="btn w-full"
            style={{
              background: isValid ? "var(--gold)" : "var(--bg-3)",
              color: isValid ? "#0a0a0a" : "var(--txt-4)",
              padding: "15px",
              fontSize: "14px",
              fontWeight: 700,
              border: isValid ? "none" : "1px solid var(--border)",
              cursor: loading || !isValid ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full" style={{ border: "2px solid rgba(10,10,10,0.3)", borderTopColor: "#0a0a0a" }}/>
                Génération en cours…
              </span>
            ) : (
              "Générer la stratégie réseaux sociaux →"
            )}
          </button>

          {!isValid && (
            <p className="text-center" style={{ fontSize: "11.5px", color: "var(--txt-4)" }}>
              Titre, ville et description sont obligatoires pour générer la stratégie.
            </p>
          )}

          <p className="text-center" style={{ fontSize: "11px", color: "var(--txt-4)" }}>
            Génération en ~15 secondes · Propulsé par GPT-4o mini · 1 crédit consommé
          </p>
        </div>
      </main>
    </div>
  );
}
