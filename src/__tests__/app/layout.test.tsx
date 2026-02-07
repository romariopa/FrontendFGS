import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

// Mock Navbar since it uses useI18n and other hooks
jest.mock("@/components/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

describe("RootLayout", () => {
  it("renders children and navbar", () => {
    render(
      <RootLayout>
        <div data-testid="child">Child Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("has correct metadata", () => {
    expect(metadata).toEqual({
      title: "Simulador del Ahorro Digital",
      description: "Explora productos y simula tu ahorro con nosotros.",
    });
  });
});
