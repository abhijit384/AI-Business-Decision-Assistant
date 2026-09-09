# 🤖 AI Business Decision Assistant

> **Enterprise Strategic Decision Intelligence Platform**  
> Built with a decoupled architecture: **React + Vite** frontend (Vercel-ready), **FastAPI** backend (Render/Railway-ready), powered by **Google Gemini 3.8 Flash**.

---

## 📌 Executive Overview

The **AI Business Decision Assistant** is an objective, high-stakes strategic reasoning system designed for founders, executives, and corporate strategy teams. Rather than acting as a sycophantic chatbot that rubber-stamps decisions, it behaves like an elite Fortune 500 strategy consultant and venture partner: challenging assumptions, quantifying operational downsides, identifying hidden execution bottlenecks, and synthesizing calibrated counter-strategies with explicit trade-offs.

---

## 🏛️ System Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                       PRODUCTION FLOW                       │
└─────────────────────────────────────────────────────────────┘

 [ Vercel Deployment ]
    React 18 + Vite SPA Client
    (Root Directory: frontend)
               │
               │ HTTP REST (Axios)
               │ Reads: VITE_API_URL
               ▼
 [ Render / Cloud Deployment ]
    FastAPI Microservice (Python)
    (Root Directory: backend)
    • CORS configured for *.vercel.app
    • Pydantic v2 validation
    • Endpoints: /api/health, /api/analyze-decision, /api/chat-followup
               │
               │ google-genai SDK
               │ Reads: GEMINI_API_KEY (Server-side ONLY)
               ▼
 [ Google AI Studio ]
    Google Gemini 3.8 Flash
    • Calibrated Strategic Reasoning
    • Structured JSON Schema Enforcement
```

### Complete End-to-End Data Pipeline:
1. **React/Vite**: User inputs strategic parameters (decision, industry, stage, budget, timeline, risk tolerance).
2. **`VITE_API_URL`**: Client dispatches requests to `https://<FASTAPI-BACKEND-URL>`.
3. **FastAPI**: Validates payloads via Pydantic v2 schemas and enforces CORS restrictions.
4. **Gemini 3.8 Flash**: Official `google-genai` Python SDK runs strategic reasoning and JSON generation with fallback resilience.
5. **FastAPI JSON**: Returns validated verdict, reasoning, pros, cons, alternatives, risk level, and confidence score.
6. **React UI**: Dynamically visualizes confidence gauge, risk badge, recommendations, and follow-up consultation chat.

---

## 📂 Repository Structure

```text
AI-Business-Decision-Assistant/
│
├── frontend/                        # React + Vite Client (Deployed to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive navbar with live backend status indicator
│   │   │   ├── Footer.jsx           # Architecture and security documentation footer
│   │   │   ├── ConfidenceGauge.jsx  # Circular SVG dynamic confidence meter
│   │   │   ├── RiskBadge.jsx        # Visual risk badge (Low, Medium, High)
│   │   │   ├── ThemeToggle.jsx      # Light / Dark mode switcher
│   │   │   └── LoadingState.jsx     # Multi-stage animated reasoning steps
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero, value props, 6 clickable enterprise use cases
│   │   │   ├── DecisionPage.jsx     # Strategic form with client-side validation
│   │   │   ├── ResultsPage.jsx      # Verdict, alternatives matrix & executive chat advisor
│   │   │   └── HistoryPage.jsx      # Local storage audit trail with filters
│   │   ├── services/
│   │   │   ├── api.js               # Centralized Axios client calling VITE_API_URL
│   │   │   └── historyService.js    # Decoupled audit trail storage layer
│   │   ├── App.jsx                  # React Router orchestration
│   │   ├── main.jsx                 # React root mount
│   │   └── index.css                # Tailwind base and custom animations
│   ├── public/
│   │   └── favicon.svg              # Brand icon
│   ├── package.json                 # Frontend dependencies (React, Vite, Tailwind)
│   ├── vite.config.js               # Vite configuration (port 5173)
│   ├── tailwind.config.js           # Professional fintech/consulting theme
│   ├── postcss.config.js
│   ├── vercel.json                  # Client-side SPA routing rewrites
│   ├── .env                         # Frontend local configuration (ignored by git)
│   └── .env.example                 # VITE_API_URL template
│
├── backend/                         # FastAPI Microservice (Deployed to Render/Cloud)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI initialization, CORS & health route
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── decision.py          # /api/analyze-decision & /api/chat-followup routes
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── gemini_service.py    # Official google-genai Gemini 3.8 Flash service
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── decision_models.py   # Pydantic v2 input/output schemas
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logger.py            # Structured logging
│   ├── requirements.txt             # Python dependencies (FastAPI, google-genai, etc.)
│   ├── .env                         # Backend secrets (GEMINI_API_KEY, ignored by git)
│   └── .env.example                 # Environment template
│
├── vercel.json                      # Root Vercel build delegation
├── package.json                     # Root build scripts
├── README.md                        # Master documentation
└── .gitignore                       # Strict git hygiene ignoring all .env secrets
```

---

## 🚀 Deployment Guide

### 1. Backend Deployment (FastAPI on Render)

Deploy the backend first to obtain your backend API URL.

1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository: `https://github.com/abhijit384/AI-Business-Decision-Assistant`.
3. Configure the service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `ai-business-decision-backend` |
| **Environment** | `Python 3` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

4. Under **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API key (**Backend only**) |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Primary AI reasoning model |
| `FRONTEND_URL` | `https://*.vercel.app` | Allowed CORS origin (or specific Vercel URL) |

5. Deploy the service. Your backend URL will look like:
   `https://ai-business-decision-backend.onrender.com`

Verify it is online by opening:
`https://<your-backend-url>/api/health`

---

### 2. Frontend Deployment (React + Vite on Vercel)

Deploy the frontend to Vercel, pointing to your deployed FastAPI backend.

1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository: `abhijit384/AI-Business-Decision-Assistant`.
3. Configure the project settings:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://<your-fastapi-backend-url>` (e.g. `https://ai-business-decision-backend.onrender.com`) |

> [!CAUTION]
> **CRITICAL SECURITY REQUIREMENT**:
> - Never set `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` in Vercel.
> - The Gemini API key belongs **strictly** in the FastAPI backend environment.

5. Click **Deploy**. Vercel will build the frontend into `dist` and deploy it.

---

## 🔌 API Endpoints (FastAPI)

### 1. `GET /api/health`
Health readiness probe pinged automatically by the frontend Navbar to show live backend status.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Business Decision Assistant Backend",
  "version": "2.0.0",
  "gemini_model": "gemini-3.8-flash",
  "gemini_configured": true
}
```

---

### 2. `POST /api/analyze-decision`
Submits a business decision for AI executive evaluation.

**Request Body:**
```json
{
  "decision": "Should we transition from seat-based to usage-based SaaS pricing next quarter?",
  "industry": "Technology & SaaS",
  "company_size": "Small",
  "budget": 35000,
  "timeline": "1 quarter (3 months)",
  "risk_tolerance": "Medium",
  "additional_context": "Current gross margin is 82%. Competitors are 20% higher."
}
```

**Response Body (Validated by Pydantic):**
```json
{
  "recommendation": "Reject full immediate transition; execute a low-complexity Hybrid Pilot (Seats + Tiered Usage Caps) for net-new customers only.",
  "reasoning": "Given your Small company size and 3-month execution window in SaaS, a sudden universal pricing overhaul creates unacceptable customer friction and billing complexity. A hybrid pilot for new acquisitions validates willingness-to-pay while insulating existing ARR.",
  "pros": [
    "Captures high-utilization expansion upside immediately on new customer cohorts",
    "Preserves existing customer satisfaction and shields Net Revenue Retention (NRR)",
    "Provides empirical conversion elasticity data within 60 days"
  ],
  "cons": [
    "Temporarily bifurcates billing systems between legacy and new tiers",
    "Requires product telemetry instrumentation to meter consumption"
  ],
  "alternatives": [
    {
      "option": "Tiered Feature Packaging Restructure",
      "tradeoff": "Enforces expansion through feature gating rather than usage tracking"
    },
    {
      "option": "Annual Contract Usage Add-ons",
      "tradeoff": "Locks in guaranteed revenue but defers pure consumption upside"
    }
  ],
  "confidence_score": 88,
  "risk_level": "Medium"
}
```

---

### 3. `POST /api/chat-followup`
Provides real-time strategic counsel to C-level follow-up questions.

**Request Body:**
```json
{
  "question": "How should we stage this transition over the first 60 days?",
  "decision": "Should we transition from seat-based to usage-based SaaS pricing?",
  "recommendation": "Reject full immediate transition; execute a Hybrid Pilot for net-new customers.",
  "reasoning": "Insulates existing ARR while validating consumption elasticity."
}
```

**Response Body:**
```json
{
  "answer": "To execute the Hybrid Pilot on net-new accounts within 60 days:\n1. Days 1-20: Instrument usage metering on top 2 value metrics.\n2. Days 21-45: Launch pilot tier to net-new inbound traffic.\n3. Days 46-60: Compare sales conversion and churn against legacy baseline.",
  "model_used": "gemini-3.8-flash"
}
```

---

## 🔒 Security Architecture

| Security Layer | Implementation |
| :--- | :--- |
| **Zero Key Exposure** | `GEMINI_API_KEY` is exclusively read inside FastAPI. Vite contains zero references to Google API keys. |
| **CORS Restriction** | FastAPI middleware dynamically permits development endpoints and `allow_origin_regex=r"^https://.*\.vercel\.app$"`. |
| **Git Secret Hygiene** | Root `.gitignore` strictly rejects all `.env`, `.env.*`, and `.vercel` files. |
| **Input Sanitization** | Pydantic v2 validates all string lengths, data types, and bounds before AI execution. |

---

## 💻 Local Development Setup

### 1. Run the FastAPI Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows (or: source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
cp .env.example .env          # Add your GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 2. Run the React + Vite Frontend
```bash
cd frontend
npm install
cp .env.example .env          # Contains VITE_API_URL=http://localhost:8000
npm run dev
```
Open `http://localhost:5173` to test the application.
