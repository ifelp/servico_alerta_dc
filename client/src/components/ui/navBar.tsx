import NavItem from "./navItem";
import { 
    Home,
    Bell,
    MapPin
 } from "lucide-react";

interface NavBarProps{
    selected: string
}

export default function NavBar({ selected } : NavBarProps){
    return(
        <nav className="absolute bottom-0 inset-x-0 bg-card border-t border-border px-2 pt-2 pb-3 flex justify-around">
          <NavItem target="/" icon={<Home className="w-5 h-5" />} label="Início" selected={selected === "/"} />
          <NavItem target="/historico" icon={<Bell className="w-5 h-5" />} label="Histórico" selected={selected.startsWith("/historico")} />
          <NavItem target="/zona" icon={<MapPin className="w-5 h-5" />} label="Zona" selected={selected.startsWith("/zona")} />
        </nav>
    )
}