import * as p from '@clack/prompts'
import chalk from 'chalk';
import { defesacivilbanner } from "../assets/banner";

export async function loginHero() {
    console.clear();
    try{
        const banner = await defesacivilbanner();

        console.log(chalk.bold(banner));
        console.log(chalk.gray("Sistema de Operador para Alertas da Defesa Civil\n"));
    } catch(err: any){
        console.log("Erro: ", err.message)
    }
}   

