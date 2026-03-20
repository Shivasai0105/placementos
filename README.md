# PlacementOS — Full-Stack Production App 🚀

A full-stack MERN placement prep tracker for your 8-week 10 LPA battle plan.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB (local dev / Atlas for prod) |
| Auth | JWT (bcrypt passwords) |
| Styling | Vanilla CSS with design tokens |

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017` (or get a free [Atlas](https://cloud.mongodb.com) URI)

---

## Quick Start (Local Dev)

### 1. Setup Backend
```bash
cd server
cp .env.example .env          # Copy env file
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run dev                    # Starts on http://localhost:5000
```

### 2. Setup Frontend (new terminal)
```bash
cd client
npm install
npm run dev                    # Starts on http://localhost:5173
```

Open **http://localhost:5173** → Register → Start tracking!

---

## Project Structure

```
placement_prep/
├── server/
│   ├── data/plan.js          # 8-week plan (server-side stats)
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── models/
│   │   ├── User.js           # User schema (bcrypt)
│   │   └── Progress.js       # Tasks + problems map
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Profile
│   │   └── progress.js       # Toggle tasks/problems, stats, import
│   ├── .env                  # MONGODB_URI, JWT_SECRET, PORT
│   ├── index.js              # Express app entry
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useApi.js
│   │   ├── data/
│   │   │   ├── plan.js       # 8-week plan data
│   │   │   └── problems.js   # 250+ DSA problems
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx  # Today's tasks + streak
│   │   │   ├── Plan.jsx       # 8-week plan with check-off
│   │   │   ├── Problems.jsx   # 250+ problem bank
│   │   │   ├── Analytics.jsx  # Charts + heatmap
│   │   │   └── Settings.jsx   # Profile + notifications
│   │   ├── App.jsx            # Router + protected routes
│   │   ├── main.jsx
│   │   └── index.css          # All styles
│   └── vite.config.js         # Proxy /api → :5000
│
└── placement-tracker-final.html  # Original HTML (keep for reference)
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| PATCH | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/progress` | Yes | Get all progress |
| POST | `/api/progress/task` | Yes | Toggle task done/undone |
| POST | `/api/progress/problem` | Yes | Toggle problem done/undone |
| POST | `/api/progress/log-today` | Yes | Mark all today's tasks done |
| POST | `/api/progress/import` | Yes | Import from localStorage |
| GET | `/api/progress/stats` | Yes | Analytics stats |

---

## Import Existing Progress

If you used the old `placement-tracker-final.html`:
1. Open the old HTML file in a browser
2. Open DevTools → Application → localStorage → find key `pos2`  
3. In the new app, go to **Settings → Import from localStorage**
4. Your tasks and problems will be migrated!

---

## Deploy to Production

### Backend → Render
1. Push `server/` to GitHub
2. New Render service → Node.js → Root: `server/`
3. Set env vars: `MONGODB_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL`

### Frontend → Vercel
1. Push `client/` to GitHub
2. New Vercel project → Root: `client/`
3. Set env var: `VITE_API_URL=https://your-render-url.onrender.com`
4. Update `vite.config.js` proxy target to your Render URL for production

---

## .env Reference

```env
MONGODB_URI=mongodb://localhost:27017/placementos
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```
