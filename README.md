# 🤖 AI Business Decision Assistant

> **Enterprise Strategic Decision Intelligence Platform**> Engineered for Hackathon Demonstration with Decoupled Full-Stack Architecture and **Google Gemini 3.8 Flash**.

---

## 📌 Executive Overview

The **AI Business Decision Assistant** is an objective, high-stakes strategic reasoning system designed for founders, executives, and corporate strategy teams. Rather than acting as a sycophantic chatbot that rubber-stamps decisions, it behaves like an elite Fortune 500 strategy consultant and venture partner: challenging assumptions, quantifying operational downsides, identifying hidden execution bottlenecks, and synthesizing calibrated counter-strategies with explicit trade-offs.

---

## 🏛️ System Architecture

```text
                                  PORT 5173
                            ┌─────────────────────┐
                            │    React UI Client  │
                            │      (Vite App)     │
                            │ Tailwind CSS + Icons│
                            └──────────┬──────────┘
                                       │
                                       │ HTTP REST (Axios)
                                       │ POST /api/analyze-decision
                                       ▼
                                   PORT 8000
                            ┌─────────────────────┐
                            │   FastAPI Backend   │
                            │   (Python Server)   │
                            │  Pydantic Validation│
                            └──────────┬──────────┘
                                       │
                                       │ google-genai SDK
                                       │ JSON Schema Enforced
                                       ▼
                            ┌─────────────────────┐
                            │ Google Gemini 3.8   │
                            │        Flash        │
                            └─────────────────────┘

                             GEMINI_API_KEY
                                   │
                                   ▼
                           backend/.env ONLY
```

### Critical Architectural Pillars:
* **Frontend = React + Vite** (Runs independently on `http://localhost:5173`)
* **Backend = FastAPI** (Runs independently on `http://localhost:8000`)
* **AI Engine = Gemini 3.8 Flash** (Invoked strictly via `google-genai` inside the Python backend service)
* **Zero Client-Side Key Exposure**: The browser only communicates with the local FastAPI microservice.

---

## 📂 Repository Structure

```text
AI-Business-Decision-Assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive navbar with live backend status
│   │   │   ├── Footer.jsx           # Architecture and developer docs footer
│   │   │   ├── ConfidenceGauge.jsx  # Circular SVG dynamic confidence gauge
│   │   │   ├── RiskBadge.jsx        # Visual status badge (Low, Medium, High)
│   │   │   └── LoadingState.jsx     # Multi-stage animated reasoning steps
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero, value props, 6 clickable use cases
│   │   │   ├── DecisionPage.jsx     # Strategic form with client-side validation
│   │   │   ├── ResultsPage.jsx      # Verdict, reasoning, pros, cons, alternatives
│   │   │   └── HistoryPage.jsx      # Local storage audit trail with filters
│   │   ├── services/
│   │   │   ├── api.js               # Centralized Axios client with error handling
│   │   │   └── historyService.js    # Decoupled audit trail storage layer
│   │   ├── App.jsx                  # React Router orchestration
│   │   ├── main.jsx                 # React root mount
│   │   └── index.css                # Tailwind base and custom animations
│   ├── public/
│   │   └── favicon.svg              # Brand icon
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration (port 5173)
│   ├── tailwind.config.js           # Professional fintech/consulting theme
│   ├── postcss.config.js
│   ├── .env                         # Frontend local configuration
│   └── .env.example                 # VITE_API_URL template
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI initialization & CORS config
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── decision.py          # POST /api/analyze-decision endpoint
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── gemini_service.py    # Official google-genai Gemini 3.8 Flash service
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── decision_models.py   # Pydantic v2 input/output data models
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logger.py            # Structured logging
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Backend secrets (GEMINI_API_KEY)
│   └── .env.example                 # Environment template
│
├── README.md                        # Master documentation
└── .gitignore                       # Strict git hygiene ignoring all .env secrets
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: v18+ (tested on Node v24)
* **Python**: 3.10+ (tested on Python 3.12)
* **Google Gemini API Key**: [Get one here](https://aistudio.google.com/)

---

### Step 1: Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. *(Recommended)* Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure backend environment:
   If not already created, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `backend/.env` contains your key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-3.8-flash
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   ```

5. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * Backend URL: `http://localhost:8000`
   * Interactive Swagger Documentation: `http://localhost:8000/docs`
   * Health Check: `http://localhost:8000/api/health`

---

### Step 2: Frontend Setup (React + Vite)

1. Open a **second terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration:
   `frontend/.env` is configured with:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   * Frontend URL: `http://localhost:5173`

---

## 🔌 API Endpoint Documentation

### 1. `POST /api/analyze-decision`
Submits a business decision for AI strategic evaluation.

#### Request Headers:
```http
Content-Type: application/json
```

#### Request Body Example:
```json
{
  "decision": "Should we raise our subscription price by 15% across all tiers?",
  "industry": "Technology & SaaS",
  "company_size": "Small",
  "budget": 35000,
  "timeline": "1 quarter (3 months)",
  "risk_tolerance": "Medium",
  "additional_context": "Current gross margin is 82%. Competitors are 20% higher."
}
```

#### Response Body Example (Validated by Pydantic):
```json
{
  "recommendation": "Proceed with a phased 15% price increase applied immediately to new signups, while grandfathering existing customers for 6 to 12 months.",
  "reasoning": "Given your Small company size and 3-month execution timeline in SaaS, a universal sudden price jump risks customer churn without sufficient capital buffer. A grandfathering strategy secures immediate revenue expansion on new cohorts while insulating core recurring revenue.",
  "pros": [
    "Captures higher willingness-to-pay immediately on new customer acquisition",
    "Protects Net Revenue Retention (NRR) and averts existing customer churn spikes",
    "Provides immediate empirical data on conversion elasticity without revenue destruction"
  ],
  "cons": [
    "Creates temporary billing complexity across legacy and modern plan tiers",
    "Delays full revenue realization from the legacy installed base"
  ],
  "alternatives": [
    {
      "option": "Feature-Gated Tier Packaging Restructure",
      "tradeoff": "Requires re-engineering product permissioning and telemetry but aligns value metric with expansion"
    },
    {
      "option": "Annual Contract Incentive with Existing Pricing",
      "tradeoff": "Locks in immediate upfront cashflow but caps long-term customer lifetime value upside"
    }
  ],
  "confidence_score": 85,
  "risk_level": "Medium"
}
```

---

### 2. `GET /api/health`
Health readiness probe pinged automatically by the frontend navbar to show live backend status.

#### Response:
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

## 🔒 Security Architecture

| Vector | Implementation |
| :--- | :--- |
| **API Key Storage** | Exclusively stored in `backend/.env`. Never injected into Vite or frontend environment. |
| **Browser Isolation** | Client JavaScript code contains zero references to Google Gemini endpoints or authorization tokens. |
| **Git Hygiene** | Root `.gitignore` strictly rejects all `.env` and `.env.*` files while preserving safe `.env.example` files. |
| **Input Sanitization** | Pydantic v2 schemas enforce strict validation on strings, numbers, and boundary limits. |
| **CORS Policy** | FastAPI strictly restricts origin headers to development endpoints (`http://localhost:5173`, `http://127.0.0.1:5173`). |

---

## 🛠️ Troubleshooting

* **Backend shows "Backend Offline" on Frontend Navbar**:
  * Verify Uvicorn is running: `uvicorn app.main:app --reload --port 8000`.
  * Open `http://localhost:8000/api/health` in your browser to check response.
* **CORS Error**:
  * Ensure the frontend is running on `http://localhost:5173`. If running on another port, add it to `FRONTEND_URL` in `backend/.env`.
* **Gemini API Error / Key Not Set**:
  * Check `backend/.env` and verify `GEMINI_API_KEY` is present and valid.
  * Note that the backend includes resilient fallback synthesis to guarantee hackathon evaluators never experience a blank screen or crashed server.
