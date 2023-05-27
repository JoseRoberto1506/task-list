const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");

const tasksContainer = document.querySelector(".tasks-container");

// Verifica se o input é válido
const validateInput = () => inputElement.value.trim().length > 0;

// Lida com a adição da task
const handleAddTask = () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  // Cria uma div com a classe 'task-item' para a task adicionada
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  // Cria um parágrafo para mostrar qual é a task
  const taskContent = document.createElement("p");
  taskContent.innerText = inputElement.value;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  // Cria o elemento 'i', que carrega o ícone de lixeira paara excluir uma task
  const deleteItem = document.createElement("i");
  deleteItem.classList.add("fa-regular");
  deleteItem.classList.add("fa-trash-can");

  deleteItem.addEventListener("click", () =>
    handleDeleteClick(taskItemContainer, taskContent)
  );

  // Adicionar a task
  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItem);
  tasksContainer.appendChild(taskItemContainer);

  // Limpa o input após adicionar uma task
  inputElement.value = "";

  updateLocalStorage();
};

/*  1. Pega todos os items das tarefas; 2. Fazer um loop entre eles; 3. Verifica se o item atual do loop é o mesmo item que foi clicado;
    4. Se o passo 3 for true, atualiza a classe do item para 'completed' */
const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  updateLocalStorage();
};

/*  1. Pega todos os items das tarefas; 2. Fazer um loop entre eles; 3. Verifica se o item atual do loop é o mesmo item que foi clicado;
    4. Se o passo 3 for true, remove a task da lista */
const handleDeleteClick = (taskItemContainer, taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  updateLocalStorage();
};

// Remove a estilização de erro quando uma nova task é digitada e adicionada
const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

/* Local Storage é basicamente um armazenamento que todos os navegadores têm por padrão.
Esse armazenamento persiste mesmo se a página for recarregada. */
const updateLocalStorage = () => {
  const tasks = tasksContainer.childNodes;

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild;
    const isCompleted = content.classList.contains("completed");

    return { description: content.innerText, isCompleted };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-regular");
    deleteItem.classList.add("fa-trash-can");

    deleteItem.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskContent)
    );

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
  }
};

refreshTasksUsingLocalStorage();

// Quando o botão de adicionar for clicado, chama a função responsável por criar a task
addTaskButton.addEventListener("click", () => handleAddTask());

// Quando for digitada uma nova task, a estilização de erro é removida
inputElement.addEventListener("change", () => handleInputChange());
