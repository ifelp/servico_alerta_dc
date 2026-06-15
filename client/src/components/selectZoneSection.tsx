import SelectZoneSectionWrapper from "./ui/selectZoneSectionWrapper"
import SelectZoneButton from "./ui/selectZoneButton"
import type { Dispatch, SetStateAction } from "react"

interface SelectZoneSectionProps{
    zones: {id: string, label: string}[],
    selectedZone: string,
    setSelectedZone: Dispatch<SetStateAction<string>>,
}

export default function SelectZoneSection({ zones, selectedZone, setSelectedZone }: SelectZoneSectionProps){
    return(
        <SelectZoneSectionWrapper>
            {zones.map((z, idx) => {
                const active = selectedZone === z.id
                return(
                    <SelectZoneButton 
                    key={idx} 
                    active={active} 
                    setSelected={setSelectedZone} 
                    zoneId={z.id} 
                    zoneLabel={z.label} 
                    />
                )
            })}
        </SelectZoneSectionWrapper>
    )
}