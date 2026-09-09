import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, Trash2, ArrowRight, Calendar, 
  Search, PlusCircle, Building2 
} from 'lucide-react';
import { historyService } from '../services/historyService';
import RiskBadge from '../components/RiskBadge';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = historyService.getAll();
    setHistoryItems(items);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved decision analysis?')) {
      historyService.delete(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all decision history?')) {
      historyService.clear();
      loadHistory();
    }
  };

  const handleOpenItem = (item) => {
    navigate('/results', {
      state: {
        result: item.result,
        input: item.input,
        id: item.id,
      },
    });
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesQuery = 
      item.input.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result.recommendation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = 
      filterRisk === 'All' || 
      item.result.risk_level.toLowerCase() === filterRisk.toLowerCase();

    return matchesQuery && matchesRisk;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header & Global Clear */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Audit & Decision Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Decision Analysis History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review past business analyses, recommendations, and risk postures stored securely in local storage.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-navy-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-400 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Clear All History</span>
            </button>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Decision</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {historyItems.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search past decisions or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Risk Filter:</span>
            {['All', 'Low', 'Medium', 'High'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterRisk === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {historyItems.length === 0 && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Past Analyses Recorded</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Your decision analyses are automatically preserved here so you can review recommendations and track outcomes over time.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create First Analysis</span>
          </Link>
        </div>
      )}

      {/* History Items List */}
      {historyItems.length > 0 && filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
          No past analyses match your search criteria.
        </div>
      )}

      <div className="space-y-4">
        {filteredItems.map((item) => {
          const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    {item.input.industry}
                  </span>
                  <RiskBadge level={item.result.risk_level} size="sm" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {dateStr}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.input.decision}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  <strong className="text-slate-700 dark:text-slate-200 font-semibold">Verdict:</strong> {item.result.recommendation}
                </p>
              </div>

              {/* Right metadata badge & actions */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">Confidence</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {item.result.confidence_score}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete this analysis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
