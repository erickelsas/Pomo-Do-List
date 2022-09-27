let ciclo = 1;
let flag = 0;
let estado = 'pomodoro';
let tasks = [];
let tempo = {}

let editId = null;

const btnTipo = document.querySelectorAll('#pomodoro .fundo-btn');

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

const limpaCampoEdit = () => {
    document.getElementById('task-title-edit').value = "";
    document.getElementById('task-cicle-edit').value = "";
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

const atualizaCiclo = () => {
    flagCicle = 0;
    i = 0;
    do{
        if(i == tasks.length){
            flagCicle = 1;
        } else if(tasks[i].cicleAtual < tasks[i].cicle && flagCicle != 1){
            tasks[i].cicleAtual += 1;
            flagCicle = 1;

            cicleText = document.querySelector(`#cicle${i}`);
            cicleText.textContent = `${tasks[i].cicleAtual}/${tasks[i].cicle} ciclo(s)`;

            if(tasks[i].cicleAtual == tasks[i].cicle){
                document.querySelector(`#task${i}`).checked = true;
            }
        }

        i++;
    }while(flagCicle != 1)
}

document.getElementById('btnConfig').addEventListener('click', () => {
    tempo.pomodoro = validaMin(document.getElementById('min-form-pomo').value);
    tempo.pausa = validaMin(document.getElementById('min-form-pausa').value);
    tempo.descanso = validaMin(document.getElementById('min-form-descanso').value);

    addTempoLocal();
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

                atualizaCiclo();
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
    if(estado == 'pomodoro' && tasks.length != 0){
        atualizaCiclo();
    }

    proximoEstado();
})

const addTaskToHtml = (task , i) => {
    taskTemplate = `<li class="d-flex align-items-center justify-content-between task" id="li${i}">
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <input type="checkbox" name="task${i}" id="task${i}" class="mr-3">
                            <label for="task${i}" class="d-flex flex-column">
                                <h4 class="my-0 h6" id="cicle${i}">0/${task.cicle} ciclo(s)</h4>
                                <h3 class="my-0 h5" id="task-title${i}">${task.title}</h3>
                            </label>
                        </div>

                        <div class="d-flex">
                            <div class="d-flex align-items-center justify-content-center">
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
}

const addTempoLocal = () => {
    localStorage.configTempo = JSON.stringify(tempo);
}

const addTaskLocal = (task) => {
    if(localStorage.localTasks){
        tasks = JSON.parse(localStorage.getItem('localTasks'));
    }

    tasks.push(task);
    localStorage.localTasks = JSON.stringify(tasks);
}

const removeTaskLocal = (id) => {
    if(localStorage.localTasks){
        tasks = JSON.parse(localStorage.getItem('localTasks'));
        tasks.splice(id, 1);
        localStorage.localTasks = JSON.stringify(tasks);
    }
}

const editTaskLocal = () => {

}

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.configTempo){
        tempo = JSON.parse(localStorage.getItem('configTempo'));
    } else {
        tempo.pomodoro = "25";
        tempo.pausa = "05";
        tempo.descanso = "15";

        localStorage.configTempo = JSON.stringify(tempo);
    }

    if(localStorage.localTasks){
        tasks = JSON.parse(localStorage.getItem('localTasks'));

        i = 0;
        while(i < tasks.length){
            addTaskToHtml(tasks[i], i);
            i++;
        }
    }

    change[estado]();
})

document.getElementById('adc-task').addEventListener('click', () => {
    let task = {
        title: document.getElementById('task-title').value,
        cicle: document.getElementById('task-cicle').value,
        cicleAtual: 0,
    }

    if(task.title == ""){
        $('#modal-addTask').modal('hide');
        alert("O campo de título não pode ser vazio!");
        limpaCampo();
        return;
    } else if (task.cicle == ""){
        task.cicle = 1;
    }

    addTaskToHtml(task, tasks.length);
    addTaskLocal(task);

    $('#modal-addTask').modal('hide');

    limpaCampo();
});

document.querySelector('.tasks').addEventListener('click', (e) => {
    const li = e.target.closest('.task');
    ul = e.target.closest(".tasks");
    nodes = Array.from(ul.children);
    idLi = nodes.indexOf(li);

    if(e.target.classList.contains('del')){
        removeTaskLocal(idLi);
        ul.removeChild(li);
    }

    if(e.target.classList.contains('edit')){
        $('#modal-editTask').modal('show');
        
        editId = idLi;
    }
});

document.querySelector('#close').addEventListener('click', (e) => {
    document.querySelector('.hamburguer').classList.toggle('change');
})

document.querySelector('#edit-task').addEventListener('click', () => {
    if(document.getElementById('task-title-edit').value != ""){
        tasks[editId].title = document.getElementById('task-title-edit').value;
    }
    
    if(document.getElementById('task-cicle-edit').value != ""){
        tasks[editId].cicle = document.getElementById('task-cicle-edit').value;
    }


    if(tasks[editId].cicle > tasks[editId].cicleAtual){
        document.querySelector(`#task${editId}`).checked = false;
    } else if (tasks[editId].cicle < tasks[editId].cicleAtual){
        document.querySelector(`#task${editId}`).checked = true;
    }

    localStorage.localTasks = JSON.stringify(tasks);

    document.querySelector(`#cicle${editId}`).textContent = `${tasks[editId].cicleAtual}/${tasks[editId].cicle} ciclo(s)`;
    document.querySelector(`#task-title${editId}`).textContent = `${tasks[editId].title}`;

    limpaCampoEdit();
    $('#modal-editTask').modal('hide');
})