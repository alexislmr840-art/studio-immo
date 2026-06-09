import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
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
    <ClerkProvider>
      <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          {children}
          <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-1)" }}>
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
              <span style={{ fontSize: "12px", color: "var(--txt-4)" }}>
                © {new Date().getFullYear()} Studio Immo — Alexis Lemaire
              </span>
              <nav className="flex flex-wrap gap-4">
                {[
                  { href: "/mentions-legales", label: "Mentions légales" },
                  { href: "/cgu", label: "CGU" },
                  { href: "/cgv", label: "CGV" },
                  { href: "/confidentialite", label: "Confidentialité" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ fontSize: "12px", color: "var(--txt-4)" }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}