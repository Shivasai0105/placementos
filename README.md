# PlacementOS 🚀

> **Your 8-week, 10 LPA placement battle plan** — AI-powered, full-stack MERN platform for Indian engineering students preparing for campus placements.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://placementos-kappa.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

---

## ✨ Features

### 📋 8-Week Structured Roadmap
- Day-by-day task checklist covering DSA, Aptitude, DBMS, Dev projects, and Communication
- Progress tracking with check-off for every task
- Auto-detection of current week/day based on start date

### 🧠 250+ DSA Problem Bank
- Curated problems organized by topic (Arrays, Trees, DP, Graphs, etc.)
- Track solved/unsolved status with completion percentages
- Spaced repetition revision system (3-day → 7-day → 14-day intervals)

### 📊 Analytics Dashboard
- Real-time readiness score, streak tracking, and weekly breakdowns
- 56-day streak heatmap visualization
- Topic-wise completion breakdown with weakest topic detection

### 🤖 AI-Powered Features (Gemini)
- **AI Study Plan** — Personalized daily plan based on your progress, weak topics, and target companies
- **Resume Match** — ATS score analysis with missing keywords, strengths, and recommendations
- **Placement Prediction** — Dream/Core/Backup tier probability with skill gap analysis
- **Analytics Audit** — AI-generated performance audit report

### 📝 Job Application Tracker
- Kanban-style tracking (Saved → Applied → OA → Interview → Offer/Rejected)
- URL scraper — paste a job link to auto-extract company, role, and description
- Notes, salary, and applied date tracking

### 🔐 Auth & Security
- JWT authentication with bcrypt password hashing
- Email verification and password reset flows (Brevo/Resend)
- Rate limiting on all endpoints
- Helmet security headers

### 📧 Automated Emails
- Morning daily task reminders (7:30 AM IST)
- Evening streak check-in and encouragement (7:00 PM IST)

### 🌙 Dark Mode
- System-aware theme toggle with smooth transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT + bcrypt |
| AI | Google Gemini API (2.5/2.0/1.5 Flash) |
| Email | Brevo (Sendinblue) / Resend |
| Styling | Vanilla CSS with design tokens |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017` (or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone & Setup Backend
```bash
git clone https://github.com/Shivasai0105/placementos.git
cd placementos/server
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev                    # Starts on http://localhost:5000
```

### 2. Setup Frontend (new terminal)
```bash
cd placementos/client
npm install
npm run dev                    # Starts on http://localhost:5173
```

### 3. Open & Register
Navigate to **http://localhost:5173** → Register → Start your placement prep!

---

## 📁 Project Structure

```
placementos/
├── server/
│   ├── cluster.js                # Multi-process production entry point
│   ├── index.js                  # Express app + graceful shutdown
│   ├── data/
│   │   ├── plan.js               # 8-week roadmap data
│   │   └── problems.js           # 250+ DSA problems
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── statsCache.js         # In-memory stats cache (30s TTL)
│   │   └── aiQueue.js            # AI request concurrency limiter
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt, email verification)
│   │   ├── Progress.js           # Tasks + problems + comm + interview maps
│   │   ├── Application.js        # Job application tracking
│   │   └── Revision.js           # Spaced repetition records
│   ├── routes/
│   │   ├── auth.js               # Register, Login, Verify, Reset, Profile
│   │   ├── progress.js           # Tasks, Problems, Stats, Revisions
│   │   ├── applications.js       # CRUD + URL scraper
│   │   └── ai.js                 # Resume Match, Daily Plan, Predict, Audit
│   ├── services/
│   │   └── cronJobs.js           # Daily email reminders (AM/PM)
│   ├── utils/
│   │   └── email.js              # Brevo/Resend email service
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useApi.js         # API helper with auth headers
│   │   │   └── useTheme.js       # Dark mode hook
│   │   ├── data/
│   │   │   ├── plan.js           # 8-week plan (client-side)
│   │   │   └── problems.js       # DSA problem definitions
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top navigation
│   │   │   ├── MobileNav.jsx     # Bottom mobile navigation
│   │   │   ├── MobileSidebar.jsx # Slide-out sidebar
│   │   │   └── Toast.jsx         # Notification toasts
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Today's tasks + streak + overview
│   │   │   ├── Plan.jsx          # 8-week roadmap with check-off
│   │   │   ├── Problems.jsx      # DSA problem bank + revision
│   │   │   ├── Analytics.jsx     # Charts + heatmap + breakdown
│   │   │   ├── Applications.jsx  # Job tracker board
│   │   │   ├── AiStudyPlan.jsx   # AI daily study plan
│   │   │   ├── AiResume.jsx      # AI resume match analysis
│   │   │   ├── AiPlacement.jsx   # AI placement prediction
│   │   │   ├── Settings.jsx      # Profile + import + preferences
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── App.jsx               # Router + protected routes
│   │   ├── main.jsx
│   │   └── index.css             # Full design system
│   └── vite.config.js            # Dev proxy /api → :5000
│
└── README.md
```

---

## 🔌 API Endpoints (30 total)

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/register` | ❌ | Register new account |
| `POST` | `/login` | ❌ | Login, get JWT |
| `GET` | `/me` | ✅ | Get current user profile |
| `GET` | `/verify/:token` | ❌ | Verify email |
| `POST` | `/resend-verification` | ❌ | Resend verification email |
| `POST` | `/forgot-password` | ❌ | Request password reset |
| `POST` | `/reset-password/:token` | ❌ | Reset password |
| `PATCH` | `/profile` | ✅ | Update name, CGPA, companies |
| `PATCH` | `/password` | ✅ | Change password |

### Progress — `/api/progress`
| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/` | ✅ | Get full progress data |
| `POST` | `/task` | ✅ | Toggle task done/undone |
| `POST` | `/problem` | ✅ | Toggle DSA problem |
| `POST` | `/comm-day` | ✅ | Toggle communication day |
| `POST` | `/interview-review` | ✅ | Toggle interview question |
| `POST` | `/log-today` | ✅ | Mark all today's tasks done |
| `POST` | `/import` | ✅ | Import from localStorage |
| `GET` | `/stats` | ✅ | Computed analytics (cached) |
| `GET` | `/revision/due` | ✅ | Get due revisions |
| `POST` | `/revision` | ✅ | Flag problem for revision |
| `POST` | `/revision/:id/review` | ✅ | Log revision pass/fail |

### Applications — `/api/applications`
| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/` | ✅ | List all applications |
| `POST` | `/` | ✅ | Create application |
| `POST` | `/scrape` | ✅ | Scrape job URL metadata |
| `PATCH` | `/:id` | ✅ | Update application |
| `DELETE` | `/:id` | ✅ | Delete application |

### AI — `/api/ai` (Gemini-powered)
| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/resume-match` | ✅ | Resume vs JD analysis |
| `POST` | `/daily-plan` | ✅ | Personalized study plan |
| `GET` | `/predict` | ✅ | Placement prediction |
| `GET` | `/analytics-audit` | ✅ | Performance audit report |

### System
| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/api/health` | ❌ | Health check |
| `GET` | `/api/monitor` | ❌ | Server monitoring (PID, memory, cache stats, AI queue) |

---

## ⚡ Performance & Load Optimization

The server includes production-grade optimizations:

| Feature | Details |
|---------|---------|
| **Clustering** | `node cluster.js` forks 1 worker per CPU core (4-8× throughput) |
| **Stats Caching** | In-memory cache on `/stats` with 30s TTL, auto-invalidated on writes |
| **AI Queue** | Concurrency limiter (max 5 simultaneous Gemini API calls) |
| **Rate Limiting** | Auth: 10/15min · Progress writes: 100/15min · App writes: 60/15min |
| **Bcrypt Tuning** | Cost 10 in dev (fast), cost 12 in production (secure) |
| **MongoDB Pool** | Tuned connection pool (50 max, 5 min, 45s socket timeout) |
| **Graceful Shutdown** | Clean SIGTERM/SIGINT handling — closes HTTP + MongoDB connections |
| **Compression** | Gzip compression on all responses |
| **Helmet** | Security headers on all responses |

### Running in Production
```bash
# Single process
npm start

# Multi-process (recommended)
npm run start:cluster
```

---

## 🌐 Deployment

### Backend → Render
1. Push repo to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Root directory: `server/`
4. Build command: `npm install`
5. Start command: `node cluster.js`
6. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_long_random_secret
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   BREVO_API_KEY=your_brevo_api_key (optional)
   BREVO_SENDER_EMAIL=your@email.com (optional)
   NODE_ENV=production
   ```

### Frontend → Vercel
1. Import repo on [Vercel](https://vercel.com)
2. Root directory: `client/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable:
   ```
   VITE_API_URL=https://your-render-url.onrender.com
   ```

---

## 🔧 Environment Variables

### Server (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/placementos
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173

# AI Features (get from https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key

# Email Notifications (optional — app works without these)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your@email.com

# AI Queue Config (optional)
AI_MAX_CONCURRENT=5
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📦 Import from Legacy Version

If you previously used the standalone `placement-tracker-final.html`:
1. Open the old HTML file in a browser
2. Open DevTools → Application → localStorage → copy the `pos2` value
3. In PlacementOS, go to **Settings → Import from localStorage**
4. Your tasks and problems will be migrated!

---

## 📄 License

MIT © [Shivasai](https://github.com/Shivasai0105)
