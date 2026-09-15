import type { Metadata } from "next";
import Script from "next/script";

import { AppearanceSync } from "@/components/appearance-sync";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://estudiobiblico-black.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Academia de Teología Bíblica",
    template: "%s | Academia Bíblica",
  },
  description:
    "Estudio profesional de los 66 libros de la Biblia, desde Génesis hasta Apocalipsis, con análisis versículo por versículo.",
  applicationName: "Academia Bíblica",
  keywords: ["Biblia", "teología bíblica", "exégesis", "Génesis", "estudio bíblico"],
  authors: [{ name: "Academia Bíblica" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Academia Bíblica",
    title: "Academia de Teología Bíblica",
    description:
      "Estudio bíblico profundo, trazable y versículo por versículo desde Génesis hasta Apocalipsis.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Academia de Teología Bíblica",
    description: "Estudio bíblico profundo y versículo por versículo.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Script id="workspace-appearance-bootstrap" strategy="beforeInteractive">
          {`try{var saved=JSON.parse(localStorage.getItem("academia-biblica.workspace.v1")||"{}");var preferences=saved.preferences||{};var palettes=["manuscript","parchment","ocean","olive","royal","ruby","turquoise","cobalt","lavender","blush","mint"];var modes=["system","light","dark"];var palette=palettes.includes(preferences.colorPalette)?preferences.colorPalette:"manuscript";var mode=modes.includes(preferences.colorMode)?preferences.colorMode:"system";var resolved=mode==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):mode;document.documentElement.dataset.palette=palette;document.documentElement.dataset.colorMode=resolved;document.documentElement.dataset.highContrast=preferences.highContrast?"true":"false";}catch(error){document.documentElement.dataset.palette="manuscript";document.documentElement.dataset.colorMode=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.highContrast="false";}`}
        </Script>
        <AppearanceSync />
        {children}
        <Script id="api-bible-fums-bootstrap" strategy="beforeInteractive">
          {`window.fumsData=window.fumsData||[];window.fums=window.fums||function(){window.fumsData.push(arguments);};`}
        </Script>
        <Script
          src="https://pkg.api.bible/fumsV3.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
