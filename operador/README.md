# 📡 Operador - Cliente HTTP para Envio de Mensagens

Cliente TypeScript para envio dinâmico de mensagens para o servidor de alertas via HTTP/REST.

## 🚀 Características

- ✅ **Cliente HTTP Reutilizável**: Classe `OperatorClient` para fácil integração
- ✅ **Envio Dinâmico**: Publica mensagens com tópicos e payloads customizados
- ✅ **Validação**: Função para validar mensagens sem publicar
- ✅ **Batch Publishing**: Envia múltiplas mensagens em sequência
- ✅ **Health Check**: Verifica disponibilidade do servidor
- ✅ **Tratamento de Erros**: Erros detalhados e informativos
- ✅ **TypeScript**: Type-safe com interfaces completas
- ✅ **Exemplos**: Exemplos básicos e avançados inclusos

## 📦 Instalação

```bash
cd operador
pnpm install
# ou
npm install
```

## 🔧 Configuração

Crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

Configure conforme necessário:

```env
SERVER_URL=http://localhost:3000
REQUEST_TIMEOUT=5000
VERBOSE=true
```

## 📚 Uso

### Básico

```typescript
import { OperatorClient } from './src/client';

const client = new OperatorClient({
    serverUrl: 'http://localhost:3000',
    verbose: true
});

// Publica uma mensagem
await client.publish(
    'sensores/temperatura/sala1',
    {
        temperatura: 22.5,
        unidade: 'Celsius'
    }
);
```

### Exemplo 1: Envio Simples

```bash
npm run example
```

Ou:

```bash
npx tsx src/examples/basicExample.ts
```

Envia 3 mensagens de diferentes tipos de sensores.

### Exemplo 2: Envio Avançado

```bash
npm run example:advanced
```

Ou:

```bash
npx tsx src/examples/advancedExample.ts
```

Demonstra:
- Validação de mensagens
- Envio em batch
- Simulação de sensor em tempo real
- Timestamp customizado

## 🛠️ API

### Classe: `OperatorClient`

#### Constructor

```typescript
new OperatorClient(config: OperatorClientConfig)
```

**Config:**
- `serverUrl` (string, obrigatório): URL base do servidor
- `timeout` (number, opcional): Timeout em ms (padrão: 5000)
- `verbose` (boolean, opcional): Ativa logs detalhados (padrão: false)

#### Métodos

##### `publish(topico, payload, timestamp?)`

Publica uma mensagem no servidor.

```typescript
const response = await client.publish(
    'sensores/temperatura/sala1',
    {
        temperatura: 22.5,
        unidade: 'Celsius'
    }
);
// Response: { mensagem: "...", topico: "...", timestamp: "...", payload: {...} }
```

**Parâmetros:**
- `topico` (string): Nome do tópico MQTT
- `payload` (object): Dados dinâmicos (mínimo 1 campo)
- `timestamp` (string, opcional): ISO 8601 timestamp

**Retorna:** `ServerResponse`

---

##### `validate(topico, payload)`

Valida uma mensagem **sem publicar**.

```typescript
const validation = await client.validate(
    'sensores/movimento/entrada',
    { movimento_detectado: true }
);
// Response: { mensagem: "...", estrutura: {...} }
```

**Parâmetros:**
- `topico` (string): Nome do tópico
- `payload` (object): Dados dinâmicos

**Retorna:** Resposta de validação com informações estruturais

---

##### `healthCheck()`

Verifica se o servidor está online.

```typescript
const isOnline = await client.healthCheck();
// true ou false
```

**Retorna:** `boolean`

---

##### `publishBatch(messages)`

Envia múltiplas mensagens em sequência.

```typescript
const results = await client.publishBatch([
    { topico: 'sensor1', payload: {...} },
    { topico: 'sensor2', payload: {...} },
    { topico: 'sensor3', payload: {...} }
]);
// results: ServerResponse[]
```

**Parâmetros:**
- `messages` (array): Array de `{ topico, payload }`

**Retorna:** Array de `ServerResponse`

---

##### `setServerUrl(newUrl)`

Altera a URL do servidor em tempo de execução.

```typescript
client.setServerUrl('http://novo-servidor:3000');
```

---

##### `setVerbose(verbose)`

Alterna o modo verbose.

```typescript
client.setVerbose(false);
```

---

## 📊 Exemplos de Payload

### Sensor de Temperatura

```json
{
  "topico": "sensores/temperatura/sala1",
  "payload": {
    "temperatura": 22.5,
    "unidade": "Celsius",
    "sensor_id": "TEMP001"
  }
}
```

### Sensor de Movimento

```json
{
  "topico": "sensores/movimento/entrada",
  "payload": {
    "movimento_detectado": true,
    "intensidade": 95,
    "sensor_id": "MOV001"
  }
}
```

### Status de Dispositivo

```json
{
  "topico": "dispositivos/bomba/status",
  "payload": {
    "estado": "ativo",
    "vazao_litros_min": 12.5,
    "pressao_psi": 45.2,
    "erros": []
  }
}
```

## 🧪 Teste Manual com cURL

```bash
# Publicar mensagem
curl -X POST http://localhost:3000/api/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/message",
    "payload": {"teste": true}
  }'

# Validar mensagem
curl -X POST http://localhost:3000/api/operador/validate \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/message",
    "payload": {"teste": true}
  }'

# Health check
curl http://localhost:3000/api/operador/health
```

## 🐛 Tratamento de Erros

O cliente retorna erros descritivos:

```typescript
try {
    await client.publish('sensor/temp', {});
} catch (error) {
    console.error(error.message);
    // "[ERRO 400] Servidor respondeu com erro..."
    // "[ERRO DE CONEXÃO] Sem resposta do servidor..."
    // "[ERRO] Erro ao preparar requisição..."
}
```

## 🏗️ Estrutura de Arquivos

```
operador/
├── src/
│   ├── index.ts              # Exportações públicas
│   ├── client.ts             # Classe OperatorClient
│   └── examples/
│       ├── basicExample.ts    # Exemplo básico
│       └── advancedExample.ts # Exemplo avançado
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Build e Deploy

### Compilar TypeScript

```bash
npm run build
```

Gera arquivos em `dist/`

### Iniciar (após build)

```bash
npm start
```

## 📝 Notas

- O servidor gera automaticamente `timestamp` se não for fornecido
- Todos os timestamps devem estar em formato ISO 8601
- O `payload` deve conter pelo menos um campo
- O `topico` não pode estar vazio ou ser apenas espaços em branco

## 🔗 Referências

- [API Servidor - Estrutura de Mensagens](../api/OPERADOR_MESSAGE_STRUCTURE.md)
- [MQTT Topic Naming Convention](https://www.hivemq.com/article/mqtt-topic-tree-structure-best-practices-naming-conventions/)
- [RFC 3339 - ISO 8601 Timestamps](https://tools.ietf.org/html/rfc3339)
