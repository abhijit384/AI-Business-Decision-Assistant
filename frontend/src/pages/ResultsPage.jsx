import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Printer, 
  Copy, Check, Sparkles, Building2, Briefcase, DollarSign, Clock, 
  RefreshCw, HelpCircle, Layers, ArrowLeft, Send, Bot, MessageSquare, Loader2
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import ConfidenceGauge from '../components/ConfidenceGauge';
import { historyService } from '../services/historyService';
import { chatFollowUp } from '../services/api';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Retrieve state or fallback to the latest saved item in history
  let analysis = location.state?.result;
  let input = location.state?.input;

  if (!analysis) {
    const recent = historyService.getAll()[0];
    if (recent) {
      analysis = recent.result;
      input = recent.input;
    }
  }

  // If still no analysis, show clean prompt to analyze
  if (!analysis) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Analysis Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Please provide a strategic business decision to generate a real-time recommendation powered by Gemini 3.8 Flash.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Strategic Analysis</span>
        </Link>
      </div>
    );
  }

  const handleCopySummary = () => {
    const summary = `
AI BUSINESS DECISION ANALYSIS
Decision: ${input?.decision || 'N/A'}
Recommendation: ${analysis.recommendation}
Confidence: ${analysis.confidence_score}% | Risk Level: ${analysis.risk_level}

Reasoning:
${analysis.reasoning}

Pros:
${(analysis.pros || []).map((p) => `- ${p}`).join('\n')}

Cons:
${(analysis.cons || []).map((c) => `- ${c}`).join('\n')}

Alternatives:
${(analysis.alternatives || []).map((a) => `- Option: ${a.option}\n  Trade-off: ${a.tradeoff}`).join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const budgetDisplay = input?.budget && Number(input.budget) > 0 
    ? `$${Number(input.budget).toLocaleString()}` 
    : 'Not specified';

  // Executive Follow-up Consultation State
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState([]);
  const [chatError, setChatError] = useState(null);

  const handleSendFollowUp = async (qText) => {
    const questionToSend = (typeof qText === 'string' ? qText : followUpQuestion).trim();
    if (!questionToSend || isAsking) return;

    setIsAsking(true);
    setChatError(null);
    setFollowUpQuestion('');

    const userMsg = { sender: 'user', text: questionToSend };
    setFollowUpHistory((prev) => [...prev, userMsg]);

    const res = await chatFollowUp({
      question: questionToSend,
      decision: input?.decision,
      recommendation: analysis?.recommendation,
      reasoning: analysis?.reasoning,
      history: followUpHistory,
    });

    if (res.success && res.data) {
      setFollowUpHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer || 'Consultation response generated.',
          model: res.data.model_used || 'gemini-3.8-flash',
        },
      ]);
    } else {
      setChatError(res.error || 'Failed to generate answer. Please try again.');
    }
    setIsAsking(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-700">
        <div className="flex items-center gap-3">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Decision</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            Executive Synthesis
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            title="Copy strategic summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Brief'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Decision Context Header Summary */}
      {input && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Evaluated Business Choice</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Model: Gemini 3.8 Flash</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            "{input.decision}"
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-navy-700 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">Industry:</strong> {input.industry}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">Stage:</strong> {input.company_size}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">Budget:</strong> {budgetDisplay}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">Timeline:</strong> {input.timeline}
            </span>
          </div>
        </div>
      )}

      {/* Primary Highlighted AI Recommendation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Primary Strategic Verdict</span>
            </div>
            <div className="flex items-center gap-3">
              <RiskBadge level={analysis.risk_level} size="md" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {analysis.recommendation}
          </h1>
        </div>

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Key Metrics: Confidence Gauge & Risk Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Confidence Gauge Card */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-card flex items-center justify-between">
          <ConfidenceGauge score={analysis.confidence_score} />
        </div>

        {/* Risk Assessment Card */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-card space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Assessed Risk Posture</span>
          <div className="pt-1">
            <RiskBadge level={analysis.risk_level} size="lg" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
            {analysis.risk_level === 'Low'
              ? 'Minimal downside exposure; preserves existing capital and customer relationships.'
              : analysis.risk_level === 'High'
              ? 'Substantial capital or market volatility; requires milestone triggers.'
              : 'Balanced risk-adjusted profile with manageable execution trade-offs.'}
          </p>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-navy-800 dark:to-blue-950/40 rounded-2xl border border-blue-100 dark:border-navy-700 p-6 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Need another evaluation?</h4>
            <p className="text-xs text-blue-700/80 dark:text-slate-400 mt-1 leading-relaxed">
              Test alternative pricing, team sizing, or expansion horizons.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Analyze Another Decision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Detailed Analytical Reasoning Card */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 sm:p-8 shadow-card space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Strategic Justification & Market Mechanics</span>
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
          {analysis.reasoning}
        </p>
      </div>

      {/* Pros & Cons Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros Card */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Strategic Upsides & Opportunities</span>
          </div>

          <ul className="space-y-3">
            {(analysis.pros || []).map((pro, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons Card */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-rose-100 dark:border-rose-900/40 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Critical Risks & Operational Bottlenecks</span>
          </div>

          <ul className="space-y-3">
            {(analysis.cons || []).map((con, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Counter-Strategies & Alternatives Matrix */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Viable Counter-Strategies & Trade-Offs</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            High-leverage strategic alternatives to consider if assumptions or market conditions change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(analysis.alternatives || []).map((alt, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50/60 dark:bg-navy-900 p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-navy-600 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                  Alternative {index + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  {alt.option}
                </h4>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-navy-800 text-xs">
                <strong className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                  Required Trade-off:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {alt.tradeoff}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Strategic Follow-up Advisor (/api/chat-followup) */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Executive Follow-up Advisor</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Gemini 3.8 Flash
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ask clarifying questions regarding rollout milestones, downside mitigation, or capital protection.
            </p>
          </div>
        </div>

        {/* Quick starter questions */}
        <div className="flex flex-wrap gap-2">
          {[
            'What should be our primary 30-day go/no-go milestone?',
            'How should we reallocate budget if early conversion lags?',
            'What operational blind spots should our leadership team monitor?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendFollowUp(promptText)}
              disabled={isAsking}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left disabled:opacity-50"
            >
              💬 {promptText}
            </button>
          ))}
        </div>

        {/* Q&A Message Stream */}
        {followUpHistory.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-navy-700">
            {followUpHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200 ml-6 sm:ml-12'
                    : 'bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-800 dark:text-slate-200 mr-6 sm:mr-12'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {msg.sender === 'user' ? (
                    <span>Executive Question</span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Bot className="w-3.5 h-3.5" /> AI Strategic Advisor (Gemini 3.8 Flash)
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chat Error Banner */}
        {chatError && (
          <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
            {chatError}
          </p>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendFollowUp();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            placeholder="Ask a strategic follow-up question (e.g., 'How do we protect gross margin during phase 1?')"
            disabled={isAsking}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isAsking || !followUpQuestion.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAsking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Ask Advisor</span>
          </button>
        </form>
      </div>

    </div>
  );
}
