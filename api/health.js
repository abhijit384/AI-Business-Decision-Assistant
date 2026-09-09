/**
 * Health check endpoint for Vercel deployment.
 * Verifies that the serverless API is online, reports the active Gemini model,
 * and checks server-side GEMINI_API_KEY configuration without exposing the key.
 */
export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  return res.status(200).json({
    status: 'healthy',
    service: 'AI Business Decision Assistant API',
    version: '2.0.0',
    gemini_model: model,
    gemini_configured: Boolean(apiKey && apiKey.trim().length > 0),
    deployment: 'Vercel Serverless (Unified)',
  });
}
