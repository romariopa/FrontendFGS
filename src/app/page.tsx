"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useI18n } from "@/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 py-8 md:py-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-900">
          {t.home.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {t.home.subtitle}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 w-full max-w-5xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t.home.productsTitle}</CardTitle>
            <CardDescription>{t.home.productsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">{t.home.productsContent}</p>
            <Link href="/products">
              <Button className="w-full">{t.home.productsBtn}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t.home.simulatorTitle}</CardTitle>
            <CardDescription>{t.home.simulatorDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">{t.home.simulatorContent}</p>
            <Link href="/simulator">
              <Button className="w-full" variant="secondary">{t.home.simulatorBtn}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t.home.accountTitle}</CardTitle>
            <CardDescription>{t.home.accountDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">{t.home.accountContent}</p>
            <Link href="/onboarding">
              <Button className="w-full" variant="outline">{t.home.accountBtn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
