// // script.js

// const canvas = document.getElementById("whiteboard");
// const ctx = canvas.getContext("2d");

// // Canvas settings
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight - 50; // Leave space for the toolbar

// // Drawing variables
// let isDrawing = false;
// let lastX = 0;
// let lastY = 0;
// let color = "#000000"; // Default color
// let lineWidth = 5; // Default line width

// // Event listeners
// canvas.addEventListener("mousedown", startDrawing);
// canvas.addEventListener("mousemove", draw);
// canvas.addEventListener("mouseup", stopDrawing);
// canvas.addEventListener("mouseout", stopDrawing);

// // Drawing function
// function startDrawing(event) {
//   isDrawing = true;
//   lastX = event.offsetX;
//   lastY = event.offsetY;
// }

// function draw(event) {
//   if (!isDrawing) return;

//   ctx.beginPath();
//   ctx.moveTo(lastX, lastY);
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.strokeStyle = color;
//   ctx.lineWidth = lineWidth;
//   ctx.lineJoin = "round";
//   ctx.lineCap = "round";
//   ctx.stroke();

//   lastX = event.offsetX;
//   lastY = event.offsetY;
// }

// function stopDrawing() {
//   isDrawing = false;
// }

// // Handle color change
// document.getElementById("colorPicker").addEventListener("input", (event) => {
//   color = event.target.value;
// });

// // Handle line width change
// document.getElementById("lineWidth").addEventListener("input", (event) => {
//   lineWidth = event.target.value;
// });

// // Clear button functionality
// document.getElementById("clearButton").addEventListener("click", () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// });

// const socket = io("http://localhost:3000");

// // Emit draw data
// function draw(event) {
//   if (!isDrawing) return;

//   const data = {
//     startX: lastX,
//     startY: lastY,
//     endX: event.offsetX,
//     endY: event.offsetY,
//     color: color,
//     lineWidth: lineWidth,
//   };
//   socket.emit("draw", data); // Send drawing data to server

//   ctx.beginPath();
//   ctx.moveTo(lastX, lastY);
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.strokeStyle = color;
//   ctx.lineWidth = lineWidth;
//   ctx.lineJoin = "round";
//   ctx.lineCap = "round";
//   ctx.stroke();

//   lastX = event.offsetX;
//   lastY = event.offsetY;
// }

// // Listen for other users' drawing data
// socket.on("draw", (data) => {
//   ctx.beginPath();
//   ctx.moveTo(data.startX, data.startY);
//   ctx.lineTo(data.endX, data.endY);
//   ctx.strokeStyle = data.color;
//   ctx.lineWidth = data.lineWidth;
//   ctx.lineJoin = "round";
//   ctx.lineCap = "round";
//   ctx.stroke();
// });
