import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Interface para payload dinâmico
 */
export interface DynamicPayload {
    [key: string]: any;
}

/**
 * Interface para requisição de mensagem
 */
export interface MessageRequest {
    topico: string;
    timestamp?: string;
    payload: DynamicPayload;
}

/**
 * Interface para resposta do servidor
 */
export interface ServerResponse {
    mensagem: string;
    topico: string;
    timestamp: string;
    payload?: DynamicPayload;
}

/**
 * Configuração do cliente
 */
export interface OperatorClientConfig {
    serverUrl: string;
    timeout?: number;
    verbose?: boolean;
}

/**
 * Classe cliente HTTP para comunicação com o servidor
 * Responsável por enviar mensagens dinâmicas para o servidor via HTTP/REST
 */
export class OperatorClient {
    private client: AxiosInstance;
    private serverUrl: string;
    private verbose: boolean;

    constructor(config: OperatorClientConfig) {
        this.serverUrl = config.serverUrl;
        this.verbose = config.verbose ?? false;

        this.client = axios.create({
            baseURL: this.serverUrl,
            timeout: config.timeout ?? 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.log(`OperatorClient inicializado com servidor: ${this.serverUrl}`);
    }

    /**
     * Log condicional baseado na configuração verbose
     */
    private log(message: string, data?: any): void {
        if (this.verbose) {
            console.log(`[OPERADOR] ${message}`, data ? data : '');
        }
    }

    /**
     * Publica uma mensagem no servidor
     * @param topico - Nome do tópico onde a mensagem será publicada
     * @param payload - Objeto com os dados dinâmicos
     * @param timestamp - ISO 8601 timestamp (opcional, auto-gerado no servidor se omitido)
     * @returns Resposta do servidor
     */
    async publish(
        topico: string,
        payload: DynamicPayload,
        timestamp?: string
    ): Promise<ServerResponse> {
        try {
            this.log(`Enviando mensagem para tópico: ${topico}`, { payload });

            const message: MessageRequest = {
                topico,
                payload,
                ...(timestamp && { timestamp })
            };

            const response = await this.client.post<ServerResponse>('/api/operador/publish', message);

            this.log(`Mensagem publicada com sucesso!`, response.data);

            return response.data;

        } catch (error) {
            this.handleError(error, topico);
            throw error;
        }
    }

    /**
     * Valida uma mensagem sem publicar
     * Útil para testes
     * @param topico - Nome do tópico
     * @param payload - Objeto com os dados
     * @returns Resposta do servidor com validação
     */
    async validate(
        topico: string,
        payload: DynamicPayload
    ): Promise<any> {
        try {
            this.log(`Validando mensagem para tópico: ${topico}`);

            const message: MessageRequest = {
                topico,
                payload
            };

            const response = await this.client.post('/api/operador/validate', message);

            this.log(`Validação concluída!`, response.data);

            return response.data;

        } catch (error) {
            this.handleError(error, topico);
            throw error;
        }
    }

    /**
     * Verifica se o servidor está online
     * @returns true se operacional, false caso contrário
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/api/operador/health');
            this.log('Health check OK', response.data);
            return response.status === 200;

        } catch (error) {
            this.log('Health check FALHOU');
            return false;
        }
    }

    /**
     * Envia múltiplas mensagens em sequência
     * @param messages - Array de objetos { topico, payload }
     * @returns Array com resultados de cada publicação
     */
    async publishBatch(messages: { topico: string; payload: DynamicPayload }[]): Promise<ServerResponse[]> {
        const results: ServerResponse[] = [];

        for (const message of messages) {
            try {
                const result = await this.publish(message.topico, message.payload);
                results.push(result);
            } catch (error) {
                console.error(`Erro ao publicar no tópico ${message.topico}:`, error);
            }
        }

        this.log(`Batch concluído: ${results.length}/${messages.length} mensagens publicadas`);

        return results;
    }

    /**
     * Tratamento centralizado de erros
     */
    private handleError(error: any, topico: string): void {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            if (axiosError.response) {
                console.error(`[ERRO ${axiosError.response.status}] Servidor respondeu com erro para tópico "${topico}"`);
                console.error('Detalhes:', axiosError.response.data);

            } else if (axiosError.request) {
                console.error(`[ERRO DE CONEXÃO] Sem resposta do servidor para tópico "${topico}"`);
                console.error('Request enviada, mas sem resposta');

            } else {
                console.error(`[ERRO] Erro ao preparar requisição para tópico "${topico}"`);
                console.error(axiosError.message);
            }

        } else {
            console.error(`[ERRO DESCONHECIDO] Falha ao publicar no tópico "${topico}":`, error);
        }
    }

    /**
     * Muda a URL do servidor (em tempo de execução)
     */
    public setServerUrl(newUrl: string): void {
        this.serverUrl = newUrl;
        this.client.defaults.baseURL = newUrl;
        this.log(`URL do servidor alterada para: ${newUrl}`);
    }

    /**
     * Muda o modo verbose
     */
    public setVerbose(verbose: boolean): void {
        this.verbose = verbose;
    }
}
