# 🚀 Deploy PlacementOS Live — Step by Step

---

## Step 1 — Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Sign up** (free)
2. Click **"Build a Database"** → choose **M0 Free tier** → pick any region → **Create**
3. Create a database user:
   - Username: `placementos`
   - Password: something strong → click **Create User**
4. Under **Network Access** → **Add IP Address** → click **"Allow Access from Anywhere"** → Confirm
5. Go back to your cluster → click **Connect** → **Compass / Drivers** → choose **"Drivers"**
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://placementos:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password. **Save this string** — you'll need it.

---

## Step 2 — Deploy Backend to Render (Free)

1. Push your project to GitHub (if not done):
   ```bash
   git init
   git add .
   git commit -m "PlacementOS full-stack app"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/placementos.git
   git push -u origin main
   ```

2. Go to [render.com](https://render.com) → **Sign up with GitHub**

3. Click **New +** → **Web Service**

4. Connect your GitHub repo → Select it

5. Configure the service:
   | Field | Value |
   |-------|-------|
   | **Name** | `placementos-api` |
   | **Root Directory** | `server` |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |

6. Click **Add Environment Variable** and add these:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | *(your Atlas connection string from Step 1)* |
   | `JWT_SECRET` | *(any long random string, e.g. `my_super_secret_key_12345`)* |
   | `PORT` | `5000` |
   | `CLIENT_URL` | *(leave blank for now, fill in after Step 3)* |

7. Click **Deploy Web Service**

8. Wait ~3 minutes. Once deployed, copy your backend URL:
   ```
   https://placementos-api.onrender.com
   ```

---

## Step 3 — Update Frontend to Point to the Live Backend

Open `client/vite.config.js` and update the proxy target:

```js
// Replace this:
target: 'http://localhost:5000',

// With your Render URL:
target: 'https://placementos-api.onrender.com',
```

Also open `client/src/hooks/useApi.js` and change `API_BASE` from `''` to your Render URL (needed for production builds):

```js
// For production, set this to your Render URL:
const API_BASE = import.meta.env.VITE_API_URL || '';
```

Then create `client/.env.production`:
```
VITE_API_URL=https://placementos-api.onrender.com
```

---

## Step 4 — Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**

2. Click **Add New Project** → Import your GitHub repo

3. Configure:
   | Field | Value |
   |-------|-------|
   | **Root Directory** | `client` |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Click **Environment Variables** → Add:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://placementos-api.onrender.com` |

5. Click **Deploy**

6. After deploy, copy your live URL:
   ```
   https://placementos.vercel.app
   ```

---

## Step 5 — Connect Frontend URL to Backend

1. Go back to **Render** → your `placementos-api` service
2. Go to **Environment** tab → edit `CLIENT_URL`
3. Set it to your Vercel URL:
   ```
   https://placementos.vercel.app
   ```
4. Click **Save** — Render will redeploy automatically

---

## Step 6 — Test It Live 🎉

1. Open your Vercel URL in browser
2. Click **Register** → create your account
3. You're live! Share the link with anyone — each person gets their own login.

---

## 💡 Tips

- **Render free tier sleeps** after 15 min of inactivity — first request after sleep takes ~30 sec. Upgrade to paid ($7/mo) to avoid this.
- **MongoDB Atlas free tier** allows 512 MB storage — more than enough for this app.
- To **redeploy** after changes: just `git push` — both Render and Vercel auto-deploy on push.
- Your `.env` file **must never be committed to GitHub** — it's already in `.gitignore`.
