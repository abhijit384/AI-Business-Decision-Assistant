/**
 * Vercel Serverless Function: /api/chat-followup
 * Handles executive follow-up inquiries regarding strategic decisions.
 * GEMINI_API_KEY is read strictly server-side and never leaked.
 */
import { GoogleGenAI } from '@google/genai';

function generateFallbackAnswer(question, decision, recommendation) {
  return (
    `Regarding "${question || 'your strategic question'}" in the context of: "${decision || recommendation || 'the evaluated initiative'}":\n\n` +
    `1. **Execution Prioritization**: Focus on milestone-gated deployment within the first 30 days to limit downside exposure.\n` +
    `2. **Resource Allocation**: Protect core operating margin by reserving at least 35% of allocated capital until early customer retention signals are positive.\n` +
    `3. **Key Metric to Monitor**: Track weekly customer retention and unit payback period as your primary go/no-go indicators before expanding scale.`
  );
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed. Use POST.' });
  }

  const {
    question = '',
    decision = '',
    recommendation = '',
    reasoning = '',
    history = []
  } = req.body || {};

  const queryText = (question || '').trim();
  if (!queryText) {
    return res.status(400).json({ detail: 'Follow-up question cannot be empty.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];

  if (!apiKey) {
    console.warn('[Vercel API] GEMINI_API_KEY not configured. Utilizing resilient follow-up response.');
    return res.status(200).json({
      answer: generateFallbackAnswer(queryText, decision, recommendation),
      model_used: 'fallback-advisor',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = (
      "You are an executive strategic advisor providing high-impact, concise answers to C-level follow-up questions. " +
      "Be decisive, commercially astute, analytical, and structured (use bullet points and clear risk mitigations)."
    );

    const prompt = `
=== STRATEGIC CONTEXT ===
• Evaluated Decision: ${decision || 'Not specified'}
• AI Verdict / Recommendation: ${recommendation || 'Not specified'}
• Core Reasoning: ${reasoning || 'Not specified'}

=== EXECUTIVE FOLLOW-UP QUESTION ===
"${queryText}"

Provide a crisp, rigorous C-level strategic answer with practical implementation guidance.
`;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.4,
          },
        });

        const text = response.text || '';
        if (text) {
          return res.status(200).json({
            answer: text.trim(),
            model_used: model,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn(`[Vercel API] Chat model ${model} failed, trying fallback:`, err.message || err);
      }
    }

    return res.status(200).json({
      answer: generateFallbackAnswer(queryText, decision, recommendation),
      model_used: 'fallback-advisor',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Vercel API] Error in chat-followup:', error);
    return res.status(200).json({
      answer: generateFallbackAnswer(queryText, decision, recommendation),
      model_used: 'fallback-advisor',
      timestamp: new Date().toISOString(),
    });
  }
}
