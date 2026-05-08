import { createNavigation } from "next-intl/navigation";
import { locales } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({
    locales: [...locales],
    defaultLocale: "fr",
    localePrefix: "as-needed",
  });

