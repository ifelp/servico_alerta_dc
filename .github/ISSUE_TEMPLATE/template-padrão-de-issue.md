---
name: Template padrão de Issue
about: Este template serve para criar um esqueleto markdown de Issue.
title: "[TIPO DA ISSUE]"
labels: ''
assignees: ''

---

## 🚀 Módulo: [Nome do Componente/Serviço]

### 📝 Resumo da Ópera
O que este componente precisa fazer no nosso sistema distribuído? 
*(Ex: "Este será o servidor de nomes (Naming Server) que vai gerenciar o IP de todos os nós ativos").*

### ⚙️ Arquitetura e Comunicação
- **Protocolo/Tecnologia:** ( ) gRPC | ( ) Sockets TCP/UDP | ( ) HTTP/REST | ( ) Outro: ______
- **Quem fala com quem?** O nó `X` vai mandar mensagem pro nó `Y` quando acontecer `Z`.

---

## 🛠️ Checklist de Implementação (Sub-issues)
*Divida o peso para ninguém carregar o grupo nas costas. Crie as sub-issues e linke o `#Número` delas aqui.*

- [ ] #SubIssue_Aqui - Criar a estrutura de dados/mensagens (Protobuf ou JSON)
- [ ] #SubIssue_Aqui - Implementar a lógica do servidor/receptor
- [ ] #SubIssue_Aqui - Implementar a lógica do cliente/emissor
- [ ] Tratar concorrência (Mutex/Semáforos) para evitar Race Condition

---

## 🧪 Como testar essa budega?
Para garantir que o módulo funciona antes de juntar tudo no repositório principal:
1. Rodar o comando: `instrução de build/run`
2. Simular o cenário: *(Ex: Matar o processo do nó principal e ver se o secundário assume).*
