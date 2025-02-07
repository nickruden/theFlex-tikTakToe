const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const cells = [];
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
}

// Обработчик клика по ячейке
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (cells[index].textContent !== "" || !gameActive) return;

  cells[index].textContent = currentPlayer;
  checkGameStatus();

  if (gameActive && currentPlayer === "X") {
    currentPlayer = "O";
    computerMove();
  }
}

// Ход компьютера
function computerMove() {
  let bestMove = findBestMove();
  if (bestMove !== null) {
    cells[bestMove].textContent = "O";
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
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      announceWinner(cells[a].textContent);
      return;
    }
  }

  if ([...cells].every((cell) => cell.textContent !== "")) {
    announceWinner(null); // Ничья
  }
}

// Объявление победителя
function announceWinner(player) {
  gameActive = false;
  if (player) {
    alert(`Победил игрок ${player}!`);
  } else {
    alert("Ничья!");
  }
}

// Логика поиска лучшего хода для компьютера
function findBestMove() {
  // Попытка выиграть
  let move = findWinningMove("O");
  if (move !== null) return move;

  // Попытка заблокировать игрока
  move = findWinningMove("X");
  if (move !== null) return move;

  // Выбор центральной ячейки, если она свободна
  if (cells[4].textContent === "") return 4;

  // Выбор случайной свободной ячейки
  const emptyCells = cells
    .map((cell, index) => (cell.textContent === "" ? index : null))
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
    const values = [
      cells[a].textContent,
      cells[b].textContent,
      cells[c].textContent,
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
  cells.forEach((cell) => (cell.textContent = ""));
  currentPlayer = "X";
  gameActive = true;
}

// Инициализация игры
createBoard();
restartButton.addEventListener("click", restartGame);
