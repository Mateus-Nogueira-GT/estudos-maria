import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudos Maria",
  description:
    "App de estudos com quiz e flashcards de Neonatologia, Radiologia, Gastroenterologia e Obstetrícia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="relative min-h-screen font-sans text-ink-100 antialiased">
        <div className="aurora" aria-hidden />
        <div className="aurora-grain" aria-hidden />
        <div className="aurora-vignette" aria-hidden />
        {children}
      </body>
    </html>
  );
}
