import mqtt, { MqttClient } from "mqtt";
import type { AlertMessage } from"../types/alertTypes";;
import { formatAlert, parseAlert } from "./alert";
import {
  buildAllTopics,
  buildTopic,
  buildZoneTopic,
  isAlertType,
  isRiskZone,
  type AlertType,
  type RiskZone
} from "./topics";
import { addSubscriber } from "./subscribers";

const MQTT_URL = process.env.MQTT_URL ?? "mqtt://localhost:1883";
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID ?? "dc-api-server";

let client: MqttClient | null = null;

export function connectMqttBroker(): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const mqttClient = mqtt.connect(MQTT_URL, {
      clientId: MQTT_CLIENT_ID,
      clean: true,
      reconnectPeriod: 3000
    });

    mqttClient.on("connect", () => {
      console.log("Conectado ao broker MQTT.");

      mqttClient.subscribe(["dc/+/+", "dc/control/+"], { qos: 0 }, (err) => {
        if (err) {
          reject(err);
          return;
        }

        client = mqttClient;
        resolve(mqttClient);
      });
    });

    mqttClient.on("reconnect", () => {
      console.log("Reconectando ao broker MQTT...");
    });

    mqttClient.on("error", (error) => {
      console.error("Erro no cliente MQTT:", error.message);
    });

    

    mqttClient.on("message", (topic, payload) => {
      const clientId = parseControlTopic(topic);

      if (clientId) {
        handleWatchCommand(clientId, payload.toString());
        return;
      }

      handleIncomingAlert(topic, payload.toString());
    });
  });
}

export function getMqttClient(): MqttClient {
  if (!client) throw new Error("Cliente MQTT ainda não foi inicializado.");
  return client;
}

export function publishAlert(alert: AlertMessage): Promise<void> {
  const mqttClient = getMqttClient();

  if (!isRiskZone(alert.zona) || !isAlertType(alert.tipo)) {
    return Promise.reject(new Error("Zona ou tipo de alerta inválido."));
  }

  const topic = buildTopic(alert.zona, alert.tipo);
  const message = formatAlert(alert);

  return new Promise((resolve, reject) => {
    mqttClient.publish(topic, message, { qos: 0, retain: false }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function subscribeToZone(zone: RiskZone): Promise<void> {
  const mqttClient = getMqttClient();
  const topic = buildZoneTopic(zone);

  return new Promise((resolve, reject) => {
    mqttClient.subscribe(topic, { qos: 0 }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function closeMqttConnection(): Promise<void> {
  if (!client) return Promise.resolve();
  return new Promise((resolve) => {
    client!.end(false, {}, () => {
      client = null;
      resolve();
    });
  });
}

function handleIncomingAlert(topic: string, payload: string): void {
  const parsed = parseAlert(payload);
  if (parsed) {
    console.log(`Alerta textual recebido em ${topic}:`, parsed);
    return;
  }

  // fallback: mensagem não no formato ALERTA|
  console.log(`Mensagem não encontrada no formato textual em ${topic}: ${payload}`);
}

function parseControlTopic(topic: string): string | null {
  const match = topic.match(/^dc\/control\/(.+)$/);

  if (!match || !match[1]) {
    return null;
  }

  return match[1];
}

function handleWatchCommand(clientId: string, message: string): void {
  const [command, zone] = message.split("|");

  if (command !== "WATCH" || !isRiskZone(zone)) {
    console.log(`Comando inválido: ${message}`);
    return;
  }

  addSubscriber(zone, clientId);
  console.log(`Cliente ${clientId} inscrito na zona ${zone}`);
}