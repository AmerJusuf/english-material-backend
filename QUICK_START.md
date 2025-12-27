# 🚀 Quick Start Guide

Get the English Class Material Generator up and running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install packages
pip install -r requirements.txt

# 5. Create .env file and add your API keys
echo SECRET_KEY=your-secret-key-change-this > .env
echo DATABASE_URL=sqlite:///./app.db >> .env
echo OPENAI_API_KEY=your-openai-key-here >> .env
echo ANTHROPIC_API_KEY=your-anthropic-key-here >> .env

# 6. Start the backend
python run.py
```

Backend is now running at `http://localhost:8000` ✅

## Step 2: Frontend Setup (2 minutes)

Open a NEW terminal:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install packages
npm install

# 3. Start the frontend
npm run dev
```

Frontend is now running at `http://localhost:5173` ✅

## Step 3: Use the App (1 minute)

1. Open browser: `http://localhost:5173`
2. Click "Sign up" and create an account
3. Login with your credentials
4. Click "Generate New Material"
5. Fill in title and chapters
6. Click "Generate Material"
7. Edit and export your content!

## 🔑 Get API Keys

### OpenAI (Required)
1. Go to https://platform.openai.com/api-keys
2. Create account / Login
3. Click "Create new secret key"
4. Copy and paste into `.env` file

### Anthropic (Optional)
1. Go to https://console.anthropic.com/
2. Create account / Login
3. Generate API key
4. Copy and paste into `.env` file

## ⚠️ Troubleshooting

### Backend won't start?
- Make sure virtual environment is activated
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend won't start?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Can't connect to API?
- Check if backend is running on port 8000
- Check browser console for errors

### API key errors?
- Ensure no quotes around keys in `.env`
- Verify keys are valid on provider websites
- Check you have credits available

## 💡 Tips

- **Start Small**: Try GPT-4o Mini first (cheapest)
- **Save Often**: Use the Save button in the editor
- **Track Costs**: Check Token Usage page regularly
- **Export Early**: Download your materials after generation

## 📚 What's Next?

Read the full [README.md](README.md) for:
- Detailed feature descriptions
- Production deployment guide
- Security best practices
- Complete API documentation

---

Happy teaching! 🎓

