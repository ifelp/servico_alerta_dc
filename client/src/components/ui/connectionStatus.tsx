import type { MqttStatus } from "../../hooks/useMqtt"

interface ConnectionStatusProps {
    status: MqttStatus
}

const config = {
    conectado:    { cor: "bg-(--color-success)", texto: "Conectado · MQTT" },
    conectando:   { cor: "bg-yellow-400",        texto: "Conectando..." },
    desconectado: { cor: "bg-destructive",       texto: "Desconectado" },
}

export default function ConnectionStatus({ status }: ConnectionStatusProps){
    const { cor, texto } = config[status]

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span className={`w-2 h-2 rounded-full ${cor} animate-pulse`} />
            <span className="font-display font-semibold uppercase tracking-wider">{texto}</span>
        </div>
    )
}