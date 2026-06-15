import type { ReactNode } from "react"

interface SuperSevBadgeProps{
    label: string,
    ring: string,
    icon: ReactNode
    sub: string,
    children: ReactNode
}

export default function SuperSevBadge({label, ring, icon, sub, children} : SuperSevBadgeProps) {
    return(
        <div className="flex flex-col items-center text-center fade-in-up">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center ${ring}`}>
                {icon}
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold text-foreground">{label}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">{sub}</p>
            {children}
        </div>
    )
}