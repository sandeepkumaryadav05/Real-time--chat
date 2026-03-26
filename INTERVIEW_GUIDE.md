# Real-time Chat Project — Interview Guide

This document is designed to help you explain the project in an interview, walk through the architecture, show key code areas, and describe how the system works end-to-end.

> **Tip:** If you want a PDF version, open this file in VS Code and use `File → Export as PDF` (or use a tool like `pandoc INTERVIEW_GUIDE.md -o INTERVIEW_GUIDE.pdf`).

---

## 1) High-level Overview

This is a **Real-time Chat** application built with a **MERN stack** (MongoDB, Express, React, Node.js) plus **Socket.IO** for real-time messaging.

Key features:
- 🔥 Real-time 1:1 and group messaging
- 🖼️ Image attachments with upload & preview
- ✅ Typing indicator and seen status (delivery receipts)
- 👤 User authentication + chat history

---

## 2) Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React + Vite + Socket.IO client |
| Backend | Node.js + Express + Socket.IO server |
| Database | MongoDB (Mongoose models) |
| File storage | Local `uploads/` folder (Multer) |

---

## 3) Project Structure (What to show in interview)

### Frontend (`frontend/`)
- `src/main.jsx` – App entry point
- `src/components/ChatBox.jsx` – core chat UI, message list, file upload, typing indicator, seen status
- `src/components/Sidebar.jsx` – chat list + new chat interface
- `src/services/api.js` – Axios wrapper for auth + JWT token
- `src/socket.js` – Socket.IO client initialization

### Backend (`backend/`)
- `src/app.js` – Express server setup, routes, Socket.IO integration
- `src/routes/` – REST endpoints for auth and chat
- `src/controllers/` – business logic (auth, chat, messages, file uploads)
- `src/models/` – Mongoose schemas for User / Chat / Message
- `src/socket.js` – real-time event handling (join, send-message, typing, seen)

---

## 4) Real-Time Message Flow (What happens when someone sends a message)

1. User types a message and hits **Send**
2. Frontend posts to `/api/chat/message` (REST) to persist it
3. Frontend also emits a Socket.IO event `send-message` with the message object
4. Server receives `send-message`, broadcasts `receive-message` to everyone in the room
5. Connected clients receive `receive-message`, append it to their message list

### Seen indicator flow
1. When a client receives a message not from them, it emits `seen` to the server.
2. Server broadcasts `seen-update` to room.
3. Sender receives `seen-update` and shows `✓✓` on last sent message.

---

## 5) Key Code Areas to Highlight in an Interview

### Real-time communication (Socket.IO)
- `backend/src/socket.js` – handles join, send-message, typing, stop-typing, seen
- `frontend/src/components/ChatBox.jsx` – listens for events and updates UI

### Message persistence
- `backend/src/controllers/chat.controller.js` – creates messages and handles attachments
- `backend/src/models/Message.js` – schema includes `text`, `file`, `seenBy`, `deletedFor`, etc.

### File uploads
- `backend/src/middleware/upload.js` – uses Multer to store images
- `frontend/src/components/ChatBox.jsx` – handles file picker and upload

### Authentication & Protected Routes
- `backend/src/middleware/auth.middleware.js` – verifies JWT
- `frontend/src/services/api.js` – attaches auth token automatically

---

## 6) Features & Improvements You Can Mention

✅ **Already implemented**
- Real-time messaging + typing indicator
- File/image upload and preview
- Seen/delivery indicator
- Deleting messages for everyone or just yourself

🛠️ **Next enhancements (good for interview)**
- User profile pictures (upload + display)
- Group chat member list + roles (admin/owner)
- Message reactions (like 👍, ❤️)
- Push notifications when offline
- Docker + CI/CD for deployment
- End-to-end encryption

---

## 7) Running the Project Locally (Key Commands)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` (frontend) and ensure backend runs on `http://localhost:3000`.

---

## 8) Interview Talking Points / FAQs

### How does real-time update work?
Explain that Socket.IO maintains a persistent WebSocket connection (with fallback), and the server emits events to rooms. Each chat is a room and you join it with `join-chat`.

### How did you manage message persistence?
Messages are stored in MongoDB, and the client requests message history via `/api/chat/:chatId`. Real-time events keep UI in sync for new messages.

### How do you handle file uploads?
Files are accepted via a multipart POST request, stored in an `uploads/` folder, and the message stores a file path. The frontend converts that path into an accessible URL.

---

## 9) How to Export to PDF
- In VS Code: `File → Export as PDF` (or use an extension)
- With Pandoc (optional):
  ```bash
  pandoc INTERVIEW_GUIDE.md -o INTERVIEW_GUIDE.pdf
  ```

---

Good luck in your interview! Show them the flow, point out where the real-time and persistence logic lives, and emphasize the features you’ve built end-to-end.
