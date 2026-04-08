# 🧠 ArguMate-AI  
### Agentic Adversarial AI Debate System

ArguMate-AI is an **Agentic Adversarial AI Debate System** with a **ChatGPT-like UI** that simulates structured debates between autonomous AI agents. Start a debate on any topic and watch as Alpha (PRO) and Beta (CON) agents argue both sides, followed by fact-checking verification.

---

## ✨ Key Features

### 🎨 Modern UI
- **ChatGPT-like Interface**: Intuitive dark theme matching professional design standards
- **Sidebar Navigation**: Easy access to chat history and quick new chat option
- **Real-time Streaming**: Watch debate messages appear in real-time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🤖 Debate System
- **Alpha Agent (PRO)**: Argues in favor of the topic
- **Beta Agent (CON)**: Argues against the topic
- **Natural Debates**: Agents respond to each other in real-time
- **Continuable Rounds**: Start a debate and continue indefinitely

### 🧪 Fact-Checking
- **Automated Verification**: Each claim is fact-checked using Google Fact Check Tools API
- **Color-Coded Results**:
  - 🟢 **True**: Verified facts
  - 🔴 **False**: Incorrect claims
  - 🟡 **Partially True**: Claims with nuance

### 💾 Persistence
- **Chat History**: All debates saved locally in browser storage
- **Quick Access**: Resume any previous debate from the sidebar
- **Delete Option**: Remove debates from your history

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:5173` to start debating!

---

## 📖 How to Use

1. **Enter Your Topic**: Write the debate topic (e.g., "Should AI replace human workers?")
2. **Add Discussion Points**: List 3-5 key points to explore (one per line)
3. **Start Debate**: Click "Start Debate" to initiate the conversation
4. **Watch the Debate**: See Alpha open with PRO arguments, Beta respond with CON
5. **View Fact Check**: Review which claims are verified as true/false/partial
6. **Continue or New**: Debate more or start a fresh topic

---

## 🧠 Agent Architecture

### Alpha Agent (PRO Debater)
- **Role**: Initiates and argues the positive side
- **Capabilities**:
  - Opening arguments
  - Point-by-point responses
  - Evidence-based claims
  - Memory of previous points

### Beta Agent (CON Debater)
- **Role**: Contradicts and argues the negative side
- **Capabilities**:
  - Counter-arguments
  - Challenging assumptions
  - Alternative perspectives
  - Critical analysis

### Fact-Checker Agent
- **Role**: Verify factual accuracy
- **Sources**: Google Fact Check Tools API
- **Output**: True / False / Partially True verdicts

### Moderator Agent
- **Role**: Manage debate flow
- **Responsibilities**:
  - Turn coordination
  - Point allocation
  - Argument structuring

---

## 🎨 UI Components

### Sidebar
- Chat history with timestamps
- "New Chat" button for fresh debates
- Delete individual debates
- Project links and information

### Chat Area
- Topic header display
- Chronological message stream
- Color-coded agent badges (Alpha: Green, Beta: Red)
- Timestamps for each message

### Debate Messages
- Agent identification badges
- Full message content
- Time stamps
- Visual distinction between agents

### Fact Checker Display
- Claim validation results
- Individual fact-check verdicts
- Visual icons for result types
- Source attribution

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Lucide Icons** - Icon library
- **Axios** - HTTP client
- **CSS** - Modern styling with CSS variables

### Backend
- **FastAPI** - API framework
- **Python 3.8+** - Programming language
- **Uvicorn** - ASGI server

---

## 📁 Project Structure

```
ArguMate-AI/
├── frontend/              # React + TypeScript UI
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── App.tsx       # Main application
│   │   └── index.css     # Global styles
│   └── package.json
└── backend/              # FastAPI server
    ├── app/
    │   ├── agents/       # Debate and fact-checking agents
    │   ├── api/          # REST endpoints
    │   ├── models/       # Data models
    │   └── main.py       # FastAPI app
    └── requirements.txt
```

---

## 🔌 API Endpoints

### Start Debate
```
POST /api/debate/start
{
  "topic": "Should AI replace human workers?",
  "discussion_points": ["Employment", "Economics", "Ethics"]
}
```

### Continue Debate
```
POST /api/debate/continue
{
  "topic": "Should AI replace human workers?",
  "chat_history": [...]
}
```

---

## 🎨 Design Philosophy

- **Dark Theme**: Easy on the eyes with professional appearance
- **ChatGPT Inspired**: Familiar interface users already know
- **Color Coding**: Green (#10a37f) for PRO, Red for CON, Blue for Facts
- **Responsive**: Works on all screen sizes
- **Accessibility**: Clear typography and high contrast

---

## 🔄 Debate Flow

```
1. User Input
   ↓
2. Alpha Opens (PRO arguments)
   ↓
3. Beta Responds (CON arguments)
   ↓
4. Fact Checker Verifies Both
   ↓
5. User Can Continue → Loop back to step 2
   ↓
6. Or Start New → Return to step 1
```

---

## 📝 Commit Standards

We follow Conventional Commits:
- `feat` – New feature
- `fix` – Bug fixes
- `docs` – Documentation changes
- `style` – Formatting changes
- `perf` – Performance improvements
- `test` – Test additions

Example: `feat: Add real-time message streaming for debates`

---

## 🚀 Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/ folder ready for deployment
```

### Backend Deployment
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 📖 Docs

For detailed setup and configuration, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Commit following conventional commits
5. Push to your branch
6. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Athul Jestin**
- GitHub: [@athul-jestin](https://github.com/athul-jestin)
- Portfolio: [athuljestin.netlify.app](https://athuljestin.netlify.app)
- Email: athuljestin02@gmail.com

---

## 🙏 Acknowledgments

- FastAPI team for the incredible framework
- React team for the UI library
- Google Fact Check Tools API
- Inspired by ChatGPT's interface design

---

## 📊 Project Status

✅ Frontend UI Complete  
✅ Backend API Structure Ready  
✅ Component System Implemented  
⏳ Database Integration (upcoming)  
⏳ User Authentication (upcoming)  
⏳ Advanced Fact-Checking (upcoming)  

---

## 💬 Support

Found a bug or have suggestions? Open an [Issue](https://github.com/athul-jestin/ArguMate-AI/issues) on GitHub!
