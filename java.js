document.addEventListener('DOMContentLoaded', function() {
    const blocksContainer = document.getElementById('blocks-container');
    const btnAddBlock = document.getElementById('btn-add-block');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    addNewBlock('Tarefas Pendentes');
    const completedBlock = addNewBlock('Tarefas Concluídas');
    completedBlock.classList.add('completed-block');
    completedBlock.style.display = 'none';
    
    btnAddBlock.addEventListener('click', function() {
        addNewBlock('Novo Bloco');
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterTasks(filter);
        });
    });
    
    function addNewBlock(title) {
        const blockId = Date.now();
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.dataset.id = blockId;
        
        blockElement.innerHTML = `
            <div class="block-header">
                <input type="text" class="block-title" value="${title}" placeholder="Nome do bloco">
                <div class="block-actions">
                    <button class="block-btn btn-add-task" title="Adicionar tarefa">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="block-btn btn-delete-block" title="Excluir bloco">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <ul class="task-list"></ul>
            <div class="add-task-form">
                <input type="text" class="task-input" placeholder="Nova tarefa...">
                <button class="add-task-btn"><i class="fas fa-plus"></i></button>
            </div>
        `;
        
        const btnAddTask = blockElement.querySelector('.btn-add-task');
        const btnDeleteBlock = blockElement.querySelector('.btn-delete-block');
        const taskInput = blockElement.querySelector('.task-input');
        const addTaskBtn = blockElement.querySelector('.add-task-btn');
        const taskList = blockElement.querySelector('.task-list');
        const blockTitle = blockElement.querySelector('.block-title');
        
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        
        addTaskBtn.addEventListener('click', addTask);
        
        btnAddTask.addEventListener('click', function() {
            taskInput.focus();
        });
        
        btnDeleteBlock.addEventListener('click', function() {
            if (blockElement.classList.contains('completed-block')) {
                alert('O bloco de tarefas concluídas não pode ser removido!');
                return;
            }
            blockElement.remove();
        });
        
        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText === '') return;
            
            const taskId = Date.now();
            const taskElement = createTaskElement(taskText, taskId, false);
            
            taskList.appendChild(taskElement);
            taskInput.value = '';
            taskInput.focus();
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            if (activeFilter !== 'all') {
                filterTasks(activeFilter);
            }
        }
        
        blocksContainer.appendChild(blockElement);
        taskInput.focus();
        return blockElement;
    }
    
    function createTaskElement(text, id, isCompleted) {
        const taskElement = document.createElement('li');
        taskElement.className = 'task-item';
        taskElement.dataset.id = id;
        
        if (isCompleted) {
            taskElement.classList.add('task-completed');
        }
        
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
            <span class="task-text">${text}</span>
            <div class="task-actions">
                <button class="task-btn edit" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        const checkbox = taskElement.querySelector('.task-checkbox');
        const btnEdit = taskElement.querySelector('.edit');
        const btnDelete = taskElement.querySelector('.delete');
        const taskTextElement = taskElement.querySelector('.task-text');
        
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            taskElement.classList.toggle('task-completed', isChecked);
            
            const currentBlock = taskElement.closest('.block');
            const completedBlock = document.querySelector('.completed-block');
            
            if (isChecked && !currentBlock.classList.contains('completed-block')) {
                completedBlock.querySelector('.task-list').appendChild(taskElement);
                completedBlock.style.display = 'block';
            } else if (!isChecked && currentBlock.classList.contains('completed-block')) {
                const firstRegularBlock = document.querySelector('.block:not(.completed-block)');
                firstRegularBlock.querySelector('.task-list').appendChild(taskElement);
            }
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            if (activeFilter !== 'all') {
                filterTasks(activeFilter);
            }
        });
        
        btnEdit.addEventListener('click', function() {
            const newText = prompt('Editar tarefa:', taskTextElement.textContent);
            if (newText && newText.trim() !== '') {
                taskTextElement.textContent = newText.trim();
            }
        });
        
        btnDelete.addEventListener('click', function() {
            taskElement.remove();
            
            const completedBlock = document.querySelector('.completed-block');
            if (completedBlock.querySelectorAll('.task-item').length === 0) {
                completedBlock.style.display = 'none';
            }
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            if (activeFilter !== 'all') {
                filterTasks(activeFilter);
            }
        });
        
        return taskElement;
    }
    
    function filterTasks(filter) {
        const allBlocks = document.querySelectorAll('.block');
        
        allBlocks.forEach(block => {
            const isCompletedBlock = block.classList.contains('completed-block');
            const tasks = block.querySelectorAll('.task-item');
            let hasVisibleTasks = false;
            
            tasks.forEach(task => {
                const isCompleted = task.classList.contains('task-completed');
                
                switch(filter) {
                    case 'completed':
                        task.style.display = isCompleted ? 'flex' : 'none';
                        if (isCompleted) hasVisibleTasks = true;
                        break;
                    case 'pending':
                        task.style.display = !isCompleted ? 'flex' : 'none';
                        if (!isCompleted) hasVisibleTasks = true;
                        break;
                    default:
                        task.style.display = 'flex';
                        hasVisibleTasks = true;
                }
            });
            
            if (filter === 'all') {
                block.style.display = 'block';
            } else {
                block.style.display = hasVisibleTasks ? 'block' : 'none';
            }
        });
    }
});