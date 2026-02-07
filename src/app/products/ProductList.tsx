"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/Input";
import { ProductCard, ProductSkeleton } from "./ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Filter, Inbox } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const filterProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simular retardo de red para mostrar skeleton
        await new Promise((resolve) => setTimeout(resolve, 600));

        let filtered = initialProducts;

        if (debouncedSearch) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        if (filterType !== "all") {
          filtered = filtered.filter((p) => p.type === filterType);
        }

        setProducts(filtered);
      } catch {
        setError(t.products.errorFilter);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [debouncedSearch, filterType, initialProducts, t.products.errorFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-6 rounded-lg shadow-sm border">
        <div className="w-full md:w-1/2 relative">
          <label className="text-sm font-medium mb-1 block text-gray-700">{t.products.searchLabel}</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t.products.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="text-sm font-medium mb-1 block text-gray-700">{t.products.filterLabel}</label>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">{t.products.filterAll}</option>
              <option value="ahorro">{t.products.filterSavings}</option>
              <option value="inversion">{t.products.filterInvestment}</option>
              <option value="corriente">{t.products.filterChecking}</option>
              <option value="cdts">{t.products.filterCDTs}</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <Inbox className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-lg font-medium">{t.products.noResults}</p>
            <p className="text-sm">{t.products.noResultsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
