import { renderHook, act, waitFor } from "@testing-library/react";
import { useSimulator } from "@/hooks/useSimulator";
import { simulatorService } from "@/services/simulatorService";
import { I18nProvider } from "@/i18n/I18nContext";

// Mock service
jest.mock("@/services/simulatorService", () => ({
  simulatorService: {
    calculate: jest.fn(),
  },
}));

describe("useSimulator", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nProvider>{children}</I18nProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty values", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    
    expect(result.current.values).toEqual({
      initialAmount: "",
      monthlyContribution: "",
      months: "",
    });
    expect(result.current.isValid).toBe(false);
  });

  it("updates fields correctly", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("initialAmount", "1000");
    });

    expect(result.current.values.initialAmount).toBe(1000);
  });

  it("validates negative values", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("initialAmount", "-100");
      result.current.setField("monthlyContribution", "-50");
    });

    expect(result.current.errors.initialAmount).toBe("No puede ser negativo");
    expect(result.current.errors.monthlyContribution).toBe("No puede ser negativo");
    expect(result.current.isValid).toBe(false);
  });

  it("validates months range", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("months", "400");
    });

    expect(result.current.errors.months).toBe("Entre 1 y 360 meses");
  });

  it("validates zero values logic (at least one > 0)", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("initialAmount", "0");
      result.current.setField("monthlyContribution", "0");
      result.current.setField("months", "12");
    });

    expect(result.current.isValid).toBe(false);
  });

  it("does not calculate if invalid", async () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });

    // Invalid state (empty)
    await act(async () => {
      await result.current.calculate();
    });

    expect(simulatorService.calculate).not.toHaveBeenCalled();
    expect(result.current.result).toBeNull();
  });

  it("handles calculation errors", async () => {
    (simulatorService.calculate as jest.Mock).mockRejectedValue(new Error("API Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("initialAmount", "1000");
      result.current.setField("monthlyContribution", "100");
      result.current.setField("months", "12");
    });

    await act(async () => {
      await result.current.calculate();
    });

    expect(result.current.error).toBe("Error al calcular la simulación. Por favor intente nuevamente.");
    expect(result.current.result).toBeNull();
    
    consoleSpy.mockRestore();
  });

  it("calculates correct interest", async () => {
    // Mock API response
    (simulatorService.calculate as jest.Mock).mockResolvedValue({
      totalContributed: 12000,
      interestEarned: 600,
      finalBalance: 12600,
    });

    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.setField("initialAmount", "0");
      result.current.setField("monthlyContribution", "1000");
      result.current.setField("months", "12");
    });

    await act(async () => {
      await result.current.calculate();
    });

    expect(result.current.result).not.toBeNull();
    
    // Approximate checks
    const res = result.current.result!;
    expect(res.totalContributed).toBe(12000);
    expect(res.finalBalance).toBe(12600);
  });

  it("handles empty string input", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    act(() => {
      result.current.setField("initialAmount", "");
    });
    expect(result.current.values.initialAmount).toBe("");
  });

  it("ignores non-numeric input", () => {
    const { result } = renderHook(() => useSimulator(), { wrapper });
    act(() => {
      // Set initial value
      result.current.setField("initialAmount", "100");
    });
    
    act(() => {
      // Try setting invalid value
      result.current.setField("initialAmount", "abc");
    });
    
    // Should remain 100
    expect(result.current.values.initialAmount).toBe(100);
  });
});
