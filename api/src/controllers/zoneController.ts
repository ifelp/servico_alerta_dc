import { ZoneService } from "@services";
import { Request, Response } from "express";
import { CreateZoneDTO, ZoneResponseDTO } from "@types";

export class ZoneController{

    static async create(req: Request, res: Response){
        try {
            const dto: CreateZoneDTO = req.body;
            const { name, label} = dto;

            if(Object.values(dto).length < 2){
                throw new Error("Há um campo em falta na requisição.");
            }

            const zone = await ZoneService.register({
                name,
                label
            })

            return res.status(201).json({
                message: "Zona criada com sucesso.",
                zone
            });

        } catch(error: any) {
            console.error(error.message);
            return res.status(400).json({
                message: "Erro durante criação de zona.",
                error: error.message
            })
        }
        }
    
    static async getAllZones(req: Request, res: Response){
        try{
            const zones = await ZoneService.getAll();

            return res.status(200).json(zones);

        } catch(error: any) {
            console.error(error.message);
            return res.status(500).send();
        }
    }
}