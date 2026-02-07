import { formatCurrency } from "@/utils/format";

describe("formatCurrency", () => {
  it("formats COP currency correctly without decimals", () => {
    expect(formatCurrency(1000)).toBe("$ 1.000"); // Note: Intl might use non-breaking space
    expect(formatCurrency(1000000)).toBe("$ 1.000.000");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$ 0");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-5000)).toBe("-$ 5.000");
  });
});
