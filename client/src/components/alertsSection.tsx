import type { ReactNode } from "react"
import HomeAlertsHeader from "./ui/alertsHeader"

interface AlertsSecionProps{
    children: ReactNode,
    alertsLength: number
}

export default function AlertsSecion({children, alertsLength} : AlertsSecionProps){
    return (
        <section className="px-5 mt-7">
            <HomeAlertsHeader/>
            <ul className="space-y-2.5">
                {children}
                {alertsLength <= 1 && (
                    <li className="text-sm text-muted-foreground text-center py-6">Sem outros alertas para esta zona.</li>
                )}
            </ul>
        </section>
    )
}