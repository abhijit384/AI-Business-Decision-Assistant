import axios from 'axios';

/**
 * Resolves the API base URL.
 * In production (such as Vercel deployment), uses relative paths ('') so that
 * requests route directly to the same deployment's own API routes:
 *   /api/health
 *   /api/analyze-decision
 *   /api/chat-followup
 * Never falls back to http://localhost:8000 in production.
 */
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }
  // Always use relative URL in production or deployed environments
  if (import.meta.env.PROD) {
    return '';
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';
  }
  // Local development default: relative path for unified serverless, or fallback
  return '';
};

const API_BASE_URL = resolveApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for deep AI reasoning
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Pings the backend health endpoint (/api/health)
 * Uses relative URL in production so it pings the current deployment's own API.
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/api/health', { timeout: 6000 });
    return {
      online: response.status === 200,
      data: response.data,
      error: null,
    };
  } catch (err) {
    return {
      online: false,
      data: null,
      error: 'Backend API is currently offline or unreachable.',
    };
  }
};

/**
 * Analyzes a business decision using the application's API route (/api/analyze-decision)
 * @param {Object} payload Decision input parameters
 * @returns {Promise<Object>} Analysis result
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
      friendlyMessage = 'Cannot connect to the backend API. Please ensure the application deployment is active.';
    } else if (error.response.status === 400) {
      const detail = error.response.data?.detail;
      friendlyMessage = typeof detail === 'string'
        ? detail
        : 'Please verify that all required decision parameters are filled out accurately.';
    } else if (error.response.status === 500) {
      friendlyMessage = 'The AI reasoning engine encountered a temporary condition. Please try again.';
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
 * Executive follow-up consultation endpoint (/api/chat-followup)
 * Allows users to ask follow-up questions regarding an evaluated decision.
 * @param {Object} payload { question, decision, recommendation, reasoning, history }
 * @returns {Promise<Object>} Follow-up strategic response
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
      error: typeof detail === 'string' ? detail : 'Unable to generate follow-up answer at this time.',
    };
  }
};

export default apiClient;
