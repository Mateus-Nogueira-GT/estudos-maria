import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudos Maria — Neonatologia",
  description:
    "App de estudos com quiz e flashcards sobre Perinatologia, Reanimação Neonatal, Asfixia, Triagem e Alojamento Conjunto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-ink-950 font-sans text-ink-100 antialiased">
        {children}
      </body>
    </html>
  );
}
