import "../../css/SingleChat.css";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import { useDisclosure } from "@chakra-ui/react";
import UserExpandModal from "../misc/UserExpandModal";
import GroupExpandModal from "../misc/GroupExpandModal";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/messages/getMessages/${selectedChat._id}`,
        config
      );

      setMessages(res.data);
      setLoading(false);
      socket.emit("joinRoom", selectedChat._id);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", (typingUserId) => {
      if (typingUserId !== socket.id) {
        setIsTyping(true);
      }
    });
    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messageReceived", (message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
      ) {
        //notification logic
      } else {
        setMessages([...messages, message]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (newMessage && (e.key === "Enter" || e.type === "click")) {
      socket.emit("stopTyping", selectedChat._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const body = {
          chatId: selectedChat._id,
          content: newMessage,
        };

        setNewMessage("");

        const res = await axios.post(
          "http://localhost:5000/api/messages/sendMessage",
          body,
          config
        );

        socket.emit("sendMessage", res.data);
        setMessages([...messages, res.data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        console.log(error);
        toast({
          title: "An error occurred.",
          description: "Unable to send message.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var typingTimer = new Date().getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="chatBox">
      <div className="chatBoxHeader">
        <div className="headerInfo" onClick={onOpen}>
          <img
            src={
              !selectedChat.isGroupChat
                ? getSender(user, selectedChat.users).profilePic
                : selectedChat.groupAdmin.profilePic
            }
            alt="profile"
          />
          <h4>
            {!selectedChat.isGroupChat
              ? getSender(user, selectedChat.users).username
              : selectedChat.chatName}
          </h4>
        </div>
        <div className="headerButton"></div>
        <div className="headerModal">
          {selectedChat.isGroupChat ? (
            <GroupExpandModal
              isOpen={isOpen}
              onClose={onClose}
              fetchMessages={fetchMessages}
            />
          ) : (
            <UserExpandModal isOpen={isOpen} onClose={onClose} />
          )}
        </div>
      </div>
      <div className="chatBoxBody">
        {loading ? (
          <Spinner size="xl" alignSelf="center" margin="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} isTyping={isTyping} />
          </div>
        )}
      </div>
      <div className="chatBoxFooter">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
        />
        <button onClick={sendMessage} disabled={!newMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
