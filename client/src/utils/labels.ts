import type { Severity } from "../types/Alert";

export function severityLabel(s: Severity): string {
  return { OK: "Normal", INFO: "Informativo", BAIXO: "Atenção", MEDIO: "Alarmante" , ALTO: "Crítico" }[s];
}