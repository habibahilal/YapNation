import "../../css/SingleChat.css";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameUser,
  isSameSenderMargin,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((message, index) => (
          <div
            style={{ display: "flex" }}
            key={message._id}
            className="chatBoxMessage"
          >
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={message.sender.username}
                placement="bottom-start"
                hasArrow
              >
                <img src={message.sender.profilePic} alt="profile" />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#615EFC" : "#ffffff"
                }`,
                color: `${message.sender._id === user._id ? "white" : "black"}`,
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user._id
                ),
                marginTop: isSameUser(messages, message, index) ? 5 : 0,
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
