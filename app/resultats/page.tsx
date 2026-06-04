"use client";

import { useEffect, useState } from "react";

export default function ResultatsPage() {
  const [data, setData] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [bien, setBien] = useState<any>(null);
  const [agence, setAgence] = useState<any>(null);
  const [logo, setLogo] = useState("");
  const [photoPrincipale, setPhotoPrincipale] = useState(0);

  useEffect(() => {
    const savedResult = localStorage.getItem("studio_immo_resultat");
    const savedPhotos = localStorage.getItem("studio_immo_photos");
    const savedBien = localStorage.getItem("studio_immo_bien");
    const savedAgence = localStorage.getItem("studio_immo_agence");
    const savedLogo = localStorage.getItem("studio_immo_logo");
    const savedPhotoPrincipale = localStorage.getItem("studio_immo_photo_principale");

    if (savedResult) setData(JSON.parse(savedResult));
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedBien) setBien(JSON.parse(savedBien));
    if (savedAgence) setAgence(JSON.parse(savedAgence));
    if (savedLogo) setLogo(savedLogo);
    if (savedPhotoPrincipale) setPhotoPrincipale(Number(savedPhotoPrincipale));
  }, []);

  function copierTexte(texte: string) {
    navigator.clipboard.writeText(texte);
    alert("Texte copié !");
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  function drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const ratio = Math.max(w / img.width, h / img.height);
    const nw = img.width * ratio;
    const nh = img.height * ratio;
    ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
  }

  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ) {
    const words = text.split(" ");
    let line = "";
    let lines = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
        lines++;
        if (lines >= maxLines - 1) break;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, x, y);
  }

  async function telechargerVisuel(publication: any, index: number, variante: "A" | "B") {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cover = photos[photoPrincipale] || photos[0];
    const autresPhotos = photos.filter((_, i) => i !== photoPrincipale);
    const selectedPhotos = [cover, ...autresPhotos].filter(Boolean).slice(0, 4);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1080, 1350);

    ctx.fillStyle = variante === "A" ? "#172554" : "#0f172a";
    ctx.fillRect(0, 0, 1080, 150);

    if (logo) {
      const logoImg = await loadImage(logo);
      drawCover(ctx, logoImg, 55, 35, 170, 80);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px Arial";
      ctx.fillText(agence?.nomAgence || "STUDIO IMMO", 55, 92);
    }

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 32px Arial";
    ctx.fillText(variante === "A" ? "NOUVEAU BIEN" : "COUP DE CŒUR", 730, 92);

    if (selectedPhotos.length > 0) {
      const img1 = await loadImage(selectedPhotos[0]);
      drawCover(ctx, img1, 55, 190, 970, 580);

      for (let i = 1; i < Math.min(selectedPhotos.length, 4); i++) {
        const img = await loadImage(selectedPhotos[i]);
        drawCover(ctx, img, 55 + (i - 1) * 330, 790, 310, 210);
      }
    }

    ctx.fillStyle = "#172554";
    ctx.font = "bold 54px Arial";
    wrapText(ctx, publication.accroche || "Votre futur bien vous attend", 55, 1100, 970, 62, 3);

    let y = 1245;
    ctx.font = "bold 30px Arial";

    if (bien?.ville) {
      ctx.fillStyle = "#172554";
      ctx.fillText(`📍 ${bien.ville}`, 55, y);
    }

    if (bien?.surface) {
      ctx.fillStyle = "#172554";
      ctx.fillText(`🏠 ${bien.surface}`, 360, y);
    }

    if (bien?.afficherPrix && bien?.prix) {
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`💰 ${bien.prix}`, 610, y);
    }

    if (agence?.telephone) {
      ctx.fillStyle = "#475569";
      ctx.font = "bold 28px Arial";
      ctx.fillText(`📞 ${agence.telephone}`, 55, 1310);
    }

    const link = document.createElement("a");
    link.download = `studio-immo-${index + 1}-${variante}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-950 text-white">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-blue-950 p-8 text-white">
          <h1 className="text-5xl font-bold">
            Stratégie <span className="text-amber-400">générée</span>
          </h1>
          <p className="mt-3 text-slate-200">
            Textes, stories et visuels prêts à utiliser.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-950">🎯 Profil acheteur</h2>
            <p className="mt-4 text-slate-700">{data.profilAcheteur}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-2xl font-bold text-blue-950">✨ Points forts</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {data.pointsForts?.map((point: string, index: number) => (
                <li key={index} className="rounded-xl bg-amber-50 p-3 font-medium text-blue-950">
                  ✅ {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {data.publications?.map((publication: any, index: number) => {
            const cover = photos[photoPrincipale] || photos[0];
            const autresPhotos = photos.filter((_, i) => i !== photoPrincipale);
            const selectedPhotos = [cover, ...autresPhotos].filter(Boolean).slice(0, 4);

            return (
              <section key={index} className="rounded-3xl bg-white p-6 shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold uppercase tracking-widest text-amber-500">
                      {publication.jourPublication}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-blue-950">
                      {publication.titre}
                    </h2>
                    <p className="mt-2 text-slate-600">
                      {publication.objectif}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-950 px-4 py-2 font-bold text-white">
                    {publication.reseau}
                  </span>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl bg-blue-50 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-blue-950">📘 Facebook</h3>
                        <button onClick={() => copierTexte(publication.facebook)} className="rounded-xl bg-blue-950 px-4 py-2 font-bold text-white">
                          Copier
                        </button>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-800">
                        {publication.facebook}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-pink-50 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-pink-700">📸 Instagram</h3>
                        <button onClick={() => copierTexte(publication.instagram)} className="rounded-xl bg-pink-600 px-4 py-2 font-bold text-white">
                          Copier
                        </button>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-800">
                        {publication.instagram}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-blue-950">📱 Story</h3>
                        <button onClick={() => copierTexte(publication.story)} className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-blue-950">
                          Copier
                        </button>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-800">
                        {publication.story}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {["A", "B"].map((variante) => (
                      <div key={variante} className="rounded-3xl bg-slate-900 p-4">
                        <div className="overflow-hidden rounded-2xl bg-white">
                          <div className="bg-blue-950 p-4">
                            <div className="flex items-center justify-between">
                              {logo ? (
                                <img src={logo} alt="Logo" className="h-10 max-w-28 rounded bg-white/90 object-contain p-1" />
                              ) : (
                                <p className="font-bold text-white">{agence?.nomAgence || "Studio Immo"}</p>
                              )}
                              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-blue-950">
                                {variante === "A" ? "Nouveau bien" : "Coup de cœur"}
                              </span>
                            </div>
                          </div>

                          {selectedPhotos.length > 0 ? (
                            <div className="grid h-64 grid-cols-3 grid-rows-3 gap-1 p-1">
                              <img src={selectedPhotos[0]} className="col-span-3 row-span-2 h-full w-full object-cover" alt="Photo principale" />
                              {selectedPhotos.slice(1, 4).map((photo, i) => (
                                <img key={i} src={photo} className="h-full w-full object-cover" alt="Photo secondaire" />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-64 items-center justify-center bg-slate-700 text-white">
                              Photos du bien
                            </div>
                          )}

                          <div className="p-4 text-blue-950">
                            <h3 className="text-xl font-bold leading-tight">{publication.accroche}</h3>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                              {bien?.ville && <span className="rounded-full bg-blue-950 px-3 py-1 text-white">📍 {bien.ville}</span>}
                              {bien?.surface && <span className="rounded-full bg-slate-100 px-3 py-1">🏠 {bien.surface}</span>}
                              {bien?.afficherPrix && bien?.prix && <span className="rounded-full bg-amber-400 px-3 py-1">💰 {bien.prix}</span>}
                            </div>

                            {agence?.telephone && (
                              <p className="mt-3 border-t pt-3 text-sm font-bold text-slate-700">
                                📞 {agence.telephone}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => telechargerVisuel(publication, index, variante as "A" | "B")}
                          className="mt-3 w-full rounded-xl bg-amber-400 py-3 font-bold text-blue-950"
                        >
                          Télécharger visuel {variante}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}