document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const progressBar = document.getElementById('progress-bar');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('toggle-theme');
    const dueDateInput = document.getElementById('due-date');
    const priorityInput = document.getElementById('priority');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodoItem(todoInput.value, dueDateInput.value, priorityInput.value);
        todoInput.value = '';
        dueDateInput.value = '';
        updateProgress();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterTodos(filter);
        });
    });

    function addTodoItem(todoText, dueDate, priority) {
        const todo = { text: todoText, dueDate: dueDate, priority: priority, completed: false };
        todos.push(todo);
        saveTodos();
        renderTodos();
        updateProgress();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.textContent = `${todo.text} (Due: ${todo.dueDate || 'No due date'})`;
            li.classList.add(`priority-${todo.priority}`);
            if (todo.completed) li.classList.add('complete');

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', function() {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
                updateProgress();
            });

            li.addEventListener('click', function() {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
                updateProgress();
            });

            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    function filterTodos(priority) {
        if (priority === 'all') {
            renderTodos();
        } else {
            todoList.innerHTML = '';
            todos
                .filter(todo => todo.priority === priority)
                .forEach((todo, index) => {
                    const li = document.createElement('li');
                    li.textContent = todo.text;
                    li.classList.add(`priority-${todo.priority}`);
                    if (todo.completed) li.classList.add('complete');
                    todoList.appendChild(li);
                });
        }
    }

    function updateProgress() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
    }

    renderTodos();
    updateProgress();
});


