import type { ReactNode } from "react"

interface SelectZoneSectionWrapperProps{
    children: ReactNode
}

export default function SelectZoneSectionWrapper({children} : SelectZoneSectionWrapperProps){
    return(
        <div className="contents">
            <h3 className="mt-7 mb-3 font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Selecione sua zona
            </h3>
            <ul className="space-y-2.5">
                {children}
            </ul>
        </div>
    )
}