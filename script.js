window.ciclo = 1;
window.flag = 0;
window.estado = 'pomodoro';

btnTipo = document.querySelectorAll('#pomodoro .fundo-btn');

let h = {
    min: '25',
    seg: '00',
}

const setTime = (h) => {
    const clock = document.getElementById('time');
    clock.textContent = `${h.min}:${h.seg}`;
}

const getTime = () => {
    const clock = document.getElementById('time');

    let hora = {
        min: clock.textContent.substr(0, 2),
        seg: clock.textContent.substr(3, 2),
    }

    return hora;
}

const changePomodoro = () => {
    html = document.querySelector('html');
    frsCiclo = document.getElementById('cicle-title');

    if(html.classList.contains('pausa')){
        html.classList.remove('pausa');
        btnTipo[0].classList.add('ativado');
        btnTipo[1].classList.remove('ativado');
    } else if(html.classList.contains('descanso')){
        html.classList.remove('descanso');
        btnTipo[0].classList.add('ativado');
        btnTipo[2].classList.remove('ativado');
    }

    window.estado = 'pomodoro';
    frsCiclo.textContent = 'Foco!'

    h.min = '25';
    h.seg = '00';
    setTime(h);

    window.estado = 'pomodoro';
}

const changePausa =  () => {
    html = document.querySelector('html');
    frsCiclo = document.getElementById('cicle-title');

    if(html.classList.contains('descanso')){
        html.classList.remove('descanso');
        html.classList.add('pausa');
        btnTipo[2].classList.remove('ativado');
        btnTipo[1].classList.add('ativado');
    } else {
        html.classList.add('pausa');
        btnTipo[0].classList.remove('ativado');
        btnTipo[1].classList.add('ativado');
    }

    window.estado = 'pausa curta';
    frsCiclo.textContent = 'Pausa!'

    h.min = '05';
    h.seg = '00';
    setTime(h);

    window.estado = 'pausa';
}

const changeDescanso = () => {
    html = document.querySelector('html');
    frsCiclo = document.getElementById('cicle-title');

    if(html.classList.contains('pausa')){
        html.classList.remove('pausa');
        html.classList.add('descanso');
        btnTipo[1].classList.remove('ativado');
        btnTipo[2].classList.add('ativado');
    } else {
        html.classList.add('descanso');
        btnTipo[0].classList.remove('ativado');
        btnTipo[2].classList.add('ativado');
    }

    window.estado = 'pausa longa';
    frsCiclo.textContent = 'Descanso!'

    h.min = '15';
    h.seg = '00';
    setTime(h);

    window.estado = 'descanso';
}

const controlaCiclo = () => {
    window.ciclo++;
    if(window.ciclo == 6){
        window.ciclo = 1;
    }
    document.getElementById('cicle').textContent = `#${window.ciclo}`;
}

const proximoEstado = (btn) => {
    clearInterval(cronometro);
    skip.classList.add('invisible');

    btn.textContent = 'Começar';

    if(window.estado == 'pomodoro'){
        controlaCiclo();
        if(window.ciclo == 5){
            changeDescanso();
        } else {
            changePausa();
        }
    } else {
        if(window.estado == 'descanso'){
            controlaCiclo();
        }
        changePomodoro();
    }

    window.flag = 0;
}



btnTipo[0].addEventListener('click', () => {
    changePomodoro();
});

btnTipo[1].addEventListener('click', () => {
    changePausa();
});

btnTipo[2].addEventListener('click', () => {
    changeDescanso();
});

let cronometro;

document.getElementById('start').addEventListener('click', (e) => {
    skip = document.getElementById('skip-next');

    skip.classList.remove('invisible');
    let hora = getTime();

    if(window.flag == 0){
        cronometro = setInterval(() => {
            if(h.seg == '00' && h.min != '00'){
                hora.min--;
                if(hora.min <= 10){
                    hora.min = `0${hora.min}`;
                }
                hora.seg = '59'
    
                h = hora;
                setTime(h);
            } else if(h.seg > 00){
                if(hora.seg <= 10){
                    hora.seg = `0${--hora.seg}`;
    
                    h = hora;
                    setTime(h);
                } else {
                    hora.seg--;
    
                    h = hora;
                    setTime(h);
                }
            } else if(h.seg == '00' && h.min == '00') {
                proximoEstado(e.target);
            } 
        }, 1000);

        window.flag = 1;

        e.target.textContent = 'Pausar';
    } else {
        clearInterval(cronometro);
        window.flag = 0;

        e.target.textContent = 'Começar';
    } 
});

document.getElementById('skip-next').addEventListener('click', () => {
    document.getElementById('start');
    proximoEstado(start);
})