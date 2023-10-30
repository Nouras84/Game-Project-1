const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const ballSize = 30;
const ballFrequency = 2000;

const colors = [
  "#B11111",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

function createBall() {
  // Create a new ball object with a random color and fixed size
  const newBall = {
    x: canvas.width / 2, // X position to start at the center
    y: 0, // Y position to start at the top of the canvas
    size: ballSize,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
  balls.push(newBall);
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (const ball of balls) {
    drawBall(ball); // Draw each ball
    ball.y += ball.size * 0.5; // Move the ball down by half its diameter
    if (ball.y >= 690) {
      if (ball.color === "#B11111") {
        console.log("won!");
      } else {
        console.log("lost!");
      }
    }
    // console.log(ball);
  }

  // Remove balls that are off the screen
  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].y - ballSize > canvas.height) {
      balls.splice(i, 1);
    }
  }

  requestAnimationFrame(update); // Request the next animation frame
}

// Start the ball creation loop
setInterval(createBall, ballFrequency);

// Start the animation loop
update();
