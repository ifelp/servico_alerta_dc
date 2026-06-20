# 🔧 Guia de Integração - Operador

Como integrar o `OperatorClient` em seus projetos TypeScript/Node.js.

## 📦 Opção 1: npm/pnpm Link (Desenvolvimento Local)

### 1.1 No diretório `/operador`

```bash
cd operador
npm link
# ou
pnpm link --global
```

### 1.2 No seu projeto consumidor

```bash
npm link operador
# ou
pnpm link --global operador
```

### 1.3 No seu código

```typescript
import { OperatorClient } from 'operador';

const client = new OperatorClient({
    serverUrl: 'http://localhost:3000'
});

await client.publish('meu/topico', { dados: 'valor' });
```

---

## 📦 Opção 2: Copiar Arquivo client.ts

Copie o arquivo `client.ts` para seu projeto:

```bash
cp operador/src/client.ts seu-projeto/src/services/
```

No seu código:

```typescript
import { OperatorClient } from './services/client';

const client = new OperatorClient({
    serverUrl: 'http://localhost:3000'
});
```

---

## 📦 Opção 3: Publicar no npm (Produção)

### 3.1 Atualizar package.json

```json
{
  "name": "@seu-org/operador",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

### 3.2 Build

```bash
cd operador
npm run build
```

### 3.3 Publicar

```bash
npm publish --access public
# Ou privado para sua org
npm publish --access restricted
```

### 3.4 Usar em outro projeto

```bash
npm install @seu-org/operador
```

---

## 🎯 Casos de Uso Comuns

### Caso 1: Serviço de Sensores em Node.js

```typescript
// src/services/sensorService.ts
import { OperatorClient } from 'operador';

class SensorService {
    private client: OperatorClient;

    constructor() {
        this.client = new OperatorClient({
            serverUrl: process.env.API_URL || 'http://localhost:3000',
            verbose: process.env.NODE_ENV === 'development'
        });
    }

    async collectAndPublishTemperature(roomId: string, temp: number) {
        await this.client.publish(
            `sensores/temperatura/${roomId}`,
            {
                temperatura: temp,
                unidade: 'Celsius',
                timestamp: new Date().toISOString()
            }
        );
    }

    async publishMultipleSensors(readings: Array<{
        type: 'temperatura' | 'umidade';
        room: string;
        value: number;
    }>) {
        const messages = readings.map(r => ({
            topico: `sensores/${r.type}/${r.room}`,
            payload: {
                valor: r.value,
                timestamp: new Date().toISOString()
            }
        }));

        await this.client.publishBatch(messages);
    }
}

export default new SensorService();
```

**Uso:**

```typescript
import sensorService from './services/sensorService';

// Em uma rota Express
app.post('/sensores/temperatura', async (req, res) => {
    const { roomId, temp } = req.body;
    await sensorService.collectAndPublishTemperature(roomId, temp);
    res.json({ mensagem: 'Temperatura publicada' });
});
```

---

### Caso 2: Middleware Express

```typescript
// src/middleware/operatorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { OperatorClient } from 'operador';

const client = new OperatorClient({
    serverUrl: process.env.API_URL || 'http://localhost:3000'
});

/**
 * Middleware que adiciona cliente ao request
 */
export const operatorClientMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    (req as any).operatorClient = client;
    next();
};

/**
 * Middleware que publica evento de requisição
 */
export const requestLoggerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.on('finish', async () => {
        try {
            await client.publish('api/requisicoes', {
                metodo: req.method,
                rota: req.path,
                status: res.statusCode,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erro ao registrar requisição:', error);
        }
    });
    next();
};
```

**Uso:**

```typescript
import {
    operatorClientMiddleware,
    requestLoggerMiddleware
} from './middleware/operatorMiddleware';

app.use(operatorClientMiddleware);
app.use(requestLoggerMiddleware);

// Agora todas as rotas têm acesso a req.operatorClient
app.post('/dados', async (req: any, res) => {
    await req.operatorClient.publish('api/dados', req.body);
    res.json({ ok: true });
});
```

---

### Caso 3: Worker/Job Scheduler

```typescript
// src/workers/sensorWorker.ts
import { OperatorClient } from 'operador';

class SensorWorker {
    private client: OperatorClient;
    private interval: NodeJS.Timer | null = null;

    constructor() {
        this.client = new OperatorClient({
            serverUrl: process.env.API_URL || 'http://localhost:3000'
        });
    }

    /**
     * Inicia worker que coleta sensores a cada 30 segundos
     */
    start() {
        console.log('🔄 Iniciando SensorWorker...');

        this.interval = setInterval(async () => {
            try {
                const readings = await this.collectSensorReadings();
                await this.client.publishBatch(readings);
                console.log(`📊 ${readings.length} leituras publicadas`);
            } catch (error) {
                console.error('❌ Erro no worker:', error);
            }
        }, 30000);
    }

    /**
     * Para o worker
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            console.log('⛔ SensorWorker parado');
        }
    }

    /**
     * Coleta dados de sensores (mock)
     */
    private async collectSensorReadings() {
        return [
            {
                topico: 'sensores/temperatura/sala1',
                payload: {
                    temperatura: 22 + Math.random() * 3,
                    sensor_id: 'TEMP001'
                }
            },
            {
                topico: 'sensores/umidade/cozinha',
                payload: {
                    umidade: 60 + Math.random() * 10,
                    sensor_id: 'UMID001'
                }
            }
        ];
    }
}

export default new SensorWorker();
```

**Uso:**

```typescript
import sensorWorker from './workers/sensorWorker';

// Iniciar na abertura do app
app.listen(3000, () => {
    console.log('API rodando');
    sensorWorker.start();
});

// Parar gracefully
process.on('SIGTERM', () => {
    sensorWorker.stop();
    process.exit(0);
});
```

---

### Caso 4: React/TypeScript Frontend

```typescript
// src/services/api.ts
import { OperatorClient } from 'operador';

export const apiClient = new OperatorClient({
    serverUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    verbose: process.env.NODE_ENV === 'development'
});

export async function publishSensorData(
    topico: string,
    payload: Record<string, any>
) {
    try {
        const response = await apiClient.publish(topico, payload);
        return response;
    } catch (error) {
        console.error('Erro ao publicar:', error);
        throw error;
    }
}
```

**Uso em componente:**

```typescript
// src/components/SensorForm.tsx
import { useState } from 'react';
import { publishSensorData } from '../services/api';

export function SensorForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: {
        topico: string;
        temperatura: number;
    }) => {
        setLoading(true);
        setError('');

        try {
            await publishSensorData(
                formData.topico,
                { temperatura: formData.temperatura }
            );
            alert('Dados publicados com sucesso!');
        } catch (err) {
            setError('Erro ao publicar dados');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            // ... handle form
        }}>
            {error && <div className="error">{error}</div>}
            {/* ... form fields */}
        </form>
    );
}
```

---

### Caso 5: TypeScript Puro - Classe Base

```typescript
// src/base/PublisherBase.ts
import { OperatorClient } from 'operador';

export abstract class PublisherBase {
    protected client: OperatorClient;

    constructor(serverUrl: string) {
        this.client = new OperatorClient({ serverUrl });
    }

    protected async publish(topico: string, payload: any) {
        return this.client.publish(topico, payload);
    }

    protected async validateBeforePublish(topico: string, payload: any) {
        return this.client.validate(topico, payload);
    }

    abstract run(): Promise<void>;
}

// src/publishers/TemperaturePublisher.ts
import { PublisherBase } from '../base/PublisherBase';

export class TemperaturePublisher extends PublisherBase {
    async run() {
        for (let i = 0; i < 10; i++) {
            const temp = 20 + Math.random() * 5;
            await this.publish('sensores/temperatura/teste', {
                temperatura: temp,
                leitura: i + 1
            });
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

// Uso
const publisher = new TemperaturePublisher('http://localhost:3000');
await publisher.run();
```

---

## 🔒 Boas Práticas

### 1. Usar Variáveis de Ambiente

```typescript
const client = new OperatorClient({
    serverUrl: process.env.OPERATOR_URL || 'http://localhost:3000',
    timeout: parseInt(process.env.OPERATOR_TIMEOUT || '5000'),
    verbose: process.env.NODE_ENV === 'development'
});
```

### 2. Singleton Pattern

```typescript
let client: OperatorClient | null = null;

export function getOperatorClient(): OperatorClient {
    if (!client) {
        client = new OperatorClient({
            serverUrl: process.env.API_URL || 'http://localhost:3000'
        });
    }
    return client;
}
```

### 3. Error Handling

```typescript
try {
    await client.publish('meu/topico', dados);
} catch (error) {
    if (error.response?.status === 400) {
        // Erro de validação
        console.error('Dados inválidos:', error.response.data);
    } else if (error.request) {
        // Erro de conexão
        console.error('Servidor não respondeu');
    } else {
        // Outro erro
        console.error('Erro desconhecido:', error.message);
    }
}
```

### 4. Retry Logic

```typescript
async function publishWithRetry(
    topico: string,
    payload: any,
    maxRetries = 3
) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await client.publish(topico, payload);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            await new Promise(r => setTimeout(r, delay));
        }
    }
}
```

---

## 🚀 Build e Deploy

### Compilar TypeScript

```bash
npm run build
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

CMD ["node", "dist/index.js"]
```

---

## 📚 Referências

- [API Documentation](../api/OPERADOR_MESSAGE_STRUCTURE.md)
- [Test Guide](../OPERATOR_TEST_GUIDE.md)
- [OperatorClient README](./README.md)
