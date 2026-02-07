export interface SimulationRequest {
  initialAmount: number;
  monthlyContribution: number;
  months: number;
  rate?: number;
}

export interface SimulationResult {
  totalContributed: number;
  interestEarned: number;
  finalBalance: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const simulatorService = {
  calculate: async (data: SimulationRequest): Promise<SimulationResult> => {
    try {
      const response = await fetch(`${API_URL}/simulator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error calculating simulation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Simulation error:", error);
      throw error;
    }
  },
};
