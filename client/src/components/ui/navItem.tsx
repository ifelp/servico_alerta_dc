import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavItemProps{
    target: string,
    icon: ReactNode,
    label: string,
    selected: boolean
}

export default function NavItem({target, icon, label, selected = true}: NavItemProps){
    return (
        <Link
        to={target}
        className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
            selected ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
        >
            <div className={`relative ${selected ? "after:absolute after:-top-2 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:rounded-full after:bg-accent" : ""}`}>
                {icon}
            </div>
            <span className="text-[11px] font-display font-semibold uppercase tracking-wider">{label}</span>
        </Link>
    )
}