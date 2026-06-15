import type { ReactNode } from "react"

interface AlertsHistory{
    children: ReactNode
}

export default function AlertsHistory({children} : AlertsHistory){
    return (
        <ol className="relative mt-6 px-5 pb-4">
            <span className="absolute left-[34px] top-2 bottom-2 w-px bg-border"/>
            {children}
        </ol>
    )
}