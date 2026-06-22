import { Request, Response, NextFunction } from "express";

const vermelho = '\x1b[1;31m';
const verde = '\x1b[1;32m';
const amarelo = '\x1b[1;33m';
const reset = '\x1b[0m';

export const loggingHandler = (req: Request, res: Response, next: NextFunction) => {
    const time = new Date().toLocaleString('pt-br', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');

    console.log('='.repeat(50))
    console.log(`\n${vermelho}HOST ${req.hostname}${reset}`)
    console.log(`${verde}[${time}] => ${req.method} ${req.url}${reset}`)
    
    if(['POST'].includes(req.method)){
        if(Object.keys(req.body).length > 0){
            console.log(`${amarelo}[PAYLOAD RECEBIDO]:${reset}\n`, req.body);
        }
        else{
            console.log("Nenhum payload na requisição.");
        }
    }
    console.log("=".repeat(50), '\n');

    next();
}
