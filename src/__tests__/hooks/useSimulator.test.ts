import { renderHook, act, waitFor } from "@testing-library/react";
import { useSimulator } from "@/hooks/useSimulator";
import { simulatorService } from "@/services/simulatorService";

// Mock service
jest.mock("@/services/simulatorService", () => ({
  simulatorService: {
    calculate: jest.fn(),
  },
}));

describe("useSimulator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty values", () => {
    const { result } = renderHook(() => useSimulator());
    
    expect(result.current.values).toEqual({
      initialAmount: "",
      monthlyContribution: "",
      months: "",
    });
    expect(result.current.isValid).toBe(false);
  });

  it("updates fields correctly", () => {
    const { result } = renderHook(() => useSimulator());

    act(() => {
      result.current.setField("initialAmount", "1000");
    });

    expect(result.current.values.initialAmount).toBe(1000);
  });

  it("calculates correct interest", async () => {
    // Mock API response
    (simulatorService.calculate as jest.Mock).mockResolvedValue({
      totalContributed: 12000,
      interestEarned: 600,
      finalBalance: 12600,
    });

    const { result } = renderHook(() => useSimulator());

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
});
