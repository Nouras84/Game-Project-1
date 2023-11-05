class Ball {
  constructor(x, y, size, color) {
    //position X, Y
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.y += 14;
  }

  isBelowLine(lineY) {
    return this.y > lineY + this.size;
  }
}

// coordinates the timing of these actions and checks
// the game logic, such as determining if balls have crossed the decisionLineY
//or if the player has interacted with them correctly based on their color

class Game {
  constructor(canvas, lossCounterElement) {
    // reference to the HTML element on the page that will display the number of losses.
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lossCounterElement = lossCounterElement;
    this.balls = []; // A list to keep all the balls that are created.
    this.losses = 0; // the counter for how many losses
    this.ballFrequency = 1400; // How often to create balls
    this.ballSize = 30;
    this.decisionLineY = canvas.height - 360;
    this.loseColor = "#B11111"; // Color that should not be clicked and can pass
    this.colors = [
      "#DC40B0",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
    ];

    // Bind the instance methods to ensure 'this' refers to the Game instance when they are used as callbacks.
    this.update = this.update.bind(this);
    this.createBall = this.createBall.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.restartButton = document.getElementById("restart-button");
    this.restartButton.addEventListener("click", () => this.resetGame());

    // Setting up the event listener for key presses
    document.addEventListener("keydown", this.handleKeyPress);
  }

  //creating the randomness of the losecolor
  createBall() {
    const isLoseColor = Math.random() < 2 / 7; // 2 out of 7 Chance to create a loseColor ball
    const color = isLoseColor
      ? this.loseColor
      : this.colors[Math.floor(Math.random() * this.colors.length)];
    const newBall = new Ball(this.canvas.width / 2, 0, this.ballSize, color); // centering the ball
    this.balls.push(newBall);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

    // Draw decision line
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.decisionLineY);
    this.ctx.lineTo(this.canvas.width, this.decisionLineY);
    this.ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    this.ctx.stroke();

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      ball.draw(this.ctx);
      ball.move();

      if (ball.isBelowLine(this.decisionLineY)) {
        if (ball.color !== this.loseColor) {
          this.losses++;
          this.lossCounterElement.textContent = "Losses: " + this.losses; // Update the display with the current number of losses
          if (this.losses >= 4) {
            console.log("Game Over!");
            this.gameOver();
            return;
          }
        }
        this.balls.splice(i, 1); // Remove the ball after crossing the line
      }
    }

    if (this.losses < 4) {
      requestAnimationFrame(this.update);
    }
  }

  handleKeyPress(event) {
    // Execute when the space bar is pressed
    if (event.code === "Space") {
      for (let i = this.balls.length - 1; i >= 0; i--) {
        const ball = this.balls[i];
        if (ball.y + ball.size < this.decisionLineY) {
          if (ball.color === this.loseColor) {
            this.losses++;
            this.lossCounterElement.textContent = "Losses: " + this.losses;
            console.log("You clicked the loseColor ball! Lost a point.");
          }
          this.balls.splice(i, 1);
          break; // Remove only one ball per space press, and exit the loop
        }
      }
    }
  }

  startGameLoop() {
    // Delay ball creation for 2 second
    setTimeout(() => {
      this.ballCreationInterval = setInterval(
        this.createBall, //line 62
        this.ballFrequency // 32 line/ 39
      );
    }, 2000);

    this.update(); // Start the game update loop using the bound function
  }

  resetGame() {
    this.balls = []; // Reset the balls array
    this.losses = 0; // Reset the losses
    this.lossCounterElement.textContent = "Losses: 0"; // Reset the loss counter display
    this.restartButton.classList.add("hidden"); // Hide the restart button
    clearInterval(this.ballCreationInterval); // Clear the interval for creating balls
    this.startGameLoop(); // Restart the game loop
  }

  gameOver() {
    clearInterval(this.ballCreationInterval);
    this.restartButton.classList.remove("hidden");
    // Additional game over logic can be added here
  }
}

// Initialization code
const gameCanvas = document.getElementById("gameCanvas");
const lossCounterElement = document.getElementById("loss-counter");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

const game = new Game(gameCanvas, lossCounterElement);
game.startGameLoop();
