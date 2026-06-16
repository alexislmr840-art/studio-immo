export const dynamic = "force-dynamic";
export const revalidate = 0;

import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardMain from "@/components/DashboardMain";
import RefreshOnMount from "./RefreshOnMount";

export default async function DashboardPage() {
  const [, user] = await Promise.all([auth(), currentUser()]);

  const prenom = user?.firstName || "Agent";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonne après-midi" : "Bonsoir";

  return (
    <>
      <RefreshOnMount />
      <DashboardMain prenom={prenom} greeting={greeting} createdAt={createdAt} />
    </>
  );
}
