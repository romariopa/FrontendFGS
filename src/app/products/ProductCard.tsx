"use client";

import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useI18n } from "@/i18n/I18nContext";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-blue-900">{product.name}</CardTitle>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
            {t.products[`type${product.type.charAt(0).toUpperCase() + product.type.slice(1)}` as keyof typeof t.products] || product.type}
          </span>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-green-600">{product.interestRate}%</span>
          <span className="text-sm text-gray-500">{t.products.ea}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{t.products.annualRate}</p>
      </CardContent>
    </Card>
  );
}

export function ProductSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse mt-2" />
      </CardContent>
    </Card>
  );
}
