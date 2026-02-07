import { submissionService } from "@/services/submissionService";

describe("submissionService", () => {
  it("submits successfully with valid token", async () => {
    const data = {
      fullName: "Test User",
      document: "12345",
      email: "test@example.com",
      recaptchaToken: "OK",
    };

    const response = await submissionService.submit(data);
    
    expect(response.success).toBe(true);
    expect(response.requestId).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it("fails with invalid token", async () => {
    const data = {
      fullName: "Test User",
      document: "12345",
      email: "test@example.com",
      recaptchaToken: "",
    };

    const response = await submissionService.submit(data);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe("Validación de seguridad fallida.");
    expect(response.requestId).toBeUndefined();
  });
});
