// scripts/linha.js

// Variável global para armazenar a instância do gráfico e evitar duplicações
let chartHistorico = null;

async function atualizarGraficoLinha() {
    // 1. Busca os dados prontos da nossa nova rota no backend
    const dados = await fetchData("/alertas/analytics/historico");
    
    if (!dados || dados.length === 0) {
        console.warn("Sem dados para o gráfico de linha.");
        return;
    }

    // 2. Separa os dados para os eixos X (Datas) e Y (Totais)
    const labels = dados.map(item => item.data);
    const valores = dados.map(item => item.total);

    // 3. Seleciona o canvas no HTML
    const ctx = document.getElementById('graficoLinhaHistorico').getContext('2d');

    // 4. Limpeza Crucial: Destrói o gráfico antigo antes de desenhar o novo (para o polling)
    if (chartHistorico) {
        chartHistorico.destroy();
    }

    // 5. Renderiza o novo gráfico com o visual do CAIPORA
    chartHistorico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Alertas',
                data: valores,
                borderColor: '#6a1b9a', // Roxo principal do tema
                backgroundColor: 'rgba(106, 27, 154, 0.1)', // Roxo translúcido embaixo da linha
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#6a1b9a',
                pointRadius: 4,
                fill: true, // Preenche a área abaixo da linha
                tension: 0.4 // Deixa a linha suave/curvada em vez de pontiaguda
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, // Esconde a legenda superior para ficar mais limpo
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.raw} Alertas`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 } // Força o eixo Y a usar números inteiros (1, 2, 3...)
                }
            }
        }
    });
}

// Expõe globalmente
window.atualizarGraficoLinha = atualizarGraficoLinha;