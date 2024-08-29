import "../../css/ChatBox.css";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <div className="chatBox">
          <SingleChat />
        </div>
      ) : (
        <div className="chatBox">
          <div className="noChatSelected">
            <div className="logo">
              <h1>YapNation</h1>
              <img
                width="64"
                height="64"
                src="/chat-logo.png"
                alt="chat logo"
              />
            </div>

            <h4>Start a conversation!</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
