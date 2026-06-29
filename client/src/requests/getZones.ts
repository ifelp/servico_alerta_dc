import api from "../services/api";

interface Zone{
    id: number,
    name: string,
    label: string
}

export const getAllZones = async() => {
    try{
        const response = await api.get('/zone')
        console.log(response.data)
        return response.data as Zone[]

    } catch(err){
        console.error(err);
        return []
    }
}