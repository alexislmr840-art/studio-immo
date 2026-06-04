"use client";

import { useState } from "react";

export default function NouveauBienPage() {
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [prix, setPrix] = useState("");
  const [surface, setSurface] = useState("");
  const [description, setDescription] = useState("");
  const [nomAgence, setNomAgence] = useState("");
  const [telephone, setTelephone] = useState("");
  const [afficherPrix, setAfficherPrix] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [logo, setLogo] = useState("");
  const [photoPrincipale, setPhotoPrincipale] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  // FIX — message d'erreur utilisateur
  const [erreur, setErreur] = useState("");

  function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const readers = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      const nouvellesPhotos = [...photos, ...images];
      setPhotos(nouvellesPhotos);
      // FIX — on n'écrit plus les photos dans localStorage (quota ~5Mo dépassé rapidement)
      // Les photos restent en mémoire React le temps de la session
    });
  }

  function handleLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const logoData = reader.result as string;
      setLogo(logoData);
      localStorage.setItem("studio_immo_logo", logoData);
    };
    reader.readAsDataURL(file);
  }

  function supprimerPhoto(index: number) {
    const nouvellesPhotos = photos.filter((_, i) => i !== index);
    setPhotos(nouvellesPhotos);

    // FIX — correction du décalage d'index lors de la suppression
    if (photoPrincipale === index) {
      setPhotoPrincipale(0);
    } else if (photoPrincipale > index) {
      // l'index de la photo principale a décalé d'un cran vers le bas
      setPhotoPrincipale(photoPrincipale - 1);
    }
  }

  function definirPhotoPrincipale(index: number) {
    setPhotoPrincipale(index);
  }

  async function genererContenus() {
    setErreur("");

    // FIX — validation des champs obligatoires avant l'appel API
    if (!titre.trim() || !ville.trim() || !description.trim()) {
      setErreur("Veuillez remplir au minimum le titre, la ville et la description.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, ville, prix, surface, description }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // FIX — on ne stocke plus les photos en localStorage
      // On passe les données texte uniquement
      localStorage.setItem("studio_immo_resultat", JSON.stringify(data));
      localStorage.setItem(
        "studio_immo_bien",
        JSON.stringify({ titre, ville, prix, surface, description, afficherPrix })
      );
      localStorage.setItem(
        "studio_immo_agence",
        JSON.stringify({ nomAgence, telephone })
      );
      localStorage.setItem("studio_immo_photo_principale", String(photoPrincipale));

      // FIX — on stocke les photos dans sessionStorage (vidé à la fermeture du tab)
      // séparé du localStorage pour éviter le quota
      try {
        sessionStorage.setItem("studio_immo_photos", JSON.stringify(photos));
        sessionStorage.setItem("studio_immo_logo", logo);
      } catch {
        // Si sessionStorage est aussi saturé, on continue sans les photos
        console.warn("sessionStorage saturé — visuels sans photos");
      }

      window.location.href = "/resultats";
    } catch (error) {
      // FIX — on affiche l'erreur et on arrête le loading
      setErreur(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Réessayez."
      );
    } finally {
      // FIX — loading toujours remis à false, même en cas d'erreur
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-blue-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-5xl font-bold">
          Nouveau <span className="text-amber-400">Bien</span>
        </h1>

        <p className="mt-3 text-slate-200">
          Ajoutez le bien, les photos et les informations de l'agence.
        </p>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-2xl">
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-blue-950">
                Informations du bien
              </h2>

              <div className="space-y-5">
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  type="text"
                  placeholder="Titre du bien *"
                  className="w-full rounded-xl border p-4 text-slate-900"
                />
                <input
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  type="text"
                  placeholder="Ville *"
                  className="w-full rounded-xl border p-4 text-slate-900"
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    type="text"
                    placeholder="Prix"
                    className="w-full rounded-xl border p-4 text-slate-900"
                  />
                  <input
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    type="text"
                    placeholder="Surface"
                    className="w-full rounded-xl border p-4 text-slate-900"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-xl bg-slate-100 p-4 font-bold text-blue-950">
                  <input
                    type="checkbox"
                    checked={afficherPrix}
                    onChange={(e) => setAfficherPrix(e.target.checked)}
                  />
                  Afficher le prix sur les visuels
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Description du bien *"
                  className="w-full rounded-xl border p-4 text-slate-900"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-blue-950">
                Informations agence
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  value={nomAgence}
                  onChange={(e) => setNomAgence(e.target.value)}
                  type="text"
                  placeholder="Nom de l'agence"
                  className="w-full rounded-xl border p-4 text-slate-900"
                />
                <input
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  type="text"
                  placeholder="Téléphone"
                  className="w-full rounded-xl border p-4 text-slate-900"
                />
              </div>

              <div className="mt-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center">
                <p className="font-bold text-blue-950">Logo de l'agence</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  className="mt-4 text-slate-900"
                />
                {logo && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={logo}
                      alt="Logo agence"
                      className="h-20 max-w-40 rounded-xl object-contain bg-white p-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-blue-950">
                Photos du bien
              </h2>

              <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-8 text-center">
                <p className="font-bold text-blue-950">Importez vos photos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotos}
                  className="mt-6 text-slate-900"
                />
              </div>

              {photos.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt="Photo du bien"
                        className="h-32 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => definirPhotoPrincipale(index)}
                        className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          photoPrincipale === index
                            ? "bg-amber-400 text-blue-950"
                            : "bg-black/60 text-white"
                        }`}
                      >
                        ⭐
                      </button>
                      <button
                        type="button"
                        onClick={() => supprimerPhoto(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 font-bold text-white"
                      >
                        ×
                      </button>
                      {photoPrincipale === index && (
                        <div className="absolute bottom-2 left-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-blue-950">
                          Photo principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FIX — affichage de l'erreur utilisateur */}
            {erreur && (
              <div className="rounded-xl bg-red-50 p-4 font-medium text-red-700 border border-red-200">
                ⚠️ {erreur}
              </div>
            )}

            <button
              onClick={genererContenus}
              disabled={loading}
              className="w-full rounded-xl bg-amber-400 py-4 font-bold text-blue-950 disabled:opacity-70"
            >
              {loading
                ? "Création de la stratégie..."
                : "Générer la stratégie réseaux sociaux"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}