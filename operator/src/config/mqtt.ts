import mqtt, {MqttClient} from "mqtt";

const brokerURL = "mqtt://localhost:1883"
const topicoGeral = 'defesacivil/alertas/#'

export default function initClient(operadorID: string, kidnapLog: (log: string) => void): MqttClient{

    const client: MqttClient = mqtt.connect(brokerURL,{
        clientId: `operador-${operadorID}`,
        connectTimeout: 5000,
        reconnectPeriod: 2000,
        clean: false
    })

    client.on("connect" , () => {
        kidnapLog("[OK] - Broker conectado com sucesso.");

        client.subscribe(topicoGeral, { qos: 1 }, (err) => {
            if(err){
                kidnapLog("[ERROR] - Não foi possível se conectar ao tópico geral.");
                return
            }

            kidnapLog("[OK] - Inscrição ativa no tópico geral. Escutando alertas em todas as zonas.");
        })
    })

    client.on("close", () => {
        kidnapLog("Conexão com o broker encerrada.");
    })

    return client;

}


