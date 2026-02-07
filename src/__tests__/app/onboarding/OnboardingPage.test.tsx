import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingPage from "@/app/onboarding/page";
import { submissionService } from "@/services/submissionService";
import { forwardRef, useImperativeHandle } from "react";

// Mock react-google-recaptcha with ref support
jest.mock("react-google-recaptcha", () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual("react");
  return {
    __esModule: true,
    default: forwardRef(({ onChange }: { onChange: (token: string | null) => void }, ref: any) => {
      useImperativeHandle(ref, () => ({
        reset: jest.fn(),
      }));
      return (
        <div>
          <button onClick={() => onChange("TEST-TOKEN")} aria-label="Recaptcha Valid">
            Recaptcha Valid
          </button>
          <button onClick={() => onChange(null)} aria-label="Recaptcha Null">
            Recaptcha Null
          </button>
        </div>
      );
    }),
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
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
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
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
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
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Service Error")).toBeInTheDocument();
    });
  });

  it("handles generic error fallback", async () => {
    (submissionService.submit as jest.Mock).mockResolvedValue({ success: false }); // No error message

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Assuming t.onboarding.errorGeneric maps to a string in tests
      // Since we use real I18nContext, it should be "Error al procesar la solicitud." from es.ts
      expect(screen.getByText("Error al procesar la solicitud.")).toBeInTheDocument();
    });
  });

  it("handles null recaptcha token", () => {
    render(<OnboardingPage />);
    const recaptchaButton = screen.getByLabelText("Recaptcha Null");
    fireEvent.click(recaptchaButton);
    
    // Form should be invalid if token is null
    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    expect(submitBtn).toBeDisabled();
  });

  it("handles unexpected errors during submission", async () => {
    (submissionService.submit as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Unexpected Error")).toBeInTheDocument();
    });
  });

  it("handles non-Error objects during submission", async () => {
    (submissionService.submit as jest.Mock).mockRejectedValue("String Error");

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Número de Documento"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "john@example.com" } });
    
    const recaptchaButton = screen.getByLabelText("Recaptcha Valid");
    fireEvent.click(recaptchaButton);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Ocurrió un error inesperado.")).toBeInTheDocument();
    });
  });
});
