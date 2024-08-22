const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUsers,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  searchFriends,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUsers", protect, getUsers);
router.put("/addFriend", protect, addFriend);
router.put("/acceptFriendRequest", protect, acceptFriendRequest);
router.put("/rejectFriendRequest", protect, rejectFriendRequest);
router.get("/getFriendRequests", protect, getFriendRequests);
router.get("/getFriends", protect, getFriends);
router.get("/searchFriends", protect, searchFriends);

module.exports = router;
