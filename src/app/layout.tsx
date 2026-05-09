import type { Metadata } from "next";
import Image from "next/image";
import {
  getLocale,
  getMessages,
  getTimeZone,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s · Cursor Cameroun",
    default: "Cursor Cameroun",
  },
  description:
    "Événements, roadmap territoriale et projets open source de la communauté Cursor Cameroun.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);
  const [messages, timeZone, t] = await Promise.all([
    getMessages(),
    getTimeZone(),
    getTranslations(),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
