/**
 * Exemplo Intermediário - Serviço de Sensor Contínuo
 * 
 * Simula um sensor que coleta dados continuamente e os envia
 * para o servidor em intervalos regulares.
 * 
 * Execute com: npx tsx src/examples/continuousSensorExample.ts
 */

import { OperatorClient } from '../client';

/**
 * Simula um sensor de temperatura em uma sala
 */
class TemperatureSensor {
    private currentTemp: number;
    private trend: number; // 1 ou -1 para simular tendência

    constructor(initialTemp: number = 20) {
        this.currentTemp = initialTemp;
        this.trend = Math.random() > 0.5 ? 1 : -1;
    }

    /**
     * Simula variação de temperatura
     */
    read(): number {
        // Pequena variação aleatória
        const variation = (Math.random() - 0.5) * 0.3;
        this.currentTemp += variation;

        // Muda a tendência aleatoriamente
        if (Math.random() > 0.85) {
            this.trend *= -1;
        }

        // Aplica a tendência
        this.currentTemp += this.trend * 0.05;

        // Mantém dentro de um intervalo realista (15°C a 30°C)
        this.currentTemp = Math.max(15, Math.min(30, this.currentTemp));

        return parseFloat(this.currentTemp.toFixed(2));
    }

    /**
     * Retorna status do sensor
     */
    getStatus(): string {
        if (this.currentTemp < 18) return 'frio';
        if (this.currentTemp > 26) return 'quente';
        return 'normal';
    }
}

/**
 * Simula um sensor de umidade
 */
class HumiditySensor {
    private currentHumidity: number;

    constructor(initialHumidity: number = 50) {
        this.currentHumidity = initialHumidity;
    }

    /**
     * Simula variação de umidade
     */
    read(): number {
        const variation = (Math.random() - 0.5) * 2;
        this.currentHumidity += variation;
        this.currentHumidity = Math.max(30, Math.min(80, this.currentHumidity));
        return parseFloat(this.currentHumidity.toFixed(1));
    }

    /**
     * Retorna status do sensor
     */
    getStatus(): string {
        if (this.currentHumidity < 40) return 'seco';
        if (this.currentHumidity > 70) return 'umido';
        return 'ok';
    }
}

/**
 * Classe para gerenciar múltiplos sensores
 */
class SensorManager {
    private sensors: Map<string, { type: string; sensor: any }> = new Map();
    private client: OperatorClient;

    constructor(client: OperatorClient) {
        this.client = client;
    }

    /**
     * Registra um sensor
     */
    registerSensor(id: string, type: 'temperature' | 'humidity', initialValue?: number): void {
        if (type === 'temperature') {
            this.sensors.set(id, {
                type,
                sensor: new TemperatureSensor(initialValue)
            });
        } else if (type === 'humidity') {
            this.sensors.set(id, {
                type,
                sensor: new HumiditySensor(initialValue)
            });
        }
    }

    /**
     * Coleta e publica leituras de todos os sensores
     */
    async publishReadings(): Promise<void> {
        for (const [sensorId, { type, sensor }] of this.sensors) {
            try {
                if (type === 'temperature') {
                    const temp = sensor.read();
                    const status = sensor.getStatus();

                    await this.client.publish(
                        `sensores/temperatura/${sensorId}`,
                        {
                            sensor_id: sensorId,
                            temperatura: temp,
                            unidade: 'Celsius',
                            status: status,
                            timestamp_local: new Date().toISOString()
                        }
                    );

                    console.log(`🌡️  ${sensorId}: ${temp}°C (${status})`);

                } else if (type === 'humidity') {
                    const humidity = sensor.read();
                    const status = sensor.getStatus();

                    await this.client.publish(
                        `sensores/umidade/${sensorId}`,
                        {
                            sensor_id: sensorId,
                            umidade: humidity,
                            unidade: '%',
                            status: status,
                            timestamp_local: new Date().toISOString()
                        }
                    );

                    console.log(`💧 ${sensorId}: ${humidity}% (${status})`);
                }
            } catch (error) {
                console.error(`❌ Erro ao publicar ${sensorId}:`, error);
            }
        }
    }

    /**
     * Inicia coleta periódica
     */
    startMonitoring(intervalMs: number = 5000): NodeJS.Timer {
        console.log(`\n📊 Iniciando monitoramento a cada ${intervalMs}ms\n`);

        return setInterval(async () => {
            console.log(`\n⏰ [${new Date().toLocaleTimeString()}] Coletando leituras...`);
            await this.publishReadings();
        }, intervalMs);
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  EXEMPLO: Serviço de Sensor Contínuo              ║');
    console.log('║  Monitora múltiplos sensores continuamente         ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    const client = new OperatorClient({
        serverUrl: 'http://localhost:3000',
        verbose: false
    });

    // Verifica conexão
    console.log('🔗 Verificando conexão com servidor...');
    const isOnline = await client.healthCheck();
    if (!isOnline) {
        console.error('❌ Servidor não está disponível!');
        console.error('Certifique-se de que o servidor está rodando em http://localhost:3000');
        return;
    }
    console.log('✅ Conectado ao servidor!\n');

    // Cria gerenciador de sensores
    const manager = new SensorManager(client);

    // Registra sensores
    console.log('📡 Registrando sensores...\n');
    manager.registerSensor('sala1', 'temperature', 22);
    manager.registerSensor('sala2', 'temperature', 21);
    manager.registerSensor('cozinha', 'humidity', 60);
    manager.registerSensor('banheiro', 'humidity', 75);

    // Coleta inicial
    console.log('📊 Coletando leituras iniciais...');
    await manager.publishReadings();

    // Inicia monitoramento periódico (a cada 10 segundos)
    const monitor = manager.startMonitoring(10000);

    // Para após 60 segundos
    console.log('\n⏰ Executando por 60 segundos...');
    console.log('(Pressione Ctrl+C para interromper)\n');

    setTimeout(() => {
        clearInterval(monitor);
        console.log('\n\n✅ Monitoramento finalizado!');
        process.exit(0);
    }, 60000);
}

// Executa
main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
