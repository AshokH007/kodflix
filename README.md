# NetMirror — Netflix-Inspired Movie Browser

A production-ready, full-stack movie browsing application with real TMDB data, secure JWT authentication, and a cinematic dark UI.

## Tech Stack

**Frontend:** React + Vite, Tailwind CSS, React Router v6, Axios  
**Backend:** Node.js + Express, MongoDB + Mongoose, bcryptjs, JWT

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- [TMDB API Key](https://www.themoviedb.org/settings/api) (free)

---

## Setup

### 1. Clone / Open the project

```
cd c:\Users\gvtas\netmirrror
```

### 2. Configure Backend

Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/netmirror
JWT_SECRET=your_long_random_secret_here
PORT=5000
```

### 3. Configure Frontend

Edit `client/.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Install & Run Backend

```bash
cd server
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### 5. Install & Run Frontend

```bash
cd client
npm install
npm run dev
```

App opens at `http://localhost:5173`

---

## Project Structure

```
netmirrror/
├── server/
│   ├── controllers/authController.js   # Register & login logic
│   ├── middleware/authMiddleware.js     # JWT verification
│   ├── models/User.js                  # Mongoose user schema
│   ├── routes/auth.js                  # Auth API routes
│   ├── server.js                       # Express entry point
│   └── .env                            # Backend secrets
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Sticky nav with search
    │   │   ├── Banner.jsx              # Hero banner
    │   │   ├── MovieRow.jsx            # Horizontal carousel
    │   │   ├── MovieCard.jsx           # Movie poster card
    │   │   └── ProtectedRoute.jsx      # Auth guard
    │   ├── context/
    │   │   └── AuthContext.jsx         # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Home.jsx
    │   │   ├── MovieDetails.jsx
    │   │   └── Search.jsx
    │   ├── services/
    │   │   ├── tmdb.js                 # TMDB API calls
    │   │   └── auth.js                 # Auth axios instance
    │   ├── App.jsx                     # Routes
    │   └── main.jsx                    # Entry point
    └── .env                            # Frontend secrets
```

---

## Features

- 🎬 **Hero Banner** — Random trending movie with backdrop
- 🎠 **Movie Carousels** — 9 rows: Trending, Popular, Top Rated, Now Playing, Upcoming, Action, Drama, Comedy, Sci-Fi
- 🔍 **Live Search** — Debounced search with URL sync
- 🎥 **Movie Details** — Full info with cast, genres, runtime, rating
- 🔐 **Auth** — bcrypt hashing, JWT tokens, protected routes
- 📱 **Responsive** — Desktop, tablet, mobile

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |
| GET | `/api/health` | Health check |
