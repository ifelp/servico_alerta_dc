interface HistoryHeaderProps{
    alertsLeng: number
    zoneLabel: string
}

export default function HistoryHeader({alertsLeng, zoneLabel}:HistoryHeaderProps){
    return (
        <div className="px-5 pt-5">
            <p className="text-xs uppercase tracking-wider font-display font-semibold text-muted-foreground">
                Zona monitorada
            </p>
            <h2 className="font-display text-lg font-bold text-foreground mt-0.5">{zoneLabel}</h2>
            <p className="text-xs text-muted-foreground mt-1">
                {alertsLeng} {alertsLeng === 1 ? "alerta registrado" : "alertas registrados"}
            </p>
      </div>
    )
}