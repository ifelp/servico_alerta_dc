import type { AlertMessage, AlertSeverity } from "../types/alertTypes";

export function formatAlert(alert: AlertMessage): string {
  return `ALERTA|${alert.zona}|${alert.tipo}|${alert.severidade}|${alert.descricao}|${alert.timestamp}`;
}

export function parseAlert(message: string): AlertMessage | null {
  const parts = message.split("|");

  if (parts.length !== 6) {
    return null;
  }

  const [prefix, zona, tipo, severidade, descricao, timestamp] = parts;

  if (
    prefix !== "ALERTA" ||
    !zona ||
    !tipo ||
    !descricao ||
    !timestamp ||
    typeof severidade !== "string" ||
    !isValidSeverity(severidade)
  ) {
    return null;
  }

  return {
    zona: zona as AlertMessage["zona"],
    tipo: tipo as AlertMessage["tipo"],
    severidade: severidade as AlertMessage["severidade"],
    descricao,
    timestamp
  };
}

function isValidSeverity(value: string): value is AlertSeverity {
  return value === "BAIXO" || value === "MEDIO" || value === "ALTO";
}