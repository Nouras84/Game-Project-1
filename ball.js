const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const ballSize = 30;
const ballFrequency = 2000;

const colors = [
  "#DC40B0",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

const specialColor = "#B11111";
let missedBalls = 0; // Number of balls missed
const decisionZoneY = canvas.height - 50; // The Y position of the decision line

// Function to create a new ball
function createBall() {
  const newBall = {
    x: canvas.width / 2,
    y: 0, // Start at the top
    size: ballSize,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
  balls.push(newBall);
}

// Function to draw a ball
function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// Function to update the game state
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the decision line
  ctx.beginPath();
  ctx.moveTo(0, 700);
  ctx.lineTo(canvas.width, 700);
  ctx.strokeStyle = "yellow";
  ctx.stroke();

  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];

    // Draw the ball
    drawBall(ball);

    // Move the ball down
    ball.y += 10;

    // Check if the ball crosses the decision line
    if (ball.y > decisionZoneY + ball.size) {
      if (ball.color !== specialColor) {
        // Missed a non-special color ball
        missedBalls++;
        console.log(`Missed: ${missedBalls}`);
      }
      // Remove the ball regardless of color after crossing the line
      balls.splice(i, 1);
    }

    // Check for game over
    if (missedBalls >= 4) {
      console.log("Game Over!");
      return; // Stop the game loop if game over
    }
  }

  // Continue the animation loop
  requestAnimationFrame(update);
}

// Event listener for space bar
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      if (ball.color !== specialColor) {
        // Remove ball if it's not the special color
        balls.splice(i, 1);
        break; // Only remove one ball per space press
      }
    }
  }
});

// Start creating balls at a regular interval
setInterval(createBall, ballFrequency);

// Start the game loop
update();
