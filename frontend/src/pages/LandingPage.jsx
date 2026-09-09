import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { EXAMPLE_USE_CASES } from '../data/useCases';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSelectUseCase = (useCase) => {
    navigate('/analyze', { state: { prefill: useCase.payload } });
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Decoupled Full-Stack Architecture • Google Gemini 3.8 Flash</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
            Make High-Stakes Business Decisions with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">
              Executive AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Eliminate cognitive bias and analyze critical business choices. Get objective, Fortune 500-grade consulting recommendations, risk calibrations, and counter-strategies in seconds.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Strategic Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/history"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 font-semibold text-base border border-slate-200 dark:border-navy-700 shadow-sm transition-all"
            >
              <span>View Past Decisions</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 pt-8 border-t border-slate-200/80 dark:border-navy-700 text-left">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Zero Sycophancy: Critical Risk Scrutiny</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Multi-Scenario Alternative Synthesis</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span>Strictly Private Backend Key Storage</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Use Case Templates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explore Real-World Decision Templates
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Click any strategic scenario below to pre-fill the analysis engine and test instant executive evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMPLE_USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.id}
                onClick={() => handleSelectUseCase(uc)}
                className="group relative bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-card hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-tr ${uc.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${uc.bgColor}`}>
                      {uc.payload.industry}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-navy-700/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  <span>Load and evaluate scenario</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strategic Value Pillars */}
      <section className="bg-navy-900 dark:bg-slate-900 border border-navy-800 dark:border-slate-800 text-white rounded-3xl p-8 sm:p-14 max-w-7xl mx-auto shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Pillar 01</span>
            <h3 className="text-xl font-bold">Unbiased Risk Architecture</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Most tools blindly affirm user assumptions. The Decision Assistant challenges optimistic projections, stress-testing operational constraints and capital runway.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pillar 02</span>
            <h3 className="text-xl font-bold">Actionable Counter-Strategies</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Decisions are rarely binary yes/no choices. The system formulates concrete alternative paths with explicit trade-offs tailored to your company's stage.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Pillar 03</span>
            <h3 className="text-xl font-bold">Decoupled Security</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Engineered with an isolated FastAPI microservice. The client browser has zero direct access or leakage risk to Gemini API credentials.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
