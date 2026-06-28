import { dbClient } from "@config";
import { AlertPayload, AlertEntity } from "@types";

export class AlertModel {

    static async create(payload: AlertPayload): Promise<AlertEntity> {
        const result = await dbClient.run(
            `INSERT INTO alerts (payload_id, zona, categoria, gravidade, descricao, timestamp)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [String(payload.id), payload.zona, payload.categoria, payload.gravidade, payload.descricao, payload.timestamp]
        );

        const alert = await dbClient.get<AlertEntity>(
            'SELECT id, payload_id, zona, categoria, gravidade, descricao, timestamp, created_at FROM alerts WHERE id = ?',
            [result.lastID]
        );

        if(!alert) {
            throw new Error('Erro ao persistir alerta no banco de dados.');
        }

        return alert;
    }

    static async findAll(): Promise<AlertEntity[]> {
        return await dbClient.all<AlertEntity>(
            `SELECT id, payload_id, zona, categoria, gravidade, descricao, timestamp, created_at
             FROM alerts
             ORDER BY timestamp DESC`
        );
    }

    static async findByZone(zona: string): Promise<AlertEntity[]> {
        return await dbClient.all<AlertEntity>(
            `SELECT id, payload_id, zona, categoria, gravidade, descricao, timestamp, created_at
             FROM alerts
             WHERE zona = ?
             ORDER BY timestamp DESC`,
            [zona]
        );
    }

    static async findLatestByZone(zona: string): Promise<AlertEntity | null> {
        const alert = await dbClient.get<AlertEntity>(
            `SELECT id, payload_id, zona, categoria, gravidade, descricao, timestamp, created_at
             FROM alerts
             WHERE zona = ?
             ORDER BY timestamp DESC
             LIMIT 1`,
            [zona]
        );

        return alert || null;
    }
}
