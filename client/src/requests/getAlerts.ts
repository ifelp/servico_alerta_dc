import api from "../services/api";
import { type AlertEntity } from "../types/Alert";

export const getAlerts = async(currentZone: string) => {
    try{
        const response = await api.get(`/alert/zona/${currentZone}`);
        return response.data as AlertEntity[] || [];
    } catch(err){
        console.error(err)
        return [];
    }
}
