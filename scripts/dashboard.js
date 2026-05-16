const sensores = document.getElementById('sensoresDb');
const atividade = document.getElementById('atividadeDb');
const alertas = document.getElementById('alertasDb');

function setSensorValue(a) {
let dv   = sensores.querySelector('div')
let text = dv.querySelector('h3');
if (text) text.innerText = a;
}

function setActivityValue(a) {
let dv   = atividade.querySelector('div')
let text = dv.querySelector('h3');
if (text) text.innerText = a;
}

function setAlertValue(a) {
let dv   = alertas.querySelector('div')
let text = dv.querySelector('h3');
if (text) text.innerText = a;
}

// No scripts/dashboard.js
// scripts/dashboard.js

// Função principal que orquestra a atualização da página
async function atualizarDashboard() {
    console.log("A atualizar dados do dashboard...");
    const alertas = await fetchData("/alertas");
    
    if (!alertas) {
        console.error("Não foi possível carregar os alertas.");
        return;
    }

    // 1. Filtrar alertas de hoje
    const hoje = new Date().toLocaleDateString('pt-BR');
    const alertasHoje = alertas.filter(alerta => {
        // O Firebase envia o timestamp como { _seconds, _nanoseconds }
        const dataAlerta = new Date(alerta.timestamp._seconds * 1000).toLocaleDateString('pt-BR');
        return dataAlerta === hoje;
    });

    // 2. Atualizar os Cards (IDs definidos no HTML)
    const cardAlertas = document.getElementById("db-valor-alertas");
    const cardSensores = document.getElementById("db-valor-sensores");

    if (cardAlertas) {
        cardAlertas.innerText = alertasHoje.length.toString().padStart(2, '0');
    }

    if (cardSensores) {
        // Contamos sensores únicos que geraram alertas hoje
        const sensoresUnicos = new Set(alertasHoje.map(a => a.sensor_id)).size;
        cardSensores.innerText = sensoresUnicos.toString().padStart(2, '0');
    }

    // 3. Popular o Histórico
    renderizarHistorico(alertas);

    //Atualiza o gráfico de pizza com os mesmos dados
    if (typeof window.atualizarGraficoPizza === "function") {
        window.atualizarGraficoPizza(alertas);
    }

    if (typeof window.atualizarGraficoLinha === "function") {
        window.atualizarGraficoLinha();
    }

    if (typeof window.atualizarMapa === "function") {
        window.atualizarMapa(alertas);
    }

}

// Função para desenhar a lista de alertas no ecrã
// scripts/dashboard.js

function renderizarHistorico(alertas) {
    const container = document.getElementById("db-historico-log");
    if (!container) return;

    container.innerHTML = ""; 

    alertas.slice(0, 10).forEach(alerta => {
        const div = document.createElement("div");
        div.className = "alertahistorico";
        
        const dataHora = new Date(alerta.timestamp._seconds * 1000).toLocaleString('pt-BR');

        div.innerHTML = `
            <div>
                <h3>ALERTA: ${alerta.tipo_som || "RUÍDO"}</h3>
                <p>Sensor ${alerta.sensor_id || "Desconhecido"} - ${dataHora}</p> 
            </div>
            ${!alerta.resolvido 
                ? `<button class="btn-resolver" onclick="resolverEvento('${alerta.id}', '${alerta.sensor_id}')">Resolver</button>` 
                : `<span class="status-resolvido">Resolvido</span>`}
        `;
        container.appendChild(div);
    });
}

async function resolverEvento(alertaId, sensorId) {
    if (!alertaId || alertaId === 'undefined') {
        alert("Não foi possível resolver: ID do documento inválido.");
        return;
    }

    const url = `${API_BASE_URL}/alertas/${alertaId}/resolver`;

    try {
        const response = await fetch(url, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sensor_id: sensorId })
        });

        if (response.ok) {
            atualizarDashboard(); 
        }
    } catch (error) {
        // Retido apenas o tratamento básico de falha de conexão sem logs de vaidade
        alert("Erro de conexão ao tentar resolver o incidente.");
    }
}

window.resolverEvento = resolverEvento;

// Inicia a primeira carga
atualizarDashboard();

// Configura o "polling" para atualizar a cada 30 segundos
setInterval(atualizarDashboard, 30000);