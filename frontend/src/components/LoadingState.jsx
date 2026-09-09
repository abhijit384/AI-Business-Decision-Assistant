import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Database, BrainCircuit, ShieldAlert, CheckCircle } from 'lucide-react';

const steps = [
  { label: 'Formulating decision vectors and capital constraints...', icon: Database },
  { label: 'Dispatching to Google Gemini 3.8 Flash reasoning engine...', icon: BrainCircuit },
  { label: 'Synthesizing market opportunities and vulnerabilities...', icon: Sparkles },
  { label: 'Calibrating confidence score and risk trade-offs...', icon: ShieldAlert },
];

export default function LoadingState({ decisionText }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-8 sm:p-12 shadow-card max-w-2xl mx-auto text-center transition-colors">
      
      {/* Animated AI Brain Icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Bot className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Conducting Executive Strategic Analysis
      </h3>

      {decisionText && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic max-w-md mx-auto mb-8 line-clamp-2">
          "{decisionText}"
        </p>
      )}

      {/* Steps checklist */}
      <div className="space-y-3 max-w-md mx-auto text-left mb-6">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-50/70 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200 shadow-sm'
                  : isDone
                  ? 'bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300'
                  : 'border-transparent text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <StepIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                )}
              </div>
              <span className={`text-xs font-medium ${isCurrent ? 'font-semibold' : ''}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-400">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>Evaluating via official Google GenAI API client</span>
      </div>

    </div>
  );
}
