const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  // validation

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    profilePic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // validation

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      friends: user.friends,
      friendRequests: user.friendRequests,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        username: {
          $regex: `^${req.query.keyword}`,
          $options: "i",
        },
      }
    : {};

  if (Object.keys(keyword).length === 0) {
    res.send([]);
  }

  //exclude the users that are already friends

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id }, friends: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
});

const addFriend = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isFriend = req.user.friendRequests.includes(userId);

  if (isFriend) {
    res.status(400);
    throw new Error("User already received a friend request");
  }

  user.friendRequests.push(req.user._id);

  await user.save();

  res.send("Friend request sent successfully");
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isFriend = req.user.friends.includes(userId);

  if (isFriend) {
    res.status(400);
    throw new Error("User is already your friend");
  }

  req.user.friends.push(userId);
  req.user.friendRequests = req.user.friendRequests.filter(
    (request) => request.toString() !== userId
  );
  user.friends.push(req.user._id);

  await req.user.save();
  await user.save();

  res.send("Friend added successfully");
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  req.user.friendRequests = req.user.friendRequests.filter(
    (request) => request.toString() !== userId
  );

  await req.user.save();

  res.send("Friend request rejected successfully");
});

const getFriendRequests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const friendRequests = await User.find({
    _id: { $in: user.friendRequests },
  }).select("-password");

  res.send(friendRequests);
});

const getFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const friends = await User.find({
    _id: { $in: user.friends },
  }).select("-password");

  res.send(friends);
});

const searchFriends = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        username: {
          $regex: `^${req.query.keyword}`,
          $options: "i",
        },
      }
    : {};

  if (Object.keys(keyword).length === 0) {
    res.send([]);
  }

  const user = await User.findById(req.user._id);

  const friends = await User.find(keyword)
    .find({ _id: { $in: user.friends } })
    .select("-password");

  res.send(friends);
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  searchFriends,
};
