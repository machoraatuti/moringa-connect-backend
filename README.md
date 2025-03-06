# moringa-connect-backend API

This repository contains the backend API for the Moringa Alumni Connect platform, designed to connect Moringa School alumni through various features including mentorship, job boards, messaging, and more.

## Features

- **Mentorship:** Request and provide mentorship to fellow alumni
- **Job Board:** Post and find job opportunities
- **Messaging:** Private communication between alumni
- **User Connections:** Connect with other alumni
- **Groups:** Create and join interest-based groups
- **News Feed:** Share updates and stay informed

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/logout` - Logout user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Mentorship
- `GET /api/mentorship` - Get all mentorship requests
- `GET /api/mentorship/:id` - Get mentorship by ID
- `POST /api/mentorship` - Create mentorship request
- `PUT /api/mentorship/:id` - Update mentorship status

### Jobs
- `GET /api/jobs` - Get all job listings
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs/create` - Create new job posting
- `PUT /api/jobs/update/:id` - Update job posting
- `DELETE /api/jobs/delete/:id` - Delete job posting

### Messages
- `GET /api/messages` - Get user messages
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `POST /api/messages` - Send a message
- `PUT /api/messages/:id/read` - Mark message as read

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create a group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group

### Connections
- `GET /api/connections` - Get user connections
- `GET /api/connections/requests` - Get connection requests
- `POST /api/connections/request/:id` - Send connection request
- `POST /api/connections/accept/:id` - Accept connection request
- `POST /api/connections/reject/:id` - Reject connection request
- `DELETE /api/connections/:id` - Remove connection