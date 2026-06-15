import { createContext, useState, useCallback, useContext, type ReactNode } from "react";

interface ZoneContextType {
  currentZone: string | null;
  changeZone: (newZone: string) => void;
  initializeZone: (userZone: string) => void;
  resetZone: () => void;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const ZoneProvider = ({children} : {children: ReactNode}) => {
    const [currentZone, setCurrentZone] = useState<string | null>("zona_A");
    const [hasChanged, setHasChanged] = useState(false);

    const initializeZone = useCallback((userZone: string) => {
        if(!hasChanged && userZone){
            setCurrentZone(userZone);
        }
    }, [hasChanged]);

    const changeZone = (newZone: string) => {
        if(newZone !== currentZone){
            setCurrentZone(newZone)
            setHasChanged(true)
        }
    }

    const resetZone = () => {
        setCurrentZone(null)
        setHasChanged(false)
    }

    return (
        <ZoneContext.Provider value={{currentZone, changeZone, initializeZone, resetZone}}>
            {children}
        </ZoneContext.Provider>
    )
}
//eslint-disable-next-line
export const useZone = (): ZoneContextType => {

    const context = useContext(ZoneContext);
    if(context === undefined){
        throw new Error("Esse context deve ser usado dentro de um provider.");
    }

    return context
}