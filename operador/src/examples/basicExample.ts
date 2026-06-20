/**
 * Exemplo Básico - Envio simples de mensagens
 * 
 * Execute com: npm run example
 * ou: npx tsx src/examples/basicExample.ts
 */

import { OperatorClient } from '../client';

async function main() {
    // Configura o cliente operador
    const client = new OperatorClient({
        serverUrl: 'http://localhost:3000',
        timeout: 5000,
        verbose: true
    });

    // Verifica conexão com o servidor
    console.log('\n=== HEALTH CHECK ===');
    const isOnline = await client.healthCheck();
    if (!isOnline) {
        console.error('❌ Servidor não está disponível!');
        return;
    }
    console.log('✅ Servidor está online\n');

    // Exemplo 1: Enviar mensagem de sensor de temperatura
    console.log('=== EXEMPLO 1: Sensor de Temperatura ===');
    try {
        const response1 = await client.publish(
            'sensores/temperatura/sala1',
            {
                temperatura: 22.5,
                unidade: 'Celsius',
                sensor_id: 'TEMP001'
            }
        );
        console.log('✅ Mensagem publicada:', response1.topico);
    } catch (error) {
        console.error('❌ Erro:', error);
    }

    // Aguarda 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Exemplo 2: Enviar mensagem de sensor de umidade
    console.log('\n=== EXEMPLO 2: Sensor de Umidade ===');
    try {
        const response2 = await client.publish(
            'sensores/umidade/cozinha',
            {
                umidade: 65.3,
                status: 'ok',
                sensor_id: 'UMID001'
            }
        );
        console.log('✅ Mensagem publicada:', response2.topico);
    } catch (error) {
        console.error('❌ Erro:', error);
    }

    // Aguarda 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Exemplo 3: Enviar mensagem de status de dispositivo
    console.log('\n=== EXEMPLO 3: Status de Dispositivo ===');
    try {
        const response3 = await client.publish(
            'dispositivos/bomba/status',
            {
                estado: 'ativo',
                vazao_litros_min: 12.5,
                pressao_psi: 45.2,
                erros: []
            }
        );
        console.log('✅ Mensagem publicada:', response3.topico);
    } catch (error) {
        console.error('❌ Erro:', error);
    }

    console.log('\n=== EXEMPLO CONCLUÍDO ===\n');
}

// Executa o exemplo
main().catch(console.error);
