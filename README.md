# YapNation

YapNation is a real-time chatting application that allows users to connect, communicate, and manage group chats with their friends. The app includes features for searching and adding users, chatting with friends, creating and managing group chats, and sending real-time messages. Authentication is handled via JWT tokens, ensuring secure access to the app's features.

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

- **Frontend**:  React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Real-time Communication**: `socket.io`
- **Authentication**: JWT (JSON Web Tokens)

## Preview

- Authentication ![yapnation-auth-preview](https://github.com/user-attachments/assets/197e1896-0320-432c-9430-d6f50b925221)
- General Features ![yapNation-features](https://github.com/user-attachments/assets/fa7d88fb-3deb-44c5-8fda-d96a93d7d4df)
- Real-time chatting ![yapNation-realtime](https://github.com/user-attachments/assets/6ae558e5-c535-48d0-bfd8-935a86d398b4)






