import type { ReactNode } from "react"

interface LatestAlertsSectionProps{
    children: ReactNode
}

export default function LatestAlertsSection({children} : LatestAlertsSectionProps){
    return (
        <section className="px-5 -mt-2">
            {children}
        </section>
    )
}