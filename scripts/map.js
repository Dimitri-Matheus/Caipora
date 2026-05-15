const battery     = document.getElementById('bateria');
const sensor      = document.getElementById('sensor')
const stages      = document.getElementById('status');
const local       = document.getElementById('localização'); 
const acc         = document.getElementById('precisao')

function batteryPorcentage(a){
  progressBar = battery.querySelector('#barraDeProgresso');
    progressBar.style.width = a+"%"
    setBattery(a);
}
function setSensor(a){
  let text = sensor.querySelector('p');
  if (text) text.innerText = 'ID: '+a;
}

function setBattery(a){
  let text = battery.querySelector('p');
  if (text) text.innerText = a+'%';
}

function setStatus(a){
  let estage = stages.querySelector('div');
  let text = estage.querySelector('p');
switch (a) {
  case 0:
    estage.classList.remove('statusOn', 'statusAlert');
    estage.classList.add('statusOff');
    text.innerText = 'Offline';
    break;
  case 1:
    estage.classList.remove('statusOff', 'statusAlert');
    estage.classList.add('statusOn');
    text.innerText = 'Online';
    break;
  case 2:
    estage.classList.remove('statusOff', 'statusOn');
    estage.classList.add('statusAlert');
    text.innerText = 'Alerta';
    break;
  default:
    console.error('ESTADO INVALIDO')
    break;
}
}

function setLocal(a){
  let text = local.querySelector('p');
  if (text) text.innerText = a;
}

function setAcc(a){
  let text = acc.querySelector('p');
  if (text) text.innerText = a+"%";
}


const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-60.02571521482677,-3.0969381008397177], //se for pergar do google as coordenadas saem invertidas
    zoom: 16,
    container: 'map',
})
new maplibregl.Marker().setLngLat([-60.02571521482677,-3.0969381008397177]).addTo(map);
