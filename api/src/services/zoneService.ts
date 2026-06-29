import { ZoneModel } from "@models";
import { CreateZoneDTO, ZoneResponseDTO } from "@types";

export class ZoneService{

    static async register(data: CreateZoneDTO): Promise<ZoneResponseDTO>{
    
        const { name } = data;
        const zoneExists = await ZoneModel.findByName(name);

        if(zoneExists) throw new Error("Já existe uma zona com este nome.");
    
        const zone = await ZoneModel.create(data);

        return {
            id: zone.id,
            name: zone.name,
            label: zone.label
        };
    }
    
    static async getAll(): Promise<ZoneResponseDTO[]>{
        const zones = await ZoneModel.findAll();

        return zones;
    }
}