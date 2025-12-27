# 👋 Welcome to English Class Material Generator!

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🎓  ENGLISH CLASS MATERIAL GENERATOR                        ║
║                                                               ║
║   AI-Powered Learning Material Creation                      ║
║   Built with React, TypeScript, Python & FastAPI             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

## 🚀 Get Started in 3 Steps

### 1️⃣ Run Setup
```bash
# Windows Users:
setup.bat

# Mac/Linux Users:
chmod +x setup.sh && ./setup.sh
```

### 2️⃣ Add API Keys
Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```
Get your key at: https://platform.openai.com/api-keys

### 3️⃣ Start the App
```bash
# Windows:
start-backend.bat    # Terminal 1
start-frontend.bat   # Terminal 2

# Mac/Linux:
./start-backend.sh   # Terminal 1
./start-frontend.sh  # Terminal 2
```

**Then open:** http://localhost:5173 🎉

---

## 📚 Need Help?

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [README.md](README.md) | Complete guide | After setup |
| [QUICK_START.md](QUICK_START.md) | Fast setup | Right now! |
| [FEATURES.md](FEATURES.md) | What it does | When exploring |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How it works | For developers |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Overview | Anytime |

---

## ✨ What Can You Do?

### 📝 Generate Materials
Create complete English learning materials with:
- Multiple chapters
- Progressive tasks
- Vocabulary lists
- Practice exercises
- Review questions

### ✏️ Edit & Format
Use the rich text editor to:
- Format text (bold, italic, underline)
- Create lists
- Add headings
- Align content
- Professional styling

### 💾 Export & Share
Download your materials as:
- HTML (opens in Word)
- PDF (via print dialog)
- Save as .docx from Word

### 📊 Track Usage
Monitor your:
- Token consumption
- Estimated costs
- Usage by AI model
- Generation history

---

## 💰 Pricing Guide

### AI Models Available

| Model | Speed | Quality | Cost/Material* |
|-------|-------|---------|----------------|
| GPT-4o Mini | ⚡⚡⚡ | ⭐⭐⭐ | ~$0.05-0.10 |
| GPT-4o | ⚡⚡ | ⭐⭐⭐⭐ | ~$0.20-0.30 |
| GPT-4 Turbo | ⚡ | ⭐⭐⭐⭐⭐ | ~$0.50-0.80 |
| Claude 3.5 Sonnet | ⚡⚡ | ⭐⭐⭐⭐⭐ | ~$0.30-0.50 |

*3-chapter material estimate

💡 **Tip:** Start with GPT-4o Mini for best value!

---

## 🎯 First-Time Users

### Your First 5 Minutes

**Minute 1:** Run setup script  
**Minute 2:** Add API key to `.env`  
**Minute 3:** Start backend & frontend  
**Minute 4:** Create account & login  
**Minute 5:** Generate your first material! 🎉

### Your First Material

Try this example:
```
Title: "Introduction to Business English"

Chapters:
1. Professional Greetings
   Description: Basic greetings in professional settings

2. Email Etiquette
   Description: Writing professional emails

3. Meeting Vocabulary
   Description: Common phrases used in meetings
```

Model: GPT-4o Mini  
Time: ~20 seconds  
Cost: ~$0.05

---

## 🔑 Getting API Keys

### OpenAI (Required)

1. Go to https://platform.openai.com/signup
2. Create account (credit card required for API)
3. Visit https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy and paste into `backend/.env`

**Free Credits:** New users get $5 free credit!

### Anthropic (Optional)

1. Go to https://console.anthropic.com/
2. Create account
3. Add payment method
4. Generate API key
5. Add to `backend/.env`

**Note:** Anthropic keys start with `sk-ant-`

---

## ⚡ Quick Commands

### Windows
```batch
setup.bat              # First-time setup
start-backend.bat      # Run backend
start-frontend.bat     # Run frontend
```

### Mac/Linux
```bash
./setup.sh             # First-time setup
./start-backend.sh     # Run backend
./start-frontend.sh    # Run frontend
```

---

## 🐛 Troubleshooting

### "Python not found"
Install Python 3.8+ from: https://www.python.org/downloads/

### "Node not found"
Install Node.js 16+ from: https://nodejs.org/

### "pip not found"
```bash
python -m ensurepip --upgrade
```

### "npm not found"
Reinstall Node.js with npm included

### "API key invalid"
- Check for typos
- Ensure no quotes in `.env`
- Verify key on provider site
- Check you have credits

### "Port already in use"
Change ports in:
- Backend: `backend/run.py`
- Frontend: `frontend/vite.config.ts`

---

## 🎨 Features at a Glance

```
┌─────────────────────────────────────────────────────┐
│  🔐 Authentication                                  │
│  ├─ Register with email                            │
│  ├─ Secure login (JWT)                             │
│  └─ Session management                             │
│                                                     │
│  📝 Material Generation                             │
│  ├─ Multiple AI models                             │
│  ├─ Custom table of contents                       │
│  ├─ Chapter descriptions                           │
│  └─ Progressive learning tasks                     │
│                                                     │
│  ✏️  Rich Text Editor                               │
│  ├─ Text formatting                                │
│  ├─ Lists & headings                               │
│  ├─ Alignment options                              │
│  └─ Real-time editing                              │
│                                                     │
│  💾 Export Options                                  │
│  ├─ Download as HTML                               │
│  ├─ Print to PDF                                   │
│  └─ Word-compatible                                │
│                                                     │
│  📊 Usage Tracking                                  │
│  ├─ Token consumption                              │
│  ├─ Cost estimation                                │
│  ├─ Usage by model                                 │
│  └─ Activity history                               │
└─────────────────────────────────────────────────────┘
```

---

## 🌟 Pro Tips

### For Best Results
1. ✅ Write clear chapter titles
2. ✅ Add specific descriptions
3. ✅ Start with 2-3 chapters
4. ✅ Use GPT-4o Mini first
5. ✅ Review & edit generated content

### Save Money
1. 💰 Use GPT-4o Mini for most materials
2. 💰 Keep descriptions concise
3. 💰 Generate smaller batches
4. 💰 Monitor usage dashboard
5. 💰 Reuse and edit existing materials

### Stay Organized
1. 📁 Use descriptive titles
2. 📁 Export immediately after generation
3. 📁 Keep backups
4. 📁 Delete draft materials
5. 📁 Track your spending

---

## 🎓 Example Use Cases

### Elementary School
- Vocabulary worksheets
- Reading comprehension
- Grammar exercises
- Spelling tests

### High School
- Essay writing guides
- Literature analysis
- Speaking practice
- Exam preparation

### Business English
- Email templates
- Presentation skills
- Meeting vocabulary
- Professional communication

### ESL/EFL
- Conversation practice
- Pronunciation guides
- Cultural topics
- Real-world scenarios

---

## 📖 Documentation Index

```
📂 Documentation
├─ 📄 WELCOME.md          ← You are here
├─ 📄 README.md           → Complete guide
├─ 📄 QUICK_START.md      → 5-minute setup
├─ 📄 FEATURES.md         → Detailed features
├─ 📄 ARCHITECTURE.md     → Technical docs
└─ 📄 PROJECT_SUMMARY.md  → Project overview
```

---

## 🆘 Need Help?

### Resources
- 📚 Read the documentation files
- 🌐 Check API documentation: http://localhost:8000/docs
- 💻 Review error messages carefully
- 🔍 Search error messages online

### Common Questions

**Q: How much does it cost?**  
A: ~$0.05-0.10 per 3-chapter material with GPT-4o Mini

**Q: Can I use it offline?**  
A: No, requires internet for AI APIs

**Q: Is my data private?**  
A: Yes, materials are private per user

**Q: Can I export to Word?**  
A: Yes, download HTML and open in Word

**Q: How many materials can I create?**  
A: Unlimited (limited only by API costs)

---

## 🎉 Ready to Start!

You have everything you need to create amazing English learning materials!

### Next Steps:
1. ☐ Run setup script
2. ☐ Add API keys
3. ☐ Start the application
4. ☐ Create an account
5. ☐ Generate your first material
6. ☐ Explore features
7. ☐ Share with colleagues!

---

## 🚀 Let's Go!

```
     _____                                       _     _
    / ____|                                     | |   | |
   | (___  _   _  ___ ___ ___  ___ ___   _ __  | |   | |
    \___ \| | | |/ __/ __/ _ \/ __/ __| | '_ \ | |   | |
    ____) | |_| | (_| (_|  __/\__ \__ \ | | | ||_|   |_|
   |_____/ \__,_|\___\___\___||___/___/ |_| |_|(_)   (_)

```

**Happy Teaching! 🎓**

---

*Questions? Check README.md for full documentation*  
*Issues? See QUICK_START.md for troubleshooting*  
*Curious? Read ARCHITECTURE.md for technical details*

