import { productService } from "@/services/productService";

describe("productService", () => {
  it("returns a list of products", async () => {
    const products = await productService.getProducts();
    
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Check structure of first product
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("type");
    expect(firstProduct).toHaveProperty("interestRate");
    expect(firstProduct).toHaveProperty("description");
  });
});
