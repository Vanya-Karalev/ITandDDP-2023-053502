import { checkAuth, getUserId, logOut } from "./cookie.js";
import { database } from "./config.js";
import { ref, get, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";


const userId = getUserId();

function getEmail(uid) {
  const databaseRef = ref(database, `users/${uid}`);
  return get(databaseRef).then((snapshot) => {
    const user = snapshot.val();
    return user.email;
  }).catch((error) => {
    console.log(error);
    return 'undefined';
  });
}

let signup = document.querySelector(".header-links__signup");
let signin = document.querySelector(".header-links__signin");
let links = document.getElementById("link");
const result = checkAuth();

if (result == true) {
  signup.style.display = "none";
  signin.style.display = "none";

  getEmail(userId).then((mail) => {
    links.innerHTML = `
      <a class="header-links__username">${mail}</a>
      <a type="button" class="header-links__exit" href="#">Exit</a>
    `;
  }).catch((error) => {
    console.log(error);
  });
} else {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("SignIn.html");
}


links.addEventListener("click", function(event) {
    if (event.target.classList.contains("header-links__exit")) {
        logOut();
    }
});


let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementById("ModalClose");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

let todoList = [];

let noteTitle = document.querySelector(".title__note");
let noteInfo = document.querySelector(".details__note");
let noteDate = document.querySelector(".date__note");
let createTask = document.getElementById("createTask");

let todoCurrent = document.querySelector(".current-notes__list");
let todoCompleted = document.querySelector(".completed-notes__list");

let emptyTasks = document.querySelector(".tasks-empty");

// if (localStorage.getItem("todo")) {
//   todoList = JSON.parse(localStorage.getItem("todo"));
//   displayCurrentMessages();
//   displayCompletedMessages();
// }

const databaseRef = ref(database, `todos/${userId}`);
onValue(databaseRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const todoKey = Object.keys(data)[0];
    todoList = data[todoKey];
    displayCurrentMessages();
    displayCompletedMessages();
  }
});

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
//   displayCurrentMessages();
//   displayCompletedMessages();
//   localStorage.setItem("todo", JSON.stringify(todoList));

    const databaseRef = ref(database, `todos/${userId}`);
    remove(databaseRef).then(() => {
        push(databaseRef, todoList)
        .then(() => {
            displayCurrentMessages();
            displayCompletedMessages();
        })
        .catch((error) => {
            console.log(error);
            alert("Failed to save todo to database.");
        });
    }).catch((error) => {
        console.log(error);
        alert("Failed to remove old todo data from database.");
    });

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
    //   displayCurrentMessages();
    //   displayCompletedMessages();
    //   localStorage.setItem("todo", JSON.stringify(todoList));
    const databaseRef = ref(database, `todos/${userId}`);
    remove(databaseRef).then(() => {
        push(databaseRef, todoList)
        .then(() => {
            displayCurrentMessages();
            displayCompletedMessages();
        })
        .catch((error) => {
            console.log(error);
            alert("Failed to save todo to database.");
        });
    }).catch((error) => {
        console.log(error);
        alert("Failed to remove old todo data from database.");
    });

    }
  });
});

todoCompleted.addEventListener("change", function (event) {
  let id = event.target.getAttribute("id");
  let valueP = todoCompleted.querySelector("[for=" + id + "]").innerHTML;

  todoList.forEach(function (item) {
    if (item.noteTitle === valueP) {
      item.checked = !item.checked;
    //   displayCurrentMessages();
    //   displayCompletedMessages();
    //   localStorage.setItem("todo", JSON.stringify(todoList));
    const databaseRef = ref(database, `todos/${userId}`);
    remove(databaseRef).then(() => {
        push(databaseRef, todoList)
        .then(() => {
            displayCurrentMessages();
            displayCompletedMessages();
        })
        .catch((error) => {
            console.log(error);
            alert("Failed to save todo to database.");
        });
    }).catch((error) => {
        console.log(error);
        alert("Failed to remove old todo data from database.");
    });
    }
  });
});

todoCurrent.addEventListener("click", deleteTask);
todoCompleted.addEventListener("click", deleteTask);

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  let id = event.target.getAttribute("data-id");
  todoList.splice(id, 1);
//   displayCurrentMessages();
//   displayCompletedMessages();
//   localStorage.setItem("todo", JSON.stringify(todoList));
    const databaseRef = ref(database, `todos/${userId}`);
    remove(databaseRef).then(() => {
        push(databaseRef, todoList)
        .then(() => {
            displayCurrentMessages();
            displayCompletedMessages();
        })
        .catch((error) => {
            console.log(error);
            alert("Failed to save todo to database.");
        });
    }).catch((error) => {
        console.log(error);
        alert("Failed to remove old todo data from database.");
    });
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

    //   localStorage.setItem("todo", JSON.stringify(todoList));
        const databaseRef = ref(database, `todos/${userId}`);
        remove(databaseRef).then(() => {
            push(databaseRef, todoList)
            .then(() => {
                // displayCurrentMessages();
                // displayCompletedMessages();
            })
            .catch((error) => {
                console.log(error);
                alert("Failed to save todo to database.");
            });
        }).catch((error) => {
            console.log(error);
            alert("Failed to remove old todo data from database.");
        });
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

    //   localStorage.setItem("todo", JSON.stringify(todoList));
        const databaseRef = ref(database, `todos/${userId}`);
        remove(databaseRef).then(() => {
            push(databaseRef, todoList)
            .then(() => {
                // displayCurrentMessages();
                // displayCompletedMessages();
            })
            .catch((error) => {
                console.log(error);
                alert("Failed to save todo to database.");
            });
        }).catch((error) => {
            console.log(error);
            alert("Failed to remove old todo data from database.");
        });
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
  } else if (event.target == modal) {
    modal.style.display = "none";
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



const columns = document.querySelectorAll(".current-notes__list");

let dragging = null;

document.addEventListener("dragstart", (e) => {
  dragging = e.target;
  dragging.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
  dragging.classList.remove("dragging");
  UpdateDragAndDrop();
  dragging = null;
});

columns.forEach((item) => {
  item.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (dragging) {
      const applyAfter = getNewPosition(item, e.clientY);

      if (applyAfter) {
        applyAfter.insertAdjacentElement("afterend", dragging);
      } else {
        item.prepend(dragging);
      }
    }
  });
});

function getNewPosition(column, posY) {
  const cards = column.querySelectorAll(".list__current-note:not(.dragging)");
  let result;

  for (let refer_card of cards) {
    const box = refer_card.getBoundingClientRect();
    const boxCenterY = box.y + box.height / 2;

    if (posY >= boxCenterY) result = refer_card;
  }

  return result;
}


function UpdateDragAndDrop() {
    let dropped = [];
  
    // Get the current TODO items from the innerHTML of todoCurrent
    const currentItems = Array.from(todoCurrent.children);
  
    // Iterate over the current items and extract the necessary data
    currentItems.forEach((item) => {
      const title = item.querySelector(".current-main__left__title").textContent;
      const checked = item.querySelector(".current-main__left__checkbox").checked;
      const info = item.querySelector(".current-note__info__text").textContent;
      let date = item.querySelector(".current-main__right__date").textContent;
  
      // Validate and extract the date in the format "YYYY-MM-DD"
      const dateRegex = /\d{4}-\d{2}-\d{2}/;
      const match = date.match(dateRegex);
      date = match ? match[0] : ""; // If match is found, assign the matched date, otherwise assign an empty string

      // Create a new TODO object and add it to the dropped array
      const todo = {
        checked: checked,
        noteDate: date,
        noteInfo: info,
        noteTitle: title,
      };
      dropped.push(todo);
    });

    const databaseRef = ref(database, `todos/${userId}`);
        remove(databaseRef).then(() => {
            push(databaseRef, dropped)
            .then(() => {
                displayCurrentMessages();
                displayCompletedMessages();
            })
            .catch((error) => {
                console.log(error);
                alert("Failed to save todo to database.");
            });
        }).catch((error) => {
            console.log(error);
            alert("Failed to remove old todo data from database.");
        });
}
