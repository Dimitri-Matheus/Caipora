// scripts/map.js

const sensor      = document.getElementById('sensor');
const stages      = document.getElementById('status');
const local       = document.getElementById('localização'); 
const acc         = document.getElementById('precisao');

function setSensor(a) {
    let text = sensor.querySelector('p');
    if (text) text.innerText = 'ID: ' + a;
}

function setStatus(a) {
    let estage = stages.querySelector('div');
    let text = estage.querySelector('p');
    if (!estage || !text) return;

    // Limpa as classes antigas para não encavalar
    estage.classList.remove('statusOn', 'statusAlert', 'statusOff');

    switch (a) {
        case 0:
            estage.classList.add('statusOff');
            text.innerText = 'Offline';
            break;
        case 1:
            estage.classList.add('statusOn');
            text.innerText = 'Online';
            break;
        case 2:
            estage.classList.add('statusAlert');
            text.innerText = 'Alerta';
            break;
        default:
            console.error('ESTADO INVALIDO');
            break;
    }
}

function setLocal(a) {
    let text = local.querySelector('p');
    if (text) text.innerText = a;
}

function setAcc(a) {
    let text = acc.querySelector('p');
    if (text) text.innerText = a + "%";
}

// 1. Inicialização do Mapa (Centralizado no Parque Nacional da Amazônia)
const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-56.846667, -4.599722], // Coordenadas centrais da reserva
    zoom: 11, // Zoom ajustado por ser uma reserva gigantesca, permitindo ver o distanciamento dos pinos
    container: 'map',
});

// 2. Mock de Sensores Fixos (Reposicionados estrategicamente dentro do Parque)
const sensoresFixos = {
    "CAI-01": { lng: -56.846667, lat: -4.599722, local: "Base Científica - Margem do Tapajós", acc: 98 },
    "CAI-02": { lng: -56.810000, lat: -4.620000, local: "Posto de Fiscalização - Trilha da Capelinha", acc: 95 }
};

// Variável para guardar a referência dos pinos no mapa
let marcadoresNoMapa = {};

// 3. Função que recebe os alertas do Firebase e atualiza o mapa
// scripts/map.js

// ... mantenha as funções de cima (setSensor, setStatus, etc) igualzinho ...

function atualizarMapa(alertas) {
    if (!alertas) return;

    // Filtro inteligente: detecta alerta ativo se não estiver resolvido OU se o status for "alertando"
    const alertasAtivos = alertas.filter(a => !a.resolvido || a.status === "alertando");
    const sensoresEmAlerta = alertasAtivos.map(a => a.sensor_id);

    // Razão de ser dos pinos na tela
    Object.keys(sensoresFixos).forEach(sensorId => {
        const dadosSensor = sensoresFixos[sensorId];
        const estaEmAlerta = sensoresEmAlerta.includes(sensorId);
        
        // Busca o alerta mais recente desse sensor no histórico
        const alertaRecente = alertas.find(a => a.sensor_id === sensorId && a.precisao !== undefined);

        // Captura a precisão real do banco. Se não houver alerta, usa o mock.
        let precisaoReal = dadosSensor.acc;

        if (alertaRecente && alertaRecente.precisao !== undefined) {
            // Força a conversão para número, trocando vírgula por ponto caso o ESP tenha mandado errado
            let valorLimpo = alertaRecente.precisao.toString().replace(',', '.');
            let valorNumerico = parseFloat(valorLimpo);
            
            // Se a conversão deu certo e é um número válido
            if (!isNaN(valorNumerico)) {
                // Se for decimal (menor ou igual a 1, ex: 0.94), multiplica por 100. Se for inteiro (ex: 94), mantém.
                precisaoReal = valorNumerico <= 1 ? Math.round(valorNumerico * 100) : Math.round(valorNumerico);
            }
        }

        // Define a cor: Vermelho para perigo, Azul para normal
        const corPino = estaEmAlerta ? "#ff3d00" : "#00b0ff"; 

        if (marcadoresNoMapa[sensorId]) {
            marcadoresNoMapa[sensorId].remove();
        }

        const marker = new maplibregl.Marker({ color: corPino })
            .setLngLat([dadosSensor.lng, dadosSensor.lat])
            .addTo(map);

        // Painel Lateral atualizado com coordenadas e precisão real do ESP32
        marker.getElement().addEventListener('click', () => {
            setSensor(sensorId);
            setLocal(`Lat: ${dadosSensor.lat} | Lng: ${dadosSensor.lng}`);
            setAcc(estaEmAlerta ? precisaoReal : "-");; // Agora exibe os 94% reais vindos da IA do ESP32
            setStatus(estaEmAlerta ? 2 : 1);
        });

        marcadoresNoMapa[sensorId] = marker;
    });
}

window.atualizarMapa = atualizarMapa;