---
description: How to deploy TripPlan (frontend + backend) to production
---

# Deploying TripPlan to Production

Your app has 3 parts:
- **Frontend** (Vite + React) → Deploy to **Vercel**
- **Backend** (Express API) → Deploy to **Render**
- **Database** (PostgreSQL) → Already on **Supabase** ✅

---

## Step 1: Push Code to GitHub

1. Create a GitHub repository (e.g., `TripPlan`)
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TripPlan.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (Free)

1. Go to [https://render.com](https://render.com) and sign up with GitHub
2. Click **"New" → "Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `tripplan-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add **Environment Variables** (click "Environment"):
   - `DATABASE_URL` = your Supabase PostgreSQL connection string
   - `JWT_SECRET` = any strong random string (e.g., `tripplan-jwt-secret-2026-xyz`)
   - `NODE_ENV` = `production`
   - `PORT` = `5001`
6. Click **"Deploy"**
7. Once deployed, copy the URL (e.g., `https://tripplan-api.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Import Project"** → select your repo
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_BACKEND_URL` = `https://tripplan-api.onrender.com` (your Render URL from Step 2)
   - `VITE_GEMINI_API_KEY` = your Gemini API key
   - `VITE_UNSPLASH_ACCESS_KEY` = your Unsplash access key
5. Click **"Deploy"**

---

## Step 4: Update Backend CORS (Important!)

After deploying, update `backend/index.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'  // Replace with your Vercel URL
  ],
  credentials: true
}));
```

Then push the change and Render will auto-redeploy.

---

## Step 5: Verify

1. Open your Vercel URL
2. Try registering/logging in
3. Create a trip and test AI suggestions

---

## Summary of URLs

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend API | Render | `https://tripplan-api.onrender.com` |
| Database | Supabase | Already connected via `DATABASE_URL` |

## Environment Variables Checklist

### Frontend (.env / Vercel)
- `VITE_BACKEND_URL` → Render backend URL
- `VITE_GEMINI_API_KEY` → Gemini API key
- `VITE_UNSPLASH_ACCESS_KEY` → Unsplash access key

### Backend (Render)
- `DATABASE_URL` → Supabase PostgreSQL connection string
- `JWT_SECRET` → Random secret string
- `NODE_ENV` → `production`
- `PORT` → `5001`
