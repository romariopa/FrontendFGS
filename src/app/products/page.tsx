import { productService } from "@/services/productService";
import ProductList from "./ProductList";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await productService.getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">Nuestros Productos</h1>
        <p className="text-muted-foreground">
          Encuentra la solución financiera ideal para tus metas.
        </p>
      </div>
      
      <ProductList initialProducts={products} />
    </div>
  );
}
