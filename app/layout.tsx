import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// FIX — on garde une seule font (Geist Sans), suppression de Geist_Mono inutilisé
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// FIX — metadata correcte pour le SaaS
export const metadata: Metadata = {
  title: "Studio Immo — Marketing immobilier automatisé",
  description:
    "Générez des publications Facebook, Instagram et des visuels professionnels pour vos mandats immobiliers en quelques secondes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}