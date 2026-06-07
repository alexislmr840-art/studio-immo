import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/connexion");

  const prenom = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "Agent";
  const initiale = prenom.charAt(0).toUpperCase();
  const email = user.emailAddresses[0]?.emailAddress ?? undefined;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <SidebarNav prenom={prenom} initiale={initiale} email={email} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="flex lg:hidden items-center justify-between px-5 py-4 glass sticky top-0 z-20"
          style={{ borderBottom: "1px solid var(--border-s)" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{ background: "var(--gold)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-white">
              Studio <span style={{ color: "var(--gold)" }}>Immo</span>
            </span>
          </Link>
          <Link href="/nouveau-bien" className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "12px" }}>
            + Nouveau
          </Link>
        </header>

        {children}
      </div>
    </div>
  );
}
