import mqtt, { MqttClient } from "mqtt";

const MOSQUITTO_URL = process.env.MQTT_URL || "mqtt://mosquitto-eclipse:1883";
let mqttClient: MqttClient;

export function connectBroker(): MqttClient{
    if(!mqttClient){
        mqttClient = mqtt.connect(MOSQUITTO_URL, {
            clientId: "dc-api-server",
            clean: true
        })
    }
    
    mqttClient.on("connect", () => {
        console.log("Serviço de broker conectado com sucesso.");
    });
    mqttClient.on("error", (err) => {
        console.error("Erro ao tentar estabelecer conexão com o broker.", err.message);
    });

    return mqttClient;
}

export const getBrokerInstance = () => mqttClient;

