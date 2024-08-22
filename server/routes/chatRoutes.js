const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/accessChat", protect, accessChat);
router.get("/getChats", protect, getChats);
router.post("/createGroupChat", protect, createGroupChat);
router.put("/renameGroupChat", protect, renameGroupChat);
router.put("/addToGroup", protect, addToGroup);
router.put("/removeFromGroup", protect, removeFromGroup);

module.exports = router;
