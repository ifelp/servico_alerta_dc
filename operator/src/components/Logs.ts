import blessed from 'blessed'
import contrib from 'blessed-contrib'
import { theme } from '../assets/theme'

export default function LogBox(grid: contrib.Widgets.GridElement){

    const alertLog = grid.set(6, 0, 5, 7, blessed.log, {
        label: ' LOGS DE TRANSMISSÃO DA SESSÃO ',
        border: { type: 'line' },
        wrap: true,
        keys: true,
        mouse: true,
        scrollback: 200,
        scrollbar: {
            ch: '',
            track: { bg: theme.bg },
            style: { inverse: true }
        },
        style: { fg: 'green', bg: theme.bg, border: { fg: theme.border } }
    });

    return alertLog;
}