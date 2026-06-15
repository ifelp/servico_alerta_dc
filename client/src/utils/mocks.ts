import type { Alert } from "../types/Alert";

export const ZONES = [
  { id: "zona_A", label: "Zona A — Recife Centro" },
  { id: "zona_B", label: "Zona B — Olinda Alto" },
  { id: "zona_C", label: "Zona C — Jaboatão" },
  { id: "zona_D", label: "Zona D — Cabo de Santo Agostinho" },
  { id: "zona_E", label: "Zona E — Paulista" },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Risco crítico de deslizamento",
    description: "Acúmulo de chuva nas últimas 24h ultrapassou 120mm. Evacuação preventiva recomendada nas encostas do setor leste.",
    zone: "zona_A",
    severity: "ALTO",
    type: "deslizamento",
    issuedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "a2",
    title: "Atenção: chuvas intensas previstas",
    description: "Previsão de 60–80mm de chuva entre 18h e 23h. Evite áreas alagáveis e mantenha-se em local seguro.",
    zone: "zona_A",
    severity: "MEDIO",
    type: "chuva",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "a3",
    title: "Inundação em vias do bairro",
    description: "Av. Conde da Boa Vista parcialmente alagada. Trânsito desviado pela Rua do Hospício.",
    zone: "zona_A",
    severity: "MEDIO",
    type: "inundacao",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: "a4",
    title: "Comunicado: simulado de evacuação",
    description: "Simulado de evacuação programado para sábado às 9h. Participação voluntária.",
    zone: "zona_A",
    severity: "INFO",
    type: "info",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "a5",
    title: "Ventos fortes encerrados",
    description: "Alerta de vendaval cancelado. Condições normalizadas.",
    zone: "zona_A",
    severity: "OK",
    type: "vento",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "b1",
    title: "Atenção: maré alta",
    description: "Maré de 2.4m prevista para 16h. Evite a orla.",
    zone: "zona_B",
    severity: "MEDIO",
    type: "inundacao",
    issuedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];