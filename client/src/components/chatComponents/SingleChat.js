import "../../css/SingleChat.css";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import { useDisclosure } from "@chakra-ui/react";
import UserExpandModal from "../misc/UserExpandModal";
import GroupExpandModal from "../misc/GroupExpandModal";

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
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
            <GroupExpandModal isOpen={isOpen} onClose={onClose} />
          ) : (
            <UserExpandModal isOpen={isOpen} onClose={onClose} />
          )}
        </div>
      </div>
      <div className="chatBoxBody"></div>
      <div className="chatBoxFooter"></div>
    </div>
  );
};

export default SingleChat;
