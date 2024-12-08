const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Canvas settings
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = "#000000"; // Default color
let lineWidth = 5; // Default line width
let drawingWithoutMouseDown = false; // New flag to track "drawing without mousedown"
let history = []; // History stack to store drawing actions
let currentCanvasId = null; // Keep track of the current canvas' ID

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
    if (isDrawing || event.type === "mousemove") {
      // Save stroke as small chunks
      const startX = lastX;
      const startY = lastY;
      const endX = event.offsetX;
      const endY = event.offsetY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Save the stroke in history
      history.push({
        startX,
        startY,
        endX,
        endY,
        color,
        lineWidth,
      });

      lastX = endX;
      lastY = endY;
    }
  } else {
    if (isDrawing) {
      const startX = lastX;
      const startY = lastY;
      const endX = event.offsetX;
      const endY = event.offsetY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Save the stroke in history
      history.push({
        startX,
        startY,
        endX,
        endY,
        color,
        lineWidth,
      });

      lastX = endX;
      lastY = endY;
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

// Handle background color change
document.getElementById("bgColorPicker").addEventListener("input", (event) => {
  const bgColor = event.target.value;
  canvas.style.backgroundColor = bgColor; // Set the background color of the canvas
});

// Clear button functionality
document.getElementById("clearButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history = []; // Clear the drawing history as well
});

// Undo function triggered by Ctrl+Z
function undoDrawing() {
  if (history.length > 0) {
    const lastAction = history.pop(); // Remove the last action
    // Redraw the entire canvas (without the last action)
    redrawCanvas();
  }
}

// Redraw the entire canvas based on history
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Loop through all the remaining actions and redraw them
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

// Save the current canvas history to localStorage
function saveCanvas() {
  if (currentCanvasId === null) {
    currentCanvasId = `canvas-${Date.now()}`; // Generate a unique ID for the canvas
  }

  const canvasData = {
    history: history,
    bgColor: canvas.style.backgroundColor || "#ffffff", // Save the background color
  };

  localStorage.setItem(currentCanvasId, JSON.stringify(canvasData)); // Store history and background color in localStorage
  updateCanvasList(); // Update the canvas list
}

// Load the selected canvas from localStorage
function loadCanvas(canvasId) {
  const storedData = localStorage.getItem(canvasId);
  if (storedData) {
    const { history: storedHistory, bgColor } = JSON.parse(storedData);
    history = storedHistory;
    currentCanvasId = canvasId;
    canvas.style.backgroundColor = bgColor || "#ffffff"; // Set the background color from saved data
    redrawCanvas(); // Redraw the loaded canvas
  }
}

// Create a list of saved canvases
function updateCanvasList() {
  const canvasList = document.getElementById("canvasList");
  canvasList.innerHTML = ""; // Clear the list
  const canvasArr = [];
  for (const key in localStorage) {
    if (key.startsWith("canvas-")) {
      canvasArr.push(key);
    }
  }
  canvasArr.sort();

  for (const key of canvasArr) {
    const listItem = document.createElement("li");
    listItem.textContent = key;
    listItem.addEventListener("click", () => loadCanvas(key));
    canvasList.appendChild(listItem);
  }
}

// Initialize the canvas list when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCanvasList();
});

// Event listener to save the canvas when the user selects a "Save" button or menu item
document.getElementById("saveButton").addEventListener("click", saveCanvas);

document.getElementById("viewCanvases").addEventListener("click", () => {
  if (document.getElementById("canvasList").style.display === "none") {
    document.getElementById("canvasList").style.display = "block";
  } else {
    document.getElementById("canvasList").style.display = "none";
  }
});
