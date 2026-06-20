import { OperatorController } from "@controllers";
import { Router } from "express";

const OperatorRouter = Router();

/**
 * Rota para publicar mensagem do operador
 * POST /operador/publish
 * Body: { topico: string, timestamp?: string, payload: object }
 */
OperatorRouter.post('/publish', OperatorController.publishMessage);

/**
 * Rota para validar mensagem do operador (sem publicar)
 * POST /operador/validate
 * Body: { topico: string, timestamp?: string, payload: object }
 */
OperatorRouter.post('/validate', OperatorController.validateMessage);

/**
 * Rota para health check do serviço do operador
 * GET /operador/health
 */
OperatorRouter.get('/health', OperatorController.healthCheck);

export default OperatorRouter;
