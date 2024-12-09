// const express = require("express");
// const http = require("http");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5500", "https://sa-so.github.io"],
  },
});

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static("public"));

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

io.on("connection", (socket) => {
  console.log("a user connected");

  // Broadcast drawing data to all clients
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
