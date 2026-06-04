'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import { useState } from 'react'

export default function ConnexionPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-6">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Studio <span className="text-amber-400">Immo</span>
          </h1>
          <p className="mt-2 text-slate-300">
            {mode === 'signin' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {mode === 'signin'
          ? <SignIn routing="hash" />
          : <SignUp routing="hash" />
        }

        {mode === 'signin' ? (
          <p className="text-slate-300">
            Pas encore de compte ?{' '}
            <button
              onClick={() => setMode('signup')}
              className="font-bold text-amber-400 hover:underline"
            >
              Créer un compte
            </button>
          </p>
        ) : (
          <p className="text-slate-300">
            Déjà un compte ?{' '}
            <button
              onClick={() => setMode('signin')}
              className="font-bold text-amber-400 hover:underline"
            >
              Se connecter
            </button>
          </p>
        )}

      </div>
    </main>
  )
}
