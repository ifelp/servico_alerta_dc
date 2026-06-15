# 🚨 Sistema de Alertas de Defesa Civil



## 📋 Descrição do Projeto

Sistema distribuído de distribuição de alertas emergenciais baseados em localização geográfica. A plataforma permite que operadores disparem alertas categorizados por zona e tipo de risco, os quais são entregues em tempo real via modelo **Push**  a todos os cidadãos inscritos naquela região.

O sistema é composto por três componentes principais:

- **API Gateway (Node.js + Express + TypeScript):** recebe os alertas do operador, valida os dados e publica no broker MQTT.
- **Broker de Mensagens (Eclipse Mosquitto via Docker):** responsável pelo roteamento e entrega dos alertas aos clientes inscritos.
- **Aplicativo do Cidadão (React + Vite + Capacitor):** interface web onde o cidadão se inscreve em zonas de risco e recebe os alertas em tempo real.
- **Painel do Operador (TUI — Terminal User Interface):** interface de terminal de alta resiliência para o operador da Defesa Civil disparar alertas sem dependência de navegador ou rede gráfica.

---

##  Tecnologias Escolhidas e Justificativas
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

### Broker de Mensagens: Eclipse Mosquitto (MQTT)

O protocolo **MQTT** com o broker **Eclipse Mosquitto** foi escolhido por três razões centrais de Sistemas Distribuídos:

1. **Tópicos dinâmicos sob demanda:** ao contrário do RabbitMQ (que exige declaração prévia de exchanges/queues) e do Kafka (que requer provisionamento de tópicos via CLI), o Mosquitto cria tópicos logicamente na memória em tempo real. Novas zonas e categorias de risco podem ser adicionadas sem alterar configuração ou reiniciar a infraestrutura.
2. **Modelo Push nativo com gerência em memória via Árvore Trie:** o broker mantém a lista de subscribers por tópico internamente e empurra o payload em milissegundos para os clientes assim que um alerta é publicado, sem necessidade de polling.
3. **Overhead mínimo para redes móveis instáveis:** o MQTT opera sobre TCP com cabeçalho de apenas 2 bytes, sendo ideal para dispositivos móveis dos cidadãos em redes 3G/4G com qualidade variável.

### Backend: Node.js + TypeScript + Express

- **I/O não-bloqueante:** o Event Loop do Node.js oferece alta vazão para múltiplas conexões simultâneas com baixo consumo de memória, essencial para um sistema de mensageria que lida com picos de requisições em emergências.
- **TypeScript:** a tipagem estática garante que o contrato JSON de cada alerta seja validado em todas as camadas internas, reduzindo erros em produção.
- **Arquitetura em camadas (Config / Controller / Service):** o Controller trata apenas o protocolo HTTP, enquanto o Service isola as regras de negócio e a integração com o MQTT, permitindo substituir o broker no futuro sem impactar as validações do domínio.

### Banco de Dados de Apoio: SQLite

Utilizado para persistência local do histórico de alertas emitidos. Escolhido por ser um banco relacional baseado em arquivo único (in-process), eliminando a necessidade de gerenciar um contêiner de banco de dados separado nesta fase, com transações ACID e latência zero de rede local.

### Cliente Mobile: React + Vite + Capacitor

- O **Vite** substitui o Webpack por ESM nativo, acelerando o ciclo de desenvolvimento.
- O **Capacitor** encapsula a SPA React em um binário nativo (`.apk` / `.ipa`), permitindo que Android, iOS e Web compartilhem o mesmo código-fonte e dando acesso às APIs nativas de notificação em background.

### Painel do Operador: TUI (Terminal User Interface)

Escolha fundamentada em critérios de resiliência crítica:

- **Tolerância a falhas de infraestrutura:** em cenários de desastre, a TUI opera via SSH com consumo zero de banda gráfica, funcionando inclusive em conexões de satélite degradadas onde uma aplicação React seria inutilizável.
- **Sem pontos únicos de falha intermediários:** não depende de servidor de frontend (Nginx/Cloudflare) comunica-se diretamente com a API, reduzindo a cadeia de componentes que podem falhar.
- **Imunidade a incompatibilidades de navegador:** funciona em qualquer terminal POSIX, com inicialização instantânea e consistência visual absoluta independente do hardware do operador.

---

## 🗂️ Estrutura de Pastas

```
servico_alerta_dc/
├── .github/
│   └── ISSUE_TEMPLATE/       # Templates de issues para controle de tarefas
├── api/                      # Servidor Backend (Node.js + TypeScript + Express)
│   └── src/
│       ├── config/           # Configurações de ambiente, MQTT e banco de dados
│       ├── controllers/      # Camada HTTP: recebe e responde às requisições
│       ├── database/
│       │   └── migrations/   # Scripts de criação/evolução do esquema SQLite
│       ├── models/           # Definição das entidades de domínio (Alert, Zone, etc.)
│       ├── routes/           # Mapeamento de endpoints HTTP
│       ├── services/         # Regras de negócio e integração com o broker MQTT
│       ├── types/            # Interfaces e tipos TypeScript compartilhados
│       └── server.ts         # Ponto de entrada do servidor
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── mosquitto/
│   └── config/
│       └── mosquitto.conf    # Configuração do broker Eclipse Mosquitto
├── .gitignore
├── docker-compose.yml        # Orquestra API + Mosquitto em contêineres
└── README.md
```

---

## 🌐 Topologia da Árvore de Tópicos MQTT

O roteamento dos alertas segue uma hierarquia lógica geográfica/categórica:

```
defesacivil/alertas/{zona_geografica}/{categoria_risco}
```

**Exemplos de canais:**
- `defesacivil/alertas/zona_a/chuva`
- `defesacivil/alertas/zona_a/deslizamento`
- `defesacivil/alertas/zona_b/inundacao`
- `defesacivil/alertas/zona_c/vendaval`

**As zonas e categorias são dinâmicas:** o Mosquitto cria os tópicos em tempo real na memória, portanto novas zonas ou tipos de risco não exigem alteração de código ou reinicialização da infraestrutura.

**Inscrição do cidadão (wildcard multinível):**
```
defesacivil/alertas/zona_a/#
```
Uma única conexão persistente garante o recebimento de qualquer categoria de risco naquela zona.

---

## 📦 Modelagem do Estado Central em Memória

O Mosquitto mantém internamente (via Árvore Trie) a estrutura de subscribers por tópico. Na camada da API, o estado relevante em memória é:

```typescript
// Estrutura de um alerta em trânsito (antes da persistência no SQLite)
interface Alert {
  id: string;           // UUIDv4 — identificador único do alerta
  zona: string;         // Zona geográfica (ex: "zona_a")
  categoria: string;    // Categoria de risco (ex: "deslizamento")
  gravidade: "BAIXO" | "MEDIO" | "ALTO";
  descricao: string;    // Entre 10 e 500 caracteres
  timestamp: string;    // ISO 8601 UTC (ex: "2026-06-14T20:30:00Z")
}
```

---

## 📡 Protocolo de Comunicação

### Fluxo Geral

```
[Operador TUI]
      |
      | POST /enviar-alerta (JSON)
      ▼
[API Gateway — Express]
      | Valida payload (regras de negócio)
      | Persiste no SQLite
      | Publish MQTT
      ▼
[Broker — Eclipse Mosquitto]
      | Push para todos os subscribers da zona
      ▼
[App Cidadão — React/Capacitor]
```

O Painel do Operador **nunca publica diretamente no broker.** Toda mensagem passa obrigatoriamente pela API, que atua como validador e guardião do domínio.

### Endpoints da API
> ⚠️ **Mapeamento provisório:** os endpoints abaixo representam o contrato inicial definido nesta entrega. A tabela final será consolidada e expandida nas próximas entregas.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/enviar-alerta` | Valida e publica um novo alerta |
| `GET` | `/historico` | Retorna alertas persistidos no SQLite |
| `GET` | `/health` | Health-check do servidor |

### Payload de Alerta (JSON)

```json
{
  "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "zona": "zona_a",
  "categoria": "deslizamento",
  "gravidade": "ALTO",
  "descricao": "Risco iminente de deslizamento na encosta da comunidade Norte. Evacue a área imediatamente.",
  "timestamp": "2026-06-14T20:30:00Z"
}
```

### Regras de Validação

| Campo | Regra |
|---|---|
| `id` | UUIDv4 válido, obrigatório |
| `zona` | String em letras minúsculas, sem caracteres especiais |
| `categoria` | String correspondente a um risco homologado (`chuva`, `deslizamento`, `alagamento`, `incendio`, `vendaval`, `rompimento_barragem`) |
| `gravidade` | ENUM estrito, case-sensitive: `BAIXO`, `MEDIO` ou `ALTO` |
| `descricao` | String entre 10 e 500 caracteres |
| `timestamp` | ISO 8601 UTC obrigatório (`AAAA-MM-DDTHH:MM:SSZ`) |

Qualquer violação retorna HTTP `400 Bad Request`, impedindo que dados malformados cheguem ao broker e à população.

---

## 🚀 Como Rodar a Aplicação

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- [Node.js](https://nodejs.org/) >= 18 (para desenvolvimento local sem Docker)

### 1. Clonar o Repositório

```bash
git clone https://github.com/ifelp/servico_alerta_dc.git
cd servico_alerta_dc
```

### 2. Subir os Serviços com Docker Compose

```bash
docker-compose up --build
```

Isso inicializa:
- **Eclipse Mosquitto** (broker MQTT) na porta `1883`
- **API Gateway** (Express) na porta `3000`

### 3. Verificar o Health-Check da API

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{ "status": "ok" }
```

### 4. Rodar a API Localmente (sem Docker)

```bash
cd api
npm install
npm run dev
```

### 5. Testar o Broker MQTT Manualmente

Com os serviços rodando, abra dois terminais:

**Terminal 1 — Subscriber (cidadão inscrito na zona_A):**
```bash
docker exec -it mqtt-broker-container mosquitto_sub -h localhost -p 1883 -t "defesacivil/alertas/zona_A/#" -v
```

**Terminal 2 — Publisher (dispara um alerta via rota HTTP da API):**
```bash
curl -X POST http://localhost:3001/alert \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "zona": "zona_A",
    "categoria": "chuva",
    "gravidade": "ALTO",
    "descricao": "Risco iminente de alagamento e deslizamento na encosta norte.",
    "timestamp": "2026-06-14T20:15:00Z"
  }'
```

O alerta publicado via `POST /alert` deve aparecer imediatamente no Terminal 1, confirmando o fluxo completo API → Mosquitto → Subscriber.

**Evidência — Publisher (POST /alert):**

![Teste Publisher](https://github.com/user-attachments/assets/19fc2f3a-7dd0-438b-ae71-07e7dfc94622)

**Evidência — Subscriber (recebimento via MQTT):**

![Teste Subscriber](https://github.com/user-attachments/assets/1f9db292-ceb1-49d7-ba04-e246f220b827)
---

## 👥 Equipe 04

| Nome | 
|---|
| Gabriel Fonseca |
| Guilherme Barbosa |
| Iranildo Felipe |
| Rodrigo Neves |
| Thiago Bernardo |




