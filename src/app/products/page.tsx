import { productService } from "@/services/productService";
import ProductsView from "./ProductsView";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await productService.getProducts();

  return <ProductsView initialProducts={products} />;
}
