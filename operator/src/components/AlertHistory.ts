import blessed from 'blessed'
import contrib from 'blessed-contrib'
import { theme } from '../assets/theme'

export default function AlertHistory(grid: contrib.Widgets.GridElement){

    const alertHistory = grid.set(1 ,7 , 10, 5, blessed.log, {
      label: ' HISTÓRICO DE ALERTAS DA SESSÃO ',
      wrap: true,
      keys: true,
      mouse: true,
      scrollback: 200,
      scrollbar: {
        ch: '',
        track: { bg: theme.bg },
        style: { inverse: true }
    },
      border: { type: 'line' },
      style: { fg: 'green' , bg: theme.bg, border: { fg: theme.border } }
    })

    return alertHistory;
}
