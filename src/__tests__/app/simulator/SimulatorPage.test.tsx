import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SimulatorPage from "@/app/simulator/page";
import { simulatorService } from "@/services/simulatorService";
import { I18nProvider } from "@/i18n/I18nContext";

// Mock simulatorService
jest.mock("@/services/simulatorService", () => ({
  simulatorService: {
    calculate: jest.fn(),
  },
}));

describe("SimulatorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders simulator form", () => {
    render(
      <I18nProvider>
        <SimulatorPage />
      </I18nProvider>
    );
    expect(screen.getByText("Simulador de Ahorro")).toBeInTheDocument();
    expect(screen.getByLabelText("Monto Inicial")).toBeInTheDocument();
    expect(screen.getByLabelText("Aporte Mensual")).toBeInTheDocument();
    expect(screen.getByLabelText("Plazo (Meses)")).toBeInTheDocument();
  });

  it("calculates results when form is valid", async () => {
    // Mock successful response
    (simulatorService.calculate as jest.Mock).mockResolvedValue({
      totalContributed: 2200000,
      totalInterest: 66000,
      finalBalance: 2266000,
    });
    
    render(
      <I18nProvider>
        <SimulatorPage />
      </I18nProvider>
    );

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
    await waitFor(() => {
      expect(screen.getByText("Resultado de tu Simulación")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Total Aportado")).toBeInTheDocument();
    expect(screen.getByText("$ 2.200.000")).toBeInTheDocument();
  });


  it("disables button for invalid input", async () => {
    render(
      <I18nProvider>
        <SimulatorPage />
      </I18nProvider>
    );
    
    const monthsInput = screen.getByLabelText("Plazo (Meses)");
    fireEvent.change(monthsInput, { target: { value: "500" } }); // Invalid > 360

    const button = screen.getByRole("button", { name: /Calcular Rentabilidad/i });
    expect(button).toBeDisabled();
    
    expect(screen.getByText("Entre 1 y 360 meses")).toBeInTheDocument();
  });
});
