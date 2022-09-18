btnTipo = document.querySelectorAll('#pomodoro .fundo-btn');

//1 - Pomodoro 2- Pausa curta 3- Pausa longa
let faseCiclo = 1;

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

btnTipo[0].addEventListener('click', () => {
    html = document.querySelector('html');

    if(html.classList.contains('pausa')){
        html.classList.remove('pausa');
        btnTipo[0].classList.add('ativado');
        btnTipo[1].classList.remove('ativado');
    } else if(html.classList.contains('descanso')){
        html.classList.remove('descanso');
        btnTipo[0].classList.add('ativado');
        btnTipo[2].classList.remove('ativado');
    }

    h.min = '25';
    h.seg = '00';
    setTime(h);
});

btnTipo[1].addEventListener('click', () => {
    html = document.querySelector('html');
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

    h.min = '05';
    h.seg = '00';
    setTime(h);
});

btnTipo[2].addEventListener('click', () => {
    html = document.querySelector('html');
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

    h.min = '15';
    h.seg = '00';
    setTime(h);
});

document.getElementById('start').addEventListener('click', () => {
    clock = document.getElementById('time');

    hora = getTime();

    let cronometro = setInterval(() => {
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
            clearInterval(cronometro);
        }

        console.log(h)
    }, 1000);
});