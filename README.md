<div align="center">
  <img src="https://img.shields.io/badge/Status-Live%20Demo%20Available-success?style=for-the-badge&logoColor=white" alt="Live Demo Status" />

  <h1>💬 Real-Time Chat Engine</h1>
  <p><i>A Next-Generation Real-Time Messaging Architecture</i></p>

  <p>
    <a href="https://real-time-chat-henna-iota.vercel.app/"><strong>🌍 View Live Frontend</strong></a> ·
    <a href="https://real-time-chat-j0xa.onrender.com"><strong>⚙️ Backend API Server</strong></a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

## ⚡ Overview

While most chat applications rely on standard polling, this project implements a highly optimized **bi-directional WebSocket architecture** using Socket.io and the MERN stack. It guarantees sub-second message delivery latency, instantaneous typing presence, and dynamic delivery receipts across active clients. 

This isn't just a chat app; it's a demonstration of scalable, real-time concurrency.

## 🎯 Standout Capabilities

| Feature | Technical Implementation |
| :--- | :--- |
| **🚀 Instant Delivery** | Persistent WebSockets remove HTTP polling overhead for zero-latency messaging. |
| **👀 Live Presence** | Emits `typing` / `stop-typing` events globally to active room participants. |
| **✅ Delivery Receipts** | Asynchronous `seen` events trigger immediate UI updates (✓✓). |
| **🖼️ Media Handling** | Multipart form-data streaming securely piped to local volumetric storage (`/uploads`). |
| **🔐 Stateless Auth** | Hardened JWT-based authentication intercepted automatically by Axios. |

---

## 🏗️ Under the Hood: The Real-Time Workflow

*For engineers and reviewers:* Here is the exact data lifecycle for our real-time messaging pipeline. Click to expand!

<details>
<summary><b>1. Connection & Handshake 🤝</b></summary>
<br>
When a client boots via React, an Axios interceptor validates the JWT. Simultaneously, the frontend establishes a persistent <code>ws://</code> connection. The Node engine assigns the socket to specific isolated "Rooms", guaranteeing that payloads are cleanly separated per conversation.
</details>

<details>
<summary><b>2. The Dual-Write Lifecycle 💾</b></summary>
<br>
When a user hits "Send", we avoid race conditions by executing a dual-write pipeline:
<ul>
  <li><b>REST Persistence:</b> The payload is POSTed to <code>/api/chat/message</code>, traversing the Express middleware validation and securely landing in MongoDB.</li>
  <li><b>Global Broadcast:</b> Simultaneously, the client fires a <code>send-message</code> socket event. The Node server immediately broadcasts <code>receive-message</code> to the specific target room, allowing peer React components to update the DOM reactively without a hard fetch.</li>
</ul>
</details>

<details>
<summary><b>3. Asynchronous Read Receipts (✓✓) 👁️</b></summary>
<br>
The UI intelligently tracks window focus and active scroll positioning. Upon a peer receiving a payload, they silently fire a background <code>seen</code> socket event. The original sender intercepts the relayed <code>seen-update</code> and dynamically toggles the message status to double-ticks.
</details>

---

## 🚦 Quick Start Guide

Want to run the raw engine on your local machine?

### 1. Requirements
* Node v18.0+
* MongoDB Instance (Atlas or Local)

### 2. Initialization

```bash
# Clone the repository
git clone <your-repo>
cd "Real-time chat"
```

#### ⚙️ The Backend Engine
```bash
cd backend
npm install
# Ensure you create a .env file with PORT, MONGO_URI, and JWT_SECRET
npm run dev
# Server ignites on http://localhost:3000
```

#### 🎨 The Frontend Client
```bash
cd frontend
npm install
# Ensure you create a .env file with VITE_API_URL=http://localhost:3000
npm run dev
# Client is rendered at http://localhost:5173
```

---

## 📂 Repository Architecture

For developers exploring the codebase or preparing for system design walkthroughs, here is the complete separation of concerns:

```text
📦 Real-time Chat
 ┣ 📂 backend/               # ⚙️ Node/Express API Server
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 controllers/       # Business logic (Message creation, Authentication, File handling)
 ┃ ┃ ┣ 📂 middleware/        # Security (JWT Guards) & Parsing (Multer for uploads)
 ┃ ┃ ┣ 📂 models/            # Database structure (Mongoose schemas for Users, Chats, Messages)
 ┃ ┃ ┣ 📂 routes/            # REST endpoint definitions (/api/chat, /api/auth)
 ┃ ┃ ┣ 📜 app.js             # Express application instantiation
 ┃ ┃ ┗ 📜 socket.js          # Raw Socket.IO real-time event listeners
 ┃ ┗ 📜 package.json         # Backend dependencies
 ┃
 ┣ 📂 frontend/              # 🎨 React/Vite Client Application
 ┃ ┣ 📂 public/              # Static frontend assets
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 components/        # Isolated UI pieces (Sidebar, ChatBox message renderer)
 ┃ ┃ ┣ 📂 services/          # RESTful outbound logic (Axios singleton with Auth injectors)
 ┃ ┃ ┣ 📜 socket.js          # Outbound Socket.io singleton connection
 ┃ ┃ ┣ 📜 main.jsx           # React DOM bootstrapping
 ┃ ┃ ┗ 📜 App.jsx            # Core routing and state initialization
 ┃ ┗ 📜 package.json         # Frontend UI dependencies (Vite, React, Socket-Client)
 ┃
 ┗ 📜 README.md              # 📖 You are here
```

---
<div align="center">
  <i>Architected with passion & precision.</i>
</div>
