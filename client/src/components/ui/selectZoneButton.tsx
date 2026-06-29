import { MapPin, Check, Loader2, WifiOff } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

export type EstadoZona = 'disponivel' | 'selecionado' | 'selecionando' | 'indisponivel'

interface SelectZoneButtonProps{
    setSelected: Dispatch<SetStateAction<string>>,
    estado: EstadoZona,
    zoneId: string,
    zoneLabel: string
}

export default function SelectZoneButton({setSelected, estado, zoneId, zoneLabel} : SelectZoneButtonProps){
    const desabilitado = estado === 'selecionando' || estado === 'indisponivel'

    const estilosBotao = {
        selecionado:   "border-primary bg-primary/5 shadow-sm",
        selecionando:  "border-primary/40 bg-primary/5 opacity-70 cursor-wait",
        indisponivel:  "border-border bg-muted opacity-50 cursor-not-allowed",
        disponivel:    "border-border bg-card hover:border-primary/40",
    }

    const estilosIcone = {
        selecionado:  "bg-primary text-primary-foreground",
        selecionando: "bg-primary/50 text-primary-foreground",
        indisponivel: "bg-muted text-muted-foreground",
        disponivel:   "bg-muted text-muted-foreground",
    }

    return(
        <li>
            <button
                type="button"
                onClick={() => setSelected(zoneId)}
                disabled={desabilitado}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${estilosBotao[estado]}`}
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${estilosIcone[estado]}`}>
                    {estado === 'indisponivel' 
                        ? <WifiOff className="w-5 h-5" /> 
                        : <MapPin className="w-5 h-5" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm">{zoneId.replace('z', 'Z').replace('_', ' ')} - {zoneLabel}</p>
                    <p className="text-[11px] text-muted-foreground font-display uppercase tracking-wider mt-0.5">
                        {estado === 'selecionando' && 'inscrevendo...'}
                        {estado === 'indisponivel' && 'sem conexão'}
                        {(estado === 'selecionado' || estado === 'disponivel') && `tópico: alertas/${zoneId}`}
                    </p>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    estado === 'selecionado' ? "border-primary bg-primary" : "border-border"
                }`}>
                    {estado === 'selecionado' && <Check className="w-3 h-3 text-primary-foreground" />}
                    {estado === 'selecionando' && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                </div>
            </button>
        </li>
    )
}