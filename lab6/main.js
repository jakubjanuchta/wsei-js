let distance = 100;
let gameState = 'stopped';

const ballSize = 5;
const noOfBalls = 100;
const balls = [];

const canvasWidth = 1000;
const canvasHeight = 500;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

function createBall() {
  let ballX = Math.random() * (canvasWidth - ballSize * 2);
  let ballY = Math.random() * (canvasHeight - ballSize * 2);
  let ballDirectionX = Math.random() * 2 - 1;
  let ballDirectionY = Math.random() * 2 - 1;

  function calcDistance(ballToConnect) {
    return Math.sqrt(
      Math.pow(ballToConnect.ballX - ballX, 2) +
        Math.pow(ballToConnect.ballY - ballY, 2)
    );
  }

  function drawConnections() {
    balls.forEach((ballToConnect) => {
      if (calcDistance(ballToConnect) < distance) {
        ctx.beginPath();

        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ballToConnect.ballX, ballToConnect.ballY);

        ctx.strokeStyle = 'black';
        ctx.stroke();
      }
    });
  }

  function render(ctx, ball) {
    ballX += ballDirectionX;
    ballY += ballDirectionY;

    if (ballX <= ballSize || ballX >= canvasWidth - ballSize) {
      ballDirectionX *= -1;
    }

    if (ballY <= ballSize || ballY >= canvasHeight - ballSize) {
      ballDirectionY *= -1;
    }

    drawConnections();

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2, true);
    ctx.fillStyle = 'orange';
    ctx.fill();

    ball.ballX = ballX;
    ball.ballY = ballY;
  }

  return { render, distance, ballX, ballY };
}

function createBalls() {
  for (let i = 0; i < noOfBalls; i++) {
    const newBall = createBall();

    balls.push(newBall);
  }
}

function drawBalls() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  balls.forEach((ball) => ball.render(ctx, ball));

  if (gameState === 'started') {
    requestAnimationFrame(drawBalls);
  }
}

createBalls();
drawBalls();

document.querySelector('#distanceRange').addEventListener('input', function () {
  distance = this.value;
  document.querySelector('#distanceValue').textContent = distance;
});

const startButton = document.querySelector('#start');

startButton.addEventListener('click', function () {
  gameState = gameState === 'started' ? 'stopped' : 'started';
  startButton.textContent = gameState === 'stopped' ? 'Start' : 'Stop';

  if (gameState === 'started') requestAnimationFrame(drawBalls);
});

document.querySelector('#reset').addEventListener('click', () => {
  startButton.textContent = 'Start';
  gameState = 'stopped';

  balls.length = 0;
  createBalls();

  drawBalls();
});
