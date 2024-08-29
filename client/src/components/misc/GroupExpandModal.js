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
import { AddIcon, EditIcon, CheckIcon } from "@chakra-ui/icons";
import AddFriendToGroupChat from "./AddFriendToGroupChat";
import axios from "axios";

const GroupExpandModal = ({ isOpen, onClose, fetchMessages }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();

  const [triggerAddMember, setTriggerAddMember] = useState(false);
  const [newGroupChatName, setNewGroupChatName] = useState(
    selectedChat.chatName
  );
  const [triggerGroupChatName, setTriggerGroupChatName] = useState(false);

  const switchTrigger = () => {
    setTriggerAddMember(!triggerAddMember);
  };

  const handleRenameGroupChat = async () => {
    setTriggerGroupChatName(!triggerGroupChatName);

    if (triggerGroupChatName) {
      console.log("newGroupChatName", newGroupChatName);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const res = await axios.put(
          "http://localhost:5000/api/chats/renameGroupChat",
          {
            chatId: selectedChat._id,
            chatName: newGroupChatName,
          },
          config
        );
        setNewGroupChatName(res.data.chatName);
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.put(
        "http://localhost:5000/api/chats/removeFromGroup",
        { chatId: selectedChat._id, userId: userId },
        config
      );
      setSelectedChat(res.data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      // if (userId === user._id) {
      //   onClose();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#4d426d">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="userExpand">
              <img src={selectedChat.groupAdmin.profilePic} alt="profile" />
              <div className="groupChatName">
                <h3
                  contentEditable={triggerGroupChatName}
                  onInput={(e) => {
                    setNewGroupChatName(e.currentTarget.textContent);
                  }}
                >
                  {newGroupChatName}
                </h3>
                <button
                  onClick={handleRenameGroupChat}
                  disabled={user._id !== selectedChat.groupAdmin._id}
                >
                  {triggerGroupChatName ? (
                    <CheckIcon color="gray.100" boxSize={3} />
                  ) : (
                    <EditIcon color="gray.100" boxSize={3} />
                  )}
                </button>
                {triggerGroupChatName && <div className="editingLine"></div>}
              </div>
              <div className="groupMembers">
                {user._id === selectedChat.groupAdmin._id && (
                  <div className="addMember" onClick={switchTrigger}>
                    <button>
                      <AddIcon color="gray.100" boxSize={3} />{" "}
                    </button>
                    <span>Add Member</span>
                    {triggerAddMember && (
                      <AddFriendToGroupChat switchTrigger={switchTrigger} />
                    )}
                  </div>
                )}
                <div className="groupMember" key={selectedChat.groupAdmin._id}>
                  <div className="memberDetails">
                    <img
                      src={selectedChat.groupAdmin.profilePic}
                      alt="profile"
                    />
                    <span>{selectedChat.groupAdmin.username}</span>
                  </div>

                  <button>Admin</button>
                  {/* {user._id === selectedChat.groupAdmin._id && (
                    <button
                      className="leaveButton"
                      onClick={() =>
                        handleRemoveMember(selectedChat.groupAdmin._id)
                      }
                    >
                      Leave
                    </button>
                  )} */}
                </div>
                {selectedChat.users.map(
                  (user1) =>
                    user1._id !== selectedChat.groupAdmin._id && (
                      <div className="groupMember" key={user1._id}>
                        <div className="memberDetails">
                          <img src={user1.profilePic} alt="profile" />
                          <span>{user1.username}</span>
                        </div>
                        {user._id === selectedChat.groupAdmin._id && (
                          <button onClick={() => handleRemoveMember(user1._id)}>
                            Remove
                          </button>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupExpandModal;
