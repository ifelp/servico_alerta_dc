CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload_id TEXT NOT NULL,
    zona TEXT NOT NULL,
    categoria TEXT NOT NULL,
    gravidade TEXT NOT NULL,
    descricao TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
