import "../css/ChatPage.css";
import React from "react";
import OnlineBar from "../components/chatComponents/OnlineBar";
import MyChats from "../components/chatComponents/MyChats";
import MyAccount from "../components/chatComponents/MyAccount";
import FriendRequestTriggerProvider from "../context/FriendRequestTriggerProvider";
const ChatPage = () => {
  return (
    <div>
      <div className="chatContainer">
        <div className="chatPageLeft">
          <FriendRequestTriggerProvider>
            <MyAccount />
            <OnlineBar />
          </FriendRequestTriggerProvider>
          <MyChats />
        </div>
        <div className="chatPageRight">
          <div className="chatBox">chat</div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
