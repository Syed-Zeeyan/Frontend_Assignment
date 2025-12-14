# Frontend Developer Assignment

A modern, scalable web application built as part of the **Frontend Developer Intern assignment**.  
The project focuses on a high-quality frontend experience with secure authentication and a clean, well-structured supporting backend.

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TailwindCSS**
- **TypeScript**
- **JWT-based authentication**
- Responsive, modern UI

### Backend
- **Node.js**
- **Express**
- **MongoDB (Mongoose)**
- **JWT authentication**
- **bcrypt** for password hashing

---

## ✨ Features

### Authentication
- User registration and login
- Secure password hashing
- JWT-based authentication
- Protected routes (dashboard access)

### Dashboard
- User profile display
- Task management (CRUD)
- Search and filter functionality
- Clean and responsive UI
- Logout flow

### Security & Code Quality
- Token validation middleware
- Input validation
- Centralized error handling
- Scalable and modular project structure

---

## 📁 Project Structure

```text
Frontend_Assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── server.ts
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   └── public/
│
└── README.md
```
## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

---

## 🔧 Backend Setup

### 1. Navigate to the backend directory
```bash
cd backend
npm install
```

### 2. Create environment variables
Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Run the backend server
```bash
npm run build
npm start
```

Backend will be available at:  
👉 **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd frontend
npm install
```

### 2. Create environment variables
Create a `.env.local` file inside the `frontend` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the frontend server
```bash
npm run dev
```

Frontend will be available at:  
👉 **http://localhost:3000**

---

## 🔐 Authentication Flow

- User registers or logs in
- Backend issues a JWT upon successful authentication
- Token is sent with API requests
- Protected routes validate the token
- Unauthorized users are redirected to the login page

---

## 📡 API Overview

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### User Profile
```http
GET /api/user/profile
PUT /api/user/profile
```

### Tasks
```http
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 📈 Scalability Notes

- Frontend and backend are decoupled for independent scaling
- Backend follows a modular architecture for easy feature expansion
- JWT-based authentication enables horizontal scaling
- Database schema supports multi-user data isolation
- Easily deployable on cloud platforms (AWS, Vercel, Docker, etc.)

---

## 📚 Additional Projects

### 🎟 Ticketing System  
**Next.js + Spring Boot**

A separate project that follows a similar product concept but extends it with more advanced features and a richer user interface.

**Highlights:**
- Role-based access control
- End-to-end ticket workflows
- Enterprise-grade backend architecture
- More advanced UI patterns and interactions

🔗 **GitHub Repository:**  
https://github.com/Syed-Zeeyan/Ticketing-System

---

## 👤 Author

**Syed Zeeyan**  
Frontend Developer Intern Candidate  
GitHub: https://github.com/Syed-Zeeyan
