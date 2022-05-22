const url_api = '/api/v1/todo';

const FILTER_GROUP = '#filter_group';
const TASKS = '#tasks_list';

const FILTER_ALL = 'FILTER_ALL';
const FILTER_ACTIVE = 'FILTER_ACTIVE';
const FILTER_COMPLITED = 'FILTER_COMPLITED';

let FILTER_SELECTED = FILTER_ALL;

CSS_FILTER_SELECTED = "filter_selected"

function getTasks() {
    
    fetch(url_api)
        .then(response => response.json())
        .then(data => showItems(data))
        .catch(error => console.error('Unable to get items.', error));
}
function showItems(data) {
    
    document.querySelector(TASKS).innerHTML = "";
    tasksList = data;
    if (data.length)
        data[0].forEach((itemTask) => HTMLaddTask(itemTask));
}


function selectTaskBySelectedFilter(taskElement, FILTER_SELECTED = FILTER_ACTIVE) {
    
    switch (FILTER_SELECTED) {
        case FILTER_ALL: return buildTaskElement(taskElement)
        case FILTER_ACTIVE: return !taskElement.is_complete ? buildTaskElement(taskElement) : undefined
        case FILTER_COMPLITED: return taskElement.is_complete ? buildTaskElement(taskElement) : undefined
        default: return undefined
    }
}

function HTMLaddTask(taskElement) {
    
    divTaskElement = selectTaskBySelectedFilter(taskElement, FILTER_SELECTED)
    if (divTaskElement)
        document.querySelector(TASKS).innerHTML += divTaskElement;
}

function buildTaskElement(taskElement) {
    

    task_element = taskElement.is_complete ?
        `<span class="status2">Выполнено</span>
     <a onclick=buttonUndone(${taskElement.id}) class="blue button">
        Отменить
     </a>` :
        `<span class="status1">Активно</span>
     <a onclick=buttonDone(${taskElement.id}) class="green button">
        Выполнить
     </a>`

    return `
    <div class="ui segment" id=${taskElement.id}>
        <p class="header">№${taskElement.id} | ${taskElement.title}</p>
        ${task_element}
        <a onclick=buttonDelete(${taskElement.id})  class="red button">Удалить</a>
    </div>
    `;
}



function buildElementFilterButtons() {
    
    return `
        <div class="menu__filter">
            <button onclick=SelectFilter(${FILTER_ALL}) 
            id=${FILTER_ALL} 
            class="button all ${FILTER_SELECTED === FILTER_ALL ?
            CSS_FILTER_SELECTED : 'blue'}">Все</button>

            <button onclick=SelectFilter(${FILTER_ACTIVE})
             id=${FILTER_ACTIVE} class="button active ${FILTER_SELECTED === FILTER_ACTIVE ?
                 CSS_FILTER_SELECTED :'blue'}">Активные</button>
            <button onclick=SelectFilter(${FILTER_COMPLITED})
             id=${FILTER_COMPLITED} class="button done ${FILTER_SELECTED === FILTER_COMPLITED ?
                 CSS_FILTER_SELECTED : 'blue'}">Выполненные</button>
        </div>
    `;

}



function ButtonsFilters(filterIdSelected = FILTER_SELECTED) {
    
    document.querySelector(FILTER_GROUP).innerHTML = "";
    let element= buildElementFilterButtons(filterIdSelected)
    
    document.querySelector(FILTER_GROUP).innerHTML += element;
}


function SelectFilter(filterIdSelected = FILTER_SELECTED) {
    
    FILTER_SELECTED = filterIdSelected;
    ButtonsFilters()
    getTasks()
}





function buttonDelete(id) {
    
    const divTask = document.getElementById(id);
    fetch(`${url_api}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(() => getTasks())
        .then(() => divTask.outerHTML = "")
        .catch(error => console.error(`Unable to delete file ${id}`, error))
}

function buttonDone(id) {
    
    id = id + ''
    const divTask = document.getElementById(id);
    if (divTask) {
        Changestatus(id)
    }
}

function buttonUndone(id) {
    
    id = id + ''
    const divTask = document.getElementById(id);
    if (divTask) {
        Changestatus(id, false)
    }
}

function addTask() {
    
    const newTaskTitle = document.getElementById('newtask_title');
    const item = {
        id: 0,
        title: newTaskTitle.value.trim()
    };

    if (item.title) {
        fetch(url_api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json())
            .then(() => getTasks())
            .then(() => newTaskTitle.value = "")
            .catch(error => console.error('Unable to add item.', error))
    }
}

function Changestatus(id, taskStatus = true) {
    
    id = id + '';
    let itemTask = getAttributesOfTask(id);
    
    itemTask["is_complete"] = taskStatus;

    if (itemTask.title) {
        fetch(url_api + `/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemTask)
        })
            .then(response => response.json())
            .then(() => getTasks())
            .catch(error => console.error('Unable to add item.', error));
    }
}

function getAttributesOfTask(id) {
    
    const divTask = document.getElementById(id + '');
    const taskElement = {
        id: id,
        is_complete: Boolean(divTask.childNodes[3].className === 'status2'),
        title: divTask.childNodes[1].textContent.trim().split('|')[1].trim()
    }
    return taskElement;

}