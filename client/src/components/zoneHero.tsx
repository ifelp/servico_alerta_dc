import type { ReactNode } from "react";
import type { MqttStatus } from "../hooks/useMqtt"; 
import ConnectionStatus from "./ui/connectionStatus";
import SuperSevBadge from "./ui/superSevBadge";
import ZoneSpan from "./ui/zoneSpan";

interface ZoneHeroProps{
    bg: string,
    ring: string,
    icon: ReactNode,
    label: string,
    sub: string,
    zoneLabel: string,
    mqttStatus: MqttStatus 
}

export default function ZoneHero({ bg, ring, icon, label, sub, zoneLabel, mqttStatus} : ZoneHeroProps){
    return(
        <section className={`relative px-5 pt-6 pb-8 bg-linear-to-b ${bg}`}>
            <ConnectionStatus status={mqttStatus}/> 
            <SuperSevBadge ring={ring} label={label} sub={sub} icon={icon}>
                <ZoneSpan label={zoneLabel}/>
            </SuperSevBadge>
        </section>
    )
}