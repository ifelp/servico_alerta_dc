import { createContext, useState, useCallback, useContext, useEffect, type ReactNode } from "react";
// import mqtt from "mqtt";
import type { Alert } from "../types/Alert";
import client from "../services/mqttClient";

interface AlertContextType {
  latestAlert: Alert | null;
  popupAlert: Alert | null;
  dismissPopup: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children, zone }: { children: ReactNode; zone: string | null }) => {
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);
  const [popupAlert, setPopupAlert] = useState<Alert | null>(null);

  const dismissPopup = useCallback(() => setPopupAlert(null), []);

  useEffect(() => {
    if (!zone) return;

    // const brokerUrl = import.meta.env.VITE_MQTT_URL ?? "ws://localhost:9001";
    const topic = `defesacivil/alertas/${zone}/#`;

    client.on("connect", () => client.subscribe(topic, { qos: 1 }, (err) => {
      if (!err) console.log(`🟩 Inscrito com sucesso na zona: ${zone}`);
    }));

    client.on("message", (_topic, payload) => {
      const raw = payload.toString();
      try {
        const parsed = JSON.parse(raw);
        const alert: Alert = {
          id: parsed.id ?? crypto.randomUUID(),
          title: parsed.title ?? parsed.categoria ?? "Novo alerta",
          description: parsed.description ?? parsed.descricao ?? "",
          zone: parsed.zone ?? parsed.zona ?? zone,
          severity: parsed.severity ?? parsed.gravidade ?? "INFO",
          type: parsed.type ?? "info",
          issuedAt: parsed.issuedAt ?? parsed.timestamp ?? new Date().toISOString(),
        };
        setLatestAlert(alert);
        setPopupAlert(alert);
      } catch {
        console.error("Payload inválido:", raw);
      }
    });

    return () => { 
      client.removeAllListeners();
    };
  }, [zone]);

  return (
    <AlertContext.Provider value={{ latestAlert, popupAlert, dismissPopup }}>
      {children}
    </AlertContext.Provider>
  );
};

//eslint-disable-next-line
export const useAlert = (): AlertContextType => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert deve ser usado dentro de AlertProvider");
  return ctx;
};