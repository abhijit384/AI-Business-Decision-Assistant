import axios from 'axios';

// Resolve API base URL from environment variable, falling back to local port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for deep AI reasoning
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Pings the backend health endpoint
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/api/health', { timeout: 4000 });
    return {
      online: response.status === 200,
      data: response.data,
      error: null,
    };
  } catch (err) {
    return {
      online: false,
      data: null,
      error: 'Backend is offline or unreachable at ' + API_BASE_URL,
    };
  }
};

/**
 * Analyzes a business decision through the decoupled FastAPI backend
 * @param {Object} payload Decision input payload
 * @returns {Promise<Object>} Analyzed decision response
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
      // Network failure or backend server not running
      friendlyMessage = `Cannot reach the backend server at ${API_BASE_URL}. Please ensure the FastAPI backend is running on port 8000.`;
    } else if (error.response.status === 400) {
      const detail = error.response.data?.detail;
      friendlyMessage = typeof detail === 'string' 
        ? detail 
        : 'Please verify that all required decision parameters are filled out accurately.';
    } else if (error.response.status === 500) {
      friendlyMessage = 'The AI analysis engine encountered a temporary processing condition. Please try again or refine your input.';
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

export default apiClient;
