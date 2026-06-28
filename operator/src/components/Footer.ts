import blessed from 'blessed';
import { grid as Grid } from 'blessed-contrib';
import { theme } from '../assets/theme';

export default function Footer(grid: Grid){

    const footerBox = grid.set(11, 0, 1, 12, blessed.box, {
      content: ' NAVEGAÇÃO: [TAB] Mudar Foco | [SETAS] Navegar Listas | [CTRL+C] Encerrar Sessão',
      style: { fg: theme.fg, bg: theme.bg }
    });

    return footerBox;
}