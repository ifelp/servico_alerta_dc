export const RISK_ZONES = ["zona_A", "zona_B", "zona_C"] as const;
export const ALERT_TYPES = ["chuva", "deslizamento", "enchente", "vento"] as const;

export type RiskZone = (typeof RISK_ZONES)[number];
export type AlertType = (typeof ALERT_TYPES)[number];

export const MQTT_BASE_TOPIC = "dc";

export function isRiskZone(value: string | undefined): value is RiskZone {
  return !!value && RISK_ZONES.includes(value as RiskZone);
}

export function isAlertType(value: string | undefined): value is AlertType {
  return !!value && ALERT_TYPES.includes(value as AlertType);
}

export function buildTopic(zone: RiskZone, type: AlertType): string {
  return `${MQTT_BASE_TOPIC}/${zone}/${type}`;
}

export function buildZoneTopic(zone: RiskZone): string {
  return `${MQTT_BASE_TOPIC}/${zone}/+`;
}

export function buildTypeTopic(type: AlertType): string {
  return `${MQTT_BASE_TOPIC}/+/${type}`;
}

export function buildAllTopics(): string {
  return `${MQTT_BASE_TOPIC}/+/+`;
}

export function buildControlTopic(clientId: string): string {
  return `${MQTT_BASE_TOPIC}/control/${clientId}`;
}

export function parseControlTopic(topic: string): string | null {
  const parts = topic.split("/");

  if (parts.length !== 4) {
    return null;
  }

  const [base, section, clientId] = parts;

  if (base !== MQTT_BASE_TOPIC || section !== "control" || !clientId) {
    return null;
  }

  return clientId;
}

export function parseTopic(
  topic: string
): { base: string; zone: RiskZone; type: AlertType } | null {
  const parts = topic.split("/");

  if (parts.length !== 3) {
    return null;
  }

  const [base, zone, type] = parts;

  if (base !== MQTT_BASE_TOPIC) {
    return null;
  }

  if (!isRiskZone(zone) || !isAlertType(type)) {
    return null;
  }

  return { base, zone, type };
}