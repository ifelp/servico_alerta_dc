import mqtt, {  type MqttClient } from 'mqtt'

let client: MqttClient | null = null

export function getMqttClient(): MqttClient {
  if (!client) {
    client = mqtt.connect('ws://localhost:9001')
  }
  return client
}