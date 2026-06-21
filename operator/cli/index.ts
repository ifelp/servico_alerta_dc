import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } 
from "node:process";
import crypto from "node:crypto";
import axios from "axios";

// Reaproveitando a sua tipagem
type AlertPayload = {
  id?: string | number;
  zona?: string;
  categoria?: string;
  gravidade?: "BAIXO" | "MEDIO" | "ALTO" | string;
  descricao?: string;
  timestamp?: string;
};

const SERVER_URL = "http://localhost:3001/alert";

/**
 * Função responsável exclusivamente por enviar o payload ao servidor
 */
async function sendAlert(payload: AlertPayload) {
  console.log("\n[INFO] Disparando POST para o servidor...");
  
  try {
    const response = await axios.post(SERVER_URL, payload);
    console.log(`[OK] Alerta validado e publicado com sucesso!`);
    return response.data;
  } catch (error: any) {
    // O Axios joga erros HTTP para o catch, então precisamos extrair o body da resposta de erro
    if (error.response) {
      throw new Error(`HTTP ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error("Servidor não respondeu. O backend na porta 3001 está rodando?");
    } else {
      throw new Error(`Erro na requisição: ${error.message}`);
    }
  }
}

/**
 * Função responsável por gerenciar a entrada de dados do usuário (o "formulário")
 */
async function promptAlertForm() {
  const rl = readline.createInterface({ input, output });
  console.log("=== Sistema de Emissão de Alertas ===\n");

  try {
    const zona = await rl.question("📍 Zona (ex: zona_a): ");
    const categoria = await rl.question("🏷️  Categoria (ex: climatico): ");
    const gravidade = await rl.question("⚠️  Gravidade (BAIXO, MEDIO, ALTO): ");
    const descricao = await rl.question("📝 Descrição: ");

    const payload: AlertPayload = {
      id: crypto.randomUUID(),
      zona: zona.trim(),
      categoria: categoria.trim(),
      gravidade: gravidade.trim().toUpperCase() || "BAIXO",
      descricao: descricao.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("\n[INFO] Resumo do Payload montado:");
    console.log(payload);

    // Fim da digitação: chama a função de envio isolada
    await sendAlert(payload);

  } catch (error) {
    console.error("\n[ERRO] Falha no processo:", error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

// Inicia o formulário
promptAlertForm();