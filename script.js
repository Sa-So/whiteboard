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

// Event listeners for mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Event listeners for touch events
canvas.addEventListener("touchstart", startDrawingTouch);
canvas.addEventListener("touchmove", drawTouch);
canvas.addEventListener("touchend", stopDrawingTouch);
canvas.addEventListener("touchcancel", stopDrawingTouch);

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

// Function to handle drawing with mouse
function startDrawing(event) {
  if (drawingWithoutMouseDown) return; // Don't start drawing if in "without mousedown" mode
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
}

function draw(event) {
  if (drawingWithoutMouseDown) {
    if (isDrawing || event.type === "mousemove") {
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

// Function to handle drawing with touch
function startDrawingTouch(event) {
  event.preventDefault(); // Prevent default scrolling behavior
  if (drawingWithoutMouseDown) return;

  isDrawing = true;
  const touch = event.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
}

function drawTouch(event) {
  event.preventDefault(); // Prevent default scrolling behavior
  if (drawingWithoutMouseDown) {
    if (isDrawing || event.type === "touchmove") {
      const touch = event.touches[0];
      const startX = lastX;
      const startY = lastY;
      const endX = touch.clientX;
      const endY = touch.clientY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

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
      const touch = event.touches[0];
      const startX = lastX;
      const startY = lastY;
      const endX = touch.clientX;
      const endY = touch.clientY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

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

function stopDrawingTouch(event) {
  isDrawing = false;
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
  document.querySelector("meta[name='theme-color']").content = bgColor;
  document.querySelector("body").style.backgroundColor = bgColor;

  canvas.style.backgroundColor = bgColor;
});

// Clear button functionality
document.getElementById("clearButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history = [];
});

// Undo function triggered by Ctrl+Z
function undoDrawing() {
  if (history.length > 0) {
    for (let i = 0; i < 7; i++) {
      history.pop();
    }
    redrawCanvas();
  }
}

// Redraw the entire canvas based on history
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    currentCanvasId = `canvas-${Date.now()}`;
  }

  const canvasData = {
    history: history,
    bgColor: canvas.style.backgroundColor || "#ffffff",
  };

  localStorage.setItem(currentCanvasId, JSON.stringify(canvasData));
  updateCanvasList();
}

// Load the selected canvas from localStorage
function loadCanvas(canvasId) {
  const storedData = localStorage.getItem(canvasId);
  if (storedData) {
    const { history: storedHistory, bgColor } = JSON.parse(storedData);
    history = storedHistory;
    currentCanvasId = canvasId;
    canvas.style.backgroundColor = bgColor || "#ffffff";
    redrawCanvas();
  }
}

// Create a list of saved canvases
function updateCanvasList() {
  const canvasList = document.getElementById("canvasList");
  canvasList.innerHTML = "";
  const canvasArr = [];
  for (const key in localStorage) {
    if (key.startsWith("canvas-")) {
      canvasArr.push(key);
    }
  }
  canvasArr.sort();
  let i = 0;
  for (const key of canvasArr) {
    const listItem = document.createElement("li");
    const el = document.createElement("span");
    const butt = document.createElement("button");
    i += 1;
    el.textContent = `Canvas ${i} `;
    el.addEventListener("click", () => loadCanvas(key));
    butt.textContent = "del";
    butt.addEventListener("click", () => {
      localStorage.removeItem(key);
      updateCanvasList();
    });
    listItem.appendChild(el);
    listItem.appendChild(butt);
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
  const canvasList = document.getElementById("canvasList");
  canvasList.style.display =
    canvasList.style.display === "none" ? "block" : "none";
});
