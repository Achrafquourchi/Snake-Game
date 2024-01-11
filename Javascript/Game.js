// Describe the elements of HTML.
const gameBoard = document.getElementById("gameBoard");
const mainText = document.getElementById("main-text");
const logoImg = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreTxt = document.getElementById("highScore");

// Define game variables
const gridSize = 23;
let snake = [{ x: 10, y: 10 }];
let food = generateFoodCube();
let highScore = 0;
let direction = "left";
let gameIntervals;
let speedDelayGame = 200;
let StartingGame = false;

// Draw game map, snake, food
function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  DrawFood();
  updateScore();
}

// Draw my snake
function drawSnake() {
  snake.forEach((elEment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, elEment);
    gameBoard.appendChild(snakeElement);
  });
}

// Create a snake || food
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake || food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food cube function
function DrawFood() {
  if (StartingGame) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}

// Generate food
function generateFoodCube() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFoodCube();
    increaseSpeed();
    clearInterval(gameIntervals); // Clear past interval
    gameIntervals = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, speedDelayGame);
  } else {
    snake.pop();
  }
}

// Start game function
function startGame() {
  StartingGame = true; // Keep track of a running game
  mainText.style.display = "none";
  logoImg.style.display = "none";
  gameIntervals = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, speedDelayGame);
}

// Keyboard event listener
function handleKeyPress(event) {
  if (
    (!StartingGame && event.code === "Space") ||
    (!StartingGame && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (speedDelayGame > 150) {
    speedDelayGame -= 5;
  } else if (speedDelayGame > 100) {
    speedDelayGame -= 3;
  } else if (speedDelayGame > 50) {
    speedDelayGame -= 2;
  } else if (speedDelayGame > 25) {
    speedDelayGame -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFoodCube();
  direction = "right";
  speedDelayGame = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameIntervals);
  StartingGame = false;
  mainText.style.display = "block";
  logoImg.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreTxt.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreTxt.style.display = "block";
}
