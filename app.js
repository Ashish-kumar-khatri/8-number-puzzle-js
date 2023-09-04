class PuzzleState {
  constructor(board, parent = null, move = "") {
    this.board = board;
    this.parent = parent;
    this.move = move;
    // this.goal = "1238_4765";
    this.goal = "123586_74";
  }

  isGoal() {
    return this.board.join("") === this.goal;
  }

  isValidMove(x, y) {
    return x >= 0 && x < 3 && y >= 0 && y < 3;
  }

  cloneBoard() {
    return this.board.slice();
  }

  swapTiles(board, x1, y1, x2, y2) {
    const temp = board[y1 * 3 + x1];
    board[y1 * 3 + x1] = board[y2 * 3 + x2];
    board[y2 * 3 + x2] = temp;
  }

  generateNextStates() {
    const { board } = this;
    const nextStates = [];

    const emptyPos = board.indexOf("_");
    const x = emptyPos % 3;
    const y = Math.floor(emptyPos / 3);

    const moves = [
      { dx: -1, dy: 0, move: "L" },
      { dx: 1, dy: 0, move: "R" },
      { dx: 0, dy: -1, move: "U" },
      { dx: 0, dy: 1, move: "D" },
    ];

    for (const { dx, dy, move } of moves) {
      const newX = x + dx;
      const newY = y + dy;

      if (this.isValidMove(newX, newY)) {
        const newBoard = this.cloneBoard();
        this.swapTiles(newBoard, x, y, newX, newY);
        nextStates.push(new PuzzleState(newBoard, this, this.move + move));
      }
    }

    return nextStates;
  }
}

function displayBoard(board) {
  console.log("current state = ", board);
}

function solvePuzzle(initialState) {
  const visited = new Set();
  const queue = [initialState];

  while (queue.length > 0) {
    const currentState = queue.shift();

    displayBoard(currentState.board);

    if (currentState.isGoal()) {
      return currentState;
    }

    visited.add(currentState.board.join(""));

    const nextStates = currentState.generateNextStates();

    console.log(
      "next states = ",
      nextStates.map((state) => state.board)
    );

    for (const nextState of nextStates) {
      const nextStateStr = nextState.board.join("");
      if (!visited.has(nextStateStr)) {
        queue.push(nextState);
      }
    }
  }

  return null; // No solution found
}

// Example usage:
const initialState = new PuzzleState([
  "1",
  "2",
  "3",
  "5",
  "6",
  "_",
  "7",
  "8",
  "4",
]);
const goalState = solvePuzzle(initialState);

if (goalState) {
  let currentState = goalState;
  const path = [];
  while (currentState.parent) {
    path.push(currentState.move);
    currentState = currentState.parent;
  }
  path.reverse();
  console.log("Path to goal state:", path.join(" "));
} else {
  console.log("No solution found.");
}
