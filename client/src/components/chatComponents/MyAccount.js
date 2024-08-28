import "../../css/MyAccount.css";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import FriendsRequest from "../misc/FriendsRequest";

const MyAccount = () => {
  const navigate = useNavigate();

  const { user } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="account">
      <div className="account_img">
        <img src={user?.profilePic} alt="profile" />
      </div>
      <div className="accountInfo">
        <h4>{user?.username}</h4>
        <p>My Account</p>
      </div>
      <div className="accountExpandButton">
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios/50/menu-2.png"
                alt="menu-2"
              />
            }
            w="30px"
            bg="#eeeeee"
            _hover={{
              background: "#9187ab",
            }}
            transition="background 0.4s ease"
            _active={{
              background: "#9187ab",
            }}
          />
          <MenuList bg="#9187ab">
            <MenuItem
              bg="#eeeeee"
              _hover={{ background: "#9187ab" }}
              transition="background 0.4s ease"
              onClick={onOpen}
            >
              Friend Requests
              <FriendsRequest isOpen={isOpen} onClose={onClose} />
            </MenuItem>
            <MenuItem
              onClick={logoutHandler}
              bg="#eeeeee"
              _hover={{ background: "#9187ab" }}
              transition="background 0.4s ease"
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default MyAccount;
