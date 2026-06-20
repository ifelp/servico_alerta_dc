import { OperatorMessage, CreateOperatorMessageDTO } from "@types";

/**
 * Classe responsável por representar e manipular mensagens do Operador
 * Essa classe valida e transforma os dados recebidos do operador
 */
export class OperatorModel {
    private topico: string;
    private timestamp: string;
    private payload: Record<string, any>;

    constructor(data: CreateOperatorMessageDTO) {
        this.topico = data.topico;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.payload = data.payload;
    }

    /**
     * Valida a estrutura básica da mensagem
     */
    public validate(): void {
        if (!this.topico || typeof this.topico !== 'string') {
            throw new Error('Campo "topico" é obrigatório e deve ser uma string.');
        }

        if (this.topico.trim().length === 0) {
            throw new Error('Campo "topico" não pode estar vazio.');
        }

        if (!this.timestamp || typeof this.timestamp !== 'string') {
            throw new Error('Campo "timestamp" é obrigatório e deve ser uma string.');
        }

        // Valida formato ISO 8601
        if (isNaN(Date.parse(this.timestamp))) {
            throw new Error('Campo "timestamp" deve estar em formato ISO 8601.');
        }

        if (!this.payload || typeof this.payload !== 'object' || Array.isArray(this.payload)) {
            throw new Error('Campo "payload" é obrigatório e deve ser um objeto.');
        }

        if (Object.keys(this.payload).length === 0) {
            throw new Error('Campo "payload" não pode estar vazio.');
        }
    }

    /**
     * Retorna a mensagem no formato OperatorMessage
     */
    public toMessage(): OperatorMessage {
        return {
            topico: this.topico,
            timestamp: this.timestamp,
            payload: this.payload
        };
    }

    /**
     * Retorna apenas o tópico
     */
    public getTopic(): string {
        return this.topico;
    }

    /**
     * Retorna apenas o timestamp
     */
    public getTimestamp(): string {
        return this.timestamp;
    }

    /**
     * Retorna apenas o payload
     */
    public getPayload(): Record<string, any> {
        return this.payload;
    }
}
