import { v4 as uuidv4 } from "uuid";

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

export const submissionService = {
  submit: async (data: OnboardingData): Promise<SubmissionResponse> => {
    // Simular latencia
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.recaptchaToken !== "OK") {
      return { success: false, error: "Validación de seguridad fallida." };
    }

    // Simular éxito
    return {
      success: true,
      requestId: uuidv4(),
    };
  },
};
