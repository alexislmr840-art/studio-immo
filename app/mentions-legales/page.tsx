import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales — Studio Immo" };

function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)",
      color: "var(--gold)", padding: "1px 8px", borderRadius: "6px", fontWeight: 700,
    }}>
      {children}
    </span>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <header className="glass sticky top-0 z-10 flex items-center justify-between px-6 py-4 lg:px-8"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gold)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            </svg>
          </div>
          <span className="font-bold text-white" style={{ fontSize: "15px" }}>
            Studio <span style={{ color: "var(--gold)" }}>Immo</span>
          </span>
        </Link>
        <Link href="/" style={{ fontSize: "13px", color: "var(--txt-3)" }}>← Retour</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="label mb-2" style={{ color: "var(--gold)" }}>Légal</p>
          <h1 className="font-bold text-white" style={{ fontSize: "30px", letterSpacing: "-0.03em" }}>
            Mentions légales
          </h1>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginTop: "6px" }}>Dernière mise à jour : juin 2026</p>
        </div>

        <div className="space-y-6" style={{ fontSize: "14px", color: "var(--txt-2)", lineHeight: 1.8 }}>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>1. Éditeur du site</h2>
            <p>Le présent site <strong>Studio Immo</strong> (accessible à l'adresse <Todo>[À COMPLÉTER — URL définitive du site]</Todo>) est édité par :</p>
            <div className="mt-3 space-y-1.5">
              <p><strong className="text-white">Nom :</strong> Alexis Lemaire</p>
              <p>
                <strong className="text-white">Statut juridique :</strong>{" "}
                <Todo>[À COMPLÉTER — Auto-entrepreneur / SASU / SAS — structure non encore immatriculée]</Todo>
              </p>
              <p>
                <strong className="text-white">SIRET :</strong>{" "}
                <Todo>[À COMPLÉTER — numéro SIRET après immatriculation]</Todo>
              </p>
              <p>
                <strong className="text-white">Adresse :</strong>{" "}
                <Todo>[À COMPLÉTER — adresse du siège social]</Todo>
              </p>
              {/* À MODIFIER avant lancement — remplacer par l'adresse email professionnelle définitive */}
              <p>
                <strong className="text-white">Email :</strong>{" "}
                <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>
                  alexislmr840@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-white">Numéro de TVA intracommunautaire :</strong>{" "}
                <Todo>[À COMPLÉTER — si assujetti à la TVA]</Todo>
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>2. Directeur de la publication</h2>
            <p>Le directeur de la publication est <strong className="text-white">Alexis Lemaire</strong>.</p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>3. Hébergeur</h2>
            <div className="space-y-1.5">
              <p><strong className="text-white">Société :</strong> Vercel Inc.</p>
              <p><strong className="text-white">Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong className="text-white">Site web :</strong>{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le site Studio Immo (textes, visuels, logotypes, interface, code source)
              sont la propriété exclusive d'Alexis Lemaire et sont protégés par les lois françaises et internationales
              relatives à la propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments
              du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable
              de l'éditeur.
            </p>
            <p className="mt-3">
              Les contenus générés par l'IA à la demande de l'utilisateur (textes de publication, stratégies) sont
              fournis à titre de résultats de traitement automatisé. L'utilisateur est seul responsable de l'utilisation
              qu'il en fait.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>5. Données personnelles et cookies</h2>
            <p>
              Le traitement des données personnelles des utilisateurs est décrit dans la{" "}
              <Link href="/confidentialite" style={{ color: "var(--gold)" }}>
                Politique de confidentialité
              </Link>
              {" "}du site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>6. Contact</h2>
            <p>
              Pour toute question relative au présent site, vous pouvez contacter l'éditeur à l'adresse :{" "}
              {/* À MODIFIER avant lancement */}
              <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>
                alexislmr840@gmail.com
              </a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
