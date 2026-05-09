import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  // Next-intl routes look like /fr/admin or /admin (if default locale)
  // We check if the path contains /admin
  const isAdminRoute = pathname.includes("/admin");

  if (isAdminRoute) {
    const session = request.cookies.get("admin_session")?.value;
    
    // If no session, redirect to login
    // We need to preserve the locale if present
    if (!session) {
      const locale = locales.find(l => pathname.startsWith(`/${l}/`)) || defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
