# FairShare Backend

Backend API for the FairShare bill splitting application. This Node.js/Express server provides RESTful API endpoints for user authentication, bill management, and friend management.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Features

- User authentication (signup, login)
- JWT-based authentication
- Create and manage bills
- Add/remove friends
- Split bills among friends
- Track payment status

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## Project Structure

```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── .env             # Environment variables
├── package.json     # Dependencies
└── server.js        # Entry point
```

## API Endpoints

### Authentication

#### 1. Register a New User
- **Endpoint**: `POST /api/auth/signup`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get Current User
- **Endpoint**: `GET /api/auth`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response (200)**:
  ```json
  {
    "_id": "5f8d0a4b7f4b2a1d1c9f0e1d",
    "name": "John Doe",
    "email": "john@example.com",
    "friends": []
  }
  ```

### Users

#### 1. Get Current User Profile
- **Endpoint**: `GET /api/users/me`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response (200)**:
  ```json
  {
    "_id": "5f8d0a4b7f4b2a1d1c9f0e1d",
    "name": "John Doe",
    "email": "john@example.com",
    "friends": [
      {
        "_id": "5f8d0a4b7f4b2a1d1c9f0e1e",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ]
  }
  ```

#### 2. Add a Friend
- **Endpoint**: `POST /api/users/friends`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "email": "friend@example.com"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Friend added successfully"
  }
  ```

#### 3. Remove a Friend
- **Endpoint**: `DELETE /api/users/friends/:friendId`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Friend removed successfully"
  }
  ```

### Bills

#### 1. Get All Bills
- **Endpoint**: `GET /api/bills`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response (200)**:
  ```json
  [
    {
      "_id": "5f8d0a4b7f4b2a1d1c9f0e1f",
      "userId": "5f8d0a4b7f4b2a1d1c9f0e1d",
      "image": "base64encodedimage",
      "totalAmount": 100,
      "description": "Dinner at Restaurant",
      "friends": [
        {
          "friendId": "5f8d0a4b7f4b2a1d1c9f0e1e",
          "amount": 50,
          "status": "pending"
        }
      ],
      "createdAt": "2023-10-20T12:00:00.000Z"
    }
  ]
  ```

#### 2. Create a New Bill
- **Endpoint**: `POST /api/bills`
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "image": "base64encodedimage",
    "totalAmount": 100,
    "description": "Dinner at Restaurant",
    "friends": [
      {
        "friendId": "5f8d0a4b7f4b2a1d1c9f0e1e",
        "amount": 50
      }
    ]
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "_id": "5f8d0a4b7f4b2a1d1c9f0e1f",
    "userId": "5f8d0a4b7f4b2a1d1c9f0e1d",
    "image": "base64encodedimage",
    "totalAmount": 100,
    "description": "Dinner at Restaurant",
    "friends": [
      {
        "friendId": "5f8d0a4b7f4b2a1d1c9f0e1e",
        "amount": 50,
        "status": "pending",
        "_id": "5f8d0a4b7f4b2a1d1c9f0e20"
      }
    ],
    "createdAt": "2023-10-20T12:00:00.000Z"
  }
  ```

#### 3. Update Bill Payment Status
- **Endpoint**: `PATCH /api/bills/:id`
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "friendId": "5f8d0a4b7f4b2a1d1c9f0e1e",
    "status": "paid"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "_id": "5f8d0a4b7f4b2a1d1c9f0e1f",
    "userId": "5f8d0a4b7f4b2a1d1c9f0e1d",
    "image": "base64encodedimage",
    "totalAmount": 100,
    "friends": [
      {
        "friendId": "5f8d0a4b7f4b2a1d1c9f0e1e",
        "amount": 50,
        "status": "paid"
      }
    ],
    "createdAt": "2023-10-20T12:00:00.000Z"
  }
  ```

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fairshare/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## Authentication

All protected routes require a valid JWT token in the request header:
```
Authorization: Bearer <token>
```

## Error Handling

The API returns appropriate HTTP status codes and JSON responses:

- `200` - Success
- `201` - Resource created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Resource not found
- `500` - Server error

Example error response:
```json
{
  "message": "Error message here"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
