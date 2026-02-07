import { Product } from "@/types/product";

// Usar 127.0.0.1 en lugar de localhost para evitar problemas de resolución IPv4/IPv6 en Node.js
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("localhost", "127.0.0.1") || "http://127.0.0.1:3000/api";

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      console.log(`[ProductService] Fetching products from: ${API_URL}/products`);
      const response = await fetch(`${API_URL}/products`, {
        cache: 'no-store' // Asegurar que no cachee respuestas vacías o errores
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText} (${response.status})`);
      }
      
      const data = await response.json();
      console.log(`[ProductService] Successfully fetched ${data.length} products`);
      return data;
    } catch (error) {
      console.error("[ProductService] Failed to fetch products:", error);
      // Retornar array vacío para no romper la UI, pero el log ayudará a debuggear
      return [];
    }
  },
};
