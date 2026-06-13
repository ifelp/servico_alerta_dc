import { RiskZone } from "./topics";

const zoneSubscribers = new Map<RiskZone, Set<string>>();

export function addSubscriber(zone: RiskZone, clientId: string): void {
  if (!zoneSubscribers.has(zone)) {
    zoneSubscribers.set(zone, new Set());
  }

  zoneSubscribers.get(zone)!.add(clientId);
}

export function removeSubscriber(zone: RiskZone, clientId: string): void {
  const subscribers = zoneSubscribers.get(zone);

  if (!subscribers) {
    return;
  }

  subscribers.delete(clientId);

  if (subscribers.size === 0) {
    zoneSubscribers.delete(zone);
  }
}

export function getSubscribers(zone: RiskZone): string[] {
  return Array.from(zoneSubscribers.get(zone) ?? []);
}

export function getAllZoneSubscribers(): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [zone, subscribers] of zoneSubscribers.entries()) {
    result[zone] = Array.from(subscribers);
  }

  return result;
}

export function clearSubscribers(): void {
  zoneSubscribers.clear();
}

export function isSubscribed(zone: RiskZone, clientId: string): boolean {
  return zoneSubscribers.get(zone)?.has(clientId) ?? false;
}