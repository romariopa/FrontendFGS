import { useState, useCallback, useMemo } from "react";
import { simulatorService } from "@/services/simulatorService";
import { useI18n } from "@/i18n/I18nContext";

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

export function useSimulator() {
  const { t } = useI18n();
  const [values, setValues] = useState<SimulatorState>({
    initialAmount: "",
    monthlyContribution: "",
    months: "",
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive validation state during render
  const validationState = useMemo(() => {
    const newErrors: ValidationErrors = {};
    let valid = true;

    // Check negatives
    if (values.initialAmount !== "" && values.initialAmount < 0) {
      newErrors.initialAmount = t.simulator.errorNegative;
      valid = false;
    }
    if (values.monthlyContribution !== "" && values.monthlyContribution < 0) {
      newErrors.monthlyContribution = t.simulator.errorNegative;
      valid = false;
    }
    // Check range
    if (values.months !== "" && (values.months < 1 || values.months > 360)) {
      newErrors.months = t.simulator.errorMonthsRange;
      valid = false;
    }
    
    // Check required completeness for "isValid" flag (to enable button)
    if (values.initialAmount === "" || values.monthlyContribution === "" || values.months === "") {
      valid = false;
    }

    // Check logical requirement: at least one input > 0
    if (Number(values.initialAmount) === 0 && Number(values.monthlyContribution) === 0 && values.initialAmount !== "" && values.monthlyContribution !== "") {
         valid = false; 
    }

    return { errors: newErrors, isValid: valid };
  }, [values, t]);

  const { errors, isValid } = validationState;

  const calculate = useCallback(async () => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await simulatorService.calculate({
        initialAmount: Number(values.initialAmount),
        monthlyContribution: Number(values.monthlyContribution),
        months: Number(values.months),
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(t.simulator.errorCalculation);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [values, isValid, t]);

  const setField = (field: keyof SimulatorState, value: string) => {
    const numValue = value === "" ? "" : Number(value);
    if (value !== "" && isNaN(Number(value))) return;
    
    setValues((prev) => ({ ...prev, [field]: numValue }));
  };

  return { 
    values, 
    setField, 
    errors, 
    isValid, 
    result, 
    calculate,
    isLoading,
    error
  };
}
