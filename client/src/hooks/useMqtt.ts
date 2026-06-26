import { useEffect, useState } from 'react'
import { getMqttClient } from '../services/mqttClient'

export type MqttStatus = 'conectando' | 'conectado' | 'desconectado'

export function useMqtt() {
  const [status, setStatus] = useState<MqttStatus>('conectando')

  useEffect(() => {
    const client = getMqttClient()

    const onConnect = () => setStatus('conectado')
    const onError = () => setStatus('desconectado')
    const onClose = () => setStatus('desconectado')

    client.on('connect', onConnect)
    client.on('error', onError)
    client.on('close', onClose)

    // Se já estava conectado antes de montar o componente
    if (client.connected) setStatus('conectado')

    return () => {
      client.off('connect', onConnect)
      client.off('error', onError)
      client.off('close', onClose)
    }
  }, [])

  function inscreverZona(zona: string) {
    const client = getMqttClient()
    // Tópico: defesacivil/alertas/zona_A/#
    client.subscribe(`defesacivil/alertas/${zona}/#`, (err) => {
      if (err) console.error('Erro ao inscrever na zona:', err)
    })
  }

  return { status, inscreverZona }
}