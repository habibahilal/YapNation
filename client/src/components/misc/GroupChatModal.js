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
import { useToast } from "@chakra-ui/react";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  const handleCreateGroupChat = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/chats/createGroupChat",
        {
          name: groupChatName,
          users: selectedUsers,
        },
        config
      );
      setChats([res.data, ...chats]);
      onClose();
      toast({
        title: "New Group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResults([]);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#eee">
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
                      checked={selectedUsers.includes(user._id)} // Check if the user is selected
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user._id]); // Add the user to the selected users
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user._id) // Remove the user from the selected users
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
              background="#4d426d"
              color={"white"}
              _hover={{ background: "#eee", color: "#4d426d" }}
              transition="background 0.4s ease"
              onClick={handleCreateGroupChat}
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
