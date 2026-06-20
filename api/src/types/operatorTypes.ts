// Interface para o payload dinâmico dentro da mensagem do operador
export interface DynamicPayload {
    [key: string]: any;
}

// Interface para a mensagem completa do operador
export interface OperatorMessage {
    topico: string;
    timestamp: string;
    payload: DynamicPayload;
}

// DTO para criar mensagem do operador (validação na entrada)
export interface CreateOperatorMessageDTO {
    topico: string;
    timestamp?: string; // opcional, pode ser gerado no servidor
    payload: DynamicPayload;
}

// DTO para resposta do operador
export interface OperatorMessageResponseDTO {
    mensagem: string;
    topico: string;
    timestamp: string;
}
