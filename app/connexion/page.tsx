export default function ConnexionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-950">
            Studio <span className="text-amber-500">Immo</span>
          </h1>

          <p className="mt-3 text-slate-800">
            Connectez-vous à votre compte
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-slate-900">
              Adresse email
            </label>

            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-900">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-950 py-3 font-bold text-white"
          >
            Se connecter
          </button>
        </form>

        <div className="my-6 h-px bg-slate-200"></div>

        <p className="text-center text-slate-800">
          Pas encore de compte ?
        </p>

        <button className="mt-4 w-full rounded-xl border-2 border-amber-500 py-3 font-bold text-amber-600">
          Créer un compte
        </button>
      </div>
    </main>
  );
}