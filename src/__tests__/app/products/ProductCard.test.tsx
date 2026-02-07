import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/app/products/ProductCard";
import { Product } from "@/types/product";

describe("ProductCard", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    type: "ahorro",
    interestRate: 5.5,
    description: "A test product description",
  };

  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("ahorro")).toBeInTheDocument();
    expect(screen.getByText("5.5%")).toBeInTheDocument();
    expect(screen.getByText("A test product description")).toBeInTheDocument();
  });
});
