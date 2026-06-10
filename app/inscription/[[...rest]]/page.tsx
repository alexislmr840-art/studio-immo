'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

const clerkAppearance = {
  variables: {
    colorPrimary: '#c9a84c',
    colorBackground: '#111111',
    colorInputBackground: '#1a1a1a',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255,255,255,0.5)',
    colorNeutral: '#333333',
    borderRadius: '12px',
    fontFamily: 'inherit',
  },
  elements: {
    card: {
      background: '#111111',
      border: '1px solid rgba(201,168,76,0.15)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    },
    headerTitle: { color: '#ffffff', fontWeight: '700' },
    headerSubtitle: { color: 'rgba(255,255,255,0.45)' },
    socialButtonsBlockButton: {
      background: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#ffffff',
    },
    socialButtonsBlockButtonText: { color: '#ffffff', fontWeight: '600' },
    dividerLine: { background: 'rgba(255,255,255,0.08)' },
    dividerText: { color: 'rgba(255,255,255,0.3)' },
    formFieldLabel: { color: 'rgba(255,255,255,0.6)' },
    formFieldInput: {
      background: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#ffffff',
    },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, #c9a84c, #a07830)',
      color: '#0a0a0a',
      fontWeight: '700',
    },
    footerActionLink: { color: '#c9a84c' },
    identityPreviewText: { color: '#ffffff' },
    identityPreviewEditButton: { color: '#c9a84c' },
  },
}

export default function InscriptionPage() {
  return (
    <main
      className="min-h-screen flex"
      style={{ background: '#080808' }}
    >
      {/* ── Gauche : branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12"
        style={{
          background: 'linear-gradient(160deg, #0f0f0f 0%, #080808 100%)',
          borderRight: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)' }}
          >
            🏠
          </div>
          <span className="text-xl font-bold text-white">Studio Immo</span>
        </div>

        {/* Pitch */}
        <div>
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}
          >
            ✦ Campagnes IA en 2 minutes
          </div>

          <h2
            className="font-black text-white leading-tight mb-4"
            style={{ fontSize: '38px', letterSpacing: '-0.03em' }}
          >
            Transformez vos mandats en{' '}
            <span style={{ color: '#c9a84c' }}>campagnes</span>{' '}
            réseaux sociaux.
          </h2>

          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Générez automatiquement vos posts Facebook, Instagram et Stories
            grâce à l'IA — en quelques clics, sans formation.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              { icon: '⚡', text: '5 campagnes générées instantanément' },
              { icon: '🖼', text: 'Visuels PNG prêts à publier' },
              { icon: '🎯', text: 'Textes optimisés pour chaque réseau' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  {icon}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Studio Immo · Tous droits réservés
        </p>
      </div>

      {/* ── Droite : formulaire ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">

        {/* Logo mobile */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)' }}
          >
            🏠
          </div>
          <span className="text-lg font-bold text-white">Studio Immo</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Commencez gratuitement, sans carte bancaire
            </p>
          </div>

          <SignUp routing="hash" appearance={clerkAppearance} />

          <p className="mt-5 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Déjà un compte ?{' '}
            <Link
              href="/connexion"
              className="font-semibold hover:underline"
              style={{ color: '#c9a84c' }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
