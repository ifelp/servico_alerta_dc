import { AlertCircle, AlertTriangle, Radio, ShieldCheck, Info } from "lucide-react";
import type { Severity } from "../types/Alert";

export const STATUS_BY_SEV: Record<Severity, { label: string; sub: string; ring: string; icon: React.ReactNode; bg: string }> = {
  ALTO: {
    label: "Risco crítico",
    sub: "Siga as instruções da Defesa Civil imediatamente.",
    ring: "pulse-ring bg-destructive",
    icon: <AlertCircle className="w-10 h-10 text-destructive-foreground" />,
    bg: "from-destructive/20 to-transparent",
  },
  MEDIO: {
    label: "Em atenção",
    sub: "Fique atento e acompanhe atualizações.",
    ring: "pulse-ring-warning bg-accent",
    icon: <AlertTriangle className="w-10 h-10 text-accent-foreground" />,
    bg: "from-accent/25 to-transparent",
  },
  BAIXO: {
    label: "Risco baixo",
    sub: "Condições observadas, mas sem perigo iminente",
    ring: "bg-sky-500", 
    icon: <Info className="w-10 h-10 text-white" />, 
    bg: "from-sky-500/15 to-transparent",
  },
  INFO: {
    label: "Comunicado ativo",
    sub: "Informação importante para sua zona",
    ring: "bg-primary",
    icon: <Radio className="w-10 h-10 text-primary-foreground" />,
    bg: "from-primary/15 to-transparent",
  },
  OK: {
    label: "Tudo tranquilo",
    sub: "Nenhum alerta ativo no momento",
    ring: "bg-[var(--color-success)]",
    icon: <ShieldCheck className="w-10 h-10 text-(--color-success-foreground)" />,
    bg: "from-[var(--color-success)]/15 to-transparent",
  },
};