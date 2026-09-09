import React from 'react';
import { Bot, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 dark:bg-[#050B18] text-slate-300 border-t border-navy-700 dark:border-navy-800 py-10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Bot className="w-5 h-5 text-blue-400" />
              <span>AI Business Decision Assistant</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Enterprise strategic evaluation platform engineered for high-stakes business choices. Powered by decoupled FastAPI architecture and Google Gemini 3.8 Flash.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero client-side API key exposure. Fully decoupled backend.</span>
            </div>
          </div>

          {/* Architecture Stack */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Frontend: React + Vite + Tailwind (Port 5173)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Backend: FastAPI + Uvicorn (Port 8000)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                AI Model: Google Gemini 3.8 Flash
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                SDK: Official google-genai
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">System Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Decoupled REST API Architecture
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Backend Health Verification
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-slate-400">Hackathon Round 1 Submission</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 AI Business Decision Assistant. Built for Hackathon Demonstration.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered with strict separation of frontend and backend concerns.
          </p>
        </div>
      </div>
    </footer>
  );
}
