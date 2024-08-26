const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/sendMessage", protect, sendMessage);

router.get("/getMessages/:chatId", protect, getMessages);

module.exports = router;
