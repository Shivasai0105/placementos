# PlacementOS Interview Preparation Guide

This document contains 50+ carefully crafted interview questions directly tailored to the **PlacementOS** project. They are categorized from basic overview questions to advanced technical deep-dives to ensure you are fully prepared to defend and explain every aspect of your app in an interview.

---

## Part 1: General & Project Overview (Basic)
1. **Elevator Pitch:** Can you give me a 2-minute overview of what PlacementOS is and what problem it solves?
2. **Motivation:** Why did you decide to build this application? How does it improve upon a standard Excel sheet tracker?
3. **Tech Stack Selection:** Why did you choose the MERN stack (MongoDB, Express, React, Node.js) over other popular stacks (like Django + Postgres, or Next.js)?
4. **Project Scope:** What are the core features of your tracker? Can you walk me through the typical user flow?
5. **Challenges:** What was the single biggest technical challenge you faced while developing this project, and how did you overcome it?

---

## Part 2: Frontend Architecture & React (Intermediate)
6. **Build Tooling:** You used Vite instead of Create React App (CRA). Can you explain the difference between the two and why Vite is faster?
7. **State Management:** How are you managing global state in your application (e.g., User Auth state)? Why did you choose the Context API over Redux or Zustand for this project?
8. **Routing:** How does client-side routing work in your React app? Can you explain how you implemented protected routes to keep unauthenticated users out of the Dashboard page?
9. **Hooks:** Which custom hooks did you write? (e.g., `useApi`, `useTheme`) Explain the purpose of separating API calls or logic into custom hooks.
10. **Performance:** The app loads over 250+ DSA problems. How do you ensure the frontend doesn't lag when rendering long lists? 
11. **CSS/Styling:** You opted for Vanilla CSS with design tokens rather than a framework like Tailwind or Bootstrap. Why? How does your token system work?
12. **Local Storage Import:** Can you explain the mechanism you built to import legacy progress from the old HTML application's `localStorage` into the new MERN app?
13. **Dynamic Rendering:** How does your analytics dashboard (charts, heatmaps, streak calculation) dynamically compute and render the user's progress data?
14. **CORS on Frontend:** Did you face CORS issues while connecting your React local development server to your Express backend? How did the `vite.config.js` proxy help solve it locally?
15. **Props vs State:** How do you pass progress data (tasks, com-prep, interview-prep) down to your components, and when do you use local component state vs context?

---

## Part 3: Backend Architecture & Node/Express (Intermediate - Advanced)
16. **Express Basics:** Explain the entry point of your Node server (`index.js`). What is the role of middleware in your Express app?
17. **CORS in Production:** Can you explain your `corsOptions` object in `index.js`? Why do you dynamically check `allowedOrigins` and why is the `OPTIONS` pre-flight route important?
18. **Trust Proxy:** You have `app.set('trust proxy', 1);` configured. What exactly does this do, and why is it necessary when hosting on a service like Render?
19. **Security Middleware:** You integrated `helmet`. What does Helmet do under the hood to secure your Express app?
20. **Performance Middleware:** How does the `compression()` middleware optimize your backend API responses?
21. **RESTful Routing:** How are your routes structured? Explain the separation of concerns between your `authRoutes` and `progressRoutes`.
22. **Error Handling:** You have a global error-handling middleware (`app.use((err, req, res, next) => {...})`). How does this pattern improve the reliability of your API?
23. **Body Parsing:** Why do you use `express.json({ limit: '10kb' })`? What kind of attack does this specifically mitigate?
24. **Cron Jobs:** You use `node-cron` for a daily task job. How exactly does this schedule run natively in Node.js? What are the drawbacks of running cron jobs on a single Node instance instead of using an external job runner?
25. **Rate Limiting:** If an attacker tries to spam your login API, how does `express-rate-limit` protect your server?

---

## Part 4: Database & MongoDB (Advanced)
26. **Schema Design:** Walk me through your `Progress.js` and `User.js` models. Why did you separate Progress and User into two different collections instead of embedding Progress inside the User document?
27. **Map Data Type:** In your `Progress` schema, you store tasks and problems as a `Map` of Booleans (e.g., `{ "w0d0t0": true }`). Why is `Map` better here than an Array of objects or strictly defining every task as a key?
28. **References / Population:** How do you link a `Progress` document to a `User`? (Explain `mongoose.Schema.Types.ObjectId` and `.ref`).
29. **Mongoose Hooks:** You use a `pre('save')` hook in your User model. What happens inside this hook before a user is saved to the database?
30. **NoSQL vs SQL:** If you were to rebuild this project, would a relational database (like PostgreSQL) be a better fit given the structured nature of tasks? Why or why not?
31. **Indexing:** The `email` field in your User schema is marked `unique: true`. How does MongoDB handle this under the hood? Does it create an index?
32. **Connection Handling:** Where and how do you establish your connection to MongoDB Atlas, and how do you handle connection failures?
33. **Data Integrity:** What happens to the user's progress if a backend update to a task `Map` fails midway through the process?
34. **Scaling DB:** If you gain 10,000 users tomorrow, what part of your MongoDB setup will be the first bottleneck, and how would you fix it?
35. **Default Values:** How does Mongoose handle appending default values to deeply nested objects if the frontend sends an incomplete payload?

---

## Part 5: Authentication, Security & Crypto (Advanced)
36. **JWT Flow:** Explain the exact lifecycle of a JSON Web Token in your app—from the moment the user clicks "Login" to the moment they access a protected route (like `/api/progress`).
37. **Stateless Auth:** Why is JWT considered "stateless"? How does the backend verify the user without looking up a session in the database every time?
38. **Password Hashing:** You use `bcryptjs` with a cost factor (salt rounds) of 12. Explain what "salting" and "hashing" mean, and why the cost factor is important.
39. **Token Storage:** Where is your frontend storing the JWT? If it's in `localStorage`, what are the security risks (XSS)? How would you mitigate them using HTTP-only cookies?
40. **Password Reset:** Explain the logic behind your `createPasswordResetToken` method. Why do you hash the reset token before saving it to the database, but send the raw unhashed token to the user via email?
41. **Crypto Module:** You use Node's native `crypto` module to generate verification tokens (`crypto.randomBytes(32)`). Why use this instead of `Math.random()`?
42. **Select false:** In your Mongoose model, fields like `password` and `verificationToken` have `select: false`. What does this do and why is it a crucial security feature?

---

## Part 6: Deployment & DevOps (Expert level reasoning)
43. **Environment Variables:** How are you managing environment variables (`.env`) differently in your local dev environment versus production (Render/Vercel)?
44. **Monorepo setup:** Your project has a `client/` folder and `server/` folder in the same repository. How do you instruct Render to only build the backend and Vercel to only build the frontend?
45. **Vercel vs Render:** Why use Render for Node/Express and Vercel for React? Could you host the entire app on just one platform?
46. **Cold Starts:** If your server is hosted on Render's free tier, it spins down after inactivity. How does this "cold start" affect user experience, and how can you mitigate it?
47. **Logging:** You use `morgan` configured to `dev` locally and `combined` in production. Why is logging important in production, and how do you monitor your logs?
48. **Email Delivery:** You are using Resend / Nodemailer. How do you handle email failures—for instance, if the SMTP server rejects the email, do you gracefully handle the error for the user?
49. **CI/CD:** How does your current deployment pipeline work? What happens automatically when you `git push` to your main branch?
50. **Future Scaling:** If you wanted to turn PlacementOS into a B2B platform used by universities, what architecture changes would you need to make to support multi-tenancy (separating student data by college)?

---
## Advice on answering these in an interview:
- **Use the STAR method:** (Situation, Task, Action, Result) when describing challenges you faced. 
- **Be Honest about Trade-offs:** If an interviewer asks "Why didn't you use SQL?", a great answer is admitting SQL might have been strictly better for relational tasks, but you chose MongoDB to improve your NoSQL indexing skills and prototype faster.
- **Trace the Data Flow:** Be ready to draw mentally or physically how data gets from the user's React click -> Vite -> Express Route -> Auth Middleware -> Controller -> Mongoose -> DB.
