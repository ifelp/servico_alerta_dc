# 🚨 Sistema de Alertas de Defesa Civil


## Descrição

Sistema distribuído de distribuição de alertas emergenciais baseados em localização geográfica. A plataforma permite que operadores disparem alertas categorizados por zona e tipo de risco, os quais são entregues em tempo real via modelo **Push** a todos os cidadãos inscritos naquela região.

O sistema é composto por quatro componentes principais:

- **API Gateway (Node.js + Express + TypeScript):** recebe os alertas do operador, valida os dados e publica no broker MQTT.
- **Broker de Mensagens (Eclipse Mosquitto via Docker):** responsável pelo roteamento e entrega dos alertas aos clientes inscritos.
- **Aplicativo do Cidadão (React + Vite + Capacitor):** interface web onde o cidadão se inscreve em zonas de risco e recebe os alertas em tempo real.
- **Painel do Operador (TUI — Terminal User Interface):** interface de terminal de alta resiliência para o operador da Defesa Civil disparar alertas sem dependência de navegador ou rede gráfica.

---

## Tecnologias Escolhidas e Justificativas

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
- **Sem pontos únicos de falha intermediários:** não depende de servidor de frontend (Nginx/Cloudflare) — comunica-se diretamente com a API, reduzindo a cadeia de componentes que podem falhar.
- **Imunidade a incompatibilidades de navegador:** funciona em qualquer terminal POSIX, com inicialização instantânea e consistência visual absoluta independente do hardware do operador.

---

## Estrutura do repositório

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
├── client/                   # Aplicativo do Cidadão (React + Vite + Capacitor)
│   ├── android/              # Projeto Android gerado pelo Capacitor
│   ├── public/               # Arquivos estáticos públicos
│   └── src/
│       ├── app/              # Páginas da aplicação (Home, Zones, History)
│       ├── components/       # Componentes reutilizáveis da UI
│       ├── contexts/         # Contextos React (AlertContext, ZoneContext)
│       ├── hooks/            # Hooks customizados (useMqtt)
│       ├── requests/         # Cliente MQTT de linha de comando (receiveAlerts.ts)
│       ├── services/         # Serviços de API e conexão MQTT
│       └── assets/           # Imagens, ícones e recursos estáticos
├── operator/                 # Painel do Operador (TUI com blessed + blessed-contrib)
│   ├── cli/                  # Interface simplificada de linha de comando (readline)
│   └── src/
│       ├── components/       # Widgets da TUI (ZoneList, PushAlert, AlertHistory, Logs)
│       ├── config/           # Configuração da conexão MQTT
│       ├── pages/            # Páginas da TUI (loginPage, homePage)
│       ├── reqs/             # Requisições HTTP à API (login, sendAlert, getAlerts)
│       └── types/            # Tipos TypeScript da camada do operador
├── mosquitto/
│   └── config/
│       └── mosquitto.conf    # Configuração do broker Eclipse Mosquitto
├── .gitignore
├── docker-compose.yml        # Orquestra API + Mosquitto em contêineres
└── README.md
```

---

## Topologia da Árvore de Tópicos MQTT

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

## Protocolo de Comunicação

### Fluxo Geral

```
[Operador TUI]
      |
      | POST /alert (JSON)
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

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/alert` | Valida e publica um novo alerta |
| `GET` | `/historico` | Retorna alertas persistidos no SQLite |
| `GET` | `/health` | Health-check do servidor |

### Payload de Alerta (JSON)

```
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

## Como Rodar a Aplicação

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- [Node.js](https://nodejs.org/) >= 18 e npm

### 1. Clonar o Repositório

```
git clone https://github.com/ifelp/servico_alerta_dc.git
cd servico_alerta_dc
```

### 2. Configurar as variáveis de ambiente da API

Antes de subir os contêineres, crie o arquivo `.env` dentro da pasta `api/` com as seguintes variáveis:

```
# api/.env
PORT=3001
MQTT_URL=mqtt://mosquitto-eclipse:1883
SECRET=sua_chave_secreta_aqui
OP_LIST=["op1","op2"]          # IDs autorizados a fazer login no painel do operador
SENHA_DO_PROJETO_MANHATTAN=sua_chave_secreta_aqui   # mesma que SECRET
```

> `OP_LIST` deve ser um array JSON serializado como string. Os IDs listados são os únicos aceitos na tela de login do painel TUI.

### 3. Subir a API e o Broker (raiz do projeto)

Na **raiz** do repositório, suba o broker MQTT (Mosquitto) e a API com Docker Compose:

```
docker compose up --build
```

Isso inicializa:
- **Eclipse Mosquitto** (broker MQTT) nas portas `1883` (TCP) e `9001` (WebSocket)
- **API Gateway** (Express) na porta `3001`

Mantenha este terminal aberto — é nele que aparecem os logs da API e do broker.

> Verificação opcional: `curl http://localhost:3001/` deve responder `{"message":"Feito com <3 e :D no Cin!"}`.

---

## Rodando as duas interfaces de usuário

O sistema possui **duas interfaces** que operam em paralelo, cada uma voltada a um público diferente:

---

### Interface 1 — Aplicativo do Cidadão (React + Vite — Web)

A interface web do cidadão conecta-se ao broker Mosquitto via **WebSocket** (porta `9001`) e exibe alertas em tempo real para a zona selecionada pelo usuário.

Entre na pasta `client` e instale as dependências (apenas na primeira vez):

```
cd client
npm install
```

Inicie o servidor de desenvolvimento:

```
npm run dev
```

O Vite iniciará um servidor local, geralmente em `http://localhost:5173`. Abra esse endereço no navegador.

**Fluxo de uso na interface web:**

1. Ao abrir o app, o cidadão acessa a **tela inicial** (Home) com o status de conexão ao broker.
2. Navegue até a aba **Zonas** e selecione uma zona geográfica (ex.: `zona_a`). O app assina automaticamente o tópico `defesacivil/alertas/zona_a/#` via MQTT sobre WebSocket.
3. Alertas chegam **em tempo real** via Push: um popup aparece na tela assim que o operador dispara um alerta para a zona inscrita.
4. A aba **Histórico** exibe todos os alertas recebidos durante a sessão.

> Para simular múltiplos cidadãos em zonas distintas, basta abrir o app em abas ou janelas diferentes do navegador e selecionar zonas diferentes em cada uma.

#### Alternativa: cliente de linha de comando (terminal)

Se preferir testar a recepção de alertas sem a interface gráfica, o `client` também oferece um modo CLI que se conecta ao broker via TCP (porta `1883`):

```
# Na pasta client/ (com dependências já instaladas)
npm run client -- <zona>

# Exemplo: escutar alertas da zona_a
npm run client -- zona_a
```

Abra quantos terminais quiser, cada um com uma zona diferente:

```
npm run client -- zona_a   # terminal A
npm run client -- zona_b   # terminal B
npm run client -- zona_c   # terminal C
```

O cliente exibirá cada alerta recebido no formato:

```
----- ALERTA RECEBIDO -----
Topico: defesacivil/alertas/zona_a/deslizamento
Zona: zona_a
Categoria: deslizamento
Gravidade: ALTO
Descricao: Risco iminente na encosta...
Timestamp: 2026-06-14T20:30:00.000Z
---------------------------
```

---

### Interface 2 — Painel do Operador (TUI com blessed)

O painel do operador é uma **Terminal User Interface (TUI)** interativa construída com `blessed` e `blessed-contrib`. Permite ao operador da Defesa Civil autenticar-se, compor e disparar alertas com campos navegáveis via teclado, além de monitorar o histórico de alertas e os logs em tempo real — tudo sem sair do terminal.

Entre na pasta `operator` e instale as dependências (apenas na primeira vez):

```
cd operator
npm install
```

Crie o arquivo `.env` dentro de `operator/` com:

```
# operator/.env
SERVER_URL=http://localhost:3001
SENHA_DO_PROJETO_MANHATTAN=sua_chave_secreta_aqui   # mesma configurada na API
```

Inicie o painel:

```
npm run operator
```

**Fluxo de uso na TUI:**

1. **Tela de Login:** o operador informa o seu **Operador ID** (um dos IDs cadastrados em `OP_LIST` no `.env` da API). Credenciais inválidas exibem mensagem de erro sem abrir o dashboard.
2. **Dashboard principal:** após autenticação, o terminal exibe o layout completo com quatro painéis:
   - **Zone List** — lista de zonas disponíveis; use as setas ↑↓ para navegar e `Enter` para selecionar.
   - **Push Alert** — formulário de disparo com campos `Categoria`, `Gravidade` (botão toggle que alterna `BAIXO → MEDIO → ALTO` a cada `Enter`) e `Descrição`.
   - **Alert History** — histórico dos últimos alertas emitidos, atualizado automaticamente.
   - **Logs** — painel de logs com feedback em tempo real de cada requisição enviada à API.
3. **Disparar um alerta:**
   - Selecione a zona no painel **Zone List** e pressione `Enter`.
   - Preencha a **Categoria** (ex.: `deslizamento`) e pressione `Enter`.
   - Pressione `Enter` no botão **Gravidade** até atingir o nível desejado.
   - Preencha a **Descrição** do alerta.
   - Pressione `Enter` no botão **Enviar**. O painel de Logs confirmará `[OK] Alerta validado e publicado com sucesso!` ou exibirá o erro retornado pela API.
4. **Encerrar:** pressione `q`, `Escape` ou `Ctrl+C` para sair.

> **Atenção:** o painel TUI principal (`npm run operator`) requer um terminal com suporte a cores e controle de cursor (qualquer emulador moderno: iTerm2, Windows Terminal, GNOME Terminal, etc.). Se o ambiente não suportar a TUI completa, use a versão simplificada:
>
> ```
> npm run dev   # CLI readline, sem interface gráfica
> ```

---

## Demonstrando o modelo Push end-to-end

O roteiro abaixo demonstra o fluxo completo de Push usando as duas interfaces simultaneamente:

```
Terminal 1 (raiz)         → docker compose up --build           (API + Broker)
Terminal 2 (navegador)    → cd client && npm run dev             (Interface web do cidadão — selecionar zona_a)
Terminal 3 (operator)     → cd operator && npm run operator      (Painel TUI do operador)
```

**Passo a passo:**

1. **Terminal 1** — Suba a infraestrutura e aguarde as mensagens `Serviço de broker conectado com sucesso` e `App escutando na porta 3001`.
2. **Terminal 2 / Navegador** — Abra `http://localhost:5173`, vá em **Zonas** e selecione `zona_a`. O status de conexão deve mostrar **Conectado**.
3. **Terminal 3** — Inicie o painel do operador, faça login com um ID autorizado e, no dashboard, selecione `zona_a`, informe a categoria `deslizamento`, gravidade `ALTO` e uma descrição. Pressione **Enviar**.
4. **Resultado esperado:**
   - O **Log** no Terminal 3 exibe `[OK] [201] Alerta validado e publicado com sucesso!`
   - Na interface web (Terminal 2), o **popup de alerta** surge instantaneamente na tela do cidadão, exibindo zona, categoria, gravidade e descrição.
   - Cidadãos inscritos em outras zonas **não recebem** a mensagem — o Mosquitto roteia apenas para os subscribers do tópico correto.

Esse comportamento confirma o **modelo Push** implementado: o broker empurra o payload diretamente aos clientes conectados, sem qualquer polling ou refresh manual.

---

## Equipe 04

| Nome |
|---|
| Gabriel Fonseca |
| Guilherme Barbosa |
| Iranildo Felipe |
| Rodrigo de Andrade |
| Thiago Bernardo |
