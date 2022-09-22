ciclo = 1;
flag = 0;
estado = 'pomodoro';
tasks = [];
tempo = {
    pomodoro: 25,
    pausa: 5,
    descanso: 15,
}

btnTipo = document.querySelectorAll('#pomodoro .fundo-btn');

let h = {
    min: tempo.pomodoro,
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

const change = {
    pomodoro: () => {
        clearInterval(cronometro);

        html = document.querySelector('html');
        frsCiclo = document.getElementById('cicle-title');
        start = document.getElementById('start');

        if(html.classList.contains('pausa')){
            html.classList.remove('pausa');
            btnTipo[0].classList.add('ativado');
            btnTipo[1].classList.remove('ativado');
        } else if(html.classList.contains('descanso')){
            html.classList.remove('descanso');
            btnTipo[0].classList.add('ativado');
            btnTipo[2].classList.remove('ativado');
        }

        frsCiclo.textContent = 'Foco!'
        start.textContent = 'Começar';

        h.min = tempo.pomodoro;
        h.seg = '00';
        setTime(h);

        flag = 0;
        estado = 'pomodoro';
    },

    pausa: () => {
        clearInterval(cronometro);
    
        html = document.querySelector('html');
        frsCiclo = document.getElementById('cicle-title');
        start = document.getElementById('start');
    
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

        frsCiclo.textContent = 'Pausa!'
        start.textContent = 'Começar';
    
        h.min = tempo.pausa;
        h.seg = '00';
        setTime(h);
    
        flag = 0;
        estado = 'pausa';    
    },
    
    descanso: () => {
        clearInterval(cronometro);

        html = document.querySelector('html');
        frsCiclo = document.getElementById('cicle-title');
        start = document.getElementById('start');

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

        frsCiclo.textContent = 'Descanso!'
        start.textContent = 'Começar';

        h.min = tempo.descanso;
        h.seg = '00';
        setTime(h);

        flag = 0;
        estado = 'descanso';
    },
}

const controlaCiclo = () => {
    ciclo++;
    if(ciclo == 6){
        ciclo = 1;
    }
    document.getElementById('cicle').textContent = `#${ciclo}`;
}

const limpaCampo = () => {
    document.getElementById('task-title').value = "";
    document.getElementById('task-cicle').value = "";
}

const proximoEstado = () => {
    const skip = document.getElementById('skip-next');
    skip.classList.add('invisible');

    if(estado == 'pomodoro'){
        controlaCiclo();
        if(ciclo == 5){
            change["descanso"]();
        } else {
            change["pausa"]();
        }
    } else {
        if(estado == 'descanso'){
            controlaCiclo();
        }
        change["pomodoro"]();
    }
}

const validaMin = (min) => {
    if(min < 10 && min.length < 2){
        return `0${min}`;
    } else if (min != 0){
        return `${min}`;
    }

    return "01";
}

document.getElementById('btnConfig').addEventListener('click', () => {
    tempo.pomodoro = validaMin(document.getElementById('min-form-pomo').value);
    tempo.pausa = validaMin(document.getElementById('min-form-pausa').value);
    tempo.descanso = validaMin(document.getElementById('min-form-descanso').value);

    change[estado]();

    $('#modal-config').modal('hide');
});

btnTipo[0].addEventListener('click', () => {
    change["pomodoro"]();
});

btnTipo[1].addEventListener('click', () => {
    change["pausa"]();
});

btnTipo[2].addEventListener('click', () => {
    change["descanso"]();
});

let cronometro;

document.getElementById('start').addEventListener('click', (e) => {
    const skip = document.getElementById('skip-next');

    skip.classList.remove('invisible');
    let hora = getTime();

    if(flag == 0){
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
                const audio = new Audio("effects.wav");
                audio.play();
                proximoEstado();
            } 
        }, 1000);

        flag = 1;

        e.target.textContent = 'Pausar';
    } else {
        clearInterval(cronometro);
        flag = 0;

        e.target.textContent = 'Começar';
    } 
});

document.getElementById('start').addEventListener('dblclick', () => {
    document.getElementById('skip-next').classList.add('invisible');

    if(estado == 'pomodoro'){
        change["pomodoro"]();
    } else if(estado == 'pausa'){
        change["pausa"]();
    } else {
        change["descanso"]();
    }
});

document.getElementById('skip-next').addEventListener('click', () => {
    document.getElementById('start');
    proximoEstado(start);
})

document.getElementById('adc-task').addEventListener('click', () => {
    let task = {
        title: document.getElementById('task-title').value,
        cicle: document.getElementById('task-cicle').value,
    }

    if(task.title == ""){
        $('#modal-addTask').modal('hide');
        alert("O campo de título não pode ser vazio!");
        limpaCampo();
        return;
    } else if (task.cicle == ""){
        task.cicle = 1;
    }

    tasks.push(task);

    taskTemplate = `<li class="d-flex align-items-center justify-content-between task" id="li${tasks.length}">
                <div class="d-flex justify-content-center align-items-center h-100">
                    <input type="checkbox" name="task${tasks.length}" id="task${tasks.length}" class="mr-3">
                    <label for="task${tasks.length}" class="d-flex flex-column">
                        <h4 class="my-0 h6">0/${task.cicle} ciclo(s)</h4>
                        <h3 class="my-0 h5">${task.title}</h3>
                    </label>
                </div>

                <div class="d-flex">
                    <div class="d-none align-items-center justify-content-center">
                        <span class="material-symbols-outlined circle mr-1 edit">edit</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <span class="material-symbols-outlined circle del">delete</span>
                    </div>
                </div>
            </li>`

    taskHtml = document.createRange().createContextualFragment(taskTemplate);
    lista = document.querySelector("#to-do ul");
    lista.appendChild(taskHtml);

    $('#modal-addTask').modal('hide');

    limpaCampo();
});

document.querySelector('.tasks').addEventListener('click', (e) => {
    const li = e.target.closest('.task');
    ul = e.target.closest(".tasks");
    nodes = Array.from(ul.children);
    idLi = nodes.indexOf(li);

    if(e.target.classList.contains('del')){
        tasks.splice(idLi,1);
        ul.removeChild(li);
    }
});