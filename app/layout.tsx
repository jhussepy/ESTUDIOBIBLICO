import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academia de Teología Bíblica",
  description:
    "Estudio profesional de los 66 libros de la Biblia, desde Génesis hasta Apocalipsis, con análisis versículo por versículo.",
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
