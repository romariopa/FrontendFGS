import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders main heading and description", () => {
    render(<Home />);
    
    expect(screen.getByText("Tu futuro financiero comienza hoy")).toBeInTheDocument();
    expect(screen.getByText(/Descubre nuestros productos de ahorro/i)).toBeInTheDocument();
  });

  it("renders navigation cards", () => {
    render(<Home />);
    
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Simulador")).toBeInTheDocument();
    expect(screen.getByText("Abre tu Cuenta")).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<Home />);
    
    const productsLink = screen.getByRole("link", { name: /Ver Productos/i });
    expect(productsLink).toHaveAttribute("href", "/products");

    const simulatorLink = screen.getByRole("link", { name: /Simular Ahorro/i });
    expect(simulatorLink).toHaveAttribute("href", "/simulator");

    const onboardingLink = screen.getByRole("link", { name: /Comenzar/i });
    expect(onboardingLink).toHaveAttribute("href", "/onboarding");
  });
});
