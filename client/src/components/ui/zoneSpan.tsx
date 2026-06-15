import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface ZoneSpanProps{
    label: string
}

export default function ZoneSpan({label} : ZoneSpanProps){
    return (
        <Link
        to="/zona"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-primary transition-colors"
        >
            <span className="font-display font-semibold text-foreground">{label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
    )
}