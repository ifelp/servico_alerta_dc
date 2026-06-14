# Sistema de Alertas de Defesa Civil
Repositório do segundo projeto de Redes e Sistemas Distribuídos.
## Tecnologias utilizadas:
<p float="left">
    &nbsp;&nbsp;
    <a href="https://www.typescriptlang.org/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png?_=20221110153201" alt="TypeScript JavaScript with syntax for types." width="5%" />
    </a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://mosquitto.org/">
        <img src="https://mosquitto.org/images/mosquitto-text-side-28.png" alt="Eclipse Mosquitto™ An open source MQTT broker" width="20%" />
    </a>
    <a href="https://www.docker.com/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Docker_Logo.png" alt="Docker: Accelerated Container Application Development" width="20%">
    </a>
</p>

### • **TypeScript** - Linguagem de Programação

### • **Eclipse Mosquitto** - Broker de mensagens

### • **Docker** - Conteinerização de aplicação

---

## 📋 Visão Geral

Este projeto implementa um sistema de alertas distribuído para a Defesa Civil que gerencia notificações de riscos por zona geográfica e categoria de risco. Utiliza **MQTT** como protocolo de comunicação para garantir escalabilidade e baixa latência na disseminação de alertas em tempo real.

---

## 🎯 Justificativa do Broker MQTT (Mosquitto)

### Por que MQTT?
- **Lightweight**: Protocolo leve ideal para IoT e sistemas distribuídos
- **Pub/Sub nativo**: Perfeito para múltiplos subscribers por zona
- **QoS configurável**: Garantia de entrega de mensagens críticas
- **Escalabilidade**: Suporta milhares de conexões simultâneas
- **Reconexão automática**: Resiliência em caso de falhas temporárias

### Por que Mosquitto?
- **Open-source** e mantido pela Eclipse Foundation
- **Leve e eficiente**: Baixo consumo de recursos
- **Fácil deployment**: Suporte nativo a Docker
- **Maduro e estável**: Versão 2.0.22 em produção
- **WebSocket support**: Permite conexões de clientes web (porta 9001)

---

## 🗺️ Topologia de Tópicos MQTT

### Estrutura Hierárquica
```
dc/                              (base)
├── zona_A/
│   ├── chuva
│   ├── deslizamento
│   ├── enchente
│   └── vento
├── zona_B/
│   ├── chuva
│   ├── deslizamento
│   ├── enchente
│   └── vento
├── zona_C/
│   ├── chuva
│   ├── deslizamento
│   ├── enchente
│   └── vento
└── control/
    └── {clientId}         (para comandos de controle)
```

### Padrão de Tópicos
- **Alerta por zona e tipo**: `dc/{zona}/{tipo}`
- **Todos os alertas de uma zona**: `dc/{zona}/+`
- **Todos os alertas de um tipo**: `dc/+/{tipo}`
- **Todos os alertas**: `dc/+/+`
- **Controle de cliente**: `dc/control/{clientId}`

### Zonas Disponíveis
- `zona_A`
- `zona_B`
- `zona_C`

### Categorias de Risco
- `chuva` - Chuvas intensas
- `deslizamento` - Risco de deslizamento de terra
- `enchente` - Risco de enchente
- `vento` - Ventos muito fortes

---

## 📦 Formato de Alertas

### Estrutura Textual
```
ALERTA|{zona}|{tipo}|{severidade}|{descricao}|{timestamp}
```

### Campos Obrigatórios
| Campo | Tipo | Valores Válidos | Descrição |
|-------|------|-----------------|-----------|
| **zona** | String | `zona_A`, `zona_B`, `zona_C` | Zona geográfica afetada |
| **tipo** | String | `chuva`, `deslizamento`, `enchente`, `vento` | Categoria de risco |
| **severidade** | String | `BAIXO`, `MEDIO`, `ALTO` | Nível de severidade do alerta |
| **descricao** | String | Texto livre | Descrição detalhada do alerta |
| **timestamp** | String | ISO 8601 | Data/hora da criação do alerta |

### Exemplo de Alerta
```
ALERTA|zona_A|chuva|ALTO|Chuva intensa com risco de enchente. Evite áreas de risco.|2026-06-14T14:30:00Z
```

### Interface TypeScript
```typescript
interface AlertMessage {
  zona: "zona_A" | "zona_B" | "zona_C";
  tipo: "chuva" | "deslizamento" | "enchente" | "vento";
  severidade: "BAIXO" | "MEDIO" | "ALTO";
  descricao: string;
  timestamp: string;
}
```

---

## 📁 Estrutura do Projeto

```
servico_alerta_dc/
├── api/                              # Aplicação Node.js/Express
│   ├── src/
│   │   ├── mqtt/
│   │   │   ├── client.ts            # Cliente MQTT e handlers
│   │   │   ├── subscribers.ts       # Gerenciamento de subscribers por zona
│   │   │   ├── topics.ts            # Definição e construção de tópicos
│   │   │   ├── alert.ts             # Formatação/parsing de alertas
│   │   │   └── index.ts             # Exports
│   │   ├── types/
│   │   │   ├── alertTypes.ts        # Interfaces de alerta
│   │   │   └── userTypes.ts
│   │   ├── routes/                  # Endpoints da API
│   │   ├── controllers/             # Lógica de negócio
│   │   ├── services/                # Serviços
│   │   ├── models/                  # Modelos de dados
│   │   ├── config/                  # Configuração e migrations
│   │   ├── database/                # Scripts SQL
│   │   └── server.ts                # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── mosquitto/
│   └── config/
│       └── mosquitto.conf           # Configuração do broker
├── docker-compose.yml               # Orquestração de containers
└── README.md
```

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- npm ou yarn

### Instalação com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <repository-url>
cd servico_alerta_dc
```

2. **Inicie os containers**
```bash
docker-compose up -d
```

Isso vai iniciar:
- **Mosquitto MQTT Broker**: porta 1883 (MQTT) e 9001 (WebSocket)
- **API Server**: porta 3001

3. **Verifique o status**
```bash
docker-compose ps
```

### Instalação Local (Desenvolvimento)

1. **Instale dependências da API**
```bash
cd api
npm install
```

2. **Configure variáveis de ambiente** (criar `.env` na pasta `api/`)
```env
NODE_ENV=development
PORT=3001
MQTT_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=dc-api-server
```

3. **Inicie apenas o Mosquitto com Docker**
```bash
docker-compose up mosquitto-eclipse -d
```

4. **Execute a API**
```bash
npm run dev
```

---

## 🧪 Como Testar Publish/Subscribe

### Opção 1: Usando MQTT CLI (Recomendado)

**Instale mqtt-cli** (ou use mosquitto-clients)
```bash
npm install -g mqtt
```

**Abra 2 terminais:**

Terminal 1 - **Subscribe a uma zona**
```bash
mqtt sub -h localhost -p 1883 -t "dc/zona_A/+"
```

Terminal 2 - **Publique um alerta**
```bash
mqtt pub -h localhost -p 1883 -t "dc/zona_A/chuva" \
  -m "ALERTA|zona_A|chuva|ALTO|Chuva intensa detectada|2026-06-14T14:30:00Z"
```

### Opção 2: Via cURL (Usando API)

```bash
# Publicar um alerta via API
curl -X POST http://localhost:3001/alert \
  -H "Content-Type: application/json" \
  -d '{
    "zona": "zona_A",
    "tipo": "chuva",
    "severidade": "ALTO",
    "descricao": "Chuva intensa com risco de enchente",
    "timestamp": "2026-06-14T14:30:00Z"
  }'
```

### Opção 3: Usando Docker Compose

```bash
# Acesse o container do Mosquitto
docker exec -it mqtt-broker-container mosquitto_pub \
  -h localhost -p 1883 -t "dc/zona_B/deslizamento" \
  -m "ALERTA|zona_B|deslizamento|MEDIO|Movimentação de terra detectada|2026-06-14T15:00:00Z"
```

---

## 📡 Endpoints da API

### 1. **Verificar Status da API**
```
GET /
```
Retorna: `{"message": "Feito com <3 e :D no Cin!"}`

### 2. **Publicar um Alerta** (A implementar)
```
POST /alert
Content-Type: application/json

{
  "zona": "zona_A",
  "tipo": "chuva",
  "severidade": "ALTO",
  "descricao": "Descrição do alerta",
  "timestamp": "2026-06-14T14:30:00Z"
}
```
Retorna: `201 Created`

### 3. **Listar Subscribers por Zona** (A implementar)
```
GET /alert/subscribers
```
Retorna:
```json
{
  "zona_A": ["client-1", "client-2"],
  "zona_B": ["client-3"],
  "zona_C": []
}
```

### 4. **Testar Conexão MQTT** (A implementar)
```
POST /alert/test
Content-Type: application/json

{
  "zona": "zona_A",
  "tipo": "chuva"
}
```
Retorna: `200 OK` com confirmação de envio

---

## 🔄 Fluxo de Funcionamento

1. **Cliente publica alerta** em `dc/{zona}/{tipo}`
2. **Broker MQTT** recebe e distribui para todos os subscribers
3. **API Server** (subscriber de `dc/+/+`) recebe o alerta
4. **Handler** processa e valida o formato
5. **Registro em memória** (`subscribers.ts`) mapeia conexões por zona
6. **Clientes** recebem alertas em tempo real

---

## 🛡️ Características de Segurança

- ✅ Validação de zonas e tipos de alerta
- ✅ Validação de severidade (BAIXO/MEDIO/ALTO)
- ✅ Timestamps ISO 8601 obrigatórios
- ✅ Formato estruturado com pipe delimitado
- ✅ Tratamento de erros e logging
- ✅ Reconexão automática em caso de falhas

---

## 📝 Logs

Os logs são salvos em:
```
mosquitto/log/mosquitto.log  (logs do broker)
```

Para visualizar logs em tempo real:
```bash
docker logs -f mqtt-broker-container
docker logs -f dc_server
```

---

## 🤝 Estrutura de Listas Globais

A aplicação mantém em memória estruturas para rastreamento de conexões:

```typescript
// Em mqtt/subscribers.ts
const zoneSubscribers = new Map<RiskZone, Set<string>>();

// Exemplo de estado em memória:
{
  "zona_A": Set { "client-1", "client-2", "mobile-app-1" },
  "zona_B": Set { "client-3", "web-dashboard" },
  "zona_C": Set { "client-4" }
}
```

**Funções de gerenciamento:**
- `addSubscriber(zone, clientId)` - Adiciona novo subscriber
- `removeSubscriber(zone, clientId)` - Remove subscriber
- `getSubscribers(zone)` - Lista subscribers de uma zona
- `getAllZoneSubscribers()` - Retorna todas as zonas com seus subscribers
- `isSubscribed(zone, clientId)` - Verifica se está inscrito

---

## 🐛 Troubleshooting

### Erro: "Conexão recusada em 1883"
- Verifique se Mosquitto está rodando: `docker ps | grep mosquitto`
- Reinicie os containers: `docker-compose restart`

### Erro: "Mensagem não no formato textual"
- Verifique se o payload segue: `ALERTA|zona|tipo|severidade|descricao|timestamp`

### Erro: "Zona ou tipo de alerta inválido"
- Confirme que a zona está em `[zona_A, zona_B, zona_C]`
- Confirme que o tipo está em `[chuva, deslizamento, enchente, vento]`

---

## 📚 Referências

- [MQTT Specification](https://mqtt.org/)
- [Mosquitto Documentation](https://mosquitto.org/documentation/)
- [Node.js MQTT Client](https://github.com/mqttjs/MQTT.js)
- [Express.js](https://expressjs.com/)

---
