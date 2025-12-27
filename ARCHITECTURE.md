# 🏗️ Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            React Application (Frontend)                │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Pages     │  │  Components  │  │   Context    │ │ │
│  │  │  - Login    │  │  - Layout    │  │  - Auth      │ │ │
│  │  │  - Register │  │  - Editor    │  │              │ │ │
│  │  │  - Dashboard│  │              │  │              │ │ │
│  │  │  - Generator│  │              │  │              │ │ │
│  │  │  - Tokens   │  │              │  │              │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Axios API Client                       │ │ │
│  │  │  - Authentication interceptors                   │ │ │
│  │  │  - Error handling                                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS (REST API)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  Backend Server (FastAPI)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     API Routers                        │ │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │ │
│  │  │  /auth   │  │ /materials│  │     /tokens      │   │ │
│  │  │ - login  │  │ - generate│  │  - usage stats   │   │ │
│  │  │ - register│ │ - list    │  │  - history       │   │ │
│  │  │ - me     │  │ - update  │  │                  │   │ │
│  │  └──────────┘  └───────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
│  ┌───────────────────────┴────────────────────────────────┐ │
│  │              Middleware & Services                     │ │
│  │  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │ Auth Service │  │ LLM Service │  │  Database   │  │ │
│  │  │ - JWT tokens │  │ - OpenAI    │  │  - Models   │  │ │
│  │  │ - Password   │  │ - Anthropic │  │  - Sessions │  │ │
│  │  │   hashing    │  │ - Token     │  │             │  │ │
│  │  │              │  │   counting  │  │             │  │ │
│  │  └──────────────┘  └─────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
                ▼                          ▼
        ┌───────────────┐         ┌──────────────────┐
        │   SQLite DB   │         │   External APIs  │
        │  - users      │         │  ┌─────────────┐ │
        │  - materials  │         │  │  OpenAI API │ │
        │  - token_usage│         │  └─────────────┘ │
        └───────────────┘         │  ┌─────────────┐ │
                                  │  │Anthropic API│ │
                                  │  └─────────────┘ │
                                  └──────────────────┘
```

---

## Component Details

### Frontend Architecture

#### Technology Stack
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **TipTap**: Rich text editor
- **Axios**: HTTP client

#### Folder Structure
```
frontend/src/
├── api/
│   └── axios.ts              # Configured HTTP client
├── components/
│   ├── Layout.tsx            # Main app layout with sidebar
│   ├── Layout.css
│   ├── RichTextEditor.tsx    # TipTap-based editor
│   └── RichTextEditor.css
├── context/
│   └── AuthContext.tsx       # Authentication state management
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Register.tsx          # Registration page
│   ├── Dashboard.tsx         # Materials list
│   ├── Generator.tsx         # Material generation UI
│   ├── TokenUsage.tsx        # Usage statistics
│   └── *.css                 # Page-specific styles
├── App.tsx                   # Root component with routing
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

#### State Management
- **Local State**: React hooks (useState, useEffect)
- **Auth State**: Context API (AuthContext)
- **Server State**: Direct API calls (no Redux needed)

#### Routing Strategy
```
/login              → PublicRoute → Login page
/register           → PublicRoute → Register page
/                   → ProtectedRoute → Layout
  /dashboard        → Dashboard (materials list)
  /generator        → Generator (create/edit)
  /tokens           → TokenUsage (statistics)
```

---

### Backend Architecture

#### Technology Stack
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and settings
- **python-jose**: JWT token handling
- **passlib**: Password hashing (bcrypt)
- **OpenAI SDK**: GPT model integration
- **Anthropic SDK**: Claude model integration

#### Folder Structure
```
backend/
├── app/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── materials.py      # Material CRUD & generation
│   │   └── tokens.py         # Usage tracking endpoints
│   ├── __init__.py
│   ├── auth.py               # JWT & password utilities
│   ├── config.py             # Settings management
│   ├── database.py           # Database connection
│   ├── llm_service.py        # LLM integration logic
│   ├── main.py               # FastAPI application
│   ├── models.py             # SQLAlchemy models
│   └── schemas.py            # Pydantic schemas
├── requirements.txt          # Python dependencies
└── run.py                    # Application runner
```

#### API Endpoints

**Authentication (`/api/auth`)**
```
POST   /auth/register     # Create new user
POST   /auth/login        # Login and get JWT token
GET    /auth/me           # Get current user info
```

**Materials (`/api/materials`)**
```
POST   /materials/generate    # Generate new material
GET    /materials/            # List user's materials
GET    /materials/{id}        # Get specific material
PUT    /materials/{id}        # Update material content
DELETE /materials/{id}        # Delete material
```

**Token Usage (`/api/tokens`)**
```
GET    /tokens/usage      # Get usage statistics
```

---

## Data Flow

### 1. Material Generation Flow

```
User Input (Frontend)
    ↓
Validate & Send Request
    ↓
FastAPI Endpoint (/materials/generate)
    ↓
LLM Service
    ├→ For each chapter:
    │   ├→ Build prompt with context
    │   ├→ Call OpenAI/Anthropic API
    │   ├→ Count tokens
    │   └→ Accumulate content
    ↓
Save to Database
    ├→ Create Material record
    └→ Create TokenUsage record
    ↓
Return Response to Frontend
    ↓
Display in Rich Text Editor
```

### 2. Authentication Flow

```
User Credentials
    ↓
POST /auth/login
    ↓
Verify Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Return Token to Frontend
    ↓
Store in localStorage
    ↓
Add to all API requests (Authorization header)
    ↓
Backend validates token on each request
```

### 3. Content Export Flow

```
Editor Content (HTML)
    ↓
User clicks Export
    ↓
Frontend Processing:
    ├→ HTML: Create styled document → Download
    └→ PDF: Open print dialog → User saves
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Materials Table
```sql
CREATE TABLE materials (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR NOT NULL,
    table_of_contents TEXT NOT NULL,  -- JSON
    generated_content TEXT,            -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Token Usage Table
```sql
CREATE TABLE token_usage (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    estimated_cost FLOAT NOT NULL,
    model_used VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Architecture

### Authentication
- **Password Security**: Bcrypt hashing with salt
- **Token Security**: JWT with HS256 algorithm
- **Token Expiry**: 30 days (configurable)
- **Token Storage**: localStorage (frontend)

### Authorization
- **Endpoint Protection**: JWT required for protected routes
- **User Isolation**: Users can only access their own data
- **SQL Injection**: Protected by SQLAlchemy ORM
- **XSS Protection**: React's built-in protection

### API Security
- **CORS**: Configured for specific origins
- **Rate Limiting**: Ready for implementation
- **HTTPS**: Recommended for production
- **API Keys**: Stored in environment variables

---

## Integration Points

### OpenAI Integration
```python
OpenAI Client
    ↓
API Call: chat.completions.create()
    ↓
Parameters:
    - model: "gpt-4o-mini" | "gpt-4o" | "gpt-4-turbo"
    - messages: [system, user]
    - temperature: 0.7
    - max_tokens: 4000
    ↓
Response:
    - content: Generated text
    - usage: Token counts
```

### Anthropic Integration
```python
Anthropic Client
    ↓
API Call: messages.create()
    ↓
Parameters:
    - model: "claude-3-5-sonnet-20241022"
    - messages: [user]
    - temperature: 0.7
    - max_tokens: 4000
    ↓
Response:
    - content: Generated text
    - usage: Token counts
```

---

## Deployment Architecture

### Development
```
localhost:8000 (Backend)
    ↕
localhost:5173 (Frontend with Vite proxy)
```

### Production
```
                    ┌──────────────┐
                    │  CloudFlare  │
                    │     CDN      │
                    └───────┬──────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────┐                    ┌─────────────────┐
│   Frontend    │                    │    Backend      │
│  (Vercel/     │◄───────────────────┤   (Heroku/      │
│   Netlify)    │   API Calls        │    AWS/GCP)     │
└───────────────┘                    └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   PostgreSQL    │
                                     │    Database     │
                                     └─────────────────┘
```

### Recommended Production Stack
- **Frontend**: Vercel or Netlify
- **Backend**: Heroku, AWS Elastic Beanstalk, or Google Cloud Run
- **Database**: PostgreSQL (Heroku Postgres, AWS RDS)
- **CDN**: CloudFlare
- **Monitoring**: Sentry, DataDog
- **Logs**: Papertrail, LogDNA

---

## Performance Considerations

### Frontend Optimization
- Code splitting by route
- Lazy loading of components
- Debounced search inputs
- Optimized re-renders
- Memoized expensive computations

### Backend Optimization
- Database indexing on foreign keys
- Connection pooling
- Async/await for I/O operations
- Caching of frequent queries (future)
- Background jobs for long operations (future)

### API Optimization
- Streaming responses (future enhancement)
- Batch token counting
- Efficient prompt construction
- Retry logic with exponential backoff

---

## Scalability

### Current Capacity
- **Users**: Hundreds to low thousands
- **Materials**: Unlimited per user
- **Concurrent Requests**: ~50-100

### Scaling Strategy
1. **Horizontal Scaling**: Add more backend instances
2. **Database Scaling**: Move to PostgreSQL, add read replicas
3. **Caching Layer**: Redis for session and API caching
4. **Load Balancing**: Nginx or cloud load balancer
5. **CDN**: Serve static assets via CDN
6. **Queue System**: Celery for background tasks

---

## Monitoring & Observability

### Metrics to Track
- **Performance**: Response times, throughput
- **Errors**: Error rates, stack traces
- **Usage**: Active users, materials generated
- **Costs**: Token usage, API costs
- **Infrastructure**: CPU, memory, disk usage

### Logging Strategy
- **Application Logs**: Python logging module
- **Access Logs**: Uvicorn/Gunicorn logs
- **Error Logs**: Exception tracking
- **Audit Logs**: User actions (future)

---

## Technology Choices & Rationale

### Why FastAPI?
- Modern, fast Python framework
- Automatic API documentation (Swagger)
- Async support for better performance
- Type hints for better code quality
- Easy to learn and use

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent developer experience
- Good performance
- Wide community support

### Why SQLite (Development)?
- Zero configuration
- Single file database
- Perfect for development
- Easy to upgrade to PostgreSQL

### Why TipTap?
- Modern, extensible
- Good documentation
- React integration
- Customizable
- Active development

### Why JWT?
- Stateless authentication
- Easy to scale
- Standard approach
- Client-side storage
- Works well with SPAs

---

Built with modern best practices 🚀

