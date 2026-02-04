# 🧠 ArguMate-AI  
### Agentic Adversarial AI Debate System

ArguMate-AI is an **Agentic Adversarial AI Debate System** built using **FastAPI** that simulates structured debates between autonomous AI agents.  
The system features opposing debaters, a fact-checking agent, and a moderator agent — all working together to generate balanced, informative, and verifiable debates on any given topic.

---

## 🚀 Key Features

- 🤖 **Agentic Debaters**
  - Two autonomous AI agents (PRO & CON)
  - Generate arguments, rebuttals, and counterpoints
  - Maintain memory of previous statements

- 🧪 **Fact-Checker Agent**
  - Verifies claims using Google Fact Check Tools API
  - Classifies statements as:
    - `True`
    - `False`
    - `Partially true`

- 🎤 **Moderator Agent**
  - Controls debate flow
  - Manages turns and debate rounds
  - Ensures structured interaction between agents

- ⚙️ **FastAPI Backend**
  - REST-based API architecture
  - Interactive Swagger UI
  - Frontend-agnostic design

---

## 🧠 Agent Overview

### 1️⃣ Debater Agent
- Role: Argue **for** or **against** the topic
- Capabilities:
  - Argument generation
  - Context awareness
  - Memory-based responses

### 2️⃣ Fact-Checker Agent
- Role: Verify factual accuracy
- Uses: Google Fact Check Tools API
- Output:
  - `True`
  - `False`
  - `Partially true`

### 3️⃣ Moderator Agent
- Role: Facilitate debate
- Responsibilities:
  - Turn management
  - Debate flow control
  - Result aggregation

---

## Commit Standard

The conventional commit message style is another way you can level up your commit messages. The conventional commits structure involves starting your commit message with a specified commit type. Commit types include:
- `feat` – feature
- `fix` – bug fixes
- `docs` – changes to the documentation like README
- `style` – style or formatting change
- `perf` – improves code performance
- `test` – test a feature