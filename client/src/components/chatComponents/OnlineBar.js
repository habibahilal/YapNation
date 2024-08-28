import "../../css/OnlineBar.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { FriendRequestTriggerState } from "../../context/FriendRequestTriggerProvider";
import { Spinner, Button } from "@chakra-ui/react";

const OnlineBar = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { friendRequestTrigger, setFriendRequestTrigger } =
    FriendRequestTriggerState();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const res = await axios.get(
          "http://localhost:5000/api/users/getFriends",
          config
        );
        setFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [user, friendRequestTrigger]);

  const fetchUsers = async (value) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/users/getUsers?keyword=${value}`,
        config
      );
      setSearchResults(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    fetchUsers(value);
  };

  const handleAddUser = async (userId, value) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        "http://localhost:5000/api/users/addFriend",
        { userId },
        config
      );

      handleSearch(value);
      setFriendRequestTrigger(!friendRequestTrigger);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptRequest = async (userId, value) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        "http://localhost:5000/api/users/acceptFriendRequest",
        { userId },
        config
      );

      handleSearch(value);
      setFriendRequestTrigger(!friendRequestTrigger);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/chats/accessChat",
        { userId },
        config
      );

      if (!chats.find((chat) => chat._id === res.data._id)) {
        setChats([res.data, ...chats]);
      }

      setSelectedChat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="usersSection">
      <div className="searchBar">
        <img
          width="20"
          height="20"
          src="https://img.icons8.com/ios-filled/50/search--v1.png"
          alt="search--v1"
        />
        <input
          type="text"
          placeholder="Search for users"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="usersList">
        {loading ? (
          <Spinner size="sm" />
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result._id} className="user">
              <img src={result.profilePic} alt="profile" />
              <span>{result.username}</span>
              <Button
                bg="white"
                _hover={{
                  background: "#9187ab",
                  color: "white",
                }}
                size="xs"
                isDisabled={
                  result.friendRequests.includes(user._id)
                  // || user.friendRequests.includes(result._id)
                }
                onClick={
                  user.friendRequests.includes(result._id)
                    ? () => handleAcceptRequest(result._id, search)
                    : () => handleAddUser(result._id, search)
                }
              >
                {result.friendRequests.includes(user._id)
                  ? "Request Pending"
                  : user.friendRequests.includes(result._id)
                  ? "Accept"
                  : "Add"}
              </Button>
            </div>
          ))
        ) : null}
      </div>
      <div className="onlineBar">
        <div className="onlineBar_header">
          <h3>Friends</h3>
        </div>
        <div className="onlineBar_users">
          {friends.map((friend) => (
            <div
              className="onlineBar_user"
              key={friend._id}
              onClick={() => accessChat(friend._id)}
            >
              <img src={friend.profilePic} alt="profile" />
              <span>{friend.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineBar;
