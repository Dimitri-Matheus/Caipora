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

// 1. Inicialização do Mapa
const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-60.02571521482677, -3.0969381008397177], // Coordenada base
    zoom: 16,
    container: 'map',
});

// 2. Mock de Sensores Fixos (Agora sem a propriedade de bateria)
const sensoresFixos = {
    "CAI-01": { lng: -60.025715, lat: -3.096938, local: "Setor Norte - Trilha Principal", acc: 98 },
    "CAI-02": { lng: -60.024500, lat: -3.097500, local: "Setor Sul - Área de Preservação", acc: 95 }
};

// Variável para guardar a referência dos pinos no mapa
let marcadoresNoMapa = {};

// 3. Função que recebe os alertas do Firebase e atualiza o mapa
function atualizarMapa(alertas) {
    if (!alertas) return;

    // Descobre quais sensores estão com alerta não resolvido
    const alertasAtivos = alertas.filter(a => !a.resolvido);
    const sensoresEmAlerta = alertasAtivos.map(a => a.sensor_id);

    // Atualiza ou cria os pinos
    Object.keys(sensoresFixos).forEach(sensorId => {
        const dadosSensor = sensoresFixos[sensorId];
        const estaEmAlerta = sensoresEmAlerta.includes(sensorId);
        
        // BUSCA DINÂMICA: Procura o alerta mais recente desse sensor no histórico
        const alertaRecente = alertas.find(a => a.sensor_id === sensorId);
        
        // Se o Firebase enviou a precisão, usamos a real. Se não, usamos a do mock.
        const precisaoReal = (alertaRecente && alertaRecente.acc) ? alertaRecente.acc : dadosSensor.acc;

        // Define a cor: Vermelho para perigo, Azul para normal
        const corPino = estaEmAlerta ? "#ff3d00" : "#00b0ff"; 

        if (marcadoresNoMapa[sensorId]) {
            marcadoresNoMapa[sensorId].remove();
        }

        const marker = new maplibregl.Marker({ color: corPino })
            .setLngLat([dadosSensor.lng, dadosSensor.lat])
            .addTo(map);

        // Integração com os Cards Laterais (Click)
        marker.getElement().addEventListener('click', () => {
            setSensor(sensorId);
            setLocal(dadosSensor.local);
            setAcc(precisaoReal); // Atualiza com a precisão do Firebase
            setStatus(estaEmAlerta ? 2 : 1);
        });

        marcadoresNoMapa[sensorId] = marker;
    });
}

window.atualizarMapa = atualizarMapa;