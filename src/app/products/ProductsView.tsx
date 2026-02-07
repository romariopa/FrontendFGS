"use client";

import ProductList from "./ProductList";
import { useI18n } from "@/i18n/I18nContext";
import { Product } from "@/types/product";

interface ProductsViewProps {
  initialProducts: Product[];
}

export default function ProductsView({ initialProducts }: ProductsViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">{t.products.pageTitle}</h1>
        <p className="text-muted-foreground">
          {t.products.pageSubtitle}
        </p>
      </div>
      
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
