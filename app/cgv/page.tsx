import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions Générales de Vente — Studio Immo" };

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

export default function CgvPage() {
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
            Conditions Générales de Vente
          </h1>
          <p style={{ fontSize: "13px", color: "var(--txt-4)", marginTop: "6px" }}>Dernière mise à jour : juin 2026</p>
        </div>

        <div className="space-y-6" style={{ fontSize: "14px", color: "var(--txt-2)", lineHeight: 1.8 }}>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 1 — Objet et champ d&apos;application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toutes les souscriptions
              d&apos;abonnement au service <strong>Studio Immo</strong>, exploité par Alexis Lemaire
              (<Todo>[À COMPLÉTER — statut juridique, SIRET]</Todo>).
            </p>
            <p className="mt-3">
              Toute souscription implique l&apos;acceptation pleine et entière des présentes CGV.
              Ces conditions prévalent sur tout autre document, sauf accord écrit dérogatoire.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 2 — Offres et tarifs</h2>
            <p>Studio Immo propose les abonnements suivants (prix TTC) :</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Plan Solo</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>39 € / mois</span>
                </div>
                <p style={{ fontSize: "13px" }}>
                  <Todo>[À COMPLÉTER — liste des fonctionnalités incluses dans le plan Solo]</Todo>
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Plan Équipe</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>79 € / mois</span>
                </div>
                <p style={{ fontSize: "13px" }}>
                  <Todo>[À COMPLÉTER — liste des fonctionnalités incluses dans le plan Équipe]</Todo>
                </p>
              </div>
            </div>
            <p className="mt-4">
              Les tarifs sont libellés en euros, toutes taxes comprises. L&apos;éditeur se réserve le droit
              de modifier ses tarifs à tout moment ; les modifications s&apos;appliquent au renouvellement
              suivant et sont communiquées avec un préavis d&apos;au moins{" "}
              <Todo>[À COMPLÉTER — 30]</Todo> jours.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 3 — Modalités de paiement</h2>
            <p>
              Le paiement est effectué en ligne, de manière sécurisée, via la plateforme{" "}
              <strong className="text-white">Stripe</strong>. Les moyens de paiement acceptés sont :{" "}
              <Todo>[À COMPLÉTER — carte bancaire Visa/Mastercard/etc.]</Todo>.
            </p>
            <p className="mt-3">
              L&apos;abonnement est prélevé automatiquement à chaque échéance mensuelle, à date anniversaire
              de la souscription initiale. Studio Immo ne stocke aucune donnée bancaire — le traitement
              est intégralement délégué à Stripe.
            </p>
            <p className="mt-3">
              En cas d&apos;échec de paiement, l&apos;accès au service peut être suspendu après{" "}
              <Todo>[À COMPLÉTER — délai de relance]</Todo>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 4 — Durée et renouvellement</h2>
            <p>
              Les abonnements sont souscrits pour une durée d&apos;un mois, renouvelable automatiquement
              par tacite reconduction à la date anniversaire de souscription.
            </p>
            <p className="mt-3">
              L&apos;utilisateur peut annuler la reconduction automatique depuis son espace personnel
              à tout moment. L&apos;annulation prend effet à la fin de la période en cours déjà réglée.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 5 — Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation
              ne s&apos;applique pas aux services de contenu numérique dont l&apos;exécution a commencé
              avec l&apos;accord préalable du consommateur, qui a renoncé à son droit de rétractation.
            </p>
            <p className="mt-3">
              En souscrivant et en utilisant le service immédiatement après paiement, l&apos;utilisateur
              reconnaît avoir expressément demandé l&apos;exécution immédiate du service et renonce
              à son droit de rétractation de 14 jours.
            </p>
            <p className="mt-3">
              <Todo>[À COMPLÉTER — si vous souhaitez offrir un geste commercial différent, précisez-le ici]</Todo>
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 6 — Résiliation</h2>
            <p>
              L&apos;utilisateur peut résilier son abonnement à tout moment depuis son espace personnel
              ou en contactant l&apos;éditeur. La résiliation prend effet à la fin de la période mensuelle
              en cours ; aucun remboursement proratisé n&apos;est accordé sauf disposition légale contraire.
            </p>
            <p className="mt-3">
              En cas de résiliation à l&apos;initiative de l&apos;éditeur pour faute (violation des CGU),
              aucun remboursement n&apos;est dû.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 7 — Disponibilité du service</h2>
            <p>
              L&apos;éditeur s&apos;efforce de maintenir le service disponible 24h/24 et 7j/7.
              Des interruptions peuvent survenir pour maintenance, mises à jour ou incidents techniques.
              L&apos;éditeur ne garantit pas un taux de disponibilité spécifique et ne saurait être
              tenu responsable d&apos;interruptions indépendantes de sa volonté.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 8 — Responsabilité</h2>
            <p>
              La responsabilité de l&apos;éditeur est limitée aux dommages directs causés par un manquement
              avéré à ses obligations contractuelles. En tout état de cause, la responsabilité maximale
              de l&apos;éditeur est plafonnée aux sommes versées par l&apos;utilisateur au cours des
              3 derniers mois d&apos;abonnement.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 9 — Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige fera l&apos;objet d&apos;une
              tentative de résolution amiable avant tout recours judiciaire.
            </p>
            <p className="mt-3">
              Les consommateurs peuvent recourir au service de médiation :{" "}
              <Todo>[À COMPLÉTER — nom et coordonnées du médiateur agréé]</Todo>.
            </p>
            <p className="mt-3">
              À défaut, le tribunal compétent sera celui de{" "}
              <Todo>[À COMPLÉTER — ville]</Todo>.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "15px" }}>Article 10 — Contact</h2>
            <p>
              Pour toute question relative à votre abonnement ou facturation :{" "}
              {/* À MODIFIER avant lancement */}
              <a href="mailto:alexislmr840@gmail.com" style={{ color: "var(--gold)" }}>alexislmr840@gmail.com</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
