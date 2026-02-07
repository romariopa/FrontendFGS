"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import ProductList from "./ProductList";
import { useI18n } from "@/i18n/I18nContext";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">{t.products.pageTitle}</h1>
        <p className="text-muted-foreground">
          {t.products.pageSubtitle}
        </p>
      </div>
      
      <ProductList initialProducts={products} />
    </div>
  );
}
