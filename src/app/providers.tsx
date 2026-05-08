"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Providers({
  locale,
  messages,
  timeZone,
  children,
}: {
  locale: string;
  messages: Record<string, unknown>;
  timeZone: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone ?? "Africa/Douala"}
      >
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
