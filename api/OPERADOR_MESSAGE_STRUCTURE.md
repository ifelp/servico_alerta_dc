# 📡 Documentação - Estrutura de Mensagem do Operador

## 📋 Resumo

Este documento descreve a estrutura de mensagens que o **Operador** envia para o servidor, bem como os endpoints disponíveis para publicação e validação.

---

## 🔧 Estrutura da Mensagem (Payload)

A mensagem do Operador segue a seguinte estrutura JSON:

```json
{
  "topico": "sensor/temperatura/sala1",
  "timestamp": "2026-06-20T12:57:00Z",
  "payload": {
    "valor": 24.5,
    "status": "normal"
  }
}
```

### Campos:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `topico` | string | ✅ Sim | Identificador do tópico MQTT para publicação. Não pode estar vazio. |
| `timestamp` | string | ❌ Não | Data/hora em formato ISO 8601. Se omitido, o servidor gera automaticamente com a data/hora atual. |
| `payload` | object | ✅ Sim | Objeto contendo os dados dinâmicos da mensagem. Deve conter pelo menos um campo. |

---

## 🌐 Endpoints

### 1️⃣ Publicar Mensagem

**Endpoint:** `POST /operador/publish`

Recebe a mensagem, valida, e a publica no broker MQTT.

#### Request:
```bash
curl -X POST http://localhost:3000/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "sensor/temperatura/sala1",
    "timestamp": "2026-06-20T12:57:00Z",
    "payload": {
      "valor": 24.5,
      "status": "normal"
    }
  }'
```

#### Response (Sucesso - 201):
```json
{
  "mensagem": "Mensagem recebida e publicada com sucesso no broker.",
  "topico": "sensor/temperatura/sala1",
  "timestamp": "2026-06-20T12:57:00Z",
  "payload": {
    "valor": 24.5,
    "status": "normal"
  }
}
```

#### Response (Erro - 400):
```json
{
  "erro": "Campo \"topico\" é obrigatório e deve ser uma string."
}
```

---

### 2️⃣ Validar Mensagem

**Endpoint:** `POST /operador/validate`

Apenas valida a mensagem **sem publicar** no broker. Útil para testes.

#### Request:
```bash
curl -X POST http://localhost:3000/operador/validate \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "sensor/umidade/cozinha",
    "payload": {
      "umidade": 65.3,
      "status": "ok"
    }
  }'
```

#### Response (Sucesso - 200):
```json
{
  "mensagem": "Mensagem validada com sucesso.",
  "estrutura": {
    "topico": "sensor/umidade/cozinha",
    "timestamp": "2026-06-20T13:00:00Z",
    "payloadKeys": ["umidade", "status"],
    "payloadSize": "28 bytes"
  }
}
```

---

### 3️⃣ Health Check

**Endpoint:** `GET /operador/health`

Verifica se o serviço do Operador está operacional.

#### Request:
```bash
curl http://localhost:3000/operador/health
```

#### Response (Sucesso - 200):
```json
{
  "status": "ok",
  "mensagem": "Serviço do Operador está operacional."
}
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Sensor de Temperatura

```json
{
  "topico": "sensores/temperatura/sala1",
  "timestamp": "2026-06-20T14:30:45Z",
  "payload": {
    "temperatura": 22.5,
    "unidade": "Celsius",
    "sensor_id": "TEMP001"
  }
}
```

### Exemplo 2: Sensor de Movimento

```json
{
  "topico": "sensores/movimento/entrada",
  "payload": {
    "movimento_detectado": true,
    "intensidade": 95,
    "timestamp_local": 1687273200
  }
}
```

### Exemplo 3: Status de Dispositivo

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

---

## ✅ Validações Aplicadas

O servidor valida as mensagens conforme os critérios abaixo:

1. **Campo `topico`:**
   - Obrigatório
   - Deve ser uma string
   - Não pode estar vazio
   - Sem espaços em branco apenas

2. **Campo `timestamp`:**
   - Opcional (gerado automaticamente se omitido)
   - Deve estar em formato ISO 8601
   - Exemplo válido: `2026-06-20T12:57:00Z` ou `2026-06-20T12:57:00+02:00`

3. **Campo `payload`:**
   - Obrigatório
   - Deve ser um objeto JSON (não array)
   - Não pode estar vazio
   - Pode conter qualquer número de campos com qualquer tipo de dado

---

## 🔄 Fluxo de Processamento

```
┌─────────────────────────────────────────────────────┐
│ Operador envia mensagem para /operador/publish      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ OperatorController recebe requisição                │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ OperatorService valida e processa mensagem          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ OperatorModel formata e valida estrutura            │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │ Validação passa?  │
        └─────────┬─────────┘
         Sim ▼               Não ▼
         ┌──────────────────────────┐
         │ Publica no broker MQTT   │  Retorna erro 400
         │ no tópico especificado   │
         └──────────────────────────┘
```

---

## 🧪 Teste Manual com cURL

### Teste 1: Publicar com timestamp automático
```bash
curl -X POST http://localhost:3000/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/message",
    "payload": {"teste": true}
  }'
```

### Teste 2: Publicar com timestamp customizado
```bash
curl -X POST http://localhost:3000/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/message",
    "timestamp": "2026-06-20T15:00:00Z",
    "payload": {"teste": true, "valor": 42}
  }'
```

### Teste 3: Validar antes de publicar
```bash
curl -X POST http://localhost:3000/operador/validate \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/invalid",
    "payload": {}
  }'
```

---

## 🐛 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `"Campo \"topico\" é obrigatório"` | Campo `topico` não foi enviado | Adicione o campo `topico` com uma string válida |
| `"Campo \"topico\" não pode estar vazio"` | Campo `topico` está vazio ou com apenas espaços | Verifique o valor do `topico` |
| `"Campo \"timestamp\" deve estar em formato ISO 8601"` | Timestamp em formato inválido | Use formato ISO 8601: `YYYY-MM-DDTHH:mm:ssZ` |
| `"Campo \"payload\" é obrigatório"` | Campo `payload` não foi enviado | Adicione um objeto JSON em `payload` |
| `"Campo \"payload\" não pode estar vazio"` | Campo `payload` é um objeto vazio `{}` | Adicione pelo menos um campo ao `payload` |
| `"Broker MQTT não está conectado"` | Broker não foi inicializado | Verifique se o broker MQTT está rodando |

---

## 📚 Referências

- [RFC 3339 - ISO 8601 Timestamp Format](https://tools.ietf.org/html/rfc3339)
- [MQTT Topic Naming Convention](https://www.hivemq.com/article/mqtt-topic-tree-structure-best-practices-naming-conventions/)
- [JSON Standard](https://www.json.org/)

