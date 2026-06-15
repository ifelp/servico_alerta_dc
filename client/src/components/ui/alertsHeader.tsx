import { Link } from "react-router-dom"

export default function HomeAlertsHeader(){
    return (
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Alertas recentes
            </h3>
            <Link to="/historico" className="text-xs font-display font-semibold text-primary hover:underline">
                Ver tudo
            </Link>
        </div>
    )
}