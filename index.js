document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const text = document.getElementById('text');
  const taskinfo = document.querySelector('.todolist-con');
  const quoteDiv = document.getElementById('quote');
  
  const quotes = [
    "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
    "The secret of getting ahead is getting started. – Mark Twain",
    "It always seems impossible until it’s done. – Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
    "You don't have to be great to start, but you have to start to be great. – Zig Ziglar"
  ];

  let todoss = JSON.parse(localStorage.getItem('todoss')) || [];

  if (todoss.length) {
    todoss.forEach(element => insertTask(element));
  } else {
    displayQuote();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    insertTask();
  });

  function insertTask(elem) {
    const todoCol = document.createElement('div');
    todoCol.classList.add('todoCol');

    let tdtxt = text.value;
    if (elem) {
      tdtxt = elem.text;
    }

    if (tdtxt) {
      todoCol.innerHTML = `
        <div class="TD-li">
          <div class="Tick ${elem && elem.complete ? 'onn-Tick' : ''}">
            <img src="./images/icon-check.svg" alt="Check">
          </div>
          <p class="pgtag ${elem && elem.complete ? 'complete' : ''}">${tdtxt}</p>
          <button class="closing">
            <img src="./images/icon-cross.svg" alt="Close">
          </button>
        </div>
        <div class="hr"></div>`;
      taskinfo.appendChild(todoCol);
      updateList();
      displayMotivationalMessage();
    }

    const closing = todoCol.querySelector('.closing');
    closing.addEventListener('click', () => {
      todoCol.remove();
      updateList();
      displayMotivationalMessage();
    });

    const tick = todoCol.querySelector('.Tick');
    tick.addEventListener('click', () => {
      tick.classList.toggle('onn-Tick');
      tick.nextElementSibling.classList.toggle('complete');
      updateList();
      displayMotivationalMessage();
    });

    text.value = '';
  }

  function updateList() {
    const pgtag = document.querySelectorAll('.pgtag');
    const arr = Array.from(pgtag).map(element => ({
      text: element.innerText,
      complete: element.classList.contains('complete')
    }));

    localStorage.setItem('todoss', JSON.stringify(arr));
    setItemsLeft();
  }

  const information = document.querySelectorAll('.option p');
  information.forEach(element => {
    element.addEventListener('click', () => {
      information.forEach(item => item.classList.remove('onn'));
      element.classList.add('onn');
      filterTasks(element.innerText);
    });
  });

  function filterTasks(filter) {
    const tasklist = document.querySelectorAll('.todoCol');
    tasklist.forEach(task => {
      const isComplete = task.querySelector('.pgtag').classList.contains('complete');
      switch (filter) {
        case 'Active':
          task.style.display = isComplete ? 'none' : 'block';
          break;
        case 'Completed':
          task.style.display = isComplete ? 'block' : 'none';
          break;
        default:
          task.style.display = 'block';
      }
    });
  }

  const clear = document.querySelector('.clear');
  clear.addEventListener('click', () => {
    document.querySelectorAll('.todoCol .complete').forEach(task => task.parentElement.parentElement.remove());
    updateList();
    displayMotivationalMessage();
  });

  function setItemsLeft() {
    const totalTasks = document.querySelectorAll('.todoCol').length;
    const completedTasks = document.querySelectorAll('.complete').length;
    const leftTasks = totalTasks - completedTasks;
    document.querySelector('.left').innerText = `${leftTasks} items left`;

    if (leftTasks === 0 && totalTasks > 0) {
      displayCongratulatoryMessage();
    }
  }

  function displayQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDiv.innerText = quotes[randomIndex];
  }

  function displayMotivationalMessage() {
    const totalTasks = document.querySelectorAll('.todoCol').length;
    const completedTasks = document.querySelectorAll('.complete').length;
    const leftTasks = totalTasks - completedTasks;

    if (totalTasks === 0) {
      displayQuote();
    } else if (leftTasks > 0 && completedTasks > 0) {
      quoteDiv.innerText = "Keep going! You're doing great!";
    } else if (leftTasks === 0 && totalTasks > 0) {
      displayCongratulatoryMessage();
    }
  }

  function displayCongratulatoryMessage() {
    quoteDiv.innerText = "Congratulations! You've completed all your tasks!";
  }

  setItemsLeft();
});
