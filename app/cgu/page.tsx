import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions Générales d'Utilisation — Studio Immo" };

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

export default function CguPage() {
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
            Conditions Générales d&apos;Utilisation
          </h1>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginTop: "6px" }}>Dernière mise à jour : juin 2026</p>
        </div>

        <div className="space-y-6" style={{ fontSize: "14px", color: "var(--txt-2)", lineHeight: 1.8 }}>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 1 — Objet</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation
              du service <strong>Studio Immo</strong>, un outil SaaS de génération de contenus marketing pour
              les professionnels de l&apos;immobilier, exploité par Alexis Lemaire.
            </p>
            <p className="mt-3">
              L&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
              L&apos;éditeur se réserve le droit de les modifier à tout moment ; les utilisateurs seront informés
              de toute modification substantielle.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 2 — Accès au service</h2>
            <p>
              Studio Immo est accessible via un navigateur web, à l&apos;adresse{" "}
              <Todo>[À COMPLÉTER — URL du site]</Todo>. L&apos;accès complet nécessite la création d&apos;un compte
              utilisateur via notre système d&apos;authentification (Clerk).
            </p>
            <p className="mt-3">
              L&apos;inscription est ouverte à toute personne physique ou morale agissant dans un cadre
              professionnel ou commercial. L&apos;utilisateur doit avoir au minimum 18 ans et disposer
              de la capacité juridique pour contracter.
            </p>
            <p className="mt-3">
              L&apos;éditeur se réserve le droit de refuser ou de suspendre l&apos;accès à tout compte ne
              respectant pas les présentes conditions.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 3 — Description du service</h2>
            <p>Studio Immo propose les fonctionnalités suivantes :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Génération automatisée de stratégies de publication sur les réseaux sociaux (Facebook, Instagram, Stories) à partir de données d'un bien immobilier, via l'IA (OpenAI GPT-4o mini)",
                "Création de visuels PNG téléchargeables (format 1 080 × 1 350 px) composés des photos du bien et des éléments de l'agence",
                "Planification des publications (date et heure)",
                "Stockage des campagnes générées dans un espace personnel",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Les fonctionnalités disponibles dépendent de l&apos;offre souscrite (voir{" "}
              <Link href="/cgv" style={{ color: "var(--gold)" }}>CGV</Link>).
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 4 — Compte utilisateur</h2>
            <p>
              Lors de la création de son compte, l&apos;utilisateur fournit des informations exactes et à jour.
              Il est seul responsable de la confidentialité de ses identifiants de connexion.
            </p>
            <p className="mt-3">
              Tout accès au service effectué avec les identifiants d&apos;un utilisateur est réputé effectué
              par cet utilisateur. En cas de suspicion de compromission, l&apos;utilisateur doit contacter
              immédiatement l&apos;éditeur à{" "}
              {/* À MODIFIER avant lancement */}
              <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>alexislmr840@gmail.com</a>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 5 — Obligations de l&apos;utilisateur</h2>
            <p>L&apos;utilisateur s&apos;engage à :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "N'utiliser le service qu'à des fins légales et conformes aux droits des tiers",
                "Ne pas charger de photos dont il ne détient pas les droits ou pour lesquelles il n'a pas obtenu les autorisations nécessaires",
                "Ne pas tenter de contourner les mécanismes de sécurité ou d'accéder à des données d'autres utilisateurs",
                "Ne pas revendre, sous-licencier ou reproduire le service à des tiers sans accord écrit préalable",
                "Ne pas utiliser le service pour générer des contenus illicites, trompeurs ou portant atteinte à des tiers",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 6 — Limitation de responsabilité</h2>
            <p>
              Les contenus générés par l&apos;IA (textes de publication, stratégies marketing) sont produits
              automatiquement et fournis à titre indicatif. L&apos;éditeur ne garantit pas leur exactitude,
              leur pertinence commerciale ni leur conformité légale selon les situations spécifiques de chaque utilisateur.
            </p>
            <p className="mt-3">
              L&apos;utilisateur est seul responsable des contenus qu&apos;il publie sur les réseaux sociaux
              à partir des éléments générés par Studio Immo.
            </p>
            <p className="mt-3">
              L&apos;éditeur ne saurait être tenu responsable des interruptions de service liées à des causes
              extérieures (pannes de fournisseurs tiers, maintenance, force majeure).
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 7 — Propriété intellectuelle</h2>
            <p>
              Le code, le design et les composants de Studio Immo sont la propriété exclusive d&apos;Alexis Lemaire.
              Les contenus générés par l&apos;IA à la demande de l&apos;utilisateur lui sont concédés dans le cadre
              de son abonnement, pour un usage professionnel.
            </p>
            <p className="mt-3">
              <Todo>[À COMPLÉTER — préciser les droits de réutilisation des contenus générés : exclusivité, cession totale ou licence limitée]</Todo>
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 8 — Suspension et résiliation</h2>
            <p>
              L&apos;éditeur peut suspendre ou résilier l&apos;accès d&apos;un utilisateur sans préavis en cas de
              violation des présentes CGU ou de comportement portant atteinte au service ou à d&apos;autres utilisateurs.
            </p>
            <p className="mt-3">
              L&apos;utilisateur peut résilier son abonnement à tout moment depuis son espace personnel.
              Les conditions de résiliation et de remboursement sont détaillées dans les{" "}
              <Link href="/cgv" style={{ color: "var(--gold)" }}>CGV</Link>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 9 — Modifications des CGU</h2>
            <p>
              L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés par email{" "}
              <Todo>[À COMPLÉTER — et/ou notification dans l'interface]</Todo>{" "}
              au moins <Todo>[À COMPLÉTER — 15 / 30]</Todo> jours avant l&apos;entrée en vigueur
              des nouvelles conditions.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 10 — Droit applicable et litiges</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties s&apos;efforceront
              de trouver une solution amiable avant tout recours judiciaire.
            </p>
            <p className="mt-3">
              À défaut, tout litige relèvera de la compétence exclusive du tribunal de{" "}
              <Todo>[À COMPLÉTER — ville du tribunal compétent]</Todo>.
            </p>
            <p className="mt-3">
              Conformément à l&apos;article L.612-1 du Code de la consommation, le consommateur a le droit
              de recourir gratuitement à un médiateur de la consommation. Médiateur compétent :{" "}
              <Todo>[À COMPLÉTER — nom et coordonnées du médiateur]</Todo>.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
