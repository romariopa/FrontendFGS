import { renderHook, act } from "@testing-library/react";
import { useSimulator } from "@/hooks/useSimulator";

describe("useSimulator", () => {
  it("initializes with empty values", () => {
    const { result } = renderHook(() => useSimulator());
    expect(result.current.values).toEqual({
      initialAmount: "",
      monthlyContribution: "",
      months: "",
    });
    expect(result.current.result).toBeNull();
    expect(result.current.isValid).toBe(false);
  });

  it("validates negative values", () => {
    const { result } = renderHook(() => useSimulator());

    act(() => {
      result.current.setField("initialAmount", "-100");
    });

    expect(result.current.errors.initialAmount).toBe("No puede ser negativo");
    expect(result.current.isValid).toBe(false);
  });

  it("validates months range", () => {
    const { result } = renderHook(() => useSimulator());

    act(() => {
      result.current.setField("months", "400");
    });

    expect(result.current.errors.months).toBe("Entre 1 y 360 meses");
    expect(result.current.isValid).toBe(false);
  });

  it("calculates correct interest", () => {
    const { result } = renderHook(() => useSimulator());

    // Setup valid simulation
    // P = 1,000,000
    // PMT = 100,000
    // n = 12 months
    // i = 6% EA -> monthly = (1.06)^(1/12) - 1 approx 0.004867
    
    act(() => {
      result.current.setField("initialAmount", "1000000");
      result.current.setField("monthlyContribution", "100000");
      result.current.setField("months", "12");
    });

    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.calculate();
    });

    expect(result.current.result).not.toBeNull();
    
    // Approximate checks
    const res = result.current.result!;
    expect(res.totalContributed).toBe(2200000); // 1M + 12*100k
    expect(res.finalBalance).toBeGreaterThan(2200000);
    expect(res.interestEarned).toBeGreaterThan(0);
  });
});
