import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingPage from "@/app/onboarding/page";
import { submissionService } from "@/services/submissionService";

// Mock react-google-recaptcha
jest.mock("react-google-recaptcha", () => {
  return {
    __esModule: true,
    default: ({ onChange }: { onChange: (token: string) => void }) => (
      <button onClick={() => onChange("TEST-TOKEN")} aria-label="Recaptcha Mock">
        Recaptcha Mock
      </button>
    ),
  };
});

// Mock the service
jest.mock("@/services/submissionService", () => ({
  submissionService: {
    submit: jest.fn(),
  },
}));

describe("OnboardingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders onboarding form", () => {
    render(<OnboardingPage />);
    expect(screen.getByLabelText("Nombre Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Número de Documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo Electrónico")).toBeInTheDocument();
  });

  it("disables submit button if form is invalid", () => {
    render(<OnboardingPage />);
    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    expect(submitBtn).toBeDisabled();

    // Fill some fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    expect(submitBtn).toBeDisabled();

    // Fill all fields but no recaptcha
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    expect(submitBtn).toBeDisabled();

    // Complete recaptcha
    const recaptchaButton = screen.getByLabelText("Recaptcha Mock");
    fireEvent.click(recaptchaButton);
    
    expect(submitBtn).not.toBeDisabled();
  });

  it("submits successfully when valid", async () => {
    (submissionService.submit as jest.Mock).mockResolvedValue({ success: true, requestId: "REQ-123" });

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    // Check recaptcha (mocked as a button)
    const recaptchaButton = screen.getByLabelText("Recaptcha Mock");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("¡Solicitud Exitosa!")).toBeInTheDocument();
      expect(screen.getByText("REQ-123")).toBeInTheDocument();
    });

    // Test reset form
    const resetBtn = screen.getByRole("button", { name: /Volver al inicio/i });
    fireEvent.click(resetBtn);

    expect(screen.queryByText("¡Solicitud Exitosa!")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre Completo")).toHaveValue("");
  });

  it("handles service error", async () => {
    (submissionService.submit as jest.Mock).mockResolvedValue({ success: false, error: "Service Error" });

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Mock");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Service Error")).toBeInTheDocument();
    });
  });

  it("handles unexpected exception", async () => {
    (submissionService.submit as jest.Mock).mockRejectedValue("Unexpected String Error");

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Mock");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Ocurrió un error inesperado.")).toBeInTheDocument();
    });
  });

  it("handles standard exception", async () => {
    (submissionService.submit as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Mock");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });
  });
});
