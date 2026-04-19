# HabitFlow - MERN Stack Habit Tracker

A full-stack habit tracking app built with MongoDB, Express, React, and Node.js.

## Features
- Daily, Weekly, Monthly habit tracking
- Create, Edit, Delete habits with icons and colors
- Streak tracking with visual badges
- Calendar view per habit
- User profile with stats
- JWT Authentication

## Project Structure

```
habit-tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or above)
- MongoDB installed and running locally

### Step 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Step 2 - Frontend
```bash
cd frontend
npm install
npm start
```

### Step 3 - Open Browser
Visit `http://localhost:3000`

## Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your_super_secret_key
```
