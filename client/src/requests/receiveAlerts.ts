  import mqtt, { MqttClient } from "mqtt";

  type AlertPayload = {
    id?: string | number;
    zona?: string;
    categoria?: string;
    gravidade?: "BAIXO" | "MEDIO" | "ALTO" | string;
    descricao?: string;
    timestamp?: string;
  };

  const zoneArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

  if (!zoneArg) {
    console.error("[ERRO] Zona nao informada.");
    console.error("Uso: npm run client -- <zona>");
    console.error("Exemplo: npm run client -- zona_a");
    process.exit(1);
  }

  const zone = zoneArg.trim();
  const brokerUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";
  const topic = `defesacivil/alertas/${zone}/#`;
  const topicPrefix = `defesacivil/alertas/${zone}/`;

  const clientId = `dc-cidadao-${zone}-${Math.random().toString(16).slice(2, 8)}`;

  async function startClient() {
    console.log(`[INFO] Iniciando cliente cidadao para a zona: ${zone}`);
    console.log(`[INFO] Broker alvo: ${brokerUrl}`);

    const client: MqttClient = mqtt.connect(brokerUrl, {
      clientId,
      reconnectPeriod: 2000,
      connectTimeout: 5000,
      clean: false,
    });

    client.on("connect", () => {
      console.log("[OK] Conectado ao broker MQTT.");

      client.subscribe(topic, { qos: 1 }, (err, granted) => {
        if (err) {
          console.error(`[ERRO] Falha ao assinar topico ${topic}:`, err.message);
          return;
        }

        const grantedTopics = (granted ?? [])
          .map((item) => `${item.topic} (qos=${item.qos})`)
          .join(", ");
        console.log(`[OK] WATCH ativo nos topicos: ${grantedTopics}`);
      });
    });

    client.on("reconnect", () => {
      console.log("[INFO] Tentando reconectar ao broker...");
    });

    client.on("offline", () => {
      console.log("[INFO] Cliente offline. Aguardando reconexao automatica...");
    });

    client.on("close", () => {
      console.log("[INFO] Conexao MQTT encerrada.");
    });

    client.on("error", (error) => {
      console.error("[ERRO] Problema na conexao MQTT:", error.message);
    });

    client.on("message", (receivedTopic, payloadBuffer) => {
      if (!receivedTopic.startsWith(topicPrefix)) {
        return;
      }

      const payloadText = payloadBuffer.toString("utf-8");
      const [, , , zonaDoTopico, categoriaDoTopico] = receivedTopic.split("/");

      try {
        const parsed = JSON.parse(payloadText) as AlertPayload;

        const zona = parsed.zona ?? zonaDoTopico ?? zone;
        const categoria = parsed.categoria ?? categoriaDoTopico ?? "desconhecida";
        const gravidade = parsed.gravidade ?? "desconhecida";
        const descricao = parsed.descricao ?? "(sem descricao)";
        const timestamp = parsed.timestamp ?? new Date().toISOString();

        console.log("\n----- ALERTA RECEBIDO -----");
        console.log(`Topico: ${receivedTopic}`);
        console.log(`Zona: ${zona}`);
        console.log(`Categoria: ${categoria}`);
        console.log(`Gravidade: ${gravidade}`);
        console.log(`Descricao: ${descricao}`);
        console.log(`Timestamp: ${timestamp}`);
        console.log("---------------------------\n");
      } catch {
        console.log("\n----- ALERTA RECEBIDO (raw) -----");
        console.log(`Topico: ${receivedTopic}`);
        console.log(`Payload: ${payloadText}`);
        console.log("----------------------------------\n");
      }
    });

    process.on("SIGINT", () => {
      console.log("\n[INFO] Encerrando cliente...");

      client.end(false, () => {
        console.log("[OK] Cliente finalizado com sucesso.");
        process.exit(0);
      });
    });
  }

  startClient();