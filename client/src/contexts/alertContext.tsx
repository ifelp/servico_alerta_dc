import { createContext, useState, useCallback, useContext, useEffect, type ReactNode } from "react";
import type { AlertEntity } from "../types/Alert";
import client from "../services/mqttClient";
import { getAlerts } from "../requests/getAlerts";

interface AlertContextType {
  latestAlert: AlertEntity | null;
  popupAlert: AlertEntity | null;
  dismissPopup: () => void;
  alerts: AlertEntity[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children, zone }: { children: ReactNode; zone: string | null }) => {
  const [latestAlert, setLatestAlert] = useState<AlertEntity | null>(null);
  const [popupAlert, setPopupAlert] = useState<AlertEntity | null>(null);
  const [alerts, setAlerts] = useState<AlertEntity[]>([]);

  const dismissPopup = useCallback(() => setPopupAlert(null), []);

  useEffect(() => {
    if (!zone) return;

    const fetchAlerts = async() => {
      const response = await getAlerts(zone);
      setAlerts(response);
    }

    // const brokerUrl = import.meta.env.VITE_MQTT_URL ?? "ws://localhost:9001";
    const topic = `defesacivil/alertas/${zone}/#`;

    client.on("connect", () => client.subscribe(topic, { qos: 1 }, (err) => {
      if (!err) console.log(`🟩 Inscrito com sucesso na zona: ${zone}`);
    }));



    client.on("message", (_topic, payload) => {
      const raw = payload.toString();
      try {
        const parsed = JSON.parse(raw);
        const alert: AlertEntity = {
          id: parsed.id,
          payload_id: parsed.payload_id ?? crypto.randomUUID(),
          categoria: parsed.title ?? parsed.categoria ?? "Novo alerta",
          descricao: parsed.description ?? parsed.descricao ?? "",
          zona: parsed.zone ?? parsed.zona ?? zone,
          gravidade: parsed.severity ?? parsed.gravidade ?? "INFO",
          created_at: parsed.created_at,
          timestamp: parsed.issuedAt ?? parsed.timestamp ?? new Date().toISOString(),
        };
        setLatestAlert(alert);
        setPopupAlert(alert);
      } catch {
        console.error("Payload inválido:", raw);
      }
    });

    fetchAlerts();

    return () => { 
      client.removeAllListeners();
    };
  }, [zone]);

  return (
    <AlertContext.Provider value={{ latestAlert, popupAlert, dismissPopup, alerts }}>
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