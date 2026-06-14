import { Request, Response } from "express";
import { AlertService } from "@services";

export class AlertController{

    static async create(req: Request, res: Response){
        try{
            const alert = await AlertService.pushAlert(req.body);

            return res.status(201).json({
                mensagem: "Alerta validado e disparado com sucesso."
            });
        } catch(error: any){

            return res.status(400).json({
                erro: error.message
            })
        }
    }
}