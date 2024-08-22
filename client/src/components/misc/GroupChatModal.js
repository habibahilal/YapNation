import "../../css/GroupChatModal.css";
import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/users/searchFriends?keyword=${value}`,
        config
      );

      setSearchResults(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSelect = async () => {};

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#E0E5B6">
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="groupChatInputs">
              <input
                type="text"
                placeholder="Group Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Add friends"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="selectedUsers"></div>
            <div className="searchResults">
              {loading ? (
                <Spinner alignSelf="center" />
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div key={user._id} className="searchResult">
                    <img src={user.profilePic} alt="profile" />
                    <span>{user.username}</span>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user._id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user._id)
                          );
                        }
                      }}
                    />
                  </div>
                ))
              ) : (
                <p>No users found</p>
              )}
            </div>
            <Button
              background="#FAEDCE"
              _hover={{ background: "#FEFAE0" }}
              transition="background 0.4s ease"
            >
              Create
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
