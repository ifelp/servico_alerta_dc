import PageWrapper from "../../components/pageWrapper"
import HistoryHeader from "../../components/historyHeader"
import AlertsHistory from "../../components/alertsHistory"
import AlertsCard from "../../components/ui/alertCard"
import EmptyAlertsHistory from "../../components/ui/emptyAlertsHistory"
import { ZONES, MOCK_ALERTS } from "../../utils/mocks"
import { useZone } from "../../contexts/zoneContext"

export default function History(){
    const { currentZone } = useZone();
    const zone = ZONES.find((z) => z.id === currentZone) ?? ZONES[0]
    const alerts = MOCK_ALERTS.filter((a) => a.zone === currentZone).sort(
        (a,b) => +new Date(b.issuedAt) - +new Date(a.issuedAt)
    );

    return (
        <PageWrapper showHeader={true}>
            <HistoryHeader alertsLeng={alerts.length} zoneLabel={zone.label} />
            <AlertsHistory>
                {alerts.map((a) => (
                    <AlertsCard key={a.id} title={a.title} description={a.description} issuedAt={a.issuedAt} severity={a.severity} />
                ))}
                {alerts.length === 0 && (
                    <EmptyAlertsHistory/>
                )}
            </AlertsHistory>
        </PageWrapper>
    )
}