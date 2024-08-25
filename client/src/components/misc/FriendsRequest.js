import "../../css/FriendRequest.css";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { FriendRequestTriggerState } from "../../context/FriendRequestTriggerProvider";

const FriendsRequest = ({ isOpen, onClose }) => {
  const { user } = ChatState();

  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { friendRequestTrigger, setFriendRequestTrigger } =
    FriendRequestTriggerState();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.get(
          "http://localhost:5000/api/users/getFriendRequests",
          config
        );
        setFriendRequests(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, friendRequestTrigger]);

  const handleAcceptRequest = async (userId) => {
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

      setFriendRequestTrigger(!friendRequestTrigger);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        "http://localhost:5000/api/users/rejectFriendRequest",
        { userId },
        config
      );

      setFriendRequestTrigger(!friendRequestTrigger);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="#E0E5B6">
          <ModalHeader>Friend Requests</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="friendRequests">
              {loading ? (
                <Spinner size="sm" />
              ) : (
                friendRequests.map((request) => (
                  <div className="friendRequest" key={request._id}>
                    <img src={request.profilePic} alt="user's profile pic" />
                    <span>{request.username}</span>
                    <div className="requestButtons">
                      <Button
                        bg="#CCD5AE"
                        _hover={{
                          background: "#FEFAE0",
                          color: "#CCD5AE",
                        }}
                        size="xs"
                        mr={2}
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        bg="#CCD5AE"
                        _hover={{
                          background: "#FEFAE0",
                          color: "#CCD5AE",
                        }}
                        size="xs"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              background="#FAEDCE"
              _hover={{ background: "#FEFAE0" }}
              transition="background 0.4s ease"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FriendsRequest;
