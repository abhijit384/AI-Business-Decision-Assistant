import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/useTheme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer ${
        isDark
          ? 'bg-navy-800 border-navy-700 text-amber-300 hover:bg-navy-750 hover:border-navy-600'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Light and Dark Mode"
    >
      <div className={`w-4 h-4 flex items-center justify-center transition-transform duration-300 ${isDark ? 'rotate-0 text-amber-400' : '-rotate-12 text-slate-500'}`}>
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </div>
      <span className="font-medium tracking-tight">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      {/* Visual indicator dot */}
      <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-blue-600'}`} />
    </button>
  );
}
