import { useEffect, useRef, useState } from 'react'
import { getMqttClient } from '../services/mqttClient'

export type MqttStatus = 'conectando' | 'conectado' | 'desconectado'

export function useMqtt() {
  const [status, setStatus] = useState<MqttStatus>('conectando')
  const zonaAtualRef = useRef<string | null>(null) 

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

    
    if (zonaAtualRef.current && zonaAtualRef.current !== novaZona) {
      client.unsubscribe(`defesacivil/alertas/${zonaAtualRef.current}/#`)
    }

    
    client.subscribe(`defesacivil/alertas/${novaZona}/#`, (err: Error | null) => {
      if (err) console.error('Erro ao inscrever na zona:', err)
    })

    
    zonaAtualRef.current = novaZona
  }

  return { status, inscreverZona }
}