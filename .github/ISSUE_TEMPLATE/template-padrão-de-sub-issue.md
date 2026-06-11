---
name: Template padrão de sub-issue
about: Este template serve para criar um esqueleto markdown para sub-issues.
title: "[SUB #N]"
labels: ''
assignees: ''

---

## 🔗 Conectado à Issue Principal: #Número_da_Issue

## 🎯 O que precisa ser feito?
Descrição direta e sem enrolação da tarefa técnica ou do bug que está quebrando o sistema.

### 💻 Lista de To-Do
- [ ] Alterar o arquivo `src/...` para adicionar o timeout de conexão.
- [ ] Criar o loop de *heartbeat* para checar se o nó vizinho está vivo.
- [ ] Adicionar logs limpos no console (pra gente saber o que tá acontecendo no meio do caos).

---

## 🔥 Critério de Pronto (DoD de Universitário)
- [ ] O código compila sem erros.
- [ ] Rodou local na minha máquina e não crashou de cara.
- [ ] Não deixei nenhuma senha ou IP fixo (hardcoded) no código.
