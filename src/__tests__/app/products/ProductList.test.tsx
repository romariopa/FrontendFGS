import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductList from "@/app/products/ProductList";
import { Product } from "@/types/product";

// Mock debounce to return value immediately to avoid timer issues in tests or use real timers
jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: any) => value,
}));

const mockProducts: Product[] = [
  { id: "1", name: "Alpha Savings", type: "ahorro", interestRate: 5, description: "Desc 1" },
  { id: "2", name: "Beta Investment", type: "inversion", interestRate: 10, description: "Desc 2" },
];

describe("ProductList", () => {
  it("renders initial products", async () => {
    render(<ProductList initialProducts={mockProducts} />);
    
    // Initial render might show skeleton or products depending on how useEffect runs.
    // The component sets loading=true on mount.
    // We wait for products to appear.
    
    await waitFor(() => {
      expect(screen.getByText("Alpha Savings")).toBeInTheDocument();
      expect(screen.getByText("Beta Investment")).toBeInTheDocument();
    });
  });

  it("filters products by name", async () => {
    render(<ProductList initialProducts={mockProducts} />);

    await waitFor(() => screen.getByText("Alpha Savings"));

    const searchInput = screen.getByPlaceholderText(/Ej: Cuenta Amiga.../i);
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    await waitFor(() => {
      expect(screen.getByText("Alpha Savings")).toBeInTheDocument();
      expect(screen.queryByText("Beta Investment")).not.toBeInTheDocument();
    });
  });

  it("filters products by type", async () => {
    render(<ProductList initialProducts={mockProducts} />);

    await waitFor(() => screen.getByText("Alpha Savings"));

    const typeSelect = screen.getByRole("combobox"); // Select element
    fireEvent.change(typeSelect, { target: { value: "inversion" } });

    await waitFor(() => {
      expect(screen.queryByText("Alpha Savings")).not.toBeInTheDocument();
      expect(screen.getByText("Beta Investment")).toBeInTheDocument();
    });
  });
});
