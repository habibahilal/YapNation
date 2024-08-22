const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

// variables

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});

// routes

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// error handling

app.use(notFound);
app.use(errorHandler);
