import type { AlertType, RiskZone } from "../mqtt/topics";

export type AlertSeverity = "BAIXO" | "MEDIO" | "ALTO";

export interface AlertMessage {
  zona: RiskZone;
  tipo: AlertType;
  severidade: AlertSeverity;
  descricao: string;
  timestamp: string;
}