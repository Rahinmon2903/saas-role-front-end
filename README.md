# RBAC Dashboard – Frontend

A modern, role-based access control (RBAC) dashboard built with React.  
Designed for internal systems requiring secure authentication, approval workflows, and role-specific interfaces.

---

## 🚀 Live Demo

🔗 https://saas-role-front-b3o9y2fsp-rahin-mon-ss-projects.vercel.app/

---

## 🧩 Features

- Secure authentication (Login / Register / Forgot / Reset Password)
- Role-based dashboards (Admin, Manager, User)
- Request creation, assignment, approval & rejection
- Real-time notifications
- Audit history tracking
- Protected routes
- Clean, authoritative dark UI
- Responsive layout

---

## 🛠 Tech Stack

- React
- React Router
- Axios
- Tailwind CSS
- React Icons
- React Toastify

---

## 📂 Project Structure

```txt
src/
├── Components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   └── Loader.jsx
├── Pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Requests.jsx
│   ├── AdminUsers.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx

🧪 Run Locally
git clone https://github.com/Rahinmon2903/saas-role-front-end
cd rbac-dashboard-frontend
npm install
npm run dev

🔐 Authentication Flow

JWT stored securely in localStorage

Axios interceptor attaches token

Routes protected based on role

📌 Notes

This frontend is built to simulate real enterprise dashboards and focuses on clarity, hierarchy, and professional UX patterns.