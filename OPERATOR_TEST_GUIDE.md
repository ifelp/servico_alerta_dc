# 🧪 Guia de Teste - Operador

## 📋 Pré-requisitos

1. **Docker e Docker Compose** instalados
2. **Node.js/npm ou pnpm** instalados
3. **Ter implementado o servidor** conforme [OPERADOR_MESSAGE_STRUCTURE.md](../api/OPERADOR_MESSAGE_STRUCTURE.md)

## 🚀 Passo 1: Iniciar Infraestrutura

### Terminal 1 - Broker MQTT e Servidor API

```bash
# Na raiz do projeto
docker compose up

# Isso vai subir:
# - Mosquitto (broker MQTT) na porta 1883
# - API Express na porta 3000
```

Aguarde até ver mensagens como:
```
✅ Serviço de broker conectado com sucesso.
✅ Servidor Express rodando na porta 3000
```

## 🚀 Passo 2: Instalar Dependências do Operador

### Terminal 2 - Instalar Operador

```bash
cd operador
pnpm install
# ou: npm install
```

## 🧪 Passo 3: Executar Testes

### Teste 1: Exemplo Básico

```bash
npm run example
```

**O que esperar:**
- ✅ 3 mensagens publicadas com sucesso
- ✅ Logs mostrando os tópicos e timestamps
- ✅ Resposta HTTP 201 (Created)

**Saída esperada:**
```
[OPERADOR] OperatorClient inicializado com servidor: http://localhost:3000
[OPERADOR] Verificando conexão com servidor...
[OPERADOR] Health check OK
✅ Servidor está online

=== EXEMPLO 1: Sensor de Temperatura ===
[OPERADOR] Enviando mensagem para tópico: sensores/temperatura/sala1
[OPERADOR] Mensagem publicada com sucesso!
✅ Mensagem publicada: sensores/temperatura/sala1
...
```

---

### Teste 2: Exemplo Avançado

```bash
npm run example:advanced
```

**O que esperar:**
- ✅ Mensagem validada sem publicar
- ✅ 5 mensagens em batch
- ✅ 5 leituras contínuas de sensor
- ✅ 1 mensagem com timestamp customizado

**Saída esperada:**
```
=== EXEMPLO 1: Validar Mensagem ===
[OPERADOR] Validando mensagem para tópico: sensores/movimento/entrada
✅ Validação bem-sucedida

=== EXEMPLO 2: Envio em Batch ===
✅ Publicadas 5 mensagens no batch

=== EXEMPLO 3: Simulação de Sensor em Tempo Real ===
📊 Leitura 1: 22.45°C publicada
📊 Leitura 2: 22.38°C publicada
...
```

---

### Teste 3: Serviço Contínuo

```bash
npx tsx src/examples/continuousSensorExample.ts
```

**O que esperar:**
- ✅ 4 sensores sendo monitorados (2 temperatura, 2 umidade)
- ✅ Leituras coletadas a cada 10 segundos
- ✅ Mensagens publicadas continuamente
- ✅ Para automaticamente após 60 segundos

**Saída esperada:**
```
╔════════════════════════════════════════════════════╗
║  EXEMPLO: Serviço de Sensor Contínuo              ║
║  Monitora múltiplos sensores continuamente         ║
╚════════════════════════════════════════════════════╝

🔗 Verificando conexão com servidor...
✅ Conectado ao servidor!

📡 Registrando sensores...
📊 Coletando leituras iniciais...
🌡️  sala1: 22.34°C (normal)
💧 cozinha: 59.87% (ok)
...

⏰ [14:30:25] Coletando leituras...
🌡️  sala1: 22.45°C (normal)
🌡️  sala2: 20.98°C (normal)
💧 cozinha: 61.23% (ok)
💧 banheiro: 73.45% (umido)
```

---

## 📡 Passo 4: Validar no Broker

Enquanto o operador envia mensagens, abra outro terminal para validar recebimento:

### Terminal 3 - Validar Recebimento no Broker

```bash
# Entrar no container do broker
docker exec -it mosquitto-eclipse mosquitto_sub -t "sensores/#" -h localhost

# Ou para um tópico específico:
docker exec -it mosquitto-eclipse mosquitto_sub -t "sensores/temperatura/sala1" -h localhost
```

**O que esperar:**
- ✅ Mensagens JSON sendo recebidas
- ✅ Mensagens no tópico correto
- ✅ Timestamps ISO 8601

**Exemplo de mensagem recebida:**
```json
{"topico":"sensores/temperatura/sala1","timestamp":"2026-06-20T14:30:25.123Z","payload":{"temperatura":22.34,"unidade":"Celsius","sensor_id":"TEMP001"}}
```

---

### Testar Múltiplos Tópicos Simultaneamente

```bash
# Terminal 3A - Escuta temperatura
docker exec -it mosquitto-eclipse mosquitto_sub -t "sensores/temperatura/#" -h localhost

# Terminal 3B - Escuta umidade
docker exec -it mosquitto-eclipse mosquitto_sub -t "sensores/umidade/#" -h localhost

# Terminal 3C - Escuta dispositivos
docker exec -it mosquitto-eclipse mosquitto_sub -t "dispositivos/#" -h localhost
```

---

## 🧪 Passo 5: Teste Manual com cURL

### Test 1: Health Check

```bash
curl http://localhost:3000/api/operador/health
```

**Resposta esperada (200):**
```json
{
  "status": "ok",
  "mensagem": "Serviço do Operador está operacional."
}
```

---

### Test 2: Validar Mensagem

```bash
curl -X POST http://localhost:3000/api/operador/validate \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/manual",
    "payload": {
      "teste": true,
      "valor": 42
    }
  }'
```

**Resposta esperada (200):**
```json
{
  "mensagem": "Mensagem validada com sucesso.",
  "estrutura": {
    "topico": "test/manual",
    "timestamp": "2026-06-20T14:35:00.123Z",
    "payloadKeys": ["teste", "valor"],
    "payloadSize": "28 bytes"
  }
}
```

---

### Test 3: Publicar Mensagem

```bash
curl -X POST http://localhost:3000/api/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/manual",
    "payload": {
      "teste": true,
      "valor": 42
    }
  }'
```

**Resposta esperada (201):**
```json
{
  "mensagem": "Mensagem recebida e publicada com sucesso no broker.",
  "topico": "test/manual",
  "timestamp": "2026-06-20T14:35:00.123Z",
  "payload": {
    "teste": true,
    "valor": 42
  }
}
```

---

### Test 4: Erro - Tópico Vazio

```bash
curl -X POST http://localhost:3000/api/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "",
    "payload": {"teste": true}
  }'
```

**Resposta esperada (400):**
```json
{
  "erro": "Campo \"topico\" não pode estar vazio."
}
```

---

### Test 5: Erro - Payload Vazio

```bash
curl -X POST http://localhost:3000/api/operador/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topico": "test/error",
    "payload": {}
  }'
```

**Resposta esperada (400):**
```json
{
  "erro": "Campo \"payload\" não pode estar vazio."
}
```

---

## ✅ Checklist de Validação

Marque cada item conforme vai testando:

- [ ] **Health Check**: API respondendo em http://localhost:3000/api/operador/health
- [ ] **Validação**: POST `/validate` retorna 200 com validação bem-sucedida
- [ ] **Publicação**: POST `/publish` retorna 201 com confirmação
- [ ] **Broker**: Mosquitto recebendo mensagens nos tópicos corretos
- [ ] **Exemplo Básico**: 3 mensagens publicadas com sucesso
- [ ] **Exemplo Avançado**: 5 batch + 5 leituras + timestamp customizado
- [ ] **Serviço Contínuo**: 4 sensores monitorados continuamente
- [ ] **cURL**: Testes manuais funcionando
- [ ] **Múltiplos Tópicos**: Mensagens indo para tópicos corretos (validado no broker)
- [ ] **Tratamento de Erros**: Erros 400 sendo retornados corretamente

---

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED - Conexão recusada"

**Causa:** Servidor não está rodando

**Solução:**
```bash
# Verificar se Docker Compose está ativo
docker ps

# Se não estiver, reiniciar
docker compose up
```

---

### Erro: "Broker MQTT não está conectado"

**Causa:** API não conseguiu conectar ao Mosquitto

**Solução:**
```bash
# Verificar logs do Docker
docker compose logs mosquitto-eclipse

# Reiniciar tudo
docker compose down
docker compose up
```

---

### Mensagens não aparecem no broker

**Causa:** Tópico incorreto ou mensagem não publicada

**Solução:**
1. Verifique o tópico (case-sensitive)
2. Verifique se o payload contém ao menos 1 campo
3. Veja os logs da API: `docker compose logs api`

---

### Timeout na publicação

**Causa:** Servidor lento ou indisponível

**Solução:**
```bash
# Aumentar timeout no cliente
client = new OperatorClient({
    serverUrl: 'http://localhost:3000',
    timeout: 10000  // 10 segundos
});
```

---

## 📊 Resultado Esperado Final

Quando tudo funciona corretamente:

```
Terminal 1 (Docker):
✅ Broker conectado
✅ API rodando
✅ Banco de dados inicializado

Terminal 2 (Operador):
✅ 15+ mensagens publicadas
✅ Sem erros de conexão
✅ Timestamps corretos

Terminal 3 (Validação):
✅ Mensagens JSON recebidas
✅ Tópicos corretos
✅ Payloads dinâmicos variados
```

---

## 📝 Próximos Passos

Após validar tudo:
1. Implementar persistência de alertas no banco de dados
2. Criar subscribers para escutar tópicos
3. Implementar regras de processamento de alertas
4. Integrar com interface frontend (React)
