//Classe exemplo. Podemos usar no projeto se for conveninente :)
import { dbClient } from "../config/database";

interface UserTable {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
}
type UserTableWithoutPassword = Omit<UserTable, 'password_hash'>;

export class UserModel {

    static async create(data: Omit<UserTable, 'id' | 'created_at'>): Promise<Omit<UserTable, 'password_hash'>> {
        const {name, email, password_hash} = data;
        const user = await dbClient.run(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, password_hash],
        )
        return {
            id: user.lastID,
            name,
            email,
            created_at: new Date().toISOString()
        }
    }

    static async findById(id: number): Promise<UserTableWithoutPassword | null>{
        const user = await dbClient.get<UserTableWithoutPassword>(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [id]
        );

        return user || null;
    }
}