/* СОСТОЯНИЕ */

let state = {
    tasks: [],
    statusFilter: "all",
    sortFilter: "newest"
};


/* ЧИСТЫЕ ФУНКЦИИ */

// Добавление задачи
const addTask = (tasks, text) => [
    ...tasks,
    {
        id: Date.now(),
        text,
        completed: false,
        createdAt: Date.now()
    }
];

// Переключение чекбокса
const toggleTask = (tasks, id) =>
    tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

// Удаление
const deleteTask = (tasks, id) =>
    tasks.filter(task => task.id !== id);

// Фильтрация по статусу
const filterByStatus = (tasks, status) => {
    switch (status) {
        case "active":
            return tasks.filter(task => !task.completed);
        case "completed":
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
};

// Сортировка по времени
const sortByDate = (tasks, order) => {
    const sorted = [...tasks];
    return order === "newest"
        ? sorted.sort((a, b) => b.createdAt - a.createdAt)
        : sorted.sort((a, b) => a.createdAt - b.createdAt);
};


/* ОБНОВЛЕНИЕ СОСТОЯНИЯ */

const setState = (newState) => {
    state = { ...state, ...newState };
    render();
};


/* РЕНДЕР */

const render = () => {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const visibleTasks = sortByDate(
        filterByStatus(state.tasks, state.statusFilter),
        state.sortFilter
    );

    visibleTasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        // Левая часть (текст + дата)
        const leftBlock = document.createElement("div");
        leftBlock.className = "task-left";

        const topRow = document.createElement("div");
        topRow.className = "task-top";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onchange = () =>
            setState({ tasks: toggleTask(state.tasks, task.id) });

        const text = document.createElement("span");
        text.textContent = task.text;
        if (task.completed) text.classList.add("completed");

        topRow.appendChild(checkbox);
        topRow.appendChild(text);

        const time = document.createElement("div");
        time.className = "time";
        time.textContent = new Date(task.createdAt).toLocaleString();

        leftBlock.appendChild(topRow);
        leftBlock.appendChild(time);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удаление";
        deleteBtn.onclick = () =>
            setState({ tasks: deleteTask(state.tasks, task.id) });

        div.appendChild(leftBlock);
        div.appendChild(deleteBtn);

        list.appendChild(div);
    });
};


/* СОБЫТИЯ */

document.getElementById("addBtn").onclick = () => {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text) {
        setState({ tasks: addTask(state.tasks, text) });
        input.value = "";
    }
};

document.getElementById("statusFilter").onchange = (e) =>
    setState({ statusFilter: e.target.value });

document.getElementById("sortFilter").onchange = (e) =>
    setState({ sortFilter: e.target.value });


render();
