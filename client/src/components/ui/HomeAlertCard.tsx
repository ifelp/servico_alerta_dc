import type { Severity } from "../../types/Alert"
import { sevBar } from "../../utils/sevBar"
import { timeAgo } from "../../utils/timeAgo"

interface HomeAlertCardProps{
    severity: Severity,
    title: string,
    description: string,
    issuedAt: string
}

export default function HomeAlertCard({ severity, title, description, issuedAt } : HomeAlertCardProps){
    return (
        <li
        className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:border-primary/40 transition-colors"
        >
              <div className={`w-2 self-stretch rounded-full ${sevBar(severity)}`} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm truncate">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
              </div>
              <span className="text-[11px] text-muted-foreground font-display whitespace-nowrap">{timeAgo(issuedAt)}</span>
        </li>
    )    
}