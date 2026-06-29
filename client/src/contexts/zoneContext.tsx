import { createContext, useState, useCallback, useContext, type ReactNode, useEffect } from "react";
import { getAllZones } from "../requests/getZones";

interface Zone{
    id: number,
    name: string,
    label: string
}

interface ZoneContextType {
  currentZone: string | null;
  changeZone: (newZone: string) => void;
  initializeZone: (userZone: string) => void;
  resetZone: () => void;
  zones: Zone[];
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const ZoneProvider = ({children} : {children: ReactNode}) => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [currentZone, setCurrentZone] = useState<string | null>("zona_A");
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        const getZns = async() => {
            const response = await getAllZones();
            setZones(response);
        }

        getZns();
    }, [])

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
        <ZoneContext.Provider value={{currentZone, changeZone, initializeZone, resetZone, zones}}>
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