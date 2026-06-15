import type { ReactNode } from "react";
import ConnectionStatus from "./ui/connectionStatus";
import SuperSevBadge from "./ui/superSevBadge";
import ZoneSpan from "./ui/zoneSpan";

interface ZoneHeroProps{
    bg: string,
    ring: string,
    icon: ReactNode,
    label: string,
    sub: string,
    zoneLabel: string
}

export default function ZoneHero({ bg, ring, icon, label, sub, zoneLabel} : ZoneHeroProps){
    return(
        <section className={`relative px-5 pt-6 pb-8 bg-linear-to-b ${bg}`}>
            <ConnectionStatus/>
            <SuperSevBadge ring={ring} label={label} sub={sub} icon={icon}>
                <ZoneSpan label={zoneLabel}/>
            </SuperSevBadge>
        </section>
    )
}