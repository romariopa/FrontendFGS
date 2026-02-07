export interface Product {
  id: string;
  name: string;
  type: "ahorro" | "inversion" | "corriente" | "cdts";
  interestRate: number;
  description: string;
}
