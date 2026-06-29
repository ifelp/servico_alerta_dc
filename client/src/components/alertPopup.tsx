import { useEffect, useRef } from "react";
import { useAlert } from "../contexts/alertContext";

export default function AlertPopup() {
  const { popupAlert, dismissPopup } = useAlert();
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!popupAlert) return;

    // Som
    try {
      audioRef.current = new AudioContext();
      const osc = audioRef.current.createOscillator();
      osc.connect(audioRef.current.destination);
      osc.frequency.setValueAtTime(880, audioRef.current.currentTime);
      osc.start();
      osc.stop(audioRef.current.currentTime + 0.4);
    } catch { return }

    // Vibração (mobile)
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);

  }, [popupAlert]);

  if (!popupAlert) return null;

  const bgByseverity: Record<string, string> = {
    ALTO: "bg-red-600",
    MEDIO: "bg-orange-500",
    BAIXO: "bg-yellow-400",
    INFO: "bg-blue-500",
    OK: "bg-green-500",
  };
  const bg = bgByseverity[popupAlert.gravidade] ?? "bg-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${bg} text-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-xl`}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1">⚠ Alerta recebido</p>
        <h2 className="text-lg font-bold mb-2">{popupAlert.categoria}</h2>
        <p className="text-sm mb-4">{popupAlert.descricao}</p>
        <button
          onClick={dismissPopup}
          className="w-full py-2 bg-white text-black font-semibold rounded-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}