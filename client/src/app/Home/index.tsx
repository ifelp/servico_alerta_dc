import PageWrapper from '../../components/pageWrapper'
import ZoneHero from '../../components/zoneHero'
import LatestAlertsSection from '../../components/latestAlertsSection'
import LatestCard from '../../components/ui/latestCard'
import AlertsSecion from '../../components/alertsSection'
import { MOCK_ALERTS, ZONES } from '../../utils/mocks'
import { STATUS_BY_SEV } from '../../utils/subdescription'
import HomeAlertCard from '../../components/ui/HomeAlertCard'

export default function Home() {
  const zoneId = "zona_A"
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0]
  const zoneAlerts = MOCK_ALERTS.filter((a) => a.zone === zoneId)
  const latest = zoneAlerts[0]
  const status = latest ? latest.severity : "OK"
  const cfg = STATUS_BY_SEV[status];

  return (
    <PageWrapper title='Alerta Cidadão' showHeader={true}>
        <ZoneHero 
        bg={cfg.bg} 
        ring={cfg.ring} 
        icon={cfg.icon} 
        label={cfg.label} 
        zoneLabel={zone.label} 
        sub={cfg.sub} 
        />
        {latest && (
          <LatestAlertsSection>
            <LatestCard 
            severity={latest.severity} 
            title={latest.title} 
            description={latest.description} 
            issuedAt={latest.issuedAt} 
            />
          </LatestAlertsSection>
        )}
        <AlertsSecion alertsLength={zoneAlerts.length}>
          {zoneAlerts.slice(1,4).map((al,idx) => (
            <HomeAlertCard 
            key={idx} 
            title={al.title} 
            severity={al.severity} 
            description={al.description} 
            issuedAt={al.issuedAt} 
            />
          ))}
        </AlertsSecion>
    </PageWrapper>
  )
}