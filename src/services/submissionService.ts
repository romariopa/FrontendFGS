export interface OnboardingData {
  fullName: string;
  document: string;
  email: string;
  recaptchaToken: string;
}

export interface SubmissionResponse {
  success: boolean;
  requestId?: string;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const submissionService = {
  submit: async (data: OnboardingData): Promise<SubmissionResponse> => {
    try {
      const response = await fetch(`${API_URL}/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Error al enviar la solicitud.",
        };
      }

      return {
        success: true,
        requestId: result.requestId, // Assuming backend returns requestId
      };
    } catch (error) {
      console.error("Submission error:", error);
      return {
        success: false,
        error: "Error de conexión con el servidor.",
      };
    }
  },
};
