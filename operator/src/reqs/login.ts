import axios, { AxiosError } from "axios";
import { message } from "blessed";
import { error } from "node:console";

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001'

export default async function Login(id: string){
    try{
        const response = await axios.post(`${SERVER_URL}/op-login`, {
            id: id
        })

        return {
            auth: true,
            message: 'Operador autorizado.'
        }
    } catch(error: any){
        const err = error as AxiosError;
        if(err.response?.status === 401){
            return {
                auth: false,
                message: 'Usuário não autorizado.'
            }
        }
        else return {
            auth: false,
            message: 'Erro durante login, tente novamente.'
        }
    }
}