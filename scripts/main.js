const project = document.querySelectorAll('#projectSection');
const dashboard = document.querySelectorAll('#dashboardSection');
const buttons = document.querySelectorAll(".switchButton");
const history = document.getElementById('history');
showcontent(0);
//Apenas para testes
// goTo('dashboard');

buttons.forEach((el, index) => {
  el.addEventListener('click', (e) => {
    showcontent(index);
  });
})

function showcontent(a){    
    switch (a) {
        case 0:
            project.forEach(el => el.classList.remove('hidden'));
            dashboard.forEach(el => el.classList.add('hidden'));
            buttons[a].classList.add('selected')
            buttons[1].classList.remove('selected')
            break;
        case 1:
            dashboard.forEach(el => el.classList.remove('hidden'));
            project.forEach(el => el.classList.add('hidden'));
            buttons[a].classList.add('selected')
            buttons[0].classList.remove('selected')
            break;
        default:
            break;
    }
}

function goTo(a){
    let x = document.getElementById(a);
    let y = document.getElementById('projectSection')
    let z = document.getElementById('dashboardSection')
    if(y.contains(x)){
    showcontent(0);
    x.scrollIntoView({behavior:'smooth'});
    }else if(z.contains(x)){
    showcontent(1);
    x.scrollIntoView({behavior:'smooth'});
    }else{
    x.scrollIntoView({behavior:'smooth'});
    }
}

function createH(a,b){
    let x = document.createElement('div')
    x.classList.add('alertahistory')
    x.innerHTML = '<h3>' + b +'</h3><p>' + a + '</p>';
    history.appendChild(x);
}

// createH('informações',"< sensor_id >");
// createH('informações',"< sensor_id >");
// createH('informações',"< sensor_id >");
// lembrar me de melhorar a organização dos historicos de alertas --riki