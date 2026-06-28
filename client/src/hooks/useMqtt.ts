import { useEffect, useState } from 'react'
import { useZone } from '../contexts/zoneContext'
import { getMqttClient } from '../services/mqttClient'

export type MqttStatus = 'conectando' | 'conectado' | 'desconectado'

export function useMqtt() {
  const [status, setStatus] = useState<MqttStatus>('conectando')
  const { currentZone, changeZone } = useZone();

  useEffect(() => {
    const client = getMqttClient()

    const onConnect = () => setStatus('conectado')
    const onError = () => setStatus('desconectado')
    const onClose = () => setStatus('desconectado')

    client.on('connect', onConnect)
    client.on('error', onError)
    client.on('close', onClose)

    if (client.connected) setStatus('conectado')

    return () => {
      client.off('connect', onConnect)
      client.off('error', onError)
      client.off('close', onClose)
    }
  }, [])

  function inscreverZona(novaZona: string) {
    const client = getMqttClient()

    console.log(currentZone);

    if (currentZone && currentZone !== novaZona) {
      client.unsubscribe(`defesacivil/alertas/${currentZone}/#`)
    }

    
    client.subscribe(`defesacivil/alertas/${novaZona}/#`, (err: Error | null) => {
      if (err) console.error('Erro ao inscrever na zona:', err)
    })

    changeZone(novaZona);
     
  }

  return { status, inscreverZona }
}