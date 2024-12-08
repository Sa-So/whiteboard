// script.js

const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Canvas settings
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50; // Leave space for the toolbar

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = "#000000"; // Default color
let lineWidth = 5; // Default line width
let drawingWithoutMouseDown = false; // New flag to track "drawing without mousedown"

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Keydown listener for the "1" key
document.addEventListener("keydown", (event) => {
  if (event.key === "`") {
    drawingWithoutMouseDown = !drawingWithoutMouseDown; // Toggle the mode
    if (drawingWithoutMouseDown) {
      // Reset the drawing position to the current mouse position when entering "drawing without mousedown" mode
      lastX = event.clientX;
      lastY = event.clientY;
    }

    console.log(
      drawingWithoutMouseDown
        ? "Drawing without mousedown!"
        : "Normal drawing mode"
    );
  }
});

// Drawing function for normal mode
function startDrawing(event) {
  if (drawingWithoutMouseDown) return; // Don't start drawing if in "without mousedown" mode
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
}

function draw(event) {
  if (drawingWithoutMouseDown) {
    // If we are in "drawing without mousedown" mode, use mouse movement to draw
    if (isDrawing || event.type === "mousemove") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      lastX = event.offsetX;
      lastY = event.offsetY;
    }
  } else {
    // Normal mode (mousedown required)
    if (isDrawing) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      lastX = event.offsetX;
      lastY = event.offsetY;
    }
  }
}

function stopDrawing() {
  if (!drawingWithoutMouseDown) {
    isDrawing = false;
  }
}

// Handle color change
document.getElementById("colorPicker").addEventListener("input", (event) => {
  color = event.target.value;
});

// Handle line width change
document.getElementById("lineWidth").addEventListener("input", (event) => {
  lineWidth = event.target.value;
});

// Clear button functionality
document.getElementById("clearButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
