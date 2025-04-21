const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const restartBtn = document.getElementById('restartBtn');
const gameOverEl = document.getElementById('gameOver');
let isGameOver = false;

let pendingDirection = null; // 키 입력을 저장할 변수

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };

let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highscore');

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
  highScoreEl.textContent = `High Score: ${highScore}`;
}

function gameLoop() {
  if (!isGameOver) {
    moveSnake();
    checkCollision();
  }

  drawGame(); // 게임 오버여도 계속 그림은 그리기
  setTimeout(gameLoop, 100);
}

function moveSnake() {
  // 대기 중인 방향 입력이 있다면 적용
  if (pendingDirection) {
    direction = pendingDirection;
    pendingDirection = null;
  }

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }
}


function checkCollision() {
  const head = snake[0];

  // 벽 충돌
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    showGameOver();
  }

  // 자기 몸 충돌
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      showGameOver();
    }
  }
}

function showGameOver() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
  }
  updateScore();
  isGameOver = true;
  direction = { x: 0, y: 0 };
  restartBtn.style.display = 'block';
}

function resetGame() {
  score = 0;
  updateScore();
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 5, y: 5 };
  isGameOver = false;
  restartBtn.style.display = 'none';
}

restartBtn.addEventListener('click', () => {
  resetGame();
});

function drawGame() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 뱀 그리기
  ctx.fillStyle = 'lime';
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2);

    const segmentX = segment.x * tileSize + tileSize / 2;
    const segmentY = segment.y * tileSize + tileSize / 2;

    // 머리일 때만 얼굴 추가
    if (i === 0) {
      // 눈 흰자
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(segment.x * tileSize + tileSize / 4, segment.y * tileSize + tileSize / 3, tileSize / 5, 0, Math.PI * 2);
      ctx.arc(segment.x * tileSize + tileSize * 3 / 4, segment.y * tileSize + tileSize / 3, tileSize / 5, 0, Math.PI * 2);
      ctx.fill();
    
      // 눈동자
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(segment.x * tileSize + tileSize / 4, segment.y * tileSize + tileSize / 3, tileSize / 10, 0, Math.PI * 2);
      ctx.arc(segment.x * tileSize + tileSize * 3 / 4, segment.y * tileSize + tileSize / 3, tileSize / 10, 0, Math.PI * 2);
      ctx.fill();



    }
    ctx.fillStyle = 'lime';
  }
  

  // 음식 그리기
  if (!isGameOver) {
// 빨간 원 그리기 (사과 대신)
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.arc(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
ctx.fill();

// 원 안에 "+1" 텍스트 그리기
ctx.fillStyle = 'white';
ctx.font = '13px Arial'; // 폰트 설정
ctx.textAlign = 'center'; // 텍스트 가운데 정렬
ctx.textBaseline = 'middle'; // 텍스트 세로 가운데 정렬
ctx.fillText('+1', food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 1.9); // "+1" 텍스트 그리기
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

let isKeyPressed = false; // 키 입력 상태를 추적하는 변수

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  const newDirection = (() => {
    if ((key === 'arrowup' || key === 'w') && direction.y === 0) return { x: 0, y: -1 };
    if ((key === 'arrowdown' || key === 's') && direction.y === 0) return { x: 0, y: 1 };
    if ((key === 'arrowleft' || key === 'a') && direction.x === 0) return { x: -1, y: 0 };
    if ((key === 'arrowright' || key === 'd') && direction.x === 0) return { x: 1, y: 0 };
    return null;
  })();

  if (newDirection) {
    pendingDirection = newDirection;
  }
});



// 초기 점수 표시 & 게임 시작
updateScore();
gameLoop();
