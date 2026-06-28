import { Widgets as Blessed } from "blessed";
import { Widgets as Contrib } from "blessed-contrib";
import ZoneList from "../components/ZoneList";
import PushAlert from "../components/pushAlert";
import AlertHistory from "../components/AlertHistory";
import LogBox from "../components/Logs";
import { randomUUID } from "crypto";
import { sendAlert } from "../reqs/sendAlert";

const niveisGravidade = ['BAIXO', 'MEDIO', 'ALTO'];
let gravidadeAtual = 0;

export default function getHomepage(screen: Blessed.Screen, grid: Contrib.GridElement ){
  
  const zonesList = ZoneList(grid);
  
  const createAlertSection = PushAlert(grid);
  const alertForm = createAlertSection.alertForm;
  const categoryInput = createAlertSection.categoryInput;
  const severityToggle = createAlertSection.severityToggle;
  const descInput = createAlertSection.descInput;
  const submitBtn = createAlertSection.submitBtn;
  
  const alertHistory = AlertHistory(grid);
  
  const alertLog = LogBox(grid);
  
  const toggleDashboard = (show: boolean) => {
    const elements = [ zonesList, alertForm, alertLog, alertHistory];
    elements.forEach(el => show ? el.show() : el.hide());
    }

  severityToggle.on('press', () => {
    gravidadeAtual = (gravidadeAtual + 1) % niveisGravidade.length;
    severityToggle.setContent(` ${niveisGravidade[gravidadeAtual]} `);
    screen.render();
    });

    zonesList.on('select', function() {
      categoryInput.focus();
      screen.render();
    });
    
    categoryInput.on('submit', () => severityToggle.focus());
    
    severityToggle.on('select', () => {
      descInput.focus();
      screen.render();
    });

    
    submitBtn.on('press', async () => {
      const zona = zonesList.items[zonesList.selected].getText();
      const categoria = categoryInput.getValue() || 'geral';
    
      const gravidade = niveisGravidade[gravidadeAtual] || "ALERTA DEFESA CIVIL";
    
      const descricao = descInput.getValue() || 'Alerta emitido pelo operador.';
      
      const payload = {
        id: randomUUID(),
        zona: zona,
        categoria: categoria,
        gravidade: gravidade.toUpperCase(),
        descricao: descricao,
        timestamp: new Date().toISOString()
      };
    
      alertLog.log(`\n[ENVIANDO] Tópico: defesacivil/alertas/${payload.zona}/${payload.categoria}`);
      await sendAlert(payload, (log) => {
        alertLog.log(log)
      })
      
      categoryInput.clearValue();
      descInput.clearValue();
      gravidadeAtual = 0;
      severityToggle.setContent(` ${niveisGravidade[gravidadeAtual]} `);
      
      screen.render();
    });

      screen.render()

    return {
      hide: () => toggleDashboard(false),
      show: () => toggleDashboard(true),
      focus: () => zonesList.focus(),
      printAlert: (log: string) => alertHistory.log(log),
      printLog: (log: string) => alertLog.log(log)
    }
}