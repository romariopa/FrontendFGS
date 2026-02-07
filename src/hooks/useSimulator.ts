import { useState, useCallback, useMemo } from "react";

interface SimulationResult {
  totalContributed: number;
  interestEarned: number;
  finalBalance: number;
}

interface SimulatorState {
  initialAmount: number | "";
  monthlyContribution: number | "";
  months: number | "";
}

interface ValidationErrors {
  initialAmount?: string;
  monthlyContribution?: string;
  months?: string;
}

const DEFAULT_INTEREST_RATE_EA = 0.06; // 6% Efectivo Anual

export function useSimulator() {
  const [values, setValues] = useState<SimulatorState>({
    initialAmount: "",
    monthlyContribution: "",
    months: "",
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  // Derive validation state during render
  const validationState = useMemo(() => {
    const newErrors: ValidationErrors = {};
    let valid = true;

    // Check negatives
    if (values.initialAmount !== "" && values.initialAmount < 0) {
      newErrors.initialAmount = "No puede ser negativo";
      valid = false;
    }
    if (values.monthlyContribution !== "" && values.monthlyContribution < 0) {
      newErrors.monthlyContribution = "No puede ser negativo";
      valid = false;
    }
    // Check range
    if (values.months !== "" && (values.months < 1 || values.months > 360)) {
      newErrors.months = "Entre 1 y 360 meses";
      valid = false;
    }
    
    // Check required completeness for "isValid" flag (to enable button)
    if (values.initialAmount === "" || values.monthlyContribution === "" || values.months === "") {
      valid = false;
    }

    // Check logical requirement: at least one input > 0
    if (Number(values.initialAmount) === 0 && Number(values.monthlyContribution) === 0 && values.initialAmount !== "" && values.monthlyContribution !== "") {
         valid = false; 
         // We might not show error text yet to avoid noise, or we can.
    }

    return { errors: newErrors, isValid: valid };
  }, [values]);

  const { errors, isValid } = validationState;

  const calculate = useCallback(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    const P = Number(values.initialAmount);
    const PMT = Number(values.monthlyContribution);
    const n = Number(values.months);

    // Convertir Tasa Efectiva Anual a Mensual
    const r = Math.pow(1 + DEFAULT_INTEREST_RATE_EA, 1 / 12) - 1;

    // Fórmula de Valor Futuro con Interés Compuesto
    const futureValueInitial = P * Math.pow(1 + r, n);
    const futureValueSeries = PMT * ((Math.pow(1 + r, n) - 1) / r);
    
    const finalBalance = futureValueInitial + futureValueSeries;
    const totalContributed = P + (PMT * n);
    const interestEarned = finalBalance - totalContributed;

    setResult({
      totalContributed,
      interestEarned,
      finalBalance,
    });
  }, [values, isValid]);

  const setField = (field: keyof SimulatorState, value: string) => {
    const numValue = value === "" ? "" : Number(value);
    if (value !== "" && isNaN(Number(value))) return;
    
    setValues((prev) => ({ ...prev, [field]: numValue }));
    setResult(null); 
  };

  return {
    values,
    setField,
    errors,
    isValid,
    result,
    calculate,
  };
}
