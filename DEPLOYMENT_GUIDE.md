# 🚀 FREE Deployment Guide

Deploy your English Material Generator app completely FREE!

---

## 🎯 Deployment Architecture

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Vercel (Frontend)  │  ← FREE
│  - React app        │
│  - CDN cached       │
└──────┬──────────────┘
       │ API calls
       ▼
┌─────────────────────┐
│  Render (Backend)   │  ← FREE
│  - FastAPI          │
│  - Auto-deploy      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Neon PostgreSQL    │  ← FREE
│  - Database         │
│  - 0.5GB storage    │
└─────────────────────┘
```

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- Render account (sign up with GitHub)
- Neon account (sign up with GitHub)

---

## 🗄️ Step 1: Setup Free PostgreSQL Database

### Option A: Neon (Recommended)

1. **Go to:** https://neon.tech/
2. **Sign up** with GitHub
3. **Create a new project:**
   - Name: `english-material-db`
   - Region: Choose closest to you
4. **Get connection string:**
   - Click "Connection string"
   - Copy the connection string (looks like):
     ```
     postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
     ```
5. **Save this!** You'll need it for the backend

**Free Tier Includes:**
- ✅ 0.5 GB storage
- ✅ Unlimited projects
- ✅ Auto-scaling
- ✅ Branching

### Option B: Supabase

1. **Go to:** https://supabase.com/
2. **Sign up** with GitHub
3. **Create new project**
4. **Get connection string** from Settings → Database

---

## 🔧 Step 2: Prepare Backend for Deployment

### 2.1 Update Requirements

Create `backend/requirements.txt` with PostgreSQL support:

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
sqlalchemy==2.0.25
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
openai==1.10.0
anthropic==0.18.0
tiktoken==0.6.0
psycopg2-binary==2.9.9
```

### 2.2 Update Database URL Format

Your backend already supports this via the `DATABASE_URL` environment variable!

### 2.3 Create Production Config

The backend is already production-ready with environment variables!

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
gh repo create english-material-backend --private --source=. --remote=origin --push
# OR manually create repo on GitHub and:
git remote add origin https://github.com/YOUR_USERNAME/english-material-generator.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Render

1. **Go to:** https://render.com/
2. **Sign up** with GitHub
3. **Click** "New +" → "Web Service"
4. **Connect your GitHub repository**
5. **Configure:**

   ```
   Name: english-material-backend
   Region: Oregon (or closest)
   Branch: main
   Root Directory: backend
   Runtime: Python 3.12
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

6. **Add Environment Variables:**
   
   Click "Environment" and add:
   ```
   SECRET_KEY = your-super-secret-random-key-here
   DATABASE_URL = postgresql://user:password@ep-xxx.neon.tech/neondb
   OPENAI_API_KEY = sk-your-openai-key
   ANTHROPIC_API_KEY = sk-ant-your-anthropic-key
   ```

7. **Deploy!** (takes 2-3 minutes)

8. **Copy your backend URL:** 
   ```
   https://english-material-backend.onrender.com
   ```

**Free Tier Includes:**
- ✅ 750 hours/month (enough for hobby projects)
- ✅ Auto-deploy on git push
- ✅ Free SSL certificate
- ⚠️ Spins down after 15 min inactivity (cold starts)

---

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Update CORS Settings in Backend

Update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-app-name.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Deploy to Vercel

1. **Go to:** https://vercel.com/
2. **Sign up** with GitHub
3. **Click** "Add New..." → "Project"
4. **Import** your GitHub repository
5. **Configure:**

   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

6. **Add Environment Variable:**
   
   In Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL = https://english-material-backend.onrender.com/api
   ```

7. **Deploy!** (takes 1-2 minutes)

8. **Your app is live at:**
   ```
   https://your-app-name.vercel.app
   ```

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ CDN (edge network)
- ✅ Preview deployments for branches
- ✅ 100GB bandwidth/month

---

## 🔄 Step 5: Update Backend CORS with Actual Vercel URL

After deployment, update your backend CORS settings:

1. Go to your backend code
2. Replace `"https://your-app-name.vercel.app"` with your actual Vercel URL
3. Commit and push to GitHub
4. Render will auto-deploy the update!

---

## ✅ Step 6: Test Your Deployment

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Generate a test material**
4. **Check that everything works!**

---

## 🎉 You're Live!

Your app is now accessible worldwide at:
```
https://your-app-name.vercel.app
```

---

## 📊 Free Tier Limits

| Service | Storage | Traffic | Notes |
|---------|---------|---------|-------|
| Vercel | Unlimited | 100GB/mo | More than enough |
| Render | N/A | 100GB/mo | Spins down after 15min |
| Neon | 0.5GB | Unlimited | Enough for 1000s of materials |

**Estimated capacity:**
- 100-500 users/month
- 1000s of materials
- Perfect for personal/classroom use

---

## 🚨 Important Notes

### Cold Starts (Render Free Tier)
- Backend spins down after 15 min inactivity
- First request after idle takes 30-60 seconds
- Subsequent requests are instant
- **Upgrade to $7/month to keep always running**

### Database Backups
- Neon free tier includes automatic backups
- Export your data regularly for safety

### API Costs
- Your OpenAI/Anthropic costs are separate
- Monitor usage in Token Usage dashboard
- Set up billing alerts on provider websites

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Add production domain to CORS
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Review environment variables
- [ ] Test authentication flow
- [ ] Verify API keys are not exposed

---

## 📈 Upgrade Path (If You Outgrow Free Tier)

### When to Upgrade:

**Render ($7/month):**
- Backend always running (no cold starts)
- 400GB bandwidth

**Neon ($19/month):**
- 3GB storage
- More compute

**Vercel ($20/month):**
- 1TB bandwidth
- Advanced analytics

---

## 🆓 Alternative: 100% Free Option (Railway)

Railway offers 500 hours/month FREE (also spins down):

### Deploy Both Backend & Database on Railway

1. **Go to:** https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Add PostgreSQL database** (click "+" → "Database" → "PostgreSQL")
5. **Configure backend service:**
   ```
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. **Connect variables automatically**

**Railway Free Tier:**
- ✅ 500 hours/month
- ✅ $5 credit each month
- ✅ 1GB database storage
- ✅ No cold starts!

---

## 🎯 Recommended Setup for Different Needs

### Personal/Learning Project:
```
Frontend: Vercel (free)
Backend: Render (free, cold starts OK)
Database: Neon (free)
Total: $0/month
```

### Small School/Active Use:
```
Frontend: Vercel (free)
Backend: Render ($7/month, always on)
Database: Neon (free)
Total: $7/month
```

### Production/Commercial:
```
Frontend: Vercel ($20/month)
Backend: Render ($25/month + more compute)
Database: Neon ($19/month)
Total: $64/month
```

---

## 🔧 Troubleshooting

### "CORS Error"
- Add your Vercel domain to backend CORS settings
- Redeploy backend after adding

### "Database Connection Error"
- Check `DATABASE_URL` format
- Ensure PostgreSQL URL is correct
- Verify Neon database is active

### "Cold Start Slow"
- Normal on free tier
- First request takes 30-60 seconds
- Upgrade to $7/month for always-on

### "Build Failed on Vercel"
- Check build logs
- Ensure `package.json` is correct
- Verify `vite.config.ts` exists

---

## 📝 Quick Deploy Checklist

- [ ] Create Neon PostgreSQL database
- [ ] Push code to GitHub
- [ ] Deploy backend to Render
- [ ] Add environment variables to Render
- [ ] Deploy frontend to Vercel
- [ ] Add VITE_API_URL to Vercel
- [ ] Update CORS in backend
- [ ] Test the live app!

---

## 🎊 Success!

You now have a **production-ready, globally accessible** English Material Generator running completely FREE (or for just $7/month if you want no cold starts)!

**Share your app with students and colleagues!** 🚀

---

## 💡 Pro Tips

1. **Custom Domain (Free on Vercel):**
   - Buy domain on Namecheap ($8/year)
   - Add to Vercel for free SSL

2. **Monitor Uptime:**
   - Use UptimeRobot (free) to ping your backend
   - Keeps it warm (reduces cold starts)

3. **Auto-Deploy:**
   - Push to `main` branch → auto-deploys everywhere
   - Use `dev` branch for testing

4. **Environment Management:**
   - Use different API keys for staging vs production
   - Vercel supports multiple environments

---

Need help with deployment? Check the error logs in each platform's dashboard!

