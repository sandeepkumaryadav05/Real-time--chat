# Real-time Chat Application

A full-stack, real-time chat application built with the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.io**. This application allows users to engage in one-on-one and group real-time messaging, complete with typing indicators, message read receipts, and file attachments.

## 🌐 Live Demo

- **Frontend Application (Vercel):** [https://real-time-chat-henna-iota.vercel.app/](https://real-time-chat-henna-iota.vercel.app/)
- **Backend API Server (Render):** [https://real-time-chat-j0xa.onrender.com](https://real-time-chat-j0xa.onrender.com)

## 🚀 Key Features

- **Real-time Messaging:** Instant message delivery using Socket.io for both 1:1 and group chats.
- **Typing Indicators:** See when the other person is typing in real-time.
- **Read Receipts:** "Seen" (✓✓) status indicator for messages.
- **Media Support:** Upload and preview image attachments within chats.
- **Authentication:** Secure user authentication with JWT.
- **Chat History:** Persistent chat history stored in MongoDB.
- **Responsive UI:** Modern, responsive chat interface.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Socket.IO Client, Axios
- **Backend:** Node.js, Express.js, Socket.IO Server
- **Database:** MongoDB (with Mongoose)
- **File Storage:** Local storage via Multer (in `uploads/` directory)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## ⚙️ How It Works (Application Workflow)

This section explains the end-to-end workflow of the application, which is especially helpful for understanding the architecture or explaining it to others (such as in an interview).

### 1. Connection & Authentication
- The user logs in via the React frontend.
- The backend validates the credentials and returns a **JWT token**.
- The frontend stores this token and attaches it to all subsequent REST API requests via an Axios interceptor.
- Simultaneously, the frontend establishes a persistent **WebSocket connection** to the backend using Socket.IO.

### 2. Real-Time Message Flow
1. **Sending:** When a user types a message and hits send, the frontend does two things simultaneously:
   - Makes a REST API `POST` request to `/api/chat/message` to save the message permanently in the MongoDB database.
   - Emits a Socket.IO event `send-message` containing the message payload to the server.
2. **Broadcasting:** The Node.js server receives the `send-message` event and broadcasts a `receive-message` event to all other clients connected to that specific chat "room" (each conversation acts as an isolated room).
3. **Receiving:** Connected clients listen for the `receive-message` event and dynamically update their React UI to display the new message without requiring a page refresh.

### 3. "Seen" & "Typing" Indicators
- **Typing:** As a user types, the client emits a `typing` event. The server broadcasts this to the room, and the recipient's UI updates to show "User is typing...". Pausing triggers a `stop-typing` event.
- **Seen Status:** When a client receives a new message, if the chat window is active, it automatically emits a `seen` event. The server broadcasts a `seen-update` back to the sender, updating the message tick from a single checkmark to a double checkmark (✓✓).

### 4. File Uploads
- When an image is selected, it is sent to the backend via a `multipart/form-data` request.
- The backend uses **Multer** to save the file to the local `uploads/` directory.
- The file's path is then saved in the database as part of the message object and broadcasted via socket to be rendered as an image on the frontend.

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd "Real-time chat"
   ```

2. **Configure Environment Variables:**
   - Navigate to the `backend` directory and ensure your `.env` file is set up (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
   - Navigate to the `frontend` directory and ensure your `.env` file is set up (e.g., `VITE_API_URL`).

3. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will typically run on `http://localhost:3000`.*

4. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will start using Vite, typically on `http://localhost:5173`.*

## 📂 Project Structure

```text
Real-time chat/
├── backend/                  # Node/Express Backend
│   ├── src/
│   │   ├── controllers/      # Business logic (auth, chat, files)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express API endpoints
│   │   ├── middleware/       # JWT auth & Multer upload
│   │   ├── app.js            # Express app setup
│   │   └── socket.js         # Socket.io event handling
│   └── package.json
├── frontend/                 # React/Vite Frontend
│   ├── src/
│   │   ├── components/       # UI Components (ChatBox, Sidebar)
│   │   ├── services/         # API & Axios config
│   │   ├── socket.js         # Socket client setup
│   │   └── main.jsx          # App entry point
│   └── package.json
└── README.md                 # Project documentation
```
