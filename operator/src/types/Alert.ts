export type AlertPayload = {
  id?: string | number;
  zona?: string;
  categoria?: string;
  gravidade?: "BAIXO" | "MEDIO" | "ALTO" | string;
  descricao?: string;
  timestamp?: string;
};