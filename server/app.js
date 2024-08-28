const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

// variables

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});

// routes

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// error handling

app.use(notFound);
app.use(errorHandler);

// socket.io

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (message) => {
    var chat = message.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("messageReceived", message);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", socket.id);
  });

  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });
});
