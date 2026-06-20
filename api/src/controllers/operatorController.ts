import { Request, Response } from "express";
import { OperatorService } from "@services";

/**
 * Controller responsável por gerenciar requisições do Operador
 * Processa mensagens de entrada e as encaminha para publicação
 */
export class OperatorController {

    /**
     * Recebe uma mensagem do operador e a publica no broker
     * @param req - Request contendo a mensagem no body
     * @param res - Response com confirmação ou erro
     */
    static async publishMessage(req: Request, res: Response) {
        try {
            // Valida e publica a mensagem
            const message = await OperatorService.publishMessage(req.body);

            return res.status(201).json({
                mensagem: "Mensagem recebida e publicada com sucesso no broker.",
                topico: message.topico,
                timestamp: message.timestamp,
                payload: message.payload
            });

        } catch (error: any) {
            console.error("[OPERATOR CONTROLLER ERROR]", error.message);

            return res.status(400).json({
                erro: error.message || "Erro ao processar mensagem do operador."
            });
        }
    }

    /**
     * Apenas valida a mensagem sem publicar (útil para testes)
     * @param req - Request contendo a mensagem no body
     * @param res - Response com validação ou erro
     */
    static async validateMessage(req: Request, res: Response) {
        try {
            // Apenas valida
            const message = OperatorService.validateMessage(req.body);
            const info = OperatorService.getMessageInfo(req.body);

            return res.status(200).json({
                mensagem: "Mensagem validada com sucesso.",
                estrutura: {
                    topico: message.topico,
                    timestamp: message.timestamp,
                    payloadKeys: info.payloadKeys,
                    payloadSize: `${info.payloadSize} bytes`
                }
            });

        } catch (error: any) {
            console.error("[OPERATOR VALIDATION ERROR]", error.message);

            return res.status(400).json({
                erro: error.message || "Erro ao validar mensagem do operador."
            });
        }
    }

    /**
     * Health check para operador
     * @param req - Request
     * @param res - Response
     */
    static healthCheck(req: Request, res: Response) {
        return res.status(200).json({
            status: "ok",
            mensagem: "Serviço do Operador está operacional."
        });
    }
}
