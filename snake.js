const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gridSize;
let tileCountX = 20, tileCountY = 20;
let snake, velocity, food, score, gameOver;
let gameLoopId;

function resizeCanvas() {
  const container = document.querySelector(".snake");
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Calculate tile size to fit 20x20 grid
  gridSize = Math.min(canvas.width / tileCountX, canvas.height / tileCountY);
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

function resetGame() {
  snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
  velocity = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  placeFood();
  if (gameLoopId) clearTimeout(gameLoopId);
  loop();
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  food = newFood;
}

function draw() {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Snake
  ctx.fillStyle = "lime";
  snake.forEach(seg => {
    ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 1, gridSize - 1);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = `${Math.floor(gridSize)}px Arial`;
  ctx.fillText("Score: " + score, 10, gridSize);
}

function update() {
  if (gameOver) return;

  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Check collisions
  if (
    head.x < 0 || head.x >= tileCountX ||
    head.y < 0 || head.y >= tileCountY ||
    head.y < 0 || head.y >= tileCountY ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}

function loop() {
  update();
  draw();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = `${Math.floor(gridSize * 1.5)}px Arial`;
    ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2 - 10);
    ctx.fillText("Press R to Restart", canvas.width / 2 - 140, canvas.height / 2 + 30);
  } else {
    gameLoopId = setTimeout(loop, 100);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && velocity.y === 0) velocity = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && velocity.y === 0) velocity = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && velocity.x === 0) velocity = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && velocity.x === 0) velocity = { x: 1, y: 0 };

  if (gameOver && (e.key === "r" || e.key === "R")) resetGame();
});

resizeCanvas();
resetGame();