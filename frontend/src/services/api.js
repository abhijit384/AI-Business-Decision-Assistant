import axios from 'axios';

/**
 * FastAPI Backend Base URL.
 * In Vercel, set VITE_API_URL=https://<your-fastapi-backend-url>
 * Local development falls back to http://localhost:8000
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for deep Gemini 3.8 Flash analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Pings the FastAPI health endpoint:
 * GET ${import.meta.env.VITE_API_URL}/api/health
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/api/health', { timeout: 8000 });
    return {
      online: response.status === 200,
      data: response.data,
      error: null,
    };
  } catch (err) {
    return {
      online: false,
      data: null,
      error: `FastAPI backend is unreachable at ${API_BASE_URL}. Verify VITE_API_URL in Vercel settings and ensure FastAPI is running.`,
    };
  }
};

/**
 * Analyzes a business decision through FastAPI:
 * POST ${import.meta.env.VITE_API_URL}/api/analyze-decision
 */
export const analyzeDecision = async (payload) => {
  try {
    const response = await apiClient.post('/api/analyze-decision', {
      decision: payload.decision,
      industry: payload.industry,
      company_size: payload.company_size,
      budget: Number(payload.budget) || 0,
      timeline: payload.timeline,
      risk_tolerance: payload.risk_tolerance,
      additional_context: payload.additional_context || '',
    });

    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    let friendlyMessage = 'An unexpected error occurred while analyzing your business decision.';

    if (!error.response) {
      friendlyMessage = `Cannot reach the FastAPI backend at ${API_BASE_URL}. Ensure your backend service is deployed and VITE_API_URL is configured.`;
    } else if (error.response.status === 400) {
      const detail = error.response.data?.detail;
      friendlyMessage = typeof detail === 'string'
        ? detail
        : 'Please verify that all required decision parameters are filled out accurately.';
    } else if (error.response.status === 500) {
      friendlyMessage = 'The AI reasoning engine encountered a temporary processing condition. Please try again.';
    } else {
      friendlyMessage = error.response.data?.detail || `Server responded with status ${error.response.status}.`;
    }

    return {
      success: false,
      data: null,
      error: friendlyMessage,
    };
  }
};

/**
 * Executive follow-up consultation endpoint:
 * POST ${import.meta.env.VITE_API_URL}/api/chat-followup
 */
export const chatFollowUp = async (payload) => {
  try {
    const response = await apiClient.post('/api/chat-followup', {
      question: payload.question,
      decision: payload.decision || '',
      recommendation: payload.recommendation || '',
      reasoning: payload.reasoning || '',
      history: payload.history || [],
    });

    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    const detail = error.response?.data?.detail;
    return {
      success: false,
      data: null,
      error: typeof detail === 'string' 
        ? detail 
        : `Unable to reach FastAPI follow-up advisor at ${API_BASE_URL}.`,
    };
  }
};

export default apiClient;
