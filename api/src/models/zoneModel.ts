import { dbClient } from "@config";

interface ZoneTable {
    id: number;
    name: string;
    label: string
}

type ZoneTableWithoutId = Omit<ZoneTable, "id">

export class ZoneModel{

    static async create(data: ZoneTableWithoutId): Promise<ZoneTable> {
            const {name, label} = data;
            const zone = await dbClient.run(
                'INSERT INTO zone (name, label) VALUES (?, ?)',
                [name, label],
            )
            return {
                id: zone.lastID,
                name,
                label
            }
    }

    static async findAll():Promise<ZoneTable[]>{
            const zones = await dbClient.all<ZoneTable>(
                'SELECT id, name, label FROM zone',
            );
    
            return zones;
    }

    static async findByName(name: string): Promise<ZoneTable | null>{
            const zones = await dbClient.get<ZoneTable>(
                'SELECT id, name, label FROM zone WHERE name = ?',
                [name]
            );
    
            return zones || null;
        }


}