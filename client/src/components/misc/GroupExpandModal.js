import "../../css/GroupExpandModal.css";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import { ChatState } from "../../context/ChatProvider";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import AddFriendToGroupChat from "./AddFriendToGroupChat";

const GroupExpandModal = ({ isOpen, onClose }) => {
  const [triggerAddMember, setTriggerAddMember] = useState(false);
  const { selectedChat } = ChatState();

  const switchTrigger = () => {
    setTriggerAddMember(!triggerAddMember);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#E0E5B6">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="userExpand">
              <img src={selectedChat.groupAdmin.profilePic} alt="profile" />
              <div className="groupChatName">
                <h3>{selectedChat.chatName}</h3>
                <button>
                  <EditIcon boxSize={3} />{" "}
                </button>
              </div>
              <div className="groupMembers">
                <div className="addMember" onClick={switchTrigger}>
                  <button>
                    <AddIcon boxSize={3} />{" "}
                  </button>
                  <span>Add Member</span>
                  {triggerAddMember && (
                    <AddFriendToGroupChat switchTrigger={switchTrigger} />
                  )}
                </div>
                {selectedChat.users.map((user) => (
                  <div className="groupMember" key={user._id}>
                    <div className="memberDetails">
                      <img src={user.profilePic} alt="profile" />
                      <span>{user.username}</span>
                    </div>
                    <button>Remove</button>
                  </div>
                ))}
              </div>{" "}
            </div>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupExpandModal;
