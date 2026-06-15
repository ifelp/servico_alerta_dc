import SeverityBadge from "./severityBadge"
import type { Severity } from "../../types/Alert"
import { timeAgo } from "../../utils/timeAgo"


interface LatestCardProps{
    severity: Severity,
    issuedAt: string,
    title: string,
    description: string
}

export default function LatestCard({severity, issuedAt, title, description} : LatestCardProps){
    return (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <SeverityBadge severity={severity} />
              <span className="text-xs text-muted-foreground font-display">{timeAgo(issuedAt)}</span>
            </div>
            <h3 className="font-display text-lg font-bold leading-snug">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
        </div>
    )
}