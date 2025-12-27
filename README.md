# English Class Material Generator

A modern, AI-powered application for generating comprehensive English language learning materials. Built with React and Python (FastAPI), this application allows educators to create engaging, structured learning content with the help of Large Language Models (LLMs).

## ✨ Features

### 🎯 Core Features
- **AI-Powered Content Generation**: Generate complete learning materials using OpenAI GPT or Anthropic Claude models
- **Table of Contents Builder**: Create structured content with multiple chapters and descriptions
- **Rich Text Editor**: Edit generated content with a Word-like interface powered by TipTap
- **Export Capabilities**: Download materials as HTML (Word-compatible) or print to PDF
- **Progressive Learning**: Tasks build on each other for effective learning progression

### 👤 User Management
- **Secure Authentication**: JWT-based login and registration system
- **User-specific Content**: Each user's materials and usage data are private

### 📊 Token Usage Tracking
- **Real-time Token Monitoring**: Track tokens used per request
- **Cost Estimation**: Approximate costs based on model pricing
- **Usage Analytics**: Visual charts showing usage by model
- **Activity History**: Detailed log of all generation requests

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Database (easily upgradable to PostgreSQL)
- **OpenAI API**: GPT model integration
- **Anthropic API**: Claude model integration
- **JWT Authentication**: Secure token-based auth
- **Pydantic**: Data validation

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **React Router**: Client-side routing
- **TipTap**: Rich text editor
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- OpenAI API key (for GPT models)
- Anthropic API key (for Claude models) - Optional

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd english_class_material_generator_
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # On Windows
# or
cp .env.example .env    # On macOS/Linux
```

Edit the `.env` file and add your API keys:

```env
SECRET_KEY=your-super-secret-key-here-change-this-in-production
DATABASE_URL=sqlite:///./app.db
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Running the Application

#### Terminal 1 - Backend:
```bash
cd backend
# Activate virtual environment if not already active
python run.py
```
Backend will run on `http://localhost:8000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## 📖 Usage Guide

### 1. Register & Login
- Create an account with email, username, and password
- Login to access the dashboard

### 2. Generate Materials
- Click "Generate New Material"
- Enter a title for your material
- Add chapters with titles and optional descriptions
- Select an AI model (GPT-4o Mini recommended for cost-effectiveness)
- Click "Generate Material" and wait for the AI to create content

### 3. Edit Content
- Use the rich text editor to modify generated content
- Format text with bold, italic, underline
- Create lists and adjust alignment
- Apply different heading styles

### 4. Export Materials
- Click "HTML" to download as HTML (opens in Word)
- Click "Print" to print or save as PDF
- Save changes to your material

### 5. Track Usage
- Navigate to "Token Usage" page
- View total tokens used and estimated costs
- See usage breakdown by model
- Review recent activity

## 🎨 Key Features Explained

### Material Generation Process

The application generates materials chapter by chapter, with each chapter building on previous ones:

1. **Context Building**: Each chapter receives context from previous chapters
2. **Progressive Tasks**: Tasks are designed to build on each other
3. **Comprehensive Content**: Includes objectives, exercises, vocabulary, and review questions

### Supported AI Models

| Model | Best For | Cost |
|-------|----------|------|
| GPT-4o Mini | Most materials, cost-effective | $ |
| GPT-4o | Balanced quality and cost | $$ |
| GPT-4 Turbo | High-quality content | $$$ |
| Claude 3.5 Sonnet | Premium quality, creative | $$$ |

### Token Cost Estimation

Pricing (approximate, as of 2024):
- GPT-4o Mini: $0.15/1M input tokens, $0.60/1M output tokens
- GPT-4o: $2.50/1M input tokens, $10.00/1M output tokens
- Claude 3.5 Sonnet: $3.00/1M input tokens, $15.00/1M output tokens

## 🗂️ Project Structure

```
english_class_material_generator_/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── materials.py     # Material CRUD & generation
│   │   │   └── tokens.py        # Token usage tracking
│   │   ├── __init__.py
│   │   ├── auth.py              # JWT authentication logic
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database connection
│   │   ├── llm_service.py       # LLM integration
│   │   ├── main.py              # FastAPI app
│   │   ├── models.py            # Database models
│   │   └── schemas.py           # Pydantic schemas
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts         # API client
│   │   ├── components/
│   │   │   ├── Layout.tsx       # App layout
│   │   │   └── RichTextEditor.tsx # Text editor
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication state
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Materials list
│   │   │   ├── Generator.tsx    # Material generator
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration
│   │   │   └── TokenUsage.tsx   # Usage dashboard
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🔒 Security Notes

1. **Change the SECRET_KEY**: Use a strong, random secret key in production
2. **API Keys**: Never commit API keys to version control
3. **HTTPS**: Use HTTPS in production
4. **Database**: Consider PostgreSQL for production
5. **CORS**: Adjust CORS settings for production domains

## 🚀 Production Deployment

### Backend (FastAPI)
- Deploy on: Heroku, AWS, Google Cloud, or DigitalOcean
- Use Gunicorn or Uvicorn workers
- Switch to PostgreSQL database
- Set environment variables securely

### Frontend (React)
- Build: `npm run build`
- Deploy on: Vercel, Netlify, or AWS S3 + CloudFront
- Update API base URL to production backend

## 🐛 Troubleshooting

### Backend Issues

**"Module not found" errors**
```bash
pip install -r requirements.txt
```

**Database errors**
```bash
# Delete the database and restart
rm app.db
python run.py
```

### Frontend Issues

**"Cannot find module" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection errors**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/app/main.py`

### API Key Issues

**OpenAI/Anthropic errors**
- Verify API keys in `.env` file
- Check API key validity and quota
- Ensure proper formatting (no quotes in .env)

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- TipTap for the rich text editor
- FastAPI and React communities

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for English language educators

