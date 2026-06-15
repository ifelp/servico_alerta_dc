interface HeaderProps{
    title?: string,
    logoUrl: string 
}

export default function Header({title, logoUrl} : HeaderProps){
    return (
        <header className="shrink-0 gradient-primary text-primary-foreground px-5 pt-6 pb-5 flex items-center gap-3 z-10">
            <img src={logoUrl} alt="Defesa Civil Pernambuco" className="w-11 h-11 rounded-full bg-white p-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80 font-display">Defesa Civil · PE</p>
              <h1 className="font-display text-xl font-bold leading-tight truncate">
                {title ?? "Alerta Cidadão"}
              </h1>
            </div>
        </header>
    )
}