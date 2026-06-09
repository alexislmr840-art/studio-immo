import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité — Studio Immo" };

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

export default function ConfidentialitePage() {
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
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginTop: "6px" }}>Dernière mise à jour : juin 2026</p>
        </div>

        <div className="space-y-6" style={{ fontSize: "14px", color: "var(--txt-2)", lineHeight: 1.8 }}>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées via le service Studio Immo est :
            </p>
            <div className="mt-3 space-y-1.5">
              <p><strong className="text-white">Nom :</strong> Alexis Lemaire</p>
              <p><strong className="text-white">Statut :</strong> <Todo>[À COMPLÉTER — statut juridique, SIRET]</Todo></p>
              <p>
                <strong className="text-white">Email :</strong>{" "}
                {/* À MODIFIER avant lancement */}
                <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>alexislmr840@gmail.com</a>
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>2. Données collectées</h2>
            <p>Studio Immo collecte les données suivantes :</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium text-white mb-2">Données de compte (via Clerk)</p>
                <ul className="space-y-1 list-none">
                  {["Adresse e-mail", "Nom (optionnel)", "Identifiant unique Clerk"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span style={{ color: "var(--gold)", flexShrink: 0 }}>▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-white mb-2">Données de contenu (générées via le service)</p>
                <ul className="space-y-1 list-none">
                  {[
                    "Informations sur les biens immobiliers (titre, ville, prix, surface, description)",
                    "Photos des biens immobiliers (stockées dans Supabase Storage)",
                    "Contenus marketing générés par l'IA",
                    "Planifications de publication",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }}>▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-white mb-2">Données de navigation et techniques</p>
                <ul className="space-y-1 list-none">
                  {["Logs de connexion", "Adresse IP (collectée par Clerk et Vercel)", "Données de session navigateur (localStorage, sessionStorage)"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }}>▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>3. Finalités du traitement</h2>
            <div className="space-y-3">
              {[
                { base: "Exécution du contrat", desc: "Fournir le service d'abonnement : génération de contenus, stockage des campagnes, accès au tableau de bord." },
                { base: "Obligations légales", desc: "Conservation des factures et données de facturation (durée légale : 10 ans)." },
                { base: "Intérêt légitime", desc: "Amélioration du service, sécurité, prévention des abus." },
                { base: "Consentement", desc: "Envoi de communications marketing (si l'utilisateur a consenti — voir les préférences de notification)." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>▸</span>
                  <p><strong className="text-white">{item.base} :</strong> {item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>4. Sous-traitants et transferts</h2>
            <p>Studio Immo fait appel aux sous-traitants suivants :</p>
            <div className="mt-3 space-y-3">
              {[
                { nom: "Clerk", role: "Authentification et gestion des comptes utilisateurs", pays: "États-Unis (SCC)", url: "https://clerk.com/privacy" },
                { nom: "Supabase", role: "Base de données et stockage des fichiers", pays: "États-Unis / UE (selon région choisie)", url: "https://supabase.com/privacy" },
                { nom: "Vercel", role: "Hébergement et déploiement du service", pays: "États-Unis (SCC)", url: "https://vercel.com/legal/privacy-policy" },
                { nom: "OpenAI", role: "Génération de contenus marketing par IA", pays: "États-Unis (SCC)", url: "https://openai.com/privacy" },
                { nom: "Stripe", role: "Traitement sécurisé des paiements", pays: "États-Unis / UE", url: "https://stripe.com/privacy" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                  <p className="font-medium text-white">{item.nom}</p>
                  <p style={{ fontSize: "13px" }}>{item.role} — {item.pays}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Les transferts hors UE sont encadrés par des Clauses Contractuelles Types (SCC) de la Commission européenne.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>5. Durée de conservation</h2>
            <div className="space-y-2">
              {[
                { type: "Données de compte", duree: "Durée de l'abonnement + 3 ans après résiliation" },
                { type: "Données de contenu (biens, campagnes)", duree: "Durée de l'abonnement + 1 an" },
                { type: "Données de facturation", duree: "10 ans (obligation légale)" },
                { type: "Logs de connexion", duree: "12 mois" },
                { type: "Données stockées localement (localStorage)", duree: "Jusqu'à suppression par l'utilisateur" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span>{item.type}</span>
                  <span className="text-right" style={{ color: "var(--txt-3)", flexShrink: 0 }}>{item.duree}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>6. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement (UE) 2016/679 (RGPD), vous disposez des droits suivants :</p>
            <div className="mt-3 space-y-2">
              {[
                { droit: "Accès", desc: "Obtenir une copie de vos données personnelles." },
                { droit: "Rectification", desc: "Corriger des données inexactes ou incomplètes." },
                { droit: "Effacement", desc: "Demander la suppression de vos données (« droit à l'oubli »)." },
                { droit: "Opposition", desc: "Vous opposer à certains traitements fondés sur l'intérêt légitime." },
                { droit: "Limitation", desc: "Demander la suspension temporaire d'un traitement." },
                { droit: "Portabilité", desc: "Recevoir vos données dans un format structuré et lisible par machine." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>▸</span>
                  <p><strong className="text-white">{item.droit} :</strong> {item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              {/* À MODIFIER avant lancement */}
              <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>alexislmr840@gmail.com</a>.
              Nous nous engageons à répondre dans un délai d&apos;un mois.
            </p>
            <p className="mt-3">
              Vous pouvez également adresser une réclamation à la{" "}
              <strong className="text-white">CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
                www.cnil.fr
              </a>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>7. Cookies et stockage local</h2>
            <p>Studio Immo utilise :</p>
            <div className="mt-3 space-y-3">
              {[
                {
                  type: "Cookies d'authentification (Clerk)",
                  base: "Nécessaire à l'exécution du service",
                  desc: "Permettent le maintien de votre session de connexion.",
                },
                {
                  type: "localStorage (navigateur)",
                  base: "Nécessaire",
                  desc: "Stockent temporairement les données de génération (ID, URLs de photos, préférences de planification) sur votre appareil. Ces données restent locales — elles ne sont pas envoyées à nos serveurs.",
                },
                {
                  type: "Cookies de préférence de consentement",
                  base: "Fonctionnel",
                  desc: "Enregistrent votre choix sur le bandeau cookies (clé « studio_immo_cookies »).",
                },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                  <p className="font-medium text-white">{item.type}</p>
                  <p style={{ fontSize: "12px", color: "var(--gold)", marginBottom: "4px" }}>{item.base}</p>
                  <p style={{ fontSize: "13px" }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              <Todo>[À COMPLÉTER — si vous utilisez des outils analytics (Plausible, Vercel Analytics, etc.), les lister ici avec leur base légale]</Todo>
            </p>
            <p className="mt-3">
              Vous pouvez modifier vos préférences à tout moment en cliquant sur{" "}
              <Todo>[À COMPLÉTER — lien « Gérer mes cookies »]</Todo>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>8. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
              vos données contre tout accès non autorisé, perte ou altération : chiffrement HTTPS,
              authentification sécurisée via Clerk, accès à la base de données restreint via les
              politiques de sécurité Supabase (RLS).
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>9. Modifications</h2>
            <p>
              Nous pouvons mettre à jour cette politique à tout moment. Les modifications substantielles
              seront notifiées par e-mail ou via une bannière dans l&apos;interface.
              La date de dernière mise à jour figure en haut de ce document.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center" style={{ fontSize: "13px", color: "var(--txt-4)" }}>
          <p>Liens utiles :{" "}
            <Link href="/mentions-legales" style={{ color: "var(--gold)" }}>Mentions légales</Link>
            {" · "}
            <Link href="/cgu" style={{ color: "var(--gold)" }}>CGU</Link>
            {" · "}
            <Link href="/cgv" style={{ color: "var(--gold)" }}>CGV</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
