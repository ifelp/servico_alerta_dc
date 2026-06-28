import blessed from 'blessed'
import { grid as Grid } from 'blessed-contrib';
import { theme } from '../assets/theme'

export default function PushAlert(grid: Grid){

    const alertForm = grid.set(1, 3, 5, 4, blessed.form, {
    label: ' COMPOSIÇÃO DE ALERTA ',
    keys: true,
    border: { type: 'line' },
    style: { fg: theme.fg, bg: theme.bg, border: { fg: theme.border } }
    });

    blessed.text({ parent: alertForm, top: 1, left: 2, content: 'Categoria:', style: { fg: theme.fg } });
    const categoryInput = blessed.textbox({
    parent: alertForm, top: 1, left: 13, width: 20, height: 1, keys: true, inputOnFocus: true,
    style: { fg: 'black', bg: theme.fg, focus: { bg: theme.focus } }
    });

    const niveisGravidade = ['BAIXO', 'MEDIO', 'ALTO'];
    let gravidadeAtual = 0;

    blessed.text({ parent: alertForm, top: 3, left: 2, content: 'Gravidade:', style: { fg: theme.fg } });

    const severityToggle = blessed.button({
    parent: alertForm, 
    top: 3, 
    left: 13, 
    width: 20, 
    height: 1, 
    keys: true, 
    mouse: true,
    content: ` ${niveisGravidade[gravidadeAtual]} `, // Exibe o valor atual
    style: { 
        fg: 'black', 
        bg: theme.fg,
        focus: { bg: 'white', fg: 'black' } 
    }
    });

    blessed.text({ parent: alertForm, top: 5, left: 2, content: 'Descrição:', style: { fg: theme.fg } });
    const descInput = blessed.textarea({
    parent: alertForm, top: 5, left: 13, width: 50, height: 3, keys: true, inputOnFocus: true, wrap: true, scrollable: true,
    style: { fg: 'black', bg: theme.fg, focus: { bg: theme.focus } }
    }); 

    const submitBtn = blessed.button({
    parent: alertForm, top: 9, left: 13, width: 20, height: 1, content: ' DISPARAR ALERTA ',
    keys: true, shrink: true, mouse: true,
    style: { fg: 'black', bg: 'red', focus: { bg: 'white', fg: 'red' } }
    });

    return {
        alertForm,
        categoryInput,
        severityToggle,
        descInput,
        submitBtn
    };
}