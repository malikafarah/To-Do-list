const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const deleteAllBtn = document.getElementById("delete-all-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateProgress = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    const offset = 565.48 * (1 - percent / 100);

    const innerCircle = document.querySelector('.inner');
    const percentText = document.querySelector('.text h2');

    if (innerCircle) innerCircle.style.strokeDashoffset = offset;
    if (percentText) percentText.textContent = `${percent}%`;
};

const toggleDeleteAllButton = () => {
    deleteAllBtn.style.display = tasks.length > 0 ? 'inline-block' : 'none';
};

const renderTask = (taskObj) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (taskObj.completed) li.classList.add('completed');

    li.innerHTML = `
        <div>
            <input type="checkbox" class="checkbox" ${taskObj.completed ? 'checked' : ''}>
            <span class="task">${taskObj.text}</span>
        </div>
        <div class="task-buttons">
            <button class="edit-btn btn"><i class="fas fa-pen"></i></button>
            <button class="delete-btn btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
        taskObj.completed = checkbox.checked;
        li.classList.toggle('completed', taskObj.completed);
        editBtn.disabled = taskObj.completed;
        editBtn.style.opacity = taskObj.completed ? '0.5' : '1';
        editBtn.style.pointerEvents = taskObj.completed ? 'none' : 'auto';
        saveTasks();
        updateProgress();
    });

    editBtn.addEventListener('click', () => {
        if (!taskObj.completed) {
            taskInput.value = taskObj.text;
            tasks = tasks.filter(t => t !== taskObj);
            li.remove();
            saveTasks();
            updateProgress();
            toggleDeleteAllButton();
        }
    });

    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== taskObj);
        li.remove();
        saveTasks();
        updateProgress();
        toggleDeleteAllButton();
    });

    taskList.appendChild(li);
};

const addTask = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const taskObj = { text: taskText, completed: false };
    tasks.push(taskObj);
    saveTasks();
    renderTask(taskObj);
    updateProgress();
    toggleDeleteAllButton();
    taskInput.value = '';
};

deleteAllBtn.addEventListener('click', () => {
    tasks = [];
    taskList.innerHTML = '';
    saveTasks();
    updateProgress();
    toggleDeleteAllButton();
});

tasks.forEach(renderTask);
updateProgress();
toggleDeleteAllButton();

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(e);
    }
});
