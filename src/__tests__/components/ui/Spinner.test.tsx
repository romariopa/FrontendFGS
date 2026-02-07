import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/ui/Spinner";

describe("Spinner", () => {
  it("renders correctly", () => {
    const { container } = render(<Spinner />);
    // Check if it renders an SVG (Loader2 renders an svg)
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Spinner className="text-red-500 w-10 h-10" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-red-500");
    expect(svg).toHaveClass("w-10");
    expect(svg).toHaveClass("h-10");
    expect(svg).toHaveClass("animate-spin"); // Default class
  });
});
