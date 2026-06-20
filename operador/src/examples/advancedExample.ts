/**
 * Exemplo Avançado - Validação, batch e simulação de sensores
 * 
 * Execute com: npm run example:advanced
 * ou: npx tsx src/examples/advancedExample.ts
 */

import { OperatorClient } from '../client';

async function main() {
    // Configura o cliente com modo verbose ativado
    const client = new OperatorClient({
        serverUrl: 'http://localhost:3000',
        timeout: 5000,
        verbose: true
    });

    // Valida o servidor
    console.log('=== VALIDAÇÃO INICIAL ===\n');
    const isOnline = await client.healthCheck();
    if (!isOnline) {
        console.error('❌ Servidor não está disponível!');
        return;
    }

    // Exemplo 1: Validar mensagem sem publicar
    console.log('=== EXEMPLO 1: Validar Mensagem ===');
    try {
        const validation = await client.validate(
            'sensores/movimento/entrada',
            {
                movimento_detectado: true,
                intensidade: 95
            }
        );
        console.log('✅ Validação bem-sucedida');
        console.log('Estrutura:', validation.estrutura);
    } catch (error) {
        console.error('❌ Erro na validação:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Exemplo 2: Envio em batch (múltiplas mensagens)
    console.log('\n=== EXEMPLO 2: Envio em Batch ===');
    const messagesToSend = [
        {
            topico: 'sensores/temperatura/sala1',
            payload: { temperatura: 22.5, unidade: 'C' }
        },
        {
            topico: 'sensores/temperatura/sala2',
            payload: { temperatura: 21.3, unidade: 'C' }
        },
        {
            topico: 'sensores/umidade/cozinha',
            payload: { umidade: 65.3, status: 'ok' }
        },
        {
            topico: 'dispositivos/luzes/sala1',
            payload: { estado: 'ligado', potencia_watts: 100 }
        },
        {
            topico: 'dispositivos/luzes/sala2',
            payload: { estado: 'desligado', potencia_watts: 0 }
        }
    ];

    const batchResults = await client.publishBatch(messagesToSend);
    console.log(`✅ Publicadas ${batchResults.length} mensagens no batch\n`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Exemplo 3: Simulação de sensor em tempo real
    console.log('=== EXEMPLO 3: Simulação de Sensor em Tempo Real ===');
    console.log('Enviando 5 leituras do sensor de temperatura...\n');

    for (let i = 1; i <= 5; i++) {
        try {
            // Simula variação de temperatura
            const temperatura = 20 + Math.random() * 5;

            const response = await client.publish(
                'sensores/temperatura/simulado',
                {
                    sensor_id: 'SIM-TEMP-001',
                    temperatura: parseFloat(temperatura.toFixed(2)),
                    unidade: 'Celsius',
                    leitura: i,
                    timestamp_local: Date.now()
                }
            );

            console.log(`📊 Leitura ${i}: ${temperatura.toFixed(2)}°C publicada`);

            // Aguarda 1 segundo entre leituras
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`❌ Erro na leitura ${i}`);
        }
    }

    // Exemplo 4: Mensagem com timestamp customizado
    console.log('\n=== EXEMPLO 4: Mensagem com Timestamp Customizado ===');
    try {
        const customTime = new Date('2026-06-20T15:30:00Z').toISOString();

        const response = await client.publish(
            'sensores/teste/timestamp',
            {
                tipo: 'teste',
                valor: 42
            },
            customTime
        );

        console.log('✅ Mensagem com timestamp customizado publicada');
        console.log('Timestamp:', customTime);
    } catch (error) {
        console.error('❌ Erro:', error);
    }

    console.log('\n=== EXEMPLOS AVANÇADOS CONCLUÍDOS ===\n');
}

// Executa os exemplos
main().catch(console.error);
