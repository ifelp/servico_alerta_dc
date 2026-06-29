export type Severity = "OK" | "BAIXO" | "MEDIO" | "ALTO" | "INFO";

export interface Alert{ //ainda não é a versão final do tipo Alert aqui.
  id: string;
  title: string;
  description: string;
  zone: string;
  severity: Severity;
  type: "chuva" | "deslizamento" | "inundacao" | "vento" | "info";
  issuedAt: string; // ISO
}

export interface AlertEntity {
  id: number;
  payload_id: string;
  zona: string;
  categoria: string;
  gravidade: 'BAIXO' | 'MEDIO' | 'ALTO';
  descricao: string;
  timestamp: string;
  created_at: string;
}