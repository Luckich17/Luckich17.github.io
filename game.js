// Element references
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

// Ball and paddle setup
let x, y, dx, dy;
const ballRadius = 8;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let isGameOver = false;

// Bricks setup
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 30;
const bricks = [];

function createBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#007aff'];
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        color: colors[r % colors.length],
      };
    }
  }
}

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

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        b.x = brickX;
        b.y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Detect collisions
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          scoreDisplay.textContent = score;
          if (score === brickRowCount * brickColumnCount) {
            setTimeout(() => {
              alert('Hai vinto!');
              overlay.classList.remove('active');
            }, 200);
          }
        }
      }
    }
  }
}

// Draw everything
function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();

  // Ball
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();

  // Paddle
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#eee';
  ctx.fill();
  ctx.closePath();

  collisionDetection();

  // Ball movement and collision
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - paddleHeight - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      gameOver();
      return;
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  // Update ball position
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// Start the game
startBtn.onclick = () => {
  overlay.classList.add('active');
  resetGame();
  draw();
};

// Close game
closeBtn.onclick = () => {
  overlay.classList.remove('active');
  isGameOver = true;
};

// Restart game
restartBtn.onclick = () => {
  gameOverBox.classList.remove('show');
  resetGame();
  draw();
};

// Game over handler
function gameOver() {
  isGameOver = true;
  gameOverBox.classList.add('show');
}

// Reset game to initial state
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  scoreDisplay.textContent = score;
  isGameOver = false;
  createBricks();
}