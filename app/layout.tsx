import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valtrapru.store";

export const metadata: Metadata = {
  title: {
    default: "ВальтрапРу — магазин вальтрапов и ушек",
    template: "%s — ВальтрапРу",
  },
  description:
    "Вальтрапы и ушки для лошадей ручной работы. Конкур, выездка, универсальные модели. Доставка по России через Яндекс Маркет.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: "ВальтрапРу",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "RTWqWDFVG0aU7TZ4oo9FHt4nxxByYwqrZVzGKCOQR00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <Providers>
          {children}
        </Providers>
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
