const board = document.getElementById("board");
const lossText = document.querySelector(".game-page__loss-text");
const restartButton = document.getElementById("restartButton");
const cells = [];
const xImage = "../assets/images/x.svg";
const oImage = "../assets/images/heart.svg";

let currentPlayer = "X";
let gameActive = true;

// Создаем игровое поле
function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  restartButton.style.display = "none";
  lossText.style.display = "none";
}

// Обработчик клика по ячейке
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (cell.querySelector("img") || !gameActive) return;

  // Добавляем изображение в ячейку
  addImageToCell(cell, currentPlayer);

  checkGameStatus();

  if (gameActive && currentPlayer === "X") {
    currentPlayer = "O";
    computerMove();
  }
}

// Добавление изображения в ячейку
function addImageToCell(cell, player) {
  const img = document.createElement("img");
  img.src = player === "X" ? oImage : xImage;
  img.alt = player;
  img.classList.add("icon");
  cell.appendChild(img);
  img.style.pointerEvents = "none";
}

// Ход компьютера
function computerMove() {
  let bestMove = findBestMove();
  if (bestMove !== null) {
    addImageToCell(cells[bestMove], "O");
    checkGameStatus();
    currentPlayer = "X";
  }
}

// Проверка состояния игры
function checkGameStatus() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Горизонтальные
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Вертикальные
    [0, 4, 8],
    [2, 4, 6], // Диагональные
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const imgA = cells[a].querySelector("img");
    const imgB = cells[b].querySelector("img");
    const imgC = cells[c].querySelector("img");

    if (
      imgA &&
      imgB &&
      imgC &&
      imgA.alt === imgB.alt &&
      imgA.alt === imgC.alt
    ) {
      announceWinner(imgA.alt);
      return;
    }
  }

  if ([...cells].every((cell) => cell.querySelector("img"))) {
    announceWinner(null); // Ничья
  }
}

// Объявление победителя
function announceWinner(player) {
  gameActive = false;

  if (player) {
    // Добавляем класс won или loss в зависимости от победителя
    if (player === "X") {
      board.classList.add("won"); // Игрок победил
      showWinAnimation();
    } else {
      board.classList.add("loss"); // Компьютер победил
      const winningCombination = findWinningCombination("O"); // Находим выигрышную комбинацию
      console.log(winningCombination)
      if (winningCombination) {
        highlightWinningCombination(winningCombination); // Отображаем линию
      }
      restartButton.style.display = "flex";
      lossText.style.display = "block";
    }

  } else {
    board.classList.add("loss");
    restartButton.style.display = "flex";
    lossText.style.display = "block";
  }
}

function highlightWinningCombination(combination) {
  const lossLine = document.getElementById('lossLine');

  // Определяем тип линии (горизонтальная, вертикальная, диагональная)
  if ((combination[0] === 0 && combination[2] === 2) || (combination[0] === 3 && combination[2] === 5) || (combination[0] === 6 && combination[2] === 8)) {
    lossLine.classList.add('horizontal');
    switch (combination[0]) {
      case 0: 
        lossLine.classList.add('--v1');
        break;
      case 3: 
        lossLine.classList.add('--v2');
        break;
      case 6: 
        lossLine.classList.add('--v3');
        break;
    }
  } else if (combination[0] === 0 && combination[2] === 8) {
    lossLine.classList.add('diagonal-left');
  } else if (combination[0] === 2 && combination[2] === 6) {
    lossLine.classList.add('diagonal-right');
  } else {
    lossLine.classList.add('vertical');
    switch (combination[0]) {
      case 0: 
        lossLine.classList.add('--v1');
        break;
      case 1: 
        lossLine.classList.add('--v2');
        break;
      case 2: 
        lossLine.classList.add('--v3');
        break;
    }
  }

  lossLine.classList.add('visible'); // Показываем линию
}

function findWinningCombination(player) {
  const winningCombinations = [
    [0, 1, 2], // Горизонтальная верхняя
    [3, 4, 5], // Горизонтальная средняя
    [6, 7, 8], // Горизонтальная нижняя
    [0, 3, 6], // Вертикальная левая
    [1, 4, 7], // Вертикальная средняя
    [2, 5, 8], // Вертикальная правая
    [0, 4, 8], // Диагональ (лево-верх -> право-низ)
    [2, 4, 6], // Диагональ (право-верх -> лево-низ)
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const imgA = cells[a].querySelector("img");
    const imgB = cells[b].querySelector("img");
    const imgC = cells[c].querySelector("img");

    if (
      imgA &&
      imgB &&
      imgC &&
      imgA.alt === player &&
      imgB.alt === player &&
      imgC.alt === player
    ) {
      return combo; // Возвращаем выигрышную комбинацию
    }
  }
  return null; // Если комбинация не найдена
}

function showWinAnimation() {
  const winHeart = document.querySelector('.game-page__win-heart');
  const wrapper = document.querySelector('.wrapper');
  const winScreen = document.getElementById('win-screen');

  winHeart.classList.add('visible');
  wrapper.style.overflow = 'hidden';
  winScreen.classList.remove('hidden');
  board.style.zIndex = 1;

  setTimeout(() => {
    winHeart.classList.remove('visible');
    setTimeout(() => {
      window.location.href = "./final.html"; // Укажите правильный путь
    }, 0);
  }, 1200);
}

// Логика поиска лучшего хода для компьютера
function findBestMove() {
  // Попытка выиграть
  let move = findWinningMove("O");
  if (move !== null) return move;

  // Попытка заблокировать игрока
  move = findWinningMove("X");
  if (move !== null) return move;

  // Выбор случайной свободной ячейки
  const emptyCells = cells
    .map((cell, index) => (!cell.querySelector("img") ? index : null))
    .filter((index) => index !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Поиск выигрышного хода
function findWinningMove(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const imgA = cells[a].querySelector("img");
    const imgB = cells[b].querySelector("img");
    const imgC = cells[c].querySelector("img");

    const values = [
      imgA ? imgA.alt : "",
      imgB ? imgB.alt : "",
      imgC ? imgC.alt : "",
    ];

    if (
      values.filter((v) => v === player).length === 2 &&
      values.includes("")
    ) {
      return combo[values.indexOf("")];
    }
  }
  return null;
}

// Перезапуск игры
function restartGame() {
  const winScreen = document.getElementById('win-screen');
  const wrapper = document.querySelector('.wrapper');
  const lossLine = document.getElementById('lossLine');

  // Сбрасываем состояния анимаций
  winScreen.classList.add('hidden');
  wrapper.style.overflow = '';
  lossLine.className = "";
  lossLine.classList.add('loss-line');

  cells.forEach((cell) => {
    cell.innerHTML = ""; // Очищаем ячейки
  });
  board.classList.remove("won", "loss"); // Удаляем классы won и loss
  board.querySelectorAll(".winning-line").forEach((line) => line.remove()); // Удаляем линии
  currentPlayer = "X";
  gameActive = true;
  restartButton.style.display = "none";
  lossText.style.display = "none";
}

// Инициализация игры
createBoard();
restartButton.addEventListener("click", restartGame);
