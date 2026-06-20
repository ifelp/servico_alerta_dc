import { getBrokerInstance } from "@config";
import { OperatorModel } from "@models";
import { CreateOperatorMessageDTO, OperatorMessage } from "@types";

/**
 * Serviço responsável por processar mensagens do Operador
 * Valida, formata e publica as mensagens no broker MQTT
 */
export class OperatorService {

    /**
     * Recebe uma mensagem do operador, valida e publica no broker
     * @param data - Dados da mensagem do operador
     * @returns Promise resolvido quando a mensagem é publicada
     */
    static async publishMessage(data: CreateOperatorMessageDTO): Promise<OperatorMessage> {
        // Cria instância do modelo
        const operatorModel = new OperatorModel(data);

        // Valida a estrutura da mensagem
        operatorModel.validate();

        // Obtém a mensagem formatada
        const message = operatorModel.toMessage();

        // Obtém instância do broker
        const broker = getBrokerInstance();

        if (!broker) {
            throw new Error("Broker MQTT não está conectado.");
        }

        // Publica a mensagem no tópico especificado
        return new Promise((resolve, reject) => {
            broker.publish(
                message.topico,
                JSON.stringify(message),
                { qos: 1 },
                (err) => {
                    if (err) {
                        console.error(`[PUBLISH ERROR] Erro ao publicar no tópico "${message.topico}":`, err.message);
                        return reject(new Error(`Erro ao encaminhar mensagem ao broker no tópico "${message.topico}".`));
                    }

                    console.log(`[PUBLISH SUCCESS] Mensagem publicada com sucesso no tópico "${message.topico}" em ${message.timestamp}`);
                    resolve(message);
                }
            );
        });
    }

    /**
     * Valida uma mensagem do operador sem publicar
     * Útil para testes e validações prévias
     * @param data - Dados da mensagem do operador
     * @returns OperatorMessage formatada se válida
     */
    static validateMessage(data: CreateOperatorMessageDTO): OperatorMessage {
        const operatorModel = new OperatorModel(data);
        operatorModel.validate();
        return operatorModel.toMessage();
    }

    /**
     * Obtém informações sobre a mensagem formatada
     * @param data - Dados da mensagem do operador
     * @returns Objeto com informações da mensagem
     */
    static getMessageInfo(data: CreateOperatorMessageDTO) {
        const operatorModel = new OperatorModel(data);
        operatorModel.validate();

        return {
            topico: operatorModel.getTopic(),
            timestamp: operatorModel.getTimestamp(),
            payloadKeys: Object.keys(operatorModel.getPayload()),
            payloadSize: JSON.stringify(operatorModel.getPayload()).length
        };
    }
}
