import { getBrokerInstance } from "@config";
import { AlertPayload } from "@types";

export class AlertService{
    
    static async pushAlert(payload: AlertPayload): Promise<void>{

        if(!['BAIXO', 'MEDIO', 'ALTO'].includes(payload.gravidade)){
            throw new Error("Campo Gravidade inválido.");
        }

        if(payload.descricao.length < 10 || payload.descricao.length > 500){
            throw new Error("A descrição deve ter entre 10 e 500 caracteres.");
        }
        //pode ter mais validações. Colocando umas básicas apenas para testes.

        const topic = `defesacivil/alertas/${payload.zona}/${payload.categoria}`

        const broker = getBrokerInstance();

        return new Promise((resolve, reject) => { //esse não será o objeto final de retorno. Vamos alterar quando implementarmos a persistência de alertas.
            broker.publish(topic, JSON.stringify(payload), { qos: 1}, (err) => {
                if(err){
                    return reject(new Error("Erro ao encaminhar alerta ao broker."));
                }
                console.log("[PUBLISH] Sucesso ao enviar mensagem ao broker.");
                resolve();
            })
        })

    }
}