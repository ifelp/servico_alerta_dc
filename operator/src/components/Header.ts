import blessed from 'blessed';
import { grid as Grid } from 'blessed-contrib';
import { theme } from "../assets/theme";

export default function Header(grid: Grid){

    const headerBox = grid.set(0, 0, 1, 12, blessed.box, {
        content: ' {bold}SISTEMA DE ALERTAS PUSH - DEFESA CIVIL{/bold} | STATUS: ONLINE | BROKER: MQTT',
        tags: true,
        style: { fg: 'black', bg: theme.fg }
    });

    return headerBox
}