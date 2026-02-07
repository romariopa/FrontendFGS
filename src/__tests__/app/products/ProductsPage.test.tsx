import { render, screen, waitFor } from "@testing-library/react";
import ProductsView from "@/app/products/ProductsView";

// Mock useI18n
jest.mock("@/i18n/I18nContext", () => ({
  useI18n: () => ({
    t: {
      products: {
        pageTitle: "Nuestros Productos",
        pageSubtitle: "Encuentra la solución financiera ideal para tus metas.",
        searchLabel: "Buscar",
        searchPlaceholder: "Buscar...",
        filterLabel: "Filtrar",
        filterAll: "Todos",
        filterSavings: "Ahorro",
        filterInvestment: "Inversión",
        filterChecking: "Corriente",
        filterCDTs: "CDTs",
        errorFilter: "Error al filtrar",
      },
    },
  }),
}));

// Mock ProductList if we want shallow rendering, but integration is fine too.
// Let's keep integration to verify the list renders.

describe("Products View", () => {
  it("renders heading and product list", async () => {
    const mockProducts = [
      { id: "1", name: "Cuenta Ahorro", type: "ahorro", interestRate: 0.05, description: "Desc 1" } as any,
    ];

    render(<ProductsView initialProducts={mockProducts} />);

    expect(screen.getByText("Nuestros Productos")).toBeInTheDocument();
    expect(screen.getByText("Encuentra la solución financiera ideal para tus metas.")).toBeInTheDocument();
    
    // Check if ProductList rendered
    await waitFor(() => {
      expect(screen.getByText("Cuenta Ahorro")).toBeInTheDocument();
    });
  });
});
