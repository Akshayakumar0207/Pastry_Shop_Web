# 🚀 DEPLOY GUIDE — Pâtisserie Dorée
## Turso (DB) + Render (Backend) + Vercel (Frontend)

---

## PART 1 — TURSO DATABASE (Free, No Credit Card)

### Step 1 — Install Turso CLI
Open PowerShell as Administrator:
```powershell
irm https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.ps1 | iex
```
Close PowerShell, reopen it, then verify:
```powershell
turso --version
```

### Step 2 — Login
```powershell
turso auth signup
```
(Opens browser → sign in with GitHub → come back)

### Step 3 — Create Database
```powershell
turso db create patisserie-doree
```

### Step 4 — Get Your Credentials
```powershell
# Copy this URL:
turso db show patisserie-doree --url

# Copy this token:
turso db tokens create patisserie-doree
```
**Save both — you need them in all next steps.**

---

## PART 2 — GITHUB (Required for Render + Vercel)

### Step 1 — Create Repo
1. Go to github.com → New repository
2. Name it: `patisserie-doree`
3. Set to **Public** → Create

### Step 2 — Push Your Code
```powershell
cd C:\pastry_shop\flaky-fantasies

git init
git branch -M main
git add .
git commit -m "Patisserie Doree — full stack app"
git remote add origin https://github.com/YOUR_USERNAME/patisserie-doree.git
git push -u origin main
```

---

## PART 3 — RENDER (Backend API)

### Step 1 — Create Account
Go to render.com → Sign up with GitHub

### Step 2 — New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo → Select `patisserie-doree`
3. Fill in these settings:

| Field           | Value              |
|-----------------|--------------------|
| Name            | patisserie-doree-backend |
| Root Directory  | `backend`          |
| Runtime         | Node               |
| Build Command   | `npm install`      |
| Start Command   | `node server.js`   |
| Instance Type   | **Free**           |

### Step 3 — Add Environment Variables
Click **"Environment"** tab → Add these one by one:

```
TURSO_URL      =  libsql://patisserie-doree-xxxx.turso.io   ← your URL
TURSO_TOKEN    =  eyJhbGci...your token here
PORT           =  5000
NODE_ENV       =  production
FRONTEND_URL   =  https://patisserie-doree.vercel.app
```

### Step 4 — Deploy
Click **"Create Web Service"** → wait 3-5 minutes.

✅ Your backend URL will be:
```
https://patisserie-doree-backend.onrender.com
```

Test it:
```
https://patisserie-doree-backend.onrender.com/api/health
```

---

## PART 4 — VERCEL (Frontend)

### Step 1 — Create Account
Go to vercel.com → Sign up with GitHub

### Step 2 — Import Project
1. Click **"Add New"** → **"Project"**
2. Import your `patisserie-doree` GitHub repo
3. Set these:

| Field              | Value        |
|--------------------|--------------|
| Framework Preset   | Vite         |
| Root Directory     | `frontend`   |
| Build Command      | `npm run build` |
| Output Directory   | `dist`       |

### Step 3 — Add Environment Variable
Click **"Environment Variables"** → Add:

```
VITE_API_URL = https://patisserie-doree-backend.onrender.com
```

### Step 4 — Deploy
Click **"Deploy"** → wait 2 minutes.

✅ Your frontend URL will be:
```
https://patisserie-doree.vercel.app
```

---

## PART 5 — UPDATE RENDER WITH FRONTEND URL

Go back to Render → your backend service → Environment tab:
Update `FRONTEND_URL` to your actual Vercel URL:
```
FRONTEND_URL = https://patisserie-doree.vercel.app
```
Click **"Save Changes"** → Render redeploys automatically.

---

## ✅ FINAL CHECKLIST

```
[ ] Turso account created
[ ] Database "patisserie-doree" created in Turso
[ ] TURSO_URL copied
[ ] TURSO_TOKEN copied
[ ] Code pushed to GitHub
[ ] Render backend deployed
[ ] All 5 env vars set in Render
[ ] Vercel frontend deployed
[ ] VITE_API_URL set in Vercel (Render backend URL)
[ ] FRONTEND_URL updated in Render (Vercel URL)
[ ] Visit your Vercel URL — app works! 🎉
```

---

## 🔗 YOUR LIVE URLS

```
Frontend  →  https://patisserie-doree.vercel.app
Backend   →  https://patisserie-doree-backend.onrender.com
API Test  →  https://patisserie-doree-backend.onrender.com/api/health
Products  →  https://patisserie-doree-backend.onrender.com/api/products
```

---

## ⚠️ NOTE — Render Free Tier Sleep

Render free services sleep after 15 min of no traffic.
First request after sleep takes ~30 seconds.
This is normal. Paid starter plan ($7/month) removes this.

---

## 🏠 LOCAL DEVELOPMENT (after deployment)

```powershell
# Terminal 1 — Backend
cd backend
# Edit .env with your TURSO_URL and TURSO_TOKEN
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev

# Open: http://localhost:5173
```
