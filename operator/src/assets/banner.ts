import terminalImage from "terminal-image"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoImg = path.join(__dirname,'logo-defesa-civil.png');

export async function defesacivilbanner() {

    try{
        const banner = await terminalImage.file(caminhoImg, {
            width: 70,
            preserveAspectRatio: false,
            height: 25,
            preferNativeRender: true
        });

        console.log(banner);
    } catch(err: any){
        console.log("Erro: ", err.message)
    }
}