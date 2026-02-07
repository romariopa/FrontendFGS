import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingPage from "@/app/onboarding/page";
import { submissionService } from "@/services/submissionService";

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
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Documento de Identidad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
  });

  it("shows error if recaptcha is not checked", async () => {
    render(<OnboardingPage />);
    
    // Fill text fields but not recaptcha
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: "john@example.com" } });

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Por favor verifica que no eres un robot.")).toBeInTheDocument();
    });
  });

  it("submits successfully when valid", async () => {
    (submissionService.submit as jest.Mock).mockResolvedValue({ success: true, requestId: "REQ-123" });

    render(<OnboardingPage />);

    // Fill all fields
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Documento de Identidad/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: "john@example.com" } });
    
    // Check recaptcha (mocked as a checkbox in the UI)
    const recaptchaCheckbox = screen.getByLabelText(/No soy un robot/i);
    fireEvent.click(recaptchaCheckbox);

    const submitBtn = screen.getByRole("button", { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("¡Solicitud Exitosa!")).toBeInTheDocument();
      expect(screen.getByText("REQ-123")).toBeInTheDocument();
    });
  });
});
