// script.js

document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('all').addEventListener('click', showAllTasks);
document.getElementById('completed').addEventListener('click', showCompletedTasks);
document.getElementById('pending').addEventListener('click', showPendingTasks);

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTask);

function addTask() {
    const maxLength = 40;
    const taskText = taskInput.value.trim();
    if (taskText.length > maxLength) {
        alert(`La tarea no puede tener más de ${maxLength} caracteres.`);
        return;
    }
    const existingTasks = Array.from(taskList.querySelectorAll('li span'))
    .map(span => span.textContent.trim().toLowerCase());

if (existingTasks.includes(taskText.toLowerCase())) {
alert('Esta tarea ya existe.');
return;}
    if (taskText !== "") {
        const li = document.createElement('li');
        li.innerHTML = `<span>${taskText}</span>
                        <button class="edit-btn">✏️</button>
                        <button class="complete-btn">✔️</button>
                        <button class="delete-btn">🗑️</button>`;
        taskList.appendChild(li);
        saveTask(taskText);
        taskInput.value = "";
    }
}

function handleTask(e) {
    if (e.target.classList.contains('complete-btn')) {
        e.target.parentElement.classList.toggle('completed');
        updateLocalStorage();
    } else if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
        removeTask(e.target.parentElement.textContent);
    } else if (e.target.classList.contains('edit-btn')) {
        editTask(e.target.parentElement);
    }
}

function saveTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.text}</span>
                        <button class="edit-btn">✏️</button>
                        <button class="complete-btn">✔️</button>
                        <button class="delete-btn">🗑️</button>`;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}

function removeTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('span').textContent;
        const isCompleted = li.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function showAllTasks() {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => task.style.display = 'flex');
}

function showCompletedTasks() {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function showPendingTasks() {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        if (!task.classList.contains('completed')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
function editTask(taskElement) {
    const taskText = taskElement.querySelector('span').textContent;
    const newTaskText = prompt('Edita la tarea:', taskText);
    if (newTaskText) {
        taskElement.querySelector('span').textContent = newTaskText;
        // Si la tarea estaba marcada como completada, la ponemos como pendiente
        if (taskElement.classList.contains('completed')) {
            taskElement.classList.remove('completed');
        }

        // Actualizamos el localStorage
        updateLocalStorage();

    }
}