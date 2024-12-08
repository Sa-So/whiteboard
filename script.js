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
let history = []; // History stack to store drawing actions

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
      lastX = event.clientX;
      lastY = event.clientY;
    }
  }

  // Listen for Ctrl + Z for undo
  if ((event.ctrlKey || event.metaKey) && event.key === "z") {
    event.preventDefault(); // Prevent default behavior (Undo in browser)
    undoDrawing(); // Call the undo function
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
    // Drawing without mouse down
    if (isDrawing || event.type === "mousemove") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Save the drawing to history
      history.push({
        startX: lastX,
        startY: lastY,
        endX: event.offsetX,
        endY: event.offsetY,
        color: color,
        lineWidth: lineWidth,
      });

      lastX = event.offsetX;
      lastY = event.offsetY;
    }
  } else {
    // Normal drawing mode
    if (isDrawing) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Save the drawing to history
      history.push({
        startX: lastX,
        startY: lastY,
        endX: event.offsetX,
        endY: event.offsetY,
        color: color,
        lineWidth: lineWidth,
      });

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
  history = []; // Clear the drawing history as well
});

// Undo function triggered by Ctrl+Z
function undoDrawing() {
  if (history.length > 0) {
    history.pop(); // Remove the last drawing action from history
    redrawCanvas(); // Redraw the canvas without the last action
  }
}

// Redraw the entire canvas based on history
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  for (let i = 0; i < history.length; i++) {
    const { startX, startY, endX, endY, color, lineWidth } = history[i];
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
}
