// let todos = [];

//* select
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");

//* event
todoForm.addEventListener("submit", addNewToDo);

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodo(todos);
});

//* function
function addNewToDo(e) {
  e.preventDefault();

  if (!todoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };

  // todos.push(newTodo);
  saveTodo(newTodo);
  filterTodos();
}

function createTodo(todos) {
  //* create todo on DOM
  let result = "";

  todos.forEach((todo) => {
    result += `<li class="todo">
          <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
          <span class="todo__createdAt">${new Date(
            todo.createAt
          ).toLocaleDateString("fa-ir")}</span>
          <button class="todo__edit" data-todo-id=${
            todo.id
          }><i class="far fa-edit"></i></button>
          <button class="todo__check" data-todo-id=${
            todo.id
          }><i class="far fa-check-square"></i></button>
          <button class="todo__remove" data-todo-id=${
            todo.id
          }><i class="far fa-trash-alt"></i></button>
        </li>`;
  });

  todoList.innerHTML = result;
  todoInput.value = "";

  // ? Delete item
  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  // ? check item
  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  // ? edit item
  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodo));
}

// *  filter status
let filtervalue = "all";
const selectfilter = document.querySelector(".filter-todos");

selectfilter.addEventListener("change", (e) => {
  filtervalue = e.target.value;
  filterTodos();
});

function filterTodos() {
  const todos = getAllTodos();
  switch (filtervalue) {
    case "all": {
      createTodo(todos);
      break;
    }

    case "completed": {
      const filterTodos = todos.filter((t) => t.isCompleted);
      createTodo(filterTodos);
      break;
    }

    case "uncompleted": {
      const filterTodos = todos.filter((t) => !t.isCompleted);
      createTodo(filterTodos);
      break;
    }

    default:
      createTodo(todos);
  }
}

//* fun removeTodo
function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}

//* fun checkTodo
function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

// localStorage => web API

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  // const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//* fun edit
const closeModalBtns = document.querySelectorAll(".close-modal");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const editTodoInput = document.querySelector("#edit-todo");

function openModal() {
  backdrop.classList.remove("hidden");
}

function closeModal() {
  backdrop.classList.add("hidden");
}

// openModalBtn.addEventListener("click", openModal);
closeModalBtns.forEach((btn) => btn.addEventListener("click", closeModal));
backdrop.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => e.stopPropagation());

function editTodo(e) {
  openModal();

  let todos = getAllTodos();
  const todoIds = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoIds);
  editTodoInput.value = todo.title;

  const confirmEditBtn = document.querySelector(".accept-btn");
  confirmEditBtn.addEventListener("click", () => {
    const newTitle = editTodoInput.value;
    todo.title = newTitle;

    saveAllTodos(todos);
    filterTodos();
    closeModal(); // بستن مودال
  });
}
