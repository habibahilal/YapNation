import "../../css/MyChats.css";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../misc/GroupChatModal";

const MyChats = () => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(
        "http://localhost:5000/api/chats/getChats",
        config
      );
      setChats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <div className="chats">
      <div className="chatsHeader">
        <h3>Messages</h3>
        <GroupChatModal>
          <button> Create Group Chat</button>
        </GroupChatModal>
      </div>
      <div className="chatsList">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="chat"
            onClick={() => setSelectedChat(chat)}
          >
            <img
              src={
                !chat.isGroupChat
                  ? getSender(user, chat.users).profilePic
                  : chat.groupAdmin.profilePic
              }
            />
            <div className="chatInfo">
              <h4>
                {!chat.isGroupChat
                  ? getSender(user, chat.users).username
                  : chat.chatName}
              </h4>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;
