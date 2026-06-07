import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardMain from "@/components/DashboardMain";

export default async function DashboardPage() {
  const user = await currentUser();
  const prenom = user?.firstName || "Agent";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonne après-midi" : "Bonsoir";

  return <DashboardMain prenom={prenom} greeting={greeting} createdAt={createdAt} />;
}
