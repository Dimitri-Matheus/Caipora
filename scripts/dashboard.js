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

