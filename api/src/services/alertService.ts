import { getBrokerInstance } from "@config";
import { AlertPayload, AlertEntity } from "@types";
import { AlertModel } from "@models";

export class AlertService{

    static validatePayload(payload: AlertPayload) {
        if(!payload || typeof payload !== 'object'){
            throw new Error("Payload de alerta inválido.");
        }

        if(!payload.zona || typeof payload.zona !== 'string' || payload.zona.trim().length === 0){
            throw new Error("Campo Zona inválido.");
        }

        if(!payload.categoria || typeof payload.categoria !== 'string' || payload.categoria.trim().length === 0){
            throw new Error("Campo Categoria inválido.");
        }

        if(!['BAIXO', 'MEDIO', 'ALTO'].includes(payload.gravidade)){
            throw new Error("Campo Gravidade inválido.");
        }

        if(!payload.descricao || typeof payload.descricao !== 'string' || payload.descricao.length < 10 || payload.descricao.length > 500){
            throw new Error("A descrição deve ter entre 10 e 500 caracteres.");
        }

        if(!payload.timestamp || typeof payload.timestamp !== 'string' || payload.timestamp.trim().length === 0){
            throw new Error("Campo Timestamp inválido.");
        }
    }

    static async pushAlert(payload: AlertPayload): Promise<AlertEntity>{
        this.validatePayload(payload);

        const persistedAlert = await AlertModel.create(payload);

        const topic = `defesacivil/alertas/${payload.zona}/${payload.categoria}`;
        const broker = getBrokerInstance();

        await new Promise<void>((resolve, reject) => {
            broker.publish(topic, JSON.stringify(payload), { qos: 1}, (err) => {
                if(err){
                    return reject(new Error("Erro ao encaminhar alerta ao broker."));
                }
                console.log("[PUBLISH] Sucesso ao enviar mensagem ao broker.");
                resolve();
            })
        });

        return persistedAlert;
    }

    static async getAll(): Promise<AlertEntity[]> {
        return AlertModel.findAll();
    }

    static async getByZone(zona: string): Promise<AlertEntity[]> {
        if(!zona || typeof zona !== 'string' || zona.trim().length === 0) {
            throw new Error("Zona inválida.");
        }
        return AlertModel.findByZone(zona);
    }

    static async getLatestByZone(zona: string): Promise<AlertEntity | null> {
        if(!zona || typeof zona !== 'string' || zona.trim().length === 0) {
            throw new Error("Zona inválida.");
        }
        return AlertModel.findLatestByZone(zona);
    }
}