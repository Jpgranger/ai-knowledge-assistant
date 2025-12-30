# AI Knowledge Assistant (RAG)

A full-stack AI-powered knowledge assistant that allows users to upload documents and query them using natural language.  
The system is designed around a **Retrieval-Augmented Generation (RAG)** architecture, combining secure backend APIs, a relational database, and AI-driven responses grounded in user-provided content.

This project is being built incrementally to reflect **real-world backend and AI system development practices**, with a focus on security, scalability, and clean architecture.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- bcrypt (password hashing)

### Frontend
- React (Vite)

### AI / RAG (In Progress)
- Document ingestion & text extraction
- Text chunking & embedding generation
- Semantic retrieval over user documents
- LLM-powered question answering
- Source attribution (citations)

---

## ✅ Features (Completed)

- User registration and login
- Secure password hashing
- JWT-based authentication
- Protected API routes
- PostgreSQL database schema
- User-scoped data access
- Clean project structure (client / server separation)

---

## 🛠 Features In Progress

- Document upload and storage
- Text extraction from uploaded files
- Chunking and embedding generation
- Semantic search over user documents
- AI chat interface with grounded responses
- Retrieval evaluation and citation display

---

## 📁 Project Structure

ai-knowledge-assistant/
├── client/ # React frontend
├── server/ # Express backend
│ ├── src/
│ │ ├── routes/ # API route handlers
│ │ ├── middleware/ # Auth & request middleware
│ │ ├── services/ # Ingestion, RAG, and AI logic
│ │ └── db.js # PostgreSQL connection
│ └── uploads/ # Uploaded documents (local)
└── README.md


---

## 🔐 Authentication Overview

- Users authenticate using email and password
- Passwords are securely hashed using bcrypt
- JWTs are issued upon login
- Protected routes require an `Authorization` header:

- Authenticated user context is attached to each request

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Jpgranger/ai-knowledge-assistant.git
cd ai-knowledge-assistant

cd server
npm install
npm run dev

PORT=3001
DATABASE_URL=postgres://<user>:<password>@localhost:5432/rag_assistant
JWT_SECRET=your_jwt_secret_here


🎯 Project Goals

This project is designed to demonstrate:

Secure backend API design

Authentication and authorization best practices

Relational database modeling with PostgreSQL

User-scoped data access

Practical AI integration using RAG

Incremental, production-minded development

📌 Status

Active development
Additional features are being added incrementally with clear commit history

