export const getSender = (loggedInUser, users) => {
  return users.filter((user) => user._id !== loggedInUser._id)[0];
};
