# ⚡ Quick Deploy Guide (5 Minutes)

## 🚀 Deploy for FREE in 5 Steps

### 1️⃣ Database (1 min)
```
1. Go to: https://neon.tech
2. Sign up with GitHub
3. Create project → Copy connection string
```

### 2️⃣ Push to GitHub (1 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
git push -u origin main
```

### 3️⃣ Deploy Backend - Render (2 min)
```
1. Go to: https://render.com
2. New + → Web Service
3. Connect GitHub repo
4. Settings:
   - Root: backend
   - Build: pip install -r requirements.txt
   - Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. Environment Variables:
   - DATABASE_URL = (paste Neon URL)
   - OPENAI_API_KEY = sk-...
   - SECRET_KEY = (random string)
6. Deploy!
```

### 4️⃣ Deploy Frontend - Vercel (1 min)
```
1. Go to: https://vercel.com
2. New Project → Import GitHub repo
3. Settings:
   - Root: frontend
   - Framework: Vite
4. Environment Variable:
   - VITE_API_URL = https://your-backend.onrender.com/api
5. Deploy!
```

### 5️⃣ Update CORS (30 sec)
```
1. In backend/app/main.py, add your Vercel URL to allow_origins
2. Commit and push
3. Auto-deploys!
```

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

---

## 💰 Cost: $0/month

**Free tier includes:**
- Vercel: 100GB bandwidth
- Render: 750 hours (spins down after 15 min)
- Neon: 0.5GB database

**Want no cold starts?** Upgrade Render to $7/month

---

See `DEPLOYMENT_GUIDE.md` for detailed instructions!

