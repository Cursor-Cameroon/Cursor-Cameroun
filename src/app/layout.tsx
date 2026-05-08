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
          <footer className="border-t border-border bg-bg-2">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-text-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                {/* Lockup horizontal officiel — CDC section 2.4 */}
                <Image
                  src="/brand/LOCKUP_HORIZONTAL_2D_LIGHT.svg"
                  alt="Cursor"
                  width={80}
                  height={19}
                  className="brand-logo-light"
                />
                <Image
                  src="/brand/LOCKUP_HORIZONTAL_2D_DARK.svg"
                  alt=""
                  aria-hidden="true"
                  width={80}
                  height={19}
                  className="brand-logo-dark"
                />
                <p className="mt-1 flex items-center gap-2">
                  Cursor Cameroun · © {new Date().getFullYear()}
                  <span className="text-border">|</span>
                  <a href="/fr/admin/events" className="hover:text-text transition-colors">Admin</a>
                </p>
              </div>
              <p className="text-text-2">{t("footer.line")}</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
