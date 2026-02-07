import { productService } from "@/services/productService";

// Mock fetch global
global.fetch = jest.fn();

describe("productService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a list of products on success", async () => {
    const mockProducts = [
      { id: "1", name: "Test Product", type: "ahorro", interestRate: 0.05, description: "Desc" }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    const products = await productService.getProducts();
    
    expect(products).toEqual(mockProducts);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/products"), expect.any(Object));
  });

  it("returns empty array and logs error on HTTP error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const products = await productService.getProducts();
    
    expect(products).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("[ProductService] Failed to fetch products:", expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it("returns empty array and logs error on network error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const products = await productService.getProducts();
    
    expect(products).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("[ProductService] Failed to fetch products:", expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});

describe("productService API_URL", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("uses default URL when env var is missing", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    const { productService } = require("@/services/productService");
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    
    await productService.getProducts();
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http:\/\/127\.0\.0\.1:3000\/api\/products/),
      expect.any(Object)
    );
  });

  it("uses configured URL and replaces localhost", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api";
    const { productService } = require("@/services/productService");
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    
    await productService.getProducts();
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http:\/\/127\.0\.0\.1:4000\/api\/products/),
      expect.any(Object)
    );
  });
});
