import { AlertPayload } from "../../types/Alert";

export default function formatMessage(kidnapLog: (log: string) => void, receivedTopic: string, payload: AlertPayload){

    const zona = payload.zona;
    const categoria = payload.categoria;
    const gravidade = payload.gravidade;
    const descricao = payload.descricao;
    const timestamp = new Intl.DateTimeFormat('pt-BR',{
        dateStyle: 'short', timeStyle: 'short'
    }).format(new Date(payload.timestamp as string));

    kidnapLog(`\n${receivedTopic}`);
    kidnapLog(`[${gravidade}] - ${timestamp}`);
    kidnapLog(`Zona: ${zona}`);
    kidnapLog(`Categoria: ${categoria}`);
    kidnapLog(`Gravidade: ${gravidade}`);
    kidnapLog(`Descricao: ${descricao}`);
    kidnapLog(`Timestamp: ${timestamp}`);
}