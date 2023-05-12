import { checkAuth, getUserId } from "./cookie.js";
import { database } from "./config.js";
import {ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const result = checkAuth();
const userId = getUserId();
console.log(userId);

if (userId) {
    get(ref(database, "users/" + userId))
    .then((snapshot) => {
        if (snapshot.exists()) {
            const email = snapshot.val().email;
            console.log(email);
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

let signup = document.querySelector(".header-links__signup");
let signin = document.querySelector(".header-links__signin");
let exit = document.querySelector(".header-links__exit");
let links = document.getElementById("link");

if (result == false) {
    signup.style.display = "none";
    signin.style.display = "none";
    links.innerHTML += `<a class="header-links__username">saltyclone@mail.ru</a>`;
} else {
    exit.style.display = "none";
}

exit.onclick = function () {
    document.cookie = "";
    window.location.replace("../html/SignIn.html");
};

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementById("ModalClose");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let todoList = [];

let noteTitle = document.querySelector(".title__note");
let noteInfo = document.querySelector(".details__note");
let noteDate = document.querySelector(".date__note");
let createTask = document.getElementById("createTask");

let todoCurrent = document.querySelector(".current-notes__list");
let todoCompleted = document.querySelector(".completed-notes__list");

let emptyTasks = document.querySelector(".tasks-empty");

if (localStorage.getItem("todo")) {
  todoList = JSON.parse(localStorage.getItem("todo"));
  displayCurrentMessages();
  displayCompletedMessages();
}

function CreateNewTodo() {
  let newToDo = {
    noteTitle: noteTitle.value,
    noteInfo: noteInfo.value,
    noteDate: noteDate.value,
    checked: false,
  };

  if (!noteTitle.value) {
    alert("Please add some task!");
    return;
  }

  todoList.unshift(newToDo);
  displayCurrentMessages();
  displayCompletedMessages();
  localStorage.setItem("todo", JSON.stringify(todoList));

  noteTitle.value = "";
  noteInfo.value = "";
  noteDate.value = "";
  modal.style.display = "none";
}

createTask.addEventListener("click", CreateNewTodo);

function displayCurrentMessages() {
  let displayMessage = "";

  todoList.forEach(function (item, i) {
    if (item.checked === false) {
      displayMessage += `
      <li class="list__current-note" draggable="true">
        <div class="current-note__main">
            <div class="current-main__left">
                <input class="current-main__left__checkbox" type="checkbox" ${
                  item.checked ? "checked" : ""
                } id='item_${i}'>
                <p class="current-main__left__title" for='item_${i}'>${
        item.noteTitle
      }</p>
                <button id="button-down" data-action="info" data-id='${i}' style="border: none; ${
        item.noteInfo ? "" : "display: none;"
      }"><span class="down">&#8595;</span></button>
            </div>
            <div class="current-main__right">
                <span class="current-main__right__date" style="${item.noteDate && new Date() > new Date(item.noteDate) ? "color: red" : ""}">
                    ${item.noteDate ? item.noteDate : "No date"}
                </span>
                <button data-action="edit" style="border: none;" data-id='${i}'>
                  <span class="current-main__right__edit">&#9998;</span>
                </button>
                <button data-action="delete" style="border: none;" data-id='${i}'>
                  <span class="current-main__right__delete">&#128465;</span>
                </button>
            </div>
        </div>
        <div class="current-note__info" id="more-info_${i}" style="display: none;">
            <p class="current-note__info__text">${item.noteInfo}</p>
        </div>
      </li>
      `;
    }
  });

  if (todoList.length > 0 && displayMessage !== "") {
    emptyTasks.style.display = "none";
  } else {
    emptyTasks.style =
      "width: 100%; align-items: center; display: flex; flex-direction: column;";
  }

  todoCurrent.innerHTML = displayMessage;
}

function displayCompletedMessages() {
  let displayMessage = "";

  todoList.forEach(function (item, i) {
    if (item.checked === true) {
      displayMessage += `
      <li class="list__completed-note" draggable="true">
        <div class="completed-note__main">
            <div class="completed-main__left">
                <input class="completed-main__left__checkbox" type="checkbox" ${
                  item.checked ? "checked" : ""
                } id='item_${i}'>
                <p class="completed-main__left__title" for='item_${i}'>${
        item.noteTitle
      }</p>
                <button id="button-down" data-action="info" data-id='${i}' style="border: none; ${
        item.noteInfo ? "" : "display: none;"
      }"><span class="down">&#8595;</span></button>
            </div>
            <div class="completed-main__right">
                <span class="completed-main__right__date" style="${item.noteDate && new Date() > new Date(item.noteDate) ? "color: red" : ""}">
                    ${item.noteDate ? item.noteDate : "No date"}
                </span>
                <button data-action="edit" style="border: none;" data-id='${i}'>
                  <span class="completed-main__right__edit">&#9998;</span>
                </button>
                <button data-action="delete" style="border: none;" data-id='${i}'>
                  <span class="completed-main__right__delete">&#128465;</span>
                </button>
            </div>
        </div>
        <div class="completed-note__info" id="more-info_${i}" style="display: none;">
            <p class="completed-note__info__text">${item.noteInfo}</p>
        </div>
      </li>
      `;
    }
  });

  todoCompleted.innerHTML = displayMessage;
}

todoCurrent.addEventListener("change", function (event) {
  let id = event.target.getAttribute("id");
  let valueP = todoCurrent.querySelector("[for=" + id + "]").innerHTML;

  todoList.forEach(function (item) {
    if (item.noteTitle === valueP) {
      item.checked = !item.checked;
      displayCurrentMessages();
      displayCompletedMessages();
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
});

todoCompleted.addEventListener("change", function (event) {
  let id = event.target.getAttribute("id");
  let valueP = todoCompleted.querySelector("[for=" + id + "]").innerHTML;

  todoList.forEach(function (item) {
    if (item.noteTitle === valueP) {
      item.checked = !item.checked;
      displayCurrentMessages();
      displayCompletedMessages();
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
});

todoCurrent.addEventListener("click", deleteTask);
todoCompleted.addEventListener("click", deleteTask);

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  let id = event.target.getAttribute("data-id");
  todoList.splice(id, 1);
  displayCurrentMessages();
  displayCompletedMessages();
  localStorage.setItem("todo", JSON.stringify(todoList));
}

todoCurrent.addEventListener("click", editCurrentTask);
todoCompleted.addEventListener("click", editCompletedTask);

function editCurrentTask(event) {
  if (event.target.dataset.action !== "edit") return;

  const taskElement = event.target.closest(".list__current-note");

  const taskTitle = taskElement.querySelector(
    ".current-main__left__title"
  ).innerText;
  const taskDetails = taskElement.querySelector(
    ".current-note__info__text"
  ).innerText;
  const taskDate = taskElement.querySelector(
    ".current-main__right__date"
  ).innerText;

  const modal = document.getElementById("editModal");
  modal.style.display = "block";
  document.getElementById("editNoteTitle").value = taskTitle;
  document.getElementById("editNoteInfo").value = taskDetails;
  document.getElementById("editNoteDate").value = taskDate;

  editbtn.addEventListener("click", function () {
    let index = todoList.findIndex((item) => item.noteTitle === taskTitle);
    let todoItem = todoList[index];
    if (todoItem) {
      todoItem.noteTitle = document.getElementById("editNoteTitle").value;
      todoItem.noteInfo = document.getElementById("editNoteInfo").value;
      todoItem.noteDate = document.getElementById("editNoteDate").value;

      localStorage.setItem("todo", JSON.stringify(todoList));
    }
    displayCurrentMessages();
    displayCompletedMessages();
    Editmodal.style.display = "none";
  });
}

function editCompletedTask(event) {
  if (event.target.dataset.action !== "edit") return;

  const taskElement = event.target.closest(".list__completed-note");

  const taskTitle = taskElement.querySelector(
    ".completed-main__left__title"
  ).innerText;
  const taskDetails = taskElement.querySelector(
    ".completed-note__info__text"
  ).innerText;
  const taskDate = taskElement.querySelector(
    ".completed-main__right__date"
  ).innerText;

  const modal = document.getElementById("editModal");
  modal.style.display = "block";
  document.getElementById("editNoteTitle").value = taskTitle;
  document.getElementById("editNoteInfo").value = taskDetails;
  document.getElementById("editNoteDate").value = taskDate;

  editbtn.addEventListener("click", function () {
    let index = todoList.findIndex((item) => item.noteTitle === taskTitle);
    let todoItem = todoList[index];
    if (todoItem) {
      todoItem.noteTitle = document.getElementById("editNoteTitle").value;
      todoItem.noteInfo = document.getElementById("editNoteInfo").value;
      todoItem.noteDate = document.getElementById("editNoteDate").value;

      localStorage.setItem("todo", JSON.stringify(todoList));
    }
    displayCurrentMessages();
    displayCompletedMessages();
    Editmodal.style.display = "none";
  });
}

let editbtn = document.getElementById("editTask");
let Editmodal = document.getElementById("editModal");
let Editspan = document.getElementById("editModalClose");

editbtn.onclick = function () {
  Editmodal.style.display = "block";
};

Editspan.onclick = function () {
  Editmodal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == Editmodal) {
    Editmodal.style.display = "none";
  }
};

todoCurrent.addEventListener("click", GetInfo);
todoCompleted.addEventListener("click", GetInfo);

function GetInfo(event) {
  if (event.target.dataset.action !== "info") return;

  let id = event.target.getAttribute("data-id");
  let infoDiv = document.getElementById(`more-info_${id}`);
  infoDiv.style.display = infoDiv.style.display === "none" ? "block" : "none";
}

// const sortableList = document.querySelector(".current-notes__list");
// const items = document.querySelectorAll(".list__current-note");

// items.forEach(item => {
//   item.addEventListener("dragstart", () => {
//     setTimeout(() => item.classList.add("dragging"), 0);
//   });
//   item.addEventListener("dragend", () => item.classList.remove("dragging"));
// });

// const initSortableList = (e) => {
//   const draggingItem = sortableList.querySelector(".dragging");
//   const siblings = [...sortableList.querySelectorAll(".list__current-note:not(.dragging)")];
//   let nextSibling = siblings.find(sibling => {
//     return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
//   });
//   sortableList.insertBefore(draggingItem, nextSibling);
// }

// sortableList.addEventListener("dragover", initSortableList);

slist(document.querySelector(".current-notes__list"));
function slist(target) {
  target.classList.add("slist");
  let items = target.getElementsByTagName("li"),
    current = null;

  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (e) => {
      current = i;
      for (let it of items) {
        if (it != current) {
          it.classList.add("hint");
        }
      }
    };

    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = (e) => {
      if (i != current) {
        i.classList.add("active");
      }
    };

    // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.ondragleave = () => i.classList.remove("active");

    // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
    i.ondragend = () => {
      for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
      }
    };

    // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.ondragover = (e) => e.preventDefault();

    // (B7) ON DROP - DO SOMETHING
    i.ondrop = (e) => {
      e.preventDefault();
      if (i != current) {
        let currentpos = 0,
          droppedpos = 0;
        for (let it = 0; it < items.length; it++) {
          if (current == items[it]) {
            currentpos = it;
          }
          if (i == items[it]) {
            droppedpos = it;
          }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
      }
    };
  }
}
