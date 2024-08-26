const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("No user id");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username profilePic",
  });

  if (isChat.length > 0) {
    return res.json(isChat[0]);
  } else {
    try {
      const newChat = await Chat.create({
        users: [userId, req.user._id],
        isGroupChat: false,
        chatName: "sender",
      });

      const populatedChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.json(populatedChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const getChats = asyncHandler(async (req, res) => {
  try {
    var chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "username profilePic",
    });

    res.json(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .sendStatus(400)
      .send({ message: "Please provide a name and users for the group chat" });
  }

  var users = req.body.users;
  users.push(req.user._id);

  try {
    const newChat = await Chat.create({
      users: users,
      isGroupChat: true,
      chatName: req.body.name,
      groupAdmin: req.user._id,
    });

    const populatedChat = await Chat.findOne({ _id: newChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(populatedChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.chatName) {
    return res.sendStatus(400).send({
      message: "Please provide a new name for the group chat",
    });
  }

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      { chatName: req.body.chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      { $push: { users: { $each: req.body.users } } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      { $pull: { users: req.body.userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
