# YapNation

YapNation is a real-time chatting application that allows users to connect, communicate, and manage group chats with their friends. The app includes features for searching and adding friends, chatting with friends, creating and managing group chats, and sending real-time messages. Authentication is handled via JWT tokens, ensuring secure access to the app's features.

## Features

- **Search and Add Friends**: 
  - Users can search for other users by name and send friend requests.
  - Once the friend request is accepted, the users can chat with each other.

- **Real-Time Messaging**: 
  - Messages are sent and received in real-time using `socket.io`.
  - Typing indicators show when a user is typing.

- **Group Chats**:
  - Users can create group chats with multiple friends.
  - Group admins have the ability to add or remove members.
  - Group admins can rename the group chat.

- **Authentication**:
  - Secure sign-up and login functionalities using JWT tokens.
  - Only authenticated users can access the chat functionalities.

## Technologies Used

- **Frontend**:  React, Chakra UI, Lottie
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Real-time Communication**: `socket.io`
- **Authentication**: JWT (JSON Web Tokens)






