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
    // Находим выигрышную комбинацию
    const winningCombination = findWinningMove(player);
    if (winningCombination !== null) {
      highlightWinningCombination(winningCombination); // Зачеркиваем выигрышную комбинацию
    }

    // Добавляем класс won или loss в зависимости от победителя
    if (player === "X") {
      board.classList.add("won"); // Игрок победил
    } else {
      board.classList.add("loss"); // Компьютер победил
      restartButton.style.display = "flex";
      lossText.style.display = "block";
    }

  } else {
    board.classList.add("loss");
    restartButton.style.display = "flex";
    lossText.style.display = "block";
  }
}

// Подсветка выигрышной комбинации
function highlightWinningCombination(combination) {
  const [a, b, c] = combination;

  // Создаем линию, которая будет зачеркивать выигрышную комбинацию
  const line = document.createElement("div");
  line.classList.add("winning-line");

  // Определяем позицию и ориентацию линии
  const cellA = cells[a];
  const cellB = cells[b];
  const cellC = cells[c];

  const rectA = cellA.getBoundingClientRect();
  const rectC = cellC.getBoundingClientRect();

  const boardRect = board.getBoundingClientRect();

  const x1 = rectA.left - boardRect.left + rectA.width / 2;
  const y1 = rectA.top - boardRect.top + rectA.height / 2;
  const x2 = rectC.left - boardRect.left + rectC.width / 2;
  const y2 = rectC.top - boardRect.top + rectC.height / 2;

  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.top = `${y1}px`;
  line.style.left = `${x1}px`;

  board.appendChild(line);
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
