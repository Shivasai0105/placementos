# PlacementOS — Full-Stack Project Report & Architecture Specification

## 1. Executive Summary & Project Purpose

**PlacementOS** is a production-ready, full-stack web application designed to track and execute an intensive 8-week placement preparation plan tailored for securing 10+ LPA (Lakhs Per Annum) software engineering roles.

### The Problem
Traditional placement preparation is often managed via static Excel sheets or local markdown checklists. While useful, these solutions fail in key areas:
- **Lack of Persistence across Devices:** Local storage or local files make it difficult for candidates to switch between devices without losing sync.
- **No Active Engagement / Reminders:** Static sheets do not actively prompt the student to stay consistent.
- **Poor User Experience:** Manually updating cells is tedious and doesn't provide visual motivation like progress streaks, dynamic charts, or activity heatmaps.
- **Manual Application Tracking:** Typing details for dozens of job applications into a spreadsheet wastes valuable preparation time.

### The Solution
PlacementOS solves these limitations by upgrading the preparation tracker into a modern cloud-synced web app:
1. **Unified Preparation Plan:** Integrates a structured 8-week curriculum with daily tasks covering core Data Structures & Algorithms (DSA), System Design, Computer Science (CS) fundamentals (OS, DBMS, Networks), and Aptitude.
2. **250+ Curated DSA Problem Bank:** A categorized list of problems with direct links to practice platforms (LeetCode, GeeksforGeeks) and dynamic solve trackers.
3. **Integrated Kanban Job Tracker with URL Autofill:** A dedicated job board where users can manage active job applications through pipeline stages. Includes an automated scraping engine that extracts details from job links in one click.
4. **AI-Powered Resume ATS Matcher:** Uses LLM diagnostics (Gemini API) to compare candidate resumes against specific job requirements, calculating matching scores, extracting missing keywords, and generating edit suggestions.
5. **Daily Email Engagement Engine:** Background services query user progress and automatically email them their customized daily tasks every evening.
6. **Interactive Analytics:** Computes completion heatmaps, progress percentages across sections, and user streaks to reinforce positive consistency.

---

## 2. Technology Stack & Third-Party APIs

| Layer | Component | Selected Technology | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | Build Tooling | **Vite** | Offers fast hot module replacement (HMR) and quick build times. |
| | Core Library | **React 18** | Allows component-driven development with efficient Virtual DOM reconciliation. |
| | Styling | **Vanilla CSS & Design Tokens** | Maximum control over performance, animations, and custom theme layouts with zero framework overhead. |
| **Backend** | Runtime Environment | **Node.js** | Provides non-blocking event-driven I/O, optimal for high-throughput API endpoints. |
| | Web Framework | **Express.js** | Lightweight routing and middleware framework. |
| | DNS Config | **dns (Node built-in)** | Patched with `ipv4first` result order to prevent IPv6 network routing timeouts. |
| | Task Scheduler | **node-cron** | Handles in-memory background cron tasks on the server. |
| | Email Engine | **Brevo REST API** | Sends transactional emails over HTTPS Port 443. |
| | AI Diagnostics | **Google Gemini API (v1beta)** | Runs content generation using Gemini 2.5 Flash / Gemini 2.0 Flash models. |
| **Database** | Database Engine | **MongoDB** | Schemaless document store. Perfect for storing user progress mapping tables and dynamic job applications. |
| | ODM / Modeling | **Mongoose** | Provides strict schema validation, hooks, and query helpers on top of MongoDB. |
| **Security** | Auth Tokens | **JSON Web Tokens (JWT)** | Enables stateless authorization, removing the need for server-side sessions. |
| | Encryption | **bcryptjs** | Standard for secure salted password hashing (12 salt rounds). |

---

## 3. System Architecture & Directory Structure

PlacementOS follows a monorepo structure separating the frontend application client from the backend server API.

### Directory Mapping
```
placement_prep/
├── server/                    # Express Backend
│   ├── data/
│   │   └── plan.js            # 8-Week Curriculum Details
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT validation & user attachment
│   ├── models/
│   │   ├── User.js            # User Schema (bcrypt hashing)
│   │   ├── Progress.js        # User Task/Problem completion tracker
│   │   └── Application.js     # Job Application Tracker schema
│   ├── routes/
│   │   ├── auth.js            # Auth handlers (Login, Signup, Reset)
│   │   ├── progress.js        # Prep progress updates & statistics
│   │   ├── applications.js    # Job applications CRUD & link scraper
│   │   └── ai.js              # Gemini API Resume matching router
│   ├── services/
│   │   └── cronJobs.js        # Daily task email schedule (node-cron)
│   ├── index.js               # Application Entry & DNS configuration
│   └── package.json
│
└── client/                    # React Frontend (Vite)
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx # Global Auth state provider
    │   ├── hooks/
    │   │   └── useApi.js      # Fetch wrapper with auto-header & session handling
    │   ├── components/        # Reusable UI elements (Navbar, MobileNav, Toast)
    │   ├── pages/             # UI Views
    │   │   ├── Dashboard.jsx  # Primary feed, daily tasks, streak status
    │   │   ├── Plan.jsx       # 8-week check-off grid
    │   │   ├── Problems.jsx   # DSA sheets
    │   │   ├── Applications.jsx # Job Board (Kanban style + Link Autofill)
    │   │   ├── AiResume.jsx   # AI ATS Resume Matcher diagnostics page
    │   │   ├── Analytics.jsx  # Progress visualizer & Heatmaps
    │   │   └── Settings.jsx   # Profile management & Data importer
    │   ├── App.jsx            # Routing & Router protection logic
    │   └── index.css          # Core Styling system & custom UI tokens
    └── vite.config.js         # Port configuration & Local development proxy
```

### Request/Data Flow Diagram

```
[ Frontend: Paste Job URL or click Analyze ]
                   │
                   ▼ (Appends JWT Authorization Header)
             [ useApi Hook ]
                   │
                   ▼ (Hits local port 5000 / API endpoint)
             [ Express Router ] 
                   │
         ┌─────────┴─────────┐
         ▼ (Scrape link)     ▼ (Analyze Resume)
  [ applications.js ]   [ ai.js ]
         │                   │
         │ (fetch url &      │ (Triggers fetch query to)
         │  parse HTML tags) │ (generativelanguage.googleapis.com)
         ▼                   ▼
  [ Return metadata ]   [ Resilient Gemini Try-Loop ]
                             │ (Iterates: gemini-2.5-flash -> 2.0 -> 1.5)
                             ▼
                        [ JSON Parsing & formatting ]
                             │
                             ▼
                    [ Return report data ]
                             │
                             ▼
                 [ Render UI Dashboard ]
```

---

## 4. Database Schema Design (Data Models)

PlacementOS models data in three primary schemas in MongoDB:

### 1. User Model (`server/models/User.js`)
Stores account credentials, profile settings, and email verification flags.
* **Security features:**
  * Password uses `select: false` so that standard MongoDB queries do not leak password hashes.
  * Hashing is applied in a Mongoose `pre('save')` hook using `bcryptjs` (salt difficulty: 12).

### 2. Progress Model (`server/models/Progress.js`)
Tracks tasks completed in the 8-week curriculum, solved DSA problems, communication prep progress, and reviewed mock interviews.
* **Why Maps instead of Arrays?**
  * Rather than storing arrays of nested objects, PlacementOS uses **Mongoose Maps of Booleans**.
  * A Map translates into a flat JSON object in MongoDB. Updating a task completion status is a direct `O(1)` operation: `{ $set: { "tasks.w1d2t3": true } }`. This offers high read/write speeds.

### 3. Application Model (`server/models/Application.js`)
Stores the status and tracking metrics for active job applications. Linked to the User ID via a direct reference index to speed up filter queries.

---

## 5. API Endpoints Specification

### Auth Endpoints (`/api/auth`)
| HTTP Method | Path | Authentication | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | No Auth | Registers a new account and emails an email verification link. |
| **POST** | `/login` | No Auth | Validates credentials and returns a JWT token. |
| **GET** | `/me` | JWT Required | Fetches the authenticated user profile details. |
| **PATCH** | `/profile` | JWT Required | Updates user profile settings. |

### Progress Endpoints (`/api/progress`)
| HTTP Method | Path | Authentication | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | JWT Required | Fetches all completion data (tasks, problems, comms). |
| **POST** | `/task` | JWT Required | Toggles a specific 8-week plan task completion state. |
| **POST** | `/problem` | JWT Required | Toggles a specific DSA problem check-off. |
| **GET** | `/stats` | JWT Required | Computes analytics metrics: streaks, solve rates, completion percentages. |

### Application Endpoints (`/api/applications`)
| HTTP Method | Path | Authentication | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | JWT Required | Lists all active job applications for the logged-in user. |
| **POST** | `/` | JWT Required | Creates a new job application card. |
| **POST** | `/scrape` | JWT Required | Scrapes metadata (company, title, description) from a pasted URL. |
| **PATCH** | `/:id` | JWT Required | Modifies details or shifts status stage of an existing application. |
| **DELETE** | `/:id` | JWT Required | Deletes an application card from the user's board. |

### AI Endpoints (`/api/ai`)
| HTTP Method | Path | Authentication | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/resume-match` | JWT Required | Takes `resume` and `jobDescription` strings, queries Gemini, and returns ATS metrics. |

---

## 6. Feature Deep Dive & Workflows

### 1. Job Link Auto-Scraper Workflow
When a candidate finds a job opening, manually typing the details into a spreadsheet is a friction point.
1. **The Input:** In the **Tracker** panel, the user clicks **+ New Application** and pastes the job URL into the `QUICK AUTOFILL_FROM_URL` field.
2. **The Request:** The frontend makes a POST request to `/api/applications/scrape`.
3. **Backend Scraper & Fallback Engine:**
   - **Hostname Extraction:** The server parses the URL's hostname (e.g. `careers.google.com`) and matches common job platforms (`LinkedIn`, `Indeed`, `Glassdoor`, `Google`, `Amazon`, `Apple`) to instantly guess the company name.
   - **HTML Fetching:** The backend initiates an asynchronous HTTP `fetch` to retrieve the page source, masking itself with a real Chrome user agent header.
   - **Regex Matching:** The server extracts:
     - The `<title>` content, cleaning out generic boilerplate strings (like *"Careers at"*, *"Job Application for"*) to isolate the exact job role.
     - The page `<meta name="description">` or `<meta property="og:description">` to capture a short summary of the job details, which is automatically populated into the notes panel.
4. **Auto-Populate:** The extracted JSON payload is returned to the React state and populates the modal input fields automatically.

### 2. AI Resume ATS Matcher Workflow
To optimize resume content before applying to a role, candidates can run instant LLM diagnostics.
1. **Pasting Text:** The user pastes their plain-text resume and the target job description requirements into the **AI Resume** page.
2. **API Request:** The client routes a POST request to `/api/ai/resume-match` with the payload.
3. **Resilient Model selection:** 
   - Not all API keys support older model generations. The backend initiates a fallback loop trying the following model endpoints in order: `gemini-2.5-flash` $\rightarrow$ `gemini-2.0-flash` $\rightarrow$ `gemini-1.5-flash` $\rightarrow$ `gemini-pro-latest`.
4. **LLM Instruction and JSON Formatting:** The server instructs the AI to operate strictly as an ATS compiler and output evaluation metrics as a structured JSON object.
5. **Robust Parsing:** The backend processes the LLM output, regex-strips any markdown block markers (e.g. ` ```json ` ... ` ``` `) if returned by the model, and parses the clean JSON.
6. **Dashboard Output:** Displays the score percentage, a list of **Missing Keywords**, **Strengths**, and specific **Refining Recommendations**.

---

## 7. Network & DNS Operational Safeguards

In production and local environments, networking behaviors can disrupt API connections:

### 1. The Node.js IPv6 Resolution Bug
*   **The Issue:** During local development on Wi-Fi or mobile hotspots, Node's built-in `undici` fetch engine frequently times out when calling Google APIs (`generativelanguage.googleapis.com`). This occurs because the local router advertises IPv6 support, forcing Node to prioritize connecting via IPv6. However, actual outbound IPv6 packets are often dropped by ISPs, causing requests to hang for 10+ seconds and crash.
*   **The Safeguard:** PlacementOS patches the server DNS result order on boot:
    ```javascript
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');
    ```
    This forces Node.js to resolve all DNS queries using **IPv4 first**, bypassing the IPv6 timeout bug entirely and resolving connections in less than 500ms.

### 2. Payload Protection & Express Security
*   **Trust Proxy:** Configured to read the correct client IP address from proxy headers (important for Render hosting).
*   **Helmet & CORS Security:** Mitigates XSS and limits API request origins to configured frontend domains.
*   **Body Payload Limits:** Incoming JSON payloads are capped at 10kb to prevent Denial of Service (DoS) memory overload.

---

## 8. Interview Defense Questions (Tailored)

### Q1: Why did you choose NoSQL (MongoDB) over a relational database (SQL) for a checklist?
> **Answer:** In a checklist app, the progress map changes layout frequently (e.g., adding dynamic communication tasks or company-specific questions). In a relational SQL database, this would require either a massive, sparsely populated table or complex join tables that grow rapidly. MongoDB's Map data type allows us to save dynamic key-value states in a single JSON document. This reduces queries, enables quick O(1) reads, and makes updates fast with minimal indexing overhead.

### Q2: Why did you use the Brevo REST API instead of a Nodemailer SMTP configuration?
> **Answer:** Most hosting environments (Render, AWS, GCP) block outgoing SMTP traffic on ports 25, 465, and 587 by default to prevent spam. Configuring standard SMTP mailers frequently leads to timeouts. The Brevo REST API operates over HTTPS on port 443, which is never blocked, ensuring reliable email delivery without needing to configure complex firewall rules.

### Q3: How does your AI Resume Matcher handle formatting differences, and why is it stateless?
> **Answer:** The AI Resume Matcher is designed statelessly to protect candidate privacy and optimize database memory. Instead of uploading and storing heavy binary PDF files, the frontend parses or accepts plain-text inputs. This lightweight string data is forwarded directly to the Gemini API, analyzed, and returned. This keeps the database clean and makes the execution extremely fast.

### Q4: Explain the connection timeout error you resolved in your Node.js backend.
> **Answer:** We encountered connection timeouts when connecting to Google's API. This was an IPv6 resolution timeout bug. In Node 18+, the fetch handler resolves both IPv6 and IPv4 addresses and prioritizes the IPv6 address first. On local mobile hotspots or certain ISPs, IPv6 routing is often broken, so the connection hangs. We resolved this by configuring `dns.setDefaultResultOrder('ipv4first')` in the server index, forcing the Node runtime to resolve and connect via IPv4 first, which instantly fixed the timeout.
