import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";

describe("Card", () => {
  it("renders card content correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom classes", () => {
    render(<Card className="custom-class">Content</Card>);
    // We check if the div with text "Content" has the class. 
    // Card renders a div, so we can find by text.
    expect(screen.getByText("Content").closest("div")).toHaveClass("custom-class");
  });
});
