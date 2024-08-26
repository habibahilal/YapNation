import React, { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  AlertDialogCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const AddFriendToGroupChat = ({ switchTrigger }) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const filteredResults = res.data.filter(
        (user) => !selectedChat.users.find((u) => u._id === user._id)
      );

      setSearchResults(filteredResults);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    onOpen();
  }, []);

  const handleClose = () => {
    onClose();
    switchTrigger();
  };

  const addUsersToGroupChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.put(
        "http://localhost:5000/api/chats/addToGroup",
        {
          chatId: selectedChat._id,
          users: selectedUsers,
        },
        config
      );

      setSearch("");
      setSearchResults([]);
      setSelectedUsers([]);
      setSelectedChat(res.data);
      handleClose();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent background="#e0e5b6">
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <div className="groupChatInputs">
              {" "}
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
              background="#FAEDCE"
              _hover={{ background: "#FEFAE0" }}
              transition="background 0.4s ease"
              onClick={addUsersToGroupChat}
            >
              Add
            </Button>
          </AlertDialogBody>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddFriendToGroupChat;
