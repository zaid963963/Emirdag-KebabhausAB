// Initialize app
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearBtn');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');

let todos = [];
let currentFilter = 'all';

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// Add event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearBtn.addEventListener('click', clearCompleted);

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
}

// Render todos based on filter
function renderTodos() {
    todoList.innerHTML = '';

    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Clear all completed todos
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    
    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completed: ${completed}`;
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
