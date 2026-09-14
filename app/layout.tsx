import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="es">
      <body className="antialiased">
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
