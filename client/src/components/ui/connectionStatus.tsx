export default function ConnectionStatus(){
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span className="w-2 h-2 rounded-full bg-(--color-success) animate-pulse" />
          <span className="font-display font-semibold uppercase tracking-wider">Conectado · MQTT</span>
        </div>
    )
}