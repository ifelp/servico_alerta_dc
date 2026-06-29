import PageWrapper from "../../components/pageWrapper"
import HistoryHeader from "../../components/historyHeader"
import AlertsHistory from "../../components/alertsHistory"
import AlertsCard from "../../components/ui/alertCard"
import EmptyAlertsHistory from "../../components/ui/emptyAlertsHistory"
import { useZone } from "../../contexts/zoneContext"
import { useAlert } from "../../contexts/alertContext"

export default function History(){
    const { currentZone, zones } = useZone(); 
    const { alerts } = useAlert();
    const zone = zones.find((z) => z.name === currentZone) || zones[0];

    if(!zone) return

    return (
        <PageWrapper showHeader={true}>
            <HistoryHeader alertsLeng={alerts.length} zoneLabel={zone.label || ""} />
            <AlertsHistory>
                {alerts.map((a) => (
                    <AlertsCard key={a.id} title={a.categoria} description={a.descricao} issuedAt={a.timestamp} severity={a.gravidade} />
                ))}
                {alerts.length === 0 && (
                    <EmptyAlertsHistory/>
                )}
            </AlertsHistory>
        </PageWrapper>
    )
}