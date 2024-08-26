const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    console.log("No chat id or content");
    return res.sendStatus(400);
  }

  try {
    var newMessage = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
    });

    newMessage = await newMessage.populate("sender", "username profilePic");

    newMessage = await newMessage.populate("chat");

    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "username profilePic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage,
    });

    res.json(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getMessages };
