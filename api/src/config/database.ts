import sqlite3 from "sqlite3";
import path from "path";

const sqlite = sqlite3.verbose();

const dbPath = path.resolve(__dirname, '../database/databaseApi.sqlite');
const db = new sqlite.Database(dbPath);

export const dbClient = {
    
    run(sql: string, params: any[] = []): Promise<{lastID: number; changes: number}> {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err){
                if(err) reject(err);
                resolve({lastID: this.lastID, changes: this.changes});
            });
        });
    },

    get<T>(sql: string, params: any[] = []): Promise<T | null>{
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err,row: T) => {
                if(err) reject(err);
                resolve(row || null);
            });
        });
    },

    all<T>(sql: string, params: any[] = []): Promise<T[]>{
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows: T[]) =>{
                if(err) reject(err);
                resolve(rows || []);
            })
        })
    }
}