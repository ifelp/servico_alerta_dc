import PageWrapper from '../../components/pageWrapper'
import ZoneHero from '../../components/zoneHero'
import LatestAlertsSection from '../../components/latestAlertsSection'
import LatestCard from '../../components/ui/latestCard'
import AlertsSecion from '../../components/alertsSection'
import { STATUS_BY_SEV } from '../../utils/subdescription'
import HomeAlertCard from '../../components/ui/HomeAlertCard'
import { useZone } from '../../contexts/zoneContext'
import { useMqtt } from '../../hooks/useMqtt'
import { useAlert } from '../../contexts/alertContext'
import { Navigate } from 'react-router-dom'

export default function Home() {
  const { currentZone, zones } = useZone()
  const { status: mqttStatus } = useMqtt()
  const { latestAlert, alerts } = useAlert()                         
  const zone = zones.find((z) => z.name === currentZone) || {label: ""};
  const zoneAlerts = alerts.filter((a) => a.zona === currentZone)
  const latest = latestAlert ?? zoneAlerts[0]   
  
  if(!currentZone) {
    return <Navigate to={"/zona"} replace/>
  };

  const status = latest ? latest.gravidade : "OK"             
  const cfg = STATUS_BY_SEV[status];

  return (
    <PageWrapper title='Alerta Cidadão' showHeader={true}>
      <div className='pb-4'>
        <ZoneHero 
        bg={cfg.bg}
        ring={cfg.ring} 
        icon={cfg.icon} 
        label={cfg.label} 
        zoneLabel={zone.label} 
        sub={cfg.sub} 
        mqttStatus={mqttStatus} 
        />
        {latest && (
          <LatestAlertsSection>
            <LatestCard 
            severity={latest.gravidade} 
            title={latest.categoria} 
            description={latest.descricao} 
            issuedAt={latest.timestamp} 
            />
          </LatestAlertsSection>
        )}
        <AlertsSecion alertsLength={zoneAlerts.length}>
          {zoneAlerts.slice(1,4).map((al,idx) => (
            <HomeAlertCard 
            key={idx} 
            title={al.categoria} 
            severity={al.gravidade} 
            description={al.descricao} 
            issuedAt={al.timestamp} 
            />
          ))}
        </AlertsSecion>
      </div>
    </PageWrapper>
  )
}