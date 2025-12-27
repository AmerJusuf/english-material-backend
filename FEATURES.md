# 📚 Features Documentation

## Overview

The English Class Material Generator is a comprehensive application designed to help educators create high-quality, structured English learning materials using AI assistance.

---

## 🎯 Core Features

### 1. AI-Powered Content Generation

**What it does:**
- Generates complete, structured learning materials based on your table of contents
- Creates progressive learning tasks that build on each other
- Produces modern, engaging content suitable for various proficiency levels

**How it works:**
1. You provide a title and chapter structure
2. Optionally add descriptions for each chapter
3. AI generates comprehensive content including:
   - Learning objectives
   - Progressive tasks (3-5 per chapter)
   - Vocabulary lists
   - Examples and practice exercises
   - Review questions

**Models available:**
- **GPT-4o Mini**: Fast, cost-effective, great for most materials
- **GPT-4o**: Balanced performance and quality
- **GPT-4 Turbo**: High-quality, detailed content
- **Claude 3.5 Sonnet**: Premium quality with creative approaches

### 2. Rich Text Editor

**Capabilities:**
- **Text Formatting**: Bold, italic, underline
- **Lists**: Bullet points and numbered lists
- **Alignment**: Left, center, right
- **Headings**: Multiple heading levels (H1, H2, H3)
- **Real-time Editing**: Changes are immediately visible
- **Word-like Interface**: Familiar editing experience

**Advanced Features:**
- Undo/Redo functionality
- Keyboard shortcuts
- Clean, distraction-free interface
- Responsive design for mobile editing

### 3. Export & Download

**Export Options:**

#### HTML Export
- Downloads as `.html` file
- Opens directly in Microsoft Word
- Can be saved as `.docx` from Word
- Preserves formatting and structure
- Includes proper styling

#### PDF Export (via Print)
- Opens print dialog
- Save as PDF option available
- Clean, professional formatting
- Optimized for A4/Letter size
- Page breaks handled automatically

**Use Cases:**
- Share with students digitally
- Print physical worksheets
- Archive materials
- Collaborate with colleagues

### 4. Material Management

**Dashboard Features:**
- View all your generated materials
- Quick access to edit any material
- Delete unwanted materials
- See creation dates
- Search and filter (coming soon)

**Material Organization:**
- Each material is saved separately
- Automatic timestamping
- User-specific materials (private)
- Easy navigation between materials

---

## 👤 User Management

### Authentication System

**Registration:**
- Email-based registration
- Unique usernames
- Secure password hashing (bcrypt)
- Instant account activation

**Login:**
- JWT token-based authentication
- Long-lasting sessions (30 days)
- Automatic token refresh
- Secure logout

**Security Features:**
- Passwords never stored in plain text
- Token-based authorization
- Protected API endpoints
- CORS protection

---

## 📊 Token Usage & Cost Tracking

### Real-Time Tracking

**What's Tracked:**
- Prompt tokens (input)
- Completion tokens (output)
- Total tokens per request
- Estimated cost per request
- Model used for each generation

### Usage Dashboard

**Statistics Displayed:**
1. **Total Tokens Used**: Lifetime token consumption
2. **Total Cost**: Approximate total spending
3. **Total Requests**: Number of generations

**Visual Analytics:**
- Bar chart showing usage by model
- Comparison of token consumption
- Cost breakdown by model
- Request frequency

**Activity Log:**
- Recent 20 generations
- Timestamp for each request
- Model used
- Tokens consumed
- Cost per request

### Cost Estimation

**Pricing (as of 2024):**

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| GPT-4o Mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4 Turbo | $10.00 | $30.00 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |

**Example Costs:**
- 3-chapter material with GPT-4o Mini: ~$0.05-0.10
- 5-chapter material with GPT-4o: ~$0.30-0.50
- 10-chapter material with Claude 3.5 Sonnet: ~$1.00-1.50

---

## 🎨 User Experience Features

### Modern, Clean Interface

**Design Principles:**
- Minimalist design
- Focus on content
- Intuitive navigation
- Professional appearance

**Color Scheme:**
- Primary: Indigo/Purple gradient
- Clean white backgrounds
- Subtle shadows and depth
- High contrast for readability

### Responsive Design

**Supported Devices:**
- Desktop computers (optimal experience)
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)
- Large screens (4K displays)

**Adaptive Features:**
- Flexible layouts
- Touch-friendly buttons
- Readable text sizes
- Optimized spacing

### Loading States

**User Feedback:**
- Loading spinners during generation
- Progress indicators
- Success/error messages
- Disabled buttons during operations

---

## 🔄 Content Generation Process

### Step-by-Step Process

**1. Input Phase:**
- User enters title
- Adds chapters with titles
- Optionally adds descriptions
- Selects AI model

**2. Generation Phase:**
- Backend receives request
- Processes chapters sequentially
- Each chapter uses context from previous ones
- Accumulates token usage

**3. Display Phase:**
- Generated content appears in editor
- Token usage displayed
- Cost calculation shown
- Ready for editing

**4. Editing Phase:**
- User can modify any content
- Apply formatting
- Add/remove sections
- Rearrange content

**5. Export Phase:**
- Save to database
- Export as HTML/PDF
- Download locally
- Share with others

### Context Building

**Progressive Learning:**
Each chapter receives:
- List of previous chapter titles
- Implicit connection to build upon
- Continuation of themes
- Progressive difficulty

**Example Flow:**
```
Chapter 1: Basic Greetings
  ↓ (context: basic greetings covered)
Chapter 2: Introducing Yourself
  ↓ (context: greetings + introductions covered)
Chapter 3: Small Talk
  ↓ (context: all above covered)
Chapter 4: Professional Conversations
```

---

## 🛠️ Technical Features

### API Integration

**OpenAI Integration:**
- GPT-4o Mini, GPT-4o, GPT-4 Turbo support
- Streaming responses (future enhancement)
- Token counting with tiktoken
- Error handling and retries

**Anthropic Integration:**
- Claude 3.5 Sonnet support
- Alternative to OpenAI
- Different writing style
- Competitive pricing

### Database

**Storage:**
- User accounts
- Generated materials
- Token usage history
- Material edit history

**Features:**
- SQLite for development
- PostgreSQL-ready for production
- Automatic migrations
- Indexed for performance

### Security

**Authentication:**
- JWT tokens
- Bcrypt password hashing
- Token expiration
- Refresh mechanism

**Authorization:**
- User-specific data access
- Protected endpoints
- Role-based (extensible)
- CORS configuration

---

## 🚀 Performance Features

### Optimization

**Backend:**
- Async/await support (FastAPI)
- Database connection pooling
- Efficient queries
- Caching (future enhancement)

**Frontend:**
- Code splitting
- Lazy loading
- Optimized builds (Vite)
- Minimal bundle size

### Scalability

**Current:**
- Single-user efficient
- Multi-user ready
- SQLite for simplicity

**Production Ready:**
- PostgreSQL support
- Load balancing ready
- Stateless design
- Horizontal scaling possible

---

## 📈 Future Enhancements

### Planned Features

1. **Template Library**: Pre-made material templates
2. **Collaboration**: Share materials with other users
3. **Version Control**: Track material revisions
4. **PDF Direct Export**: Native PDF generation
5. **Images & Media**: Add images to materials
6. **Custom Styling**: User-defined styles and themes
7. **Bulk Generation**: Generate multiple materials at once
8. **Analytics**: More detailed usage statistics
9. **Export to LMS**: Export to Moodle, Canvas, etc.
10. **Multilingual Support**: Generate materials in other languages

---

## 💡 Best Practices

### For Cost Efficiency

1. **Start with GPT-4o Mini** for most materials
2. **Use descriptions wisely**: More context = more tokens
3. **Generate smaller batches**: Test with 2-3 chapters first
4. **Review before exporting**: Avoid regeneration
5. **Track your usage**: Monitor the Token Usage page

### For Content Quality

1. **Provide clear chapter titles**
2. **Add specific descriptions** for better results
3. **Review and edit** generated content
4. **Use appropriate model**: Premium for advanced topics
5. **Build progressively**: Start simple, increase complexity

### For Organization

1. **Use descriptive titles** for easy finding
2. **Export immediately** after generation
3. **Keep backups** of important materials
4. **Delete drafts** to keep dashboard clean
5. **Track costs** regularly

---

## 🎓 Educational Value

### Pedagogy

**Task Design:**
- Progressive difficulty
- Building blocks approach
- Practice-oriented
- Real-world application

**Content Quality:**
- Modern English usage
- Contextual learning
- Comprehensive coverage
- Engaging exercises

**Flexibility:**
- Adaptable to levels
- Customizable content
- Various teaching styles
- Multiple use cases

---

Built for educators, by educators 🎓

