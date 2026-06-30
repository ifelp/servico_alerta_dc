import axios, { AxiosError, AxiosResponse } from "axios";
import { AlertPayload } from "../types/Alert";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001/alert"
const KEY = process.env.SENHA_DO_PROJETO_MANHATTAN || '';

export async function sendAlert(payload: AlertPayload, kidnapLog: (log: string) => void) {
  
  kidnapLog("[INFO] Disparando POST para o servidor...");
  
  try {
    kidnapLog(`Url da env: ${process.env.SERVER_URL} e da const ${SERVER_URL}`);
    const response = await axios.post(`${SERVER_URL}/alert`, payload, {
        headers: {
            'mega-senha': KEY
        }
    });
    kidnapLog(`[OK] [${response.status}] Alerta validado e publicado com sucesso!`);
    return response.data;
  } catch (error: any) {
    const err = error as AxiosError;
    if (err.response) {
      kidnapLog(`[ERROR] [${err.response.status}] - ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      kidnapLog(`[ERROR] [] - Servidor está inalcançável ou offline.`)
    } else {
      kidnapLog(`[ERROR] - ${error.message}`)
    }
  }
}