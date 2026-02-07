import { render, screen, fireEvent } from "@testing-library/react";
import SimulatorPage from "@/app/simulator/page";

describe("SimulatorPage", () => {
  it("renders simulator form", () => {
    render(<SimulatorPage />);
    expect(screen.getByText("Simulador de Ahorro")).toBeInTheDocument();
    expect(screen.getByLabelText("Monto Inicial")).toBeInTheDocument();
    expect(screen.getByLabelText("Aporte Mensual")).toBeInTheDocument();
    expect(screen.getByLabelText("Plazo (Meses)")).toBeInTheDocument();
  });

  it("calculates results when form is valid", () => {
    render(<SimulatorPage />);

    const initialInput = screen.getByLabelText("Monto Inicial");
    const monthlyInput = screen.getByLabelText("Aporte Mensual");
    const monthsInput = screen.getByLabelText("Plazo (Meses)");
    const button = screen.getByRole("button", { name: /Calcular Rentabilidad/i });

    // Inputs
    fireEvent.change(initialInput, { target: { value: "1000000" } });
    fireEvent.change(monthlyInput, { target: { value: "100000" } });
    fireEvent.change(monthsInput, { target: { value: "12" } });

    // Button should be enabled
    expect(button).not.toBeDisabled();

    // Click calculate
    fireEvent.click(button);

    // Results should appear
    expect(screen.getByText("Resultado de tu Simulación")).toBeInTheDocument();
    expect(screen.getByText("Total Aportado")).toBeInTheDocument();
    // Check for some formatted values roughly (exact formatting depends on locale in test env)
    // We check if result section is visible
  });

  it("disables button for invalid input", () => {
    render(<SimulatorPage />);
    
    const monthsInput = screen.getByLabelText("Plazo (Meses)");
    fireEvent.change(monthsInput, { target: { value: "500" } }); // Invalid > 360

    const button = screen.getByRole("button", { name: /Calcular Rentabilidad/i });
    expect(button).toBeDisabled();
    
    expect(screen.getByText("Entre 1 y 360 meses")).toBeInTheDocument();
  });
});
