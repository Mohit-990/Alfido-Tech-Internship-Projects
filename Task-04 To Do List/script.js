const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateStats();
});

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    
    taskInput.value = '';
    taskInput.focus();
}

// Render all tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks yet. Add your first task!</li>';
        return;
    }
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
    }
}
const clearAllBtn = document.createElement('button');
clearAllBtn.textContent = 'Clear All';
clearAllBtn.style.cssText = 'background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 3px; cursor: pointer; margin-left: 10px;';
clearAllBtn.onclick = clearAllTasks;

// Add clear all button to stats section
document.querySelector('.stats p').appendChild(clearAllBtn);
