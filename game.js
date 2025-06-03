const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const closeBtn = document.getElementById('closeGame');
const gameOverBox = document.getElementById('gameOver');
const startBtn = document.getElementById('startGame');
const restartBtn = document.getElementById('restartGame');
const scoreDisplay = document.getElementById('score');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let interval;
let isGameOver = false;

// Controls
document.addEventListener('keydown', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
});
document.addEventListener('keyup', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
});

leftBtn.onclick = () => { leftPressed = true; setTimeout(() => leftPressed = false, 100); };
rightBtn.onclick = () => { rightPressed = true; setTimeout(() => rightPressed = false, 100); };

// Game Loop
function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Ball
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();

  // Paddle
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#eee";
  ctx.fill();
  ctx.closePath();

  // Movement
  if (x + dx > canvas.width - 8 || x + dx < 8) dx = -dx;
  if (y + dy < 8) dy = -dy;
  else if (y + dy > canvas.height - paddleHeight - 8) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      score++;
      scoreDisplay.textContent = score;
    } else {
      gameOver();
      return;
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// Start Game
startBtn.onclick = () => {
  overlay.classList.add('active');
  resetGame();
  draw();
};

// Close
closeBtn.onclick = () => {
  overlay.classList.remove('active');
  isGameOver = true;
};

// Restart
restartBtn.onclick = () => {
  gameOverBox.classList.remove('show');
  resetGame();
  draw();
};

// End
function gameOver() {
  isGameOver = true;
  gameOverBox.classList.add('show');
}

// Reset
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  scoreDisplay.textContent = score;
  isGameOver = false;
}