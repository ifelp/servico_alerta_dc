import { Radio } from "lucide-react"

export default function ZonePageInfo(){
    return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Ao selecionar uma zona, seu dispositivo será inscrito no tópico MQTT correspondente
            e receberá alertas em tempo real.
          </div>
        </div>
    )
}