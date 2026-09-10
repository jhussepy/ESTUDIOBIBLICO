import type { Metadata } from "next";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
