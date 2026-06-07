"use client";

import { useState } from "react";
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
  prix: string | null;
  surface: string | null;
  afficher_prix: boolean;
}

interface Props {
  resultat: ResultatIA;
  bien: Bien;
  bienId: string;
  dateGeneration: string;
}

export function GenerationClient({ resultat, bien, bienId, dateGeneration }: Props) {
  const [copiéIndex, setCopiéIndex] = useState<string | null>(null);

  function copier(texte: string, id: string) {
    navigator.clipboard.writeText(texte);
    setCopiéIndex(id);
    setTimeout(() => setCopiéIndex(null), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* En-tête */}
        <div className="rounded-3xl bg-blue-950 p-8 text-white">
          <Link
            href={`/biens/${bienId}`}
            className="mb-6 inline-flex items-center gap-2 font-medium text-amber-400"
          >
            ← Retour au bien
          </Link>
          <h1 className="text-5xl font-bold">
            Résultats <span className="text-amber-400">générés</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm">{dateGeneration}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-bold">
              📍 {bien.ville}
            </span>
            {bien.surface && (
              <span className="rounded-full bg-white/10 px-4 py-1 text-sm">
                🏠 {bien.surface}
              </span>
            )}
            {bien.prix && bien.afficher_prix && (
              <span className="rounded-full bg-amber-400/20 px-4 py-1 text-sm font-bold text-amber-400">
                💰 {bien.prix}
              </span>
            )}
          </div>
        </div>

        {/* Profil + Points forts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-950">🎯 Profil acheteur</h2>
            <p className="mt-4 leading-relaxed text-slate-700">{resultat.profilAcheteur}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-2xl font-bold text-blue-950">✨ Points forts</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {resultat.pointsForts?.map((point, i) => (
                <li key={i} className="rounded-xl bg-amber-50 p-3 font-medium text-blue-950">
                  ✅ {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {resultat.strategie && (
          <div className="mt-6 rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-950">📋 Stratégie de publication</h2>
            <p className="mt-4 leading-relaxed text-slate-700">{resultat.strategie}</p>
          </div>
        )}

        {/* Publications */}
        <div className="mt-8 space-y-8">
          {resultat.publications?.map((pub, index) => (
            <section key={index} className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold uppercase tracking-widest text-amber-500">
                    {pub.jourPublication}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-blue-950">{pub.titre}</h2>
                  <p className="mt-2 text-slate-600">{pub.objectif}</p>
                </div>
                <span className="rounded-full bg-blue-950 px-4 py-2 font-bold text-white">
                  {pub.reseau}
                </span>
              </div>

              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-lg font-bold italic text-blue-950">
                "{pub.accroche}"
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {(
                  [
                    { key: "facebook", label: "📘 Facebook", bg: "bg-blue-50", btnBg: "bg-blue-950 text-white", textColor: "text-blue-950" },
                    { key: "instagram", label: "📸 Instagram", bg: "bg-pink-50", btnBg: "bg-pink-600 text-white", textColor: "text-pink-700" },
                    { key: "story", label: "📱 Story", bg: "bg-amber-50", btnBg: "bg-amber-400 text-blue-950", textColor: "text-blue-950" },
                  ] as const
                ).map(({ key, label, bg, btnBg, textColor }) => {
                  const copyId = `${index}-${key}`;
                  return (
                    <div key={key} className={`rounded-2xl ${bg} p-5`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-bold ${textColor}`}>{label}</h3>
                        <button
                          onClick={() => copier(pub[key], copyId)}
                          className={`rounded-xl px-3 py-2 text-sm font-bold ${btnBg}`}
                        >
                          {copiéIndex === copyId ? "✅ Copié !" : "Copier"}
                        </button>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                        {pub[key]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {(pub.ideeVisuelA || pub.ideeVisuelB) && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {pub.ideeVisuelA && (
                    <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600 leading-relaxed">
                      💡 <span className="font-bold">Visuel A :</span> {pub.ideeVisuelA}
                    </p>
                  )}
                  {pub.ideeVisuelB && (
                    <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600 leading-relaxed">
                      💡 <span className="font-bold">Visuel B :</span> {pub.ideeVisuelB}
                    </p>
                  )}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* CTA bas de page */}
        <div className="mt-10 rounded-3xl bg-blue-950 p-8 text-center text-white">
          <p className="text-lg font-bold">Besoin de visuels téléchargeables ?</p>
          <p className="mt-2 text-slate-400">
            Relancez la génération depuis la page du bien pour obtenir les visuels PNG avec vos photos.
          </p>
          <Link
            href={`/biens/${bienId}`}
            className="mt-5 inline-block rounded-xl bg-amber-400 px-8 py-4 font-bold text-blue-950"
          >
            ← Retour au bien
          </Link>
        </div>

      </div>
    </main>
  );
}
