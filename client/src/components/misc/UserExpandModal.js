import "../../css/UserExpandModal.css";
import React from "react";
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
import { getSender } from "../../config/ChatLogics";

const UserExpandModal = ({ isOpen, onClose }) => {
  const { user, selectedChat } = ChatState();

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#4d426d">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="userExpand">
              <img
                src={getSender(user, selectedChat.users).profilePic}
                alt="profile"
              />
              <h3>{getSender(user, selectedChat.users).username}</h3>
              <h4>{getSender(user, selectedChat.users).email}</h4>{" "}
            </div>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserExpandModal;
