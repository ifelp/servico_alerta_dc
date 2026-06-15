import type { ReactNode } from "react";
import type { Severity } from "../../types/Alert";
import { severityLabel } from "../../utils/labels";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

const STYLES: Record<Severity, string> = {
    OK: "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30",
    INFO: "bg-primary/10 text-primary border-primary/20",
    BAIXO: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    MEDIO: "bg-accent/20 text-[oklch(0.45_0.14_55)] border-accent/40",
    ALTO: "bg-destructive/15 text-destructive border-destructive/30"
}

const ICONS: Record<Severity, ReactNode> = {
    OK: <CheckCircle2 className="w-3.5 h-3.5" />,
    INFO: <Info className="w-3.5 h-3.5" />,
    BAIXO: <Info className="w-3.5 h-3.5" />,
    MEDIO: <AlertTriangle className="w-3.5 h-3.5" />,
    ALTO: <AlertCircle className="w-3.5 h-3.5" />
}

interface SeverityBadgeProps{
    severity: Severity
}

export default function SeverityBadge({severity} : SeverityBadgeProps){
    return (
        <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border 
        text-[11px] font-display font-semibold uppercase tracking-wider ${STYLES[severity]}
        `}
    >
      {ICONS[severity]}
      {severityLabel(severity)}
    </span>
    )
}