//Classe exemplo. Podemos usar no projeto se for conveninente :)
import { dbClient } from "@config";

interface UserTable {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
}
type UserTableWithoutPassword = Omit<UserTable, 'password_hash' | 'created_at'>;

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
            'SELECT id, name, email FROM users WHERE id = ?',
            [id]
        );

        return user || null;
    }

    static async findByEmail(email: string): Promise<UserTableWithoutPassword | null>{
        const user = await dbClient.get<UserTableWithoutPassword>(
            'SELECT id, name, email FROM users WHERE email = ?',
            [email]
        );

        return user || null;
    }

    static async findAll():Promise<UserTableWithoutPassword[]>{
        const users = await dbClient.all<UserTableWithoutPassword>(
            'SELECT id, name, email FROM users',
        );

        return users;
    }

    static async update(id: number, queryFields: Partial<UserTable>): Promise<boolean>{
        const keys = Object.keys(queryFields);
        const values = Object.values(queryFields);

        if(keys.length == 0) return false;

        const query = keys.map(key => `${key} = ?`).join(', ');
        values.push(id);

        const result = await dbClient.run(
            `UPDATE users SET ${query} WHERE id = ?`,
            values
        )

        return result.changes > 0;
    }

    static async delete(id:number): Promise<boolean>{
        const result = await dbClient.run(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        return result.changes > 0;
    }
}