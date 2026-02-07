import { render, screen, waitFor } from "@testing-library/react";
import ProductsPage from "@/app/products/page";
import { productService } from "@/services/productService";

// Mock productService
jest.mock("@/services/productService", () => ({
  productService: {
    getProducts: jest.fn(),
  },
}));

describe("Products Page", () => {
  it("renders heading and product list", async () => {
    // Mock return value
    const mockProducts = [
      { id: "1", name: "Cuenta Ahorro", minAmount: 50000, interestRate: 0.05, description: "Desc 1", benefits: [], type: "ahorro" },
    ];
    (productService.getProducts as jest.Mock).mockResolvedValue(mockProducts);

    // Call the async component directly
    const jsx = await ProductsPage();
    render(jsx);

    expect(screen.getByText("Nuestros Productos")).toBeInTheDocument();
    expect(screen.getByText("Encuentra la solución financiera ideal para tus metas.")).toBeInTheDocument();
    
    // Check if ProductList rendered (it renders the product name after loading)
    await waitFor(() => {
      expect(screen.getByText("Cuenta Ahorro")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
