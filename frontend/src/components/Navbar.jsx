import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, LineChart, History, PlusCircle } from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true, model: null });

  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus({
          online: res.online,
          checking: false,
          model: res.data?.gemini_model || 'gemini-3.8-flash',
        });
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 15000); // Poll health every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { to: '/', label: 'Overview', icon: LineChart },
    { to: '/analyze', label: 'New Analysis', icon: PlusCircle },
    { to: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-slate-200 dark:border-navy-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-blue-600 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">AI Business Decision</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Assistant</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-none">Powered by Gemini 3.8 Flash</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Backend Status, Theme Toggle, Start Analysis */}
          <div className="flex items-center gap-3">
            {/* Live Backend Readiness Pill */}
            <div 
              className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                backendStatus.checking 
                  ? 'bg-slate-50 dark:bg-navy-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-navy-700'
                  : backendStatus.online 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              }`}
              title={backendStatus.online ? `API Connected (Model: ${backendStatus.model})` : 'Backend API offline or unreachable'}
            >
              <span className={`w-2 h-2 rounded-full ${
                backendStatus.checking ? 'bg-slate-400 animate-ping' : backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`} />
              <span>{backendStatus.checking ? 'Checking API...' : backendStatus.online ? 'Backend Online' : 'Backend Offline'}</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* New Analysis CTA */}
            <Link
              to="/analyze"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all shadow-blue-500/20 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start Analysis</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex border-t border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-850 px-4 py-2 justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
