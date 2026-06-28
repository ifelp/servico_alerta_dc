import { Request, Response } from "express";
import { AlertService } from "@services";

export class AlertController{

    static async create(req: Request, res: Response){
        try{
            const alert = await AlertService.pushAlert(req.body);

            return res.status(201).json({
                mensagem: "Alerta validado, salvo e disparado com sucesso.",
                alerta: alert
            });
        } catch(error: any){
            console.error(error.message);

            return res.status(400).json({
                erro: error.message
            });
        }
    }

    static async getAll(req: Request, res: Response){
        try{
            const alerts = await AlertService.getAll();
            return res.status(200).json(alerts);
        } catch(error: any){
            console.error(error.message);
            return res.status(500).json({ error: "Erro ao buscar alertas." });
        }
    }

    static async getByZone(req: Request, res: Response){
        try{
            const { zona } = req.params;
            const alerts = await AlertService.getByZone(zona);
            return res.status(200).json(alerts);
        } catch(error: any){
            console.error(error.message);
            if(error.message === "Zona inválida.") return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Erro ao buscar alertas por zona." });
        }
    }

    static async getLatestByZone(req: Request, res: Response){
        try{
            const { zona } = req.params;
            const alert = await AlertService.getLatestByZone(zona);

            if(!alert) return res.status(204).send();
            return res.status(200).json(alert);
        } catch(error: any){
            console.error(error.message);
            if(error.message === "Zona inválida.") return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Erro ao buscar último alerta por zona." });
        }
    }
}