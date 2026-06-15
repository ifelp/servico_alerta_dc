import type { Severity } from "../../types/Alert"
import SeverityBadge from "./severityBadge"
import { sevBar as dotColor } from "../../utils/sevBar"
import { timeAgo } from "../../utils/timeAgo"

interface AlertsCard{
    severity: Severity,
    issuedAt: string,
    title: string,
    description: string,

}

export default function AlertsCard({severity, issuedAt, title, description} : AlertsCard){
    return (
        <li className="relative pl-10 pb-5 fade-in-up">
            <span className={`absolute left-[28px] top-3 w-3 h-3 rounded-full ring-4 ring-background ${dotColor(severity)}`} />
            <article className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between gap-3 mb-2">
                <SeverityBadge severity={severity} />
                <time className="text-xs text-muted-foreground font-display">{timeAgo(issuedAt)}</time>
              </div>
              <h3 className="font-display font-bold text-base leading-snug">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
              <p className="text-[11px] text-muted-foreground mt-3 font-display uppercase tracking-wider">
                {new Date(issuedAt).toLocaleString("pt-BR", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </article>
          </li>
    )
}