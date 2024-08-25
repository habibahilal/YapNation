import React from "react";
import { createContext, useContext, useState } from "react";

const FriendRequestTriggerContext = createContext();

const FriendRequestTriggerProvider = ({ children }) => {
  const [friendRequestTrigger, setFriendRequestTrigger] = useState(false);

  return (
    <FriendRequestTriggerContext.Provider
      value={{ friendRequestTrigger, setFriendRequestTrigger }}
    >
      {children}
    </FriendRequestTriggerContext.Provider>
  );
};

export const FriendRequestTriggerState = () => {
  return useContext(FriendRequestTriggerContext);
};

export default FriendRequestTriggerProvider;
