import { submissionService } from "@/services/submissionService";

// Mock fetch
global.fetch = jest.fn();

describe("submissionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validData = {
    fullName: "Test User",
    document: "12345",
    email: "test@example.com",
    recaptchaToken: "OK",
  };

  it("submits successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ requestId: "req-123" }),
    });

    const response = await submissionService.submit(validData);
    
    expect(response.success).toBe(true);
    expect(response.requestId).toBe("req-123");
    expect(response.error).toBeUndefined();
  });

  it("handles backend error response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Backend Error" }),
    });

    const response = await submissionService.submit(validData);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe("Backend Error");
    expect(response.requestId).toBeUndefined();
  });

  it("handles backend error response with default message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}), // No message
    });

    const response = await submissionService.submit(validData);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe("Error al enviar la solicitud.");
  });

  it("handles network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await submissionService.submit(validData);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe("Error de conexión con el servidor.");
    
    consoleSpy.mockRestore();
  });
});
