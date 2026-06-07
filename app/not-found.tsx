import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#080808", fontFamily: "'DM Sans','Inter',sans-serif" }}>
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08), transparent)" }} />

      <div className="relative z-10">
        <p className="text-8xl font-black" style={{ color: "rgba(201,168,76,0.15)" }}>404</p>
        
        <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl mx-auto"
          style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">Page introuvable</h1>
        <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard"
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
            Retour au dashboard
          </Link>
          <Link href="/"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
