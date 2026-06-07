import { SignUp } from "@clerk/nextjs";

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <SignUp
        routing="path"
        path="/inscription"
        signInUrl="/connexion"
        forceRedirectUrl="/dashboard"
        appearance={{ variables: { colorPrimary: "#172554" } }}
      />
    </main>
  );
}
