import { MapPin, Check } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface SelectZoneButtonProps{
    setSelected: Dispatch<SetStateAction<string>>,
    active: boolean,
    zoneId: string,
    zoneLabel: string
}

export default function SelectZoneButton({setSelected, active, zoneId, zoneLabel} : SelectZoneButtonProps){
    return(
    <li>
        <button
        type="button"
        onClick={() => setSelected(zoneId)}
        className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
        active
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border bg-card hover:border-primary/40"
        }`}
        >
            <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            >
                <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm">{zoneLabel}</p>
                <p className="text-[11px] text-muted-foreground font-display uppercase tracking-wider mt-0.5">
                    tópico: alertas/{zoneId}
                </p>
            </div>
            <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                active ? "border-primary bg-primary" : "border-border"
            }`}
            >
                {active && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
        </button>
    </li>
    )
}