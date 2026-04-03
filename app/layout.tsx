import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Toaster } from "react-hot-toast";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valtrapru.store — Вальтрапы и ушки для лошадей",
  description:
    "Valtrapru.store — вальтрапы и ушки для лошадей ручной работы. Конкур, выездка, универсальные и пони.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <Header />
        <main className="flex-1 page-enter">{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: "var(--font-nunito)", borderRadius: "12px" },
          }}
        />
      </body>
    </html>
  );
}
