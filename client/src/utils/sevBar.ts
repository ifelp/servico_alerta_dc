import type { Severity } from "../types/Alert";

export function sevBar(s: Severity) {
  return {
    ALTO: "bg-destructive",
    MEDIO: "bg-accent",
    BAIXO: "bg-sky",
    INFO: "bg-primary",
    OK: "bg-[var(--color-success)]",
  }[s];
}