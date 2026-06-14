export interface AlertPayload{
    id: number; //será string, mas o number aqui serve apenas para facilitar o teste de publish.
    zona: string;
    categoria: string;
    gravidade: 'BAIXO' | 'MEDIO' | 'ALTO';
    descricao: string;
    timestamp: string;
}