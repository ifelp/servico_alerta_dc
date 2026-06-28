import blessed from 'blessed';
import contrib from 'blessed-contrib';
import getLoginPage from './pages/loginPage';
import getHomepage from './pages/homePage';
import Header from './components/Header';
import Footer from './components/Footer';
import initClient from './config/mqtt';
import formatMessage from './reqs/getAlerts';
import { MqttClient } from 'mqtt';

const screen = blessed.screen({
  smartCSR: true,
  title: 'Defesa Civil - Central de Alertas',
  cursor: {
    artificial: true,
    shape: 'block',
    blink: true,
    color: 'yellow'
  }
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

let client: MqttClient;

const header = Header(grid);
const footer = Footer(grid);
header.hide()
footer.hide()

const homePage = getHomepage(screen, grid)
homePage.hide();

const loginPage = getLoginPage(screen, (operadorID) => {
  client = initClient(operadorID, homePage.printLog)
  client.on("message", (topic, payload) => {
    const parsedPayload = JSON.parse(payload.toString("utf-8"))
    formatMessage(homePage.printAlert, topic, parsedPayload);
  })
  header.show()
  homePage.show()
  footer.show()
  homePage.focus()
})

screen.key(['escape', 'q', 'C-c'], function() {
  if(client){
    client.on("end", () => {
      console.log("Cliente desconectado com sucesso.")
    })
  }
  return process.exit(0);
});

loginPage.focus()
screen.render();