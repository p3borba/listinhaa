let tasks = [
    { text: 'Estudar para a prova', completed: false },
    { text: 'Fazer um projeto de arte', completed: false },
    { text: 'Ler 20 páginas de um livro', completed: true },
    { text: 'Praticar exercícios físicos', completed: false },
    { text: 'Organizar a mochila', completed: true },
    { text: 'Ajudar nas tarefas domésticas', completed: false },
    { text: 'Revisar conteúdo de matemática', completed: true }
];

function renderTasks() {
    const list = document.getElementById('task-list');
    const filter = document.getElementById('filter-tasks').value;
    list.innerHTML = '';

    tasks.forEach((task, index) => {
        if (
            filter === 'completed' && !task.completed ||
            filter === 'incomplete' && task.completed
        ) {
            return;
        }

        const taskEl = document.createElement('div');
        taskEl.className = 'task' + (task.completed ? ' completed' : '');

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(index);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + task.text));

        taskEl.appendChild(label);
        list.appendChild(taskEl);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function addTask() {
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        input.value = '';
        renderTasks();
    }
}

document.getElementById('filter-tasks').addEventListener('change', renderTasks);
window.onload = renderTasks;