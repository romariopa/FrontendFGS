import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Username" id="username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    render(<Input error="Invalid input" />);
    expect(screen.getByText("Invalid input")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });

  it("handles user input", async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Hello");
    
    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(input).toHaveValue("Hello");
  });
});
