import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dbClient } from '@config'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
    console.log("Verficando migrations do banco de dados...");

    dbClient.run(
        `CREATE TABLE IF NOT EXISTS migrations(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            run_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`
    )

    const migrationDir = path.resolve(__dirname, '../database/migrations');
    if(!fs.existsSync(migrationDir)) {
        console.log("Pasta de migrations não encontrada. Ignorando ação...");
        return;
    }

    const migrationFiles = fs.readdirSync(migrationDir).sort();
    let execs = 0;
    migrationFiles.map( async (file) => {
        if(!file.endsWith('.sql')) return;

        const wasExecuted = await dbClient.get(
            'SELECT id FROM migrations WHERE name = ?',
            [file]
        );

        if(!wasExecuted){
            console.log(`Executando migração ${file}`);

            const sql = fs.readFileSync(path.join(migrationDir, file), 'utf-8');
            await dbClient.run(sql);

            await dbClient.run(
                'INSERT INTO migrations (name) VALUES (?)',
                [file]
            )
            execs++;
        }
    })
    if(execs == 0) console.log("Banco de dados atualizado. Nenhuma mudança aplicada.");
    else console.log("Migrations aplicadas. Banco de dados atualizado!");

}