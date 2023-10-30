// Selecting the game sections
const startSection = document.getElementById("start-section");
const level1Section = document.getElementById("game-section-level-1");
const level2Section = document.getElementById("game-section-level-2");
const gameOverSection = document.getElementById("game-over-section");

// Add click event to the Start Game button
document.querySelector("button.btn").addEventListener("click", function () {
  startSection.style.display = "none";
  level1Section.style.display = "block";
  // startLevel1();
});

function startLevel1() {
  resizeCanvas(); // Resize the canvas initially when level 1 starts
  window.addEventListener("resize", resizeCanvas); // Adjust canvas size on window resize
  // Your game logic here
  console.log("Level 1 started!");
}

function resizeCanvas() {
  const container = document.querySelector("#game-section-level-1");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
