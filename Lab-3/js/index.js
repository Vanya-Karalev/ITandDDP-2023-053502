// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


let scrollableDiv = document.querySelector('.scroll');

scrollableDiv.addEventListener('wheel', function(e) {
  // Останавливает прокручивание на странице, если
  // элемент не имеет больше места для прокрутки в этом направлении
  e.preventDefault();

  // Прокручивает элемент, если есть место для прокрутки
  scrollableDiv.scrollTop += e.deltaY;
});



let todoList = [];

let noteTitle = document.querySelector(".title__note"),
  noteInfo = document.querySelector(".details__note"),
  noteDate = document.querySelector(".date__note"),
  todoCurrent = document.querySelector(".current_notes__list"),
  createTask = document.querySelector(".create_button");

createTask.addEventListener('click', function() {

  let newToDo = {
    noteTitle: noteTitle.value,
    noteInfo: noteInfo.value,
    noteDate: noteDate.value,
    checked: false
  }

  if (!noteTitle.value) {
    alert("Please add some task!");
    return;
  }

  todoList.push(newToDo);
  displayMessages();

  noteTitle.value = '';
  noteInfo.value = '';
  noteDate.value = '';
  modal.style.display = "none";
});

function displayMessages() {
  
  todoList.forEach(function(item, i) {
    let displayMessage = document.createElement("li");
    displayMessage.classList.add("list__current_note");

    let currentNote = document.createElement("div");
    currentNote.classList.add("current_note__main");

    let mainLeft = document.createElement("div");
    mainLeft.classList.add("main__left");
    mainLeft.innerHTML = ''

    let mainRight = document.createElement("div");
    mainLeft.classList.add("main__right");
    mainRight.innerHTML = ''

    currentNote.appendChild(mainLeft);
    currentNote.appendChild(mainRight);

    let currentNoteInfo = document.createElement("div");
    currentNoteInfo.classList.add("container-current-note-info");
    currentNoteInfo.attributes.add("id", `more-info_${i}`);
    currentNoteInfo.attributes.add("style", "display: none;");
    currentNoteInfo.innerHTML = '';

    displayMessage.appendChild(currentNote);
    displayMessage.appendChild(currentNoteInfo);



    displayMessage += `
    <li class="list__current-note">
        <div class="current-note__main">
            <div class="current-main__left">
                <input class="current-main__left__checkbox" type="checkbox" id='item_${i}'>
                <p for='item_${i}' class="current-main__left__title">${item.noteTitle}</p>
                <button id="button-down_${i}" onclick="GetInfo(this)" style="border: none; ${item.noteInfo ? '' : 'display: none;'}">
                  <span class="down">&#8595;</span>
                </button>
            </div>
            <div class="current-main__right">
                <span for='item_${i}' class="current-main__right__date">${item.noteDate ? item.noteDate : 'No date'}</span>
                <button data-action="edit" onclick="editTask(this)" style="border: none;"><span class="current-main__right__edit">&#9998;</span></button>
                <button data-action="delete" style="border: none;"><span class="current-main__right__delete">&#128465;</span></button>
            </div>
        </div>
        <div class="current-note__info" id="more-info_${i}" style="display: none;">
            <p for='item_${i}' class="current-note__info__text">${item.noteInfo}</p>
        </div>
    </li>
    `;
    todoCurrent.innerHTML = displayMessage;
  });
};

function GetInfo(button) {
  let id = button.id.split('_')[1];
  let infoDiv = document.getElementById(`more-info_${id}`);
  infoDiv.style.display = infoDiv.style.display === 'none' ? 'block' : 'none';
}

todoCurrent.addEventListener('click', deleteTask);

function deleteTask(event) {
  if (event.target.dataset.action === 'delete') {
    const parentNode = event.target.closest('.list__current_note');
    parentNode.remove();
  }
}

// todoCurrent.addEventListener('click', editTask);

// function editTask(button) {
//   // Получаем родительский элемент задачи
//   const taskElement = button.closest('.container-current-note');

//   // Получаем значения полей задачи
//   const taskTitle = taskElement.querySelector('.container-current-note-left-title').innerText;
//   const taskDetails = taskElement.querySelector('.container-current-note-info-text').innerText;
//   const taskDate = taskElement.querySelector('.container-current-note-right-date').innerText;
  
//   // Показываем модальное окно и устанавливаем значения полей
//   const modal = document.getElementById('myModal');
//   modal.style.display = 'block';
//   document.getElementById('noteTitle').value = taskTitle;
//   document.querySelector('.modal-main-content-details-note').value = taskDetails;
//   document.querySelector('.modal-main-content-date-note').value = taskDate;
// }
