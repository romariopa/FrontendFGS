"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nContext";
import { Globe } from "lucide-react";

export function Navbar() {
  const { t, locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-800">
          {t.navbar.brand}
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost">{t.navbar.products}</Button>
          </Link>
          <Link href="/simulator">
            <Button variant="ghost">{t.navbar.simulator}</Button>
          </Link>
          <Link href="/onboarding">
            <Button>{t.navbar.openAccount}</Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleLanguage} title={t.navbar.language}>
            <span className="sr-only">{t.navbar.language}</span>
            <div className="flex items-center gap-1 font-bold">
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}
