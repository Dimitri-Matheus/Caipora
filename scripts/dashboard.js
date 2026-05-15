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

async function atualizarDashboard() {
    const alertas = await fetchData("/alertas");
    if (!alertas) return;

    const container = document.getElementById("db-historico-log");
    container.innerHTML = ""; // Limpa o "Aguardando..."

    alertas.forEach(alerta => {
        const item = document.createElement("div");
        item.className = "alertahistorico";
        
        const data = new Date(alerta.timestamp._seconds * 1000).toLocaleString();
        
        // Criamos o HTML do alerta
        item.innerHTML = `
            <div>
                <h3>${alerta.tipo_som || "RUÍDO"}</h3>
                <p>Sensor ${alerta.sensor_id} - ${data}</p>
            </div>
        `;

        // Em vez de onclick no HTML, criamos o botão e o evento via JS (Mais seguro e evita o erro de 'not defined')
        if (!alerta.resolvido) {
            const btn = document.createElement("button");
            btn.className = "btn-resolver";
            btn.innerText = "Resolver";
            btn.onclick = () => resolverAlerta(alerta.id, alerta.sensor_id);
            item.appendChild(btn);
        } else {
            const span = document.createElement("span");
            span.className = "status-resolvido";
            span.innerText = "Resolvido";
            item.appendChild(span);
        }

        container.appendChild(item);
    });
}

// Para garantir que o botão encontre a função mesmo em módulos:
window.resolverAlerta = resolverAlerta;

async function resolverAlerta(alertaId, sensorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/alertas/${alertaId}/resolver`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sensor_id: sensorId })
        });

        if (response.ok) {
            alert("Alerta resolvido com sucesso!");
            atualizarDashboard(); // Recarrega os dados para atualizar a lista
        } else {
            console.error("Falha ao resolver alerta");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
    }
}

atualizarDashboard(); // Roda ao carregar a página
setInterval(atualizarDashboard, 30000); // Atualiza a cada 30 segundos