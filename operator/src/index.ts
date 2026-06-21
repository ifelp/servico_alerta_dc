import { text, updateSettings } from '@clack/prompts'
import { loginHero } from './components/loginForm';
import { defesacivilbanner } from './assets/banner';

updateSettings({withGuide: false});

async function main(){
    console.clear();
    await defesacivilbanner();
}

main();