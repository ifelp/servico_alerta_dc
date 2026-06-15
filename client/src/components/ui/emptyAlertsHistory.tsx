import { Inbox } from "lucide-react"

export default function EmptyAlertsHistory(){
    return (
        <li className="flex flex-col items-center text-center py-16 text-muted-foreground">
            <Inbox className="w-10 h-10 mb-3 opacity-50" />
            <p className="font-display font-semibold">Nenhum alerta nesta zona.</p>
            <p className="text-xs mt-1">Você será notificado quando algo for emitido.</p>
        </li>
    )
}