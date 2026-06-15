interface ZoneButtonFooterProps{
    handleConfirm: () => void,
    confirming: boolean,
}

export default function ZoneButtonFooter({handleConfirm, confirming} : ZoneButtonFooterProps){
    return (
        <div className="px-5 mt-8">
            <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-display font-bold uppercase tracking-wider text-sm shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-70"
            >
            {confirming ? "Inscrevendo no broker…" : "Confirmar zona"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-3">
            Você pode alterar a qualquer momento.
            </p>
      </div>
    )
}