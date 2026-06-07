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

  function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const readers = Array.from(files).map(
      (file) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((images) => setPhotos((prev) => [...prev, ...images]));
  }

  function handleLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setLogo(data);
      localStorage.setItem("studio_immo_logo", data);
    };
    reader.readAsDataURL(file);
  }

  function supprimerPhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (photoPrincipale === index) setPhotoPrincipale(0);
    else if (photoPrincipale > index) setPhotoPrincipale((p) => p - 1);
  }

  async function genererContenus() {
    setErreur("");
    if (!titre.trim() || !ville.trim() || !description.trim()) {
      setErreur("Veuillez remplir le titre, la ville et la description.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, ville, prix, surface, description }),
      });
      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      localStorage.setItem("studio_immo_resultat", JSON.stringify(data));
      localStorage.setItem("studio_immo_bien", JSON.stringify({ titre, ville, prix, surface, description, afficherPrix }));
      localStorage.setItem("studio_immo_agence", JSON.stringify({ nomAgence, telephone }));
      localStorage.setItem("studio_immo_photo_principale", String(photoPrincipale));

      try {
        sessionStorage.setItem("studio_immo_photos", JSON.stringify(photos));
        sessionStorage.setItem("studio_immo_logo", logo);
      } catch {
        console.warn("sessionStorage saturé — visuels sans photos");
      }
      window.location.href = "/resultats";
    } catch (error) {
      setErreur(error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-150 placeholder-white/25";
  const inputStyle = { background: "#161616", border: "1px solid #2a2a2a" };

  function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "rgba(201,168,76,0.5)";
  }
  function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "#2a2a2a";
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 lg:px-8"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Studio <span style={{ color: "#c9a84c" }}>Immo</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-all duration-150 hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Tableau de bord
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 lg:px-8">

        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#c9a84c", letterSpacing: "0.1em" }}
          >
            Nouveau bien
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white tracking-tight">
            Renseignez votre mandat
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            L'IA génère une stratégie complète en quelques secondes.
          </p>
        </div>

        <div className="space-y-6">

          {/* Bien */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h2 className="text-sm font-semibold text-white">Informations du bien</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                  Titre *
                </label>
                <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Appartement T3 avec terrasse" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                  Ville *
                </label>
                <input value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Lyon, Paris, Bordeaux…" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                    Prix
                  </label>
                  <input value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="320 000 €" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                    Surface
                  </label>
                  <input value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="68 m²" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <label
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-150"
                style={{ background: "#161616", border: "1px solid #2a2a2a" }}
              >
                <input type="checkbox" checked={afficherPrix} onChange={(e) => setAfficherPrix(e.target.checked)} className="h-4 w-4 rounded" style={{ accentColor: "#c9a84c" }} />
                <span className="text-sm font-medium text-white">Afficher le prix sur les visuels</span>
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez les points forts du bien : exposition, vue, rénovation, quartier, prestations…"
                  className={inputClass}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>
          </section>

          {/* Agence */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h2 className="text-sm font-semibold text-white">Agence</h2>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Apparaît sur vos visuels générés.
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>Nom agence</label>
                  <input value={nomAgence} onChange={(e) => setNomAgence(e.target.value)} placeholder="Agence Dupont" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>Téléphone</label>
                  <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div
                className="rounded-xl px-4 py-4 text-center"
                style={{ background: "#161616", border: "2px dashed #2a2a2a" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Logo agence
                </p>
                <input type="file" accept="image/*" onChange={handleLogo} className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }} />
                {logo && (
                  <div className="mt-3 flex justify-center">
                    <img src={logo} alt="Logo" className="h-16 max-w-36 rounded-lg object-contain" style={{ background: "#1a1a1a", padding: "6px" }} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Photos */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h2 className="text-sm font-semibold text-white">Photos du bien</h2>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                La photo étoilée est utilisée comme photo principale sur les visuels.
              </p>
            </div>
            <div className="px-6 py-5">
              <div
                className="rounded-xl px-4 py-6 text-center mb-4"
                style={{ background: "#161616", border: "2px dashed rgba(201,168,76,0.25)" }}
              >
                <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Importez vos photos (JPEG, PNG)
                </p>
                <input type="file" multiple accept="image/*" onChange={handlePhotos} className="text-xs" style={{ color: "#c9a84c" }} />
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img src={photo} alt="" className="h-24 w-full rounded-lg object-cover" />
                      <button
                        onClick={() => setPhotoPrincipale(index)}
                        className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                        style={{
                          background: photoPrincipale === index ? "#c9a84c" : "rgba(0,0,0,0.6)",
                          color: photoPrincipale === index ? "#0a0a0a" : "#fff",
                        }}
                        title="Photo principale"
                      >
                        ★
                      </button>
                      <button
                        onClick={() => supprimerPhoto(index)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
                      >
                        ×
                      </button>
                      {photoPrincipale === index && (
                        <div
                          className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{ background: "#c9a84c", color: "#0a0a0a" }}
                        >
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Erreur */}
          {erreur && (
            <div
              className="rounded-xl px-5 py-4 text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
            >
              {erreur}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={genererContenus}
            disabled={loading}
            className="w-full rounded-xl py-4 text-sm font-bold transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full" style={{ border: "2px solid rgba(10,10,10,0.3)", borderTopColor: "#0a0a0a" }} />
                Génération en cours…
              </span>
            ) : (
              "Générer la stratégie réseaux sociaux →"
            )}
          </button>

          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Génération en ~15 secondes · Propulsé par GPT-4o mini
          </p>
        </div>
      </main>
    </div>
  );
}
