import blessed from 'blessed'
import { theme } from '../assets/theme'
import { banner } from '../assets/loginLogo';
import Login from '../reqs/login';

export default function getLoginPage(screen: blessed.Widgets.Screen, onLoginSuccess : (id: string) => void) {

    const loginBox = blessed.box({ parent: screen, top: 'center', left: 'center', width: '80%', height: 40,
      border: { type: 'line' },
      style: {
        fg: theme.fg,
        bg: theme.bg,
        border: { fg: theme.border }
      },
      tags: true
    });

    blessed.text({ parent: loginBox, top: 8, left: 'center', content: banner, width: '60%', height: '20%',
      style: { fg: theme.fg, bg: theme.bg }
    });
    blessed.text({ parent: loginBox, top: 17, left: 'center',
        content: 'SISTEMA DE ALERTAS - PAINEL DO OPERADOR',
        style: { fg: theme.fg, bg: theme.bg }
    })

    blessed.text({ parent: loginBox, top: 20, left: 38, content: 'OPERADOR ID:',
      style: { fg: theme.fg, bg: theme.bg }
    });
    
    const loginInput = blessed.textbox({ parent: loginBox, top: 20, left: 51, width: 30, height: 1, keys: true, mouse: true,
      inputOnFocus: true,
      style: {
        fg: 'black',
        bg: theme.fg,
        focus: { bg: theme.focus }
      }
    });

    const errorMessage = (message: string) => {
        return blessed.text({ parent: loginBox, top: 23, left: 'center', content: message,
        style: { fg: 'red', bg: theme.bg }
    });
}
    
    blessed.text({ parent: loginBox, top: 25, left: 'center',
      content: '[ Pressione ENTER para acessar o terminal ]',
      style: { fg: theme.fg, bg: theme.bg }
    });

    loginInput.on('submit', async () => {
        errorMessage('')
        const operadorId = loginInput.getValue();
        const resp = await Login(operadorId);
        if(!resp.auth){
            errorMessage(resp.message)
            loginInput.clearValue()
            loginInput.focus()
            return
        }
        loginBox.hide();
        onLoginSuccess(operadorId);
    });

    return {
        box: loginBox,
        focus: () => loginInput.focus(),
    };
}