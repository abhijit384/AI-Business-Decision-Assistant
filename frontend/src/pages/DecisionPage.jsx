import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Send, Sparkles, Building2, Briefcase, DollarSign, Clock, ShieldAlert, 
  FileText, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { analyzeDecision } from '../services/api';
import { historyService } from '../services/historyService';
import LoadingState from '../components/LoadingState';

const INDUSTRIES = [
  'Technology & SaaS',
  'E-commerce & Retail',
  'Fintech & Financial Services',
  'Healthcare & Biotech',
  'Manufacturing & Logistics',
  'Consumer Goods & D2C',
  'Professional Consulting & Services',
  'Education & EdTech',
  'Other / Emerging Market',
];

const COMPANY_SIZES = [
  { value: 'Startup', label: 'Startup (1-10 employees, Pre-seed/Seed)' },
  { value: 'Small', label: 'Small Business (10-50 employees, Profitable)' },
  { value: 'Medium', label: 'Medium Business (50-250 employees, Scaling)' },
  { value: 'Enterprise', label: 'Enterprise (250+ employees, Multi-region)' },
];

const TIMELINES = [
  'Immediate (1-30 days)',
  '1 quarter (3 months)',
  '2 quarters (6 months)',
  '1 year',
  'Multi-year Horizon',
];

export default function DecisionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    decision: '',
    industry: 'Technology & SaaS',
    company_size: 'Small',
    budget: '',
    timeline: '1 quarter (3 months)',
    risk_tolerance: 'Medium',
    additional_context: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Check if routed with prefilled template data from LandingPage
  useEffect(() => {
    if (location.state?.prefill) {
      const p = location.state.prefill;
      setFormData({
        decision: p.decision || '',
        industry: p.industry || 'Technology & SaaS',
        company_size: p.company_size || 'Small',
        budget: p.budget ? String(p.budget) : '',
        timeline: p.timeline || '1 quarter (3 months)',
        risk_tolerance: p.risk_tolerance || 'Medium',
        additional_context: p.additional_context || '',
      });
    }
  }, [location.state]);

  const validate = () => {
    const errs = {};
    if (!formData.decision.trim()) {
      errs.decision = 'Please specify the business decision you want to evaluate.';
    } else if (formData.decision.trim().length < 10) {
      errs.decision = 'Please provide at least 10 characters to ensure adequate strategic context.';
    }

    if (!formData.industry.trim()) {
      errs.industry = 'Industry selection is required.';
    }

    if (!formData.company_size) {
      errs.company_size = 'Company size is required.';
    }

    if (formData.budget && Number(formData.budget) < 0) {
      errs.budget = 'Budget cannot be a negative amount.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
    };

    const response = await analyzeDecision(payload);

    if (response.success && response.data) {
      // Save to local decision history
      const savedRecord = historyService.save(payload, response.data);

      // Navigate to Results page with the analysis
      navigate('/results', {
        state: {
          result: response.data,
          input: payload,
          id: savedRecord?.id,
        },
      });
    } else {
      setIsSubmitting(false);
      setApiError(response.error || 'Failed to analyze decision. Please check backend connection.');
    }
  };

  if (isSubmitting) {
    return (
      <div className="py-12">
        <LoadingState decisionText={formData.decision} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Strategic Input Parameters</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analyze a Business Decision
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Provide your operational parameters and constraints below. The AI evaluates market mechanics, downside vectors, and counter-strategies.
        </p>
      </div>

      {/* Global Error Banner if API failed */}
      {apiError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Analysis Request Could Not Be Completed</p>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}

      {/* Decision Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Main Decision Textarea */}
        <div className="space-y-2">
          <label htmlFor="decision" className="block text-sm font-semibold text-slate-900 dark:text-white">
            Core Business Decision <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            State the primary question or choice facing your leadership team.
          </p>
          <textarea
            id="decision"
            name="decision"
            rows={4}
            value={formData.decision}
            onChange={handleChange}
            placeholder="e.g., Should we transition from our existing seat-based SaaS pricing to a usage-based consumption model next quarter?"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.decision 
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20' 
                : 'border-slate-200 dark:border-navy-700 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          {errors.decision && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.decision}
            </p>
          )}
        </div>

        {/* Two-Column Grid: Industry & Company Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Industry */}
          <div className="space-y-2">
            <label htmlFor="industry" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Industry / Domain <span className="text-rose-500">*</span></span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="dark:bg-navy-900">{ind}</option>
              ))}
            </select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label htmlFor="company_size" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Company Size & Stage <span className="text-rose-500">*</span></span>
            </label>
            <select
              id="company_size"
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {COMPANY_SIZES.map((cs) => (
                <option key={cs.value} value={cs.value} className="dark:bg-navy-900">{cs.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Two-Column Grid: Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Allocated Capital / Budget ($ USD)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold">
                $
              </span>
              <input
                type="number"
                id="budget"
                name="budget"
                min="0"
                step="500"
                value={formData.budget}
                onChange={handleChange}
                placeholder="50000 (leave blank if bootstrapping)"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.budget 
                    ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20' 
                    : 'border-slate-200 dark:border-navy-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.budget && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.budget}</p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label htmlFor="timeline" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Execution Timeline <span className="text-rose-500">*</span></span>
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {TIMELINES.map((t) => (
                <option key={t} value={t} className="dark:bg-navy-900">{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Risk Tolerance */}
        <div className="space-y-2">
          <label htmlFor="risk_tolerance" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Risk Tolerance Strategy <span className="text-rose-500">*</span></span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Low', 'Medium', 'High'].map((lvl) => {
              const isSelected = formData.risk_tolerance === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, risk_tolerance: lvl }))}
                  className={`px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500'
                      : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{lvl}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />}
                  </div>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    {lvl === 'Low' ? 'Preserve capital & reduce volatility' : lvl === 'Medium' ? 'Balanced calculated upside' : 'Maximum growth velocity'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Context */}
        <div className="space-y-2">
          <label htmlFor="additional_context" className="block text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Additional Constraints & Business Context (Optional)</span>
          </label>
          <textarea
            id="additional_context"
            name="additional_context"
            rows={3}
            value={formData.additional_context}
            onChange={handleChange}
            placeholder="e.g., Current burn rate is $45k/mo with 12 months runway. Competitor X just raised $10M and launched a similar feature."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm text-slate-900 dark:text-white bg-white dark:bg-navy-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-navy-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setFormData({
              decision: '',
              industry: 'Technology & SaaS',
              company_size: 'Small',
              budget: '',
              timeline: '1 quarter (3 months)',
              risk_tolerance: 'Medium',
              additional_context: '',
            })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-750 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Analyze Strategic Decision</span>
          </button>
        </div>

      </form>

    </div>
  );
}
