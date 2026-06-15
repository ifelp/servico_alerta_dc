import Header from "./ui/header";
import NavBar from "./ui/navBar";
import type { ReactNode } from "react";
import { unstable_useRouterState } from "react-router-dom";
import logo from '../assets/logo-defesa-civil.png'

interface PageWrapperProps{
    title?: string,
    children: ReactNode,
    showHeader?: boolean
}

export default function PageWrapper({ title, children, showHeader}: PageWrapperProps){
    const pathname = unstable_useRouterState().active.location.pathname

    return(
        <div className="min-h-screen w-full bg-[oklch(0.94_0.01_270)] flex items-center justify-center p-0 sm:p-6">
            <div className="relative w-full sm:max-w-[420px] min-h-screen sm:min-h-[860px] sm:rounded-[2.5rem] overflow-hidden bg-background sm:shadow-2xl sm:border sm:border-border flex flex-col">
                {showHeader && (
                    <Header title={title} logoUrl={logo}/>
                )}
                <main className="flex-1 overflow-y-auto pb-24">{children}</main>
                <NavBar selected={pathname}/>
            </div>
        </div>
    )
}