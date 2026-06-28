import SelectZoneSectionWrapper from "./ui/selectZoneSectionWrapper"
import SelectZoneButton, { type EstadoZona } from "./ui/selectZoneButton"
import type { Dispatch, SetStateAction } from "react"
import type { MqttStatus } from "../hooks/useMqtt"

interface SelectZoneSectionProps{
    zones: {id: string, label: string}[],
    selectedZone: string,
    setSelectedZone: Dispatch<SetStateAction<string>>,
    confirming: boolean,
    mqttStatus: MqttStatus,
}

export default function SelectZoneSection({ zones, selectedZone, setSelectedZone, confirming, mqttStatus }: SelectZoneSectionProps){

    function getEstado(zoneId: string): EstadoZona {
        if (mqttStatus === 'desconectado') return 'indisponivel'
        if (confirming && zoneId === selectedZone) return 'selecionando'
        if (confirming) return 'indisponivel' // bloqueia os outros durante a inscrição
        if (zoneId === selectedZone) return 'selecionado'
        return 'disponivel'
    }

    return(
        <SelectZoneSectionWrapper>
            {zones.map((z, idx) => (
                <SelectZoneButton 
                    key={idx} 
                    estado={getEstado(z.id)}
                    setSelected={setSelectedZone} 
                    zoneId={z.id} 
                    zoneLabel={z.label} 
                />
            ))}
        </SelectZoneSectionWrapper>
    )
}