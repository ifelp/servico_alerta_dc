import { theme } from "../assets/theme";
import blessed from 'blessed';
import { grid as Grid } from "blessed-contrib";

export default function ZoneList(grid: Grid){
    const zonesList = grid.set(1, 0, 5, 3, blessed.list, {
      label: ' ZONAS DE RISCO ',
      keys: true,
      mouse: true,
      items: ['zona_A', 'zona_B', 'zona_C', 'zona_D'],
      border: { type: 'line' },
      style: {
        fg: theme.fg,
        bg: theme.bg,
        border: { fg: theme.border },
        selected: { bg: theme.fg, fg: 'black' }
      }
    });

    return zonesList;
}