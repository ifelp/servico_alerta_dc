export interface AlertPayload{
    id: number; // será string no futuro, mas o number aqui serve apenas para facilitar o teste de publish.
    zona: string;
    categoria: string;
    gravidade: 'BAIXO' | 'MEDIO' | 'ALTO';
    descricao: string;
    timestamp: string;
}

export interface AlertEntity {
    id: number;
    payload_id: string;
    zona: string;
    categoria: string;
    gravidade: 'BAIXO' | 'MEDIO' | 'ALTO';
    descricao: string;
    timestamp: string;
    created_at: string;
}