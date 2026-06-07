import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../database/databaseApi.sqlite');
const db = new Database(dbPath);

export const dbClient = {
    
    async run(sql: string, params: any[] = []): Promise<{lastID: number; changes: number}> {
        const op = db.prepare(sql);
        const resp = op.run(...params);
        return {
            lastID: resp.lastInsertRowid as number,
            changes: resp.changes
        }
    },

    async get<T>(sql: string, params: any[] = []): Promise<T | null>{
        const op = db.prepare(sql);
        const resp = op.get(...params);
        return (resp as T) || null;
    },

    async all<T>(sql: string, params: any[] = []): Promise<T[]>{
        const op = db.prepare(sql);
        const resp = op.all(...params);
        return (resp as T[]) || null;
    }
}