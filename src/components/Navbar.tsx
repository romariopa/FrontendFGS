"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nContext";
import { Globe, Menu, X } from "lucide-react";

export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-800 z-50">
          {t.navbar.brand}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="mr-2">
            <div className="flex items-center gap-1 font-bold">
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </div>
          </Button>
          <button 
            className="p-2 text-gray-600 focus:outline-none z-50" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-4 animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col space-y-4">
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg h-12">{t.navbar.products}</Button>
            </Link>
            <Link href="/simulator" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg h-12">{t.navbar.simulator}</Button>
            </Link>
            <Link href="/onboarding" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full text-lg h-12">{t.navbar.openAccount}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
