Social Media API
Description
This Node.js application provides a comprehensive backend API for social media functionalities, allowing users to interact with each other through posts, comments, and stories. It supports user management, image uploads, and CRUD operations for posts, comments, and replies, with robust JWT authentication.

Key Features

User Management:
  User Registration: Create new user accounts.
  Login: Users can log in with their credentials.
  Logout: Invalidate user session.
  Get User Data: Retrieve user profile information.
  Follow/Unfollow Users: Follow or unfollow other users.
  Block/Unblock Users: Block or unblock specific users.
  List Blocked Users: Get a list of blocked users.
  Delete User: Remove a user account.
  Update User Details: Modify user profile information.
  Search Users: Search for users by criteria.
  Image Upload: Upload profile and cover pictures using Multer.

Posts Management:
  Create Post: Users can create a post, with or without an image.
  Update Post: Modify existing posts.
  Get All Posts: Retrieve all posts.
  Like/Unlike Post: Users can like or unlike posts.
  Delete Post: Remove posts from the platform.

Comments and Replies:
  Create Comment: Add comments to posts.
  Reply to Comment: Add replies to comments.
  Update Comment: Edit comments or replies.
  Like/Unlike Comment: Like or unlike comments or replies.
  Delete Comment: Remove comments or replies.
  
Stories:
  Create Story: Upload an image as a story.
  Get All Stories: Retrieve all user stories.
  Delete Story: Remove a user story.
  
Conversations and Messages:
  Conversations: Users can start conversations with each other.
  Messages: Send messages within conversations (not real-time).
  
Technologies Used
Node.js
Express.js
Multer (for image uploads)
JWT (for authentication)
MongoDB
Postman

Installation: 
Install dependencies: npm install 
Run the application: npm run start

Postman - https://documenter.getpostman.com/view/37946927/2sAXxV5VGY
