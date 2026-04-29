# 🚀 InstaDev

**InstaDev** is an AI-powered full-stack web application generator. It allows users to prompt, run, edit, and deploy React applications instantly using a live in-browser code editor. 

🌍 **Live Deployment:** [https://instadev-rx.vercel.app](https://instadev-rx.vercel.app)
⚙️ **Backend API:** `https://instadev-backend.onrender.com`

---

## ✨ Features

- **🪄 AI Code Generation:** Describe what you want to build (e.g., "Create a Todo App", "Create a Budget Tracker") and InstaDev will generate the full React + Tailwind code structure.
- **💻 Live Code Editor:** Integrated with [Sandpack](https://sandpack.codesandbox.io/) for real-time preview and editing of generated React code.
- **🔐 Authentication:** Secure Google OAuth login.
- **🪙 Token-Based Usage:** Credit system with tiered pricing models (Basic, Starter, Pro) for generating AI applications.
- **📦 Export to ZIP:** Download your completely generated React project directly as a `.zip` file.
- **🎨 Modern Tech Stack:** Generates code using Vite, React, Tailwind CSS, and Lucide React icons.

---

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) (State Management)
- [Sandpack](https://sandpack.codesandbox.io/) (Live Browser Sandbox)
- [React Router](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (Mongoose)
- Google Auth Library & JWT (Authentication)
- AI API Integration (Generating project structures as JSON)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI
- Google OAuth Client ID

### 1. Clone & Install
```bash
# Install backend dependencies
cd InstaDev/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install