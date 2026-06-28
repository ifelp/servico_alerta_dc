import mqtt, {  type MqttClient } from 'mqtt'

const BROKER_URL = import.meta.env.VITE_MQTT_URL || "ws://localhost:9001"

const client: MqttClient = mqtt.connect(BROKER_URL, {
  connectTimeout: 5000,
  reconnectPeriod: 2000,
})

export default client;
