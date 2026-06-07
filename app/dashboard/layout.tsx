import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/connexion");

  const prenom = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "Agent";
  const initiale = prenom.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0a0a" }}>
      <SidebarNav prenom={prenom} initiale={initiale} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="flex lg:hidden items-center justify-between px-5 py-4"
          style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}
        >
          <Link href="/" className="text-lg font-bold text-white">
            Studio <span style={{ color: "#c9a84c" }}>Immo</span>
          </Link>
          <Link
            href="/nouveau-bien"
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            + Nouveau
          </Link>
        </header>

        {children}
      </div>
    </div>
  );
}
