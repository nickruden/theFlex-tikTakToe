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

// Версия посложнее
// function minimax(board, depth, isMaximizing) {
//   const scores = {
//     X: -1,
//     O: 1,
//     tie: 0,
//   };

//   const result = checkWinner(board);
//   if (result !== null) {
//     return scores[result];
//   }

//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < 9; i++) {
//       if (board[i] === "") {
//         board[i] = "O";
//         let score = minimax(board, depth + 1, false);
//         board[i] = "";
//         bestScore = Math.max(score, bestScore);
//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < 9; i++) {
//       if (board[i] === "") {
//         board[i] = "X";
//         let score = minimax(board, depth + 1, true);
//         board[i] = "";
//         bestScore = Math.min(score, bestScore);
//       }
//     }
//     return bestScore;
//   }
// }

// function findBestMove() {
//   const board = cells.map((cell) => cell.textContent);
//   const emptyCellsCount = board.filter(cell => cell === "").length;

//   // Если это первый ход компьютера (поле почти пустое)
//   if (emptyCellsCount === 8) {
//     const corners = [0, 2, 6, 8]; // Угловые ячейки
//     const randomChoice = Math.random(); // Генерируем случайное число

//     if (randomChoice < 0.5) {
//       // С вероятностью 50% выбираем случайную угловую ячейку
//       const randomCorner = corners[Math.floor(Math.random() * corners.length)];
//       return randomCorner;
//     } else {
//       // С вероятностью 50% выбираем центр, если он свободен
//       if (board[4] === "") return 4;
//     }
//   }

//   // Иначе используем Minimax для поиска лучшего хода
//   let bestScore = -Infinity;
//   let bestMove = null;
//   for (let i = 0; i < 9; i++) {
//     if (board[i] === "") {
//       board[i] = "O";
//       let score = minimax(board, 0, false);
//       board[i] = "";
//       if (score > bestScore) {
//         bestScore = score;
//         bestMove = i;
//       }
//     }
//   }
//   return bestMove;
// }

// function checkWinner(board) {
//   const winningCombinations = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   for (const combo of winningCombinations) {
//     const [a, b, c] = combo;
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }

//   if (board.every((cell) => cell !== "")) {
//     return "tie";
//   }
//   return null;
// }

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