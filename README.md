# 🤖 AI Interview Agent

An interactive, AI-powered mock interviewer application designed to evaluate candidate responses, provide numerical scoring out of 10, generate actionable strengths & improvement feedback, and issue a final hiring verdict (**HIRE**, **MAYBE**, or **REJECT**).

Built using **React (Vite)**, **Tailwind CSS v3**, **Node.js / Express**, and **Google Gemini AI API** (`gemini-1.5-flash`).

---

## ✨ Features

- **Role & Difficulty Selection**: Choose between 5 targeted roles (*Frontend Developer, Backend Developer, Fullstack Engineer, Product Manager, Data Analyst*) across experience levels (*Junior, Mid-Level, Senior*).
- **AI Question Engine**: Dynamically generates role-tailored technical questions using Google Gemini AI, backed by a curated offline fallback question bank.
- **Real-Time Answer Input**: Interactive response textarea with live character counter, answer tips/hints, and navigation controls.
- **Empty Answer Validation**: Prevents empty or incomplete submissions and provides actionable feedback on answer length.
- **AI Answer Evaluation**: Meticulously grades responses based on technical depth, key concepts, and practical understanding.
- **Final Hiring Verdict**: Calculates an overall score out of 10 and issues an executive hiring verdict (**HIRE**, **MAYBE**, **REJECT**) with detailed per-question breakdown.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS v3 + Lucide Icons
- **Backend**: Node.js + Express + `cors` + `dotenv`
- **AI Integration**: `@google/generative-ai` (`gemini-1.5-flash`)
- **Version Control**: Git

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone & Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start the backend server:
```bash
npm run dev
```
*(Server listens on `http://127.0.0.1:5000`)*

### 2. Set Up Frontend

```bash
cd ../frontend
npm install
npm run dev
```
*(Dev server runs on `http://localhost:3000`)*

---

## 📁 Repository Structure

```
ai_agent/
├── backend/
│   ├── server.js          # Express server with /api/health, /api/questions, & /api/evaluate
│   ├── package.json       # Backend dependencies (@google/generative-ai, express, cors)
│   └── .env.example       # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoleSelection.jsx     # Role, difficulty & question count selector
│   │   │   ├── QuestionCard.jsx      # Question slider, hints & response input form
│   │   │   └── ResultsDashboard.jsx  # Final verdict, score badge & detailed feedback
│   │   ├── App.jsx                   # State manager & step navigation
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Tailwind directives & typography
│   ├── tailwind.config.js # Tailwind CSS v3 configuration
│   └── vite.config.js     # Vite configuration with API proxy to port 5000
└── README.md
```

---

## 📜 Commit History

```
* ca0d0a4 - feat: add final verdict (Hire/Reject/Maybe)
* fd359a7 - fix: handle empty input edge case in answer form
* 40d7f4d - style: improve layout spacing and button styles
* afa87ab - feat: add final performance dashboard and detailed question evaluation card
* d52a05c - feat: implement AI answer evaluation endpoint and score engine
* 908f494 - feat: add user answer input form and session answer tracking
* 3f1c57c - feat: implement role-based question engine and slider UI
* fd0ddb6 - feat: add role selection and interview settings UI
* cb86c0c - feat: initialize Vite React with Tailwind CSS v3 and Express backend
```
