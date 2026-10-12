import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mic,
  Award,
  History,
  Sparkles,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, aiSettings, history } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'roles', label: 'Job Role Selection', icon: Briefcase },
    { id: 'interview', label: 'Voice Interview', icon: Mic, badge: 'Live' },
    { id: 'report', label: 'Interview Report', icon: Award },
    { id: 'history', label: 'Interview History', icon: History, count: history.length },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-100 transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
                AI Career Copilot
              </h1>
              <p className="mt-1 text-[11px] font-medium text-purple-600">
                Your AI Interview Partner
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-100 text-purple-700">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.2 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-500" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Status Card */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/50 border border-purple-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              {aiSettings.mode === 'gemini'
                ? 'Google Gemini'
                : aiSettings.mode === 'openai'
                ? 'OpenAI ChatGPT'
                : aiSettings.mode === 'grok'
                ? 'xAI Grok'
                : aiSettings.mode === 'anthropic'
                ? 'Anthropic Claude'
                : 'High-Fi Demo Mode'}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-purple-700/80 leading-relaxed">
            {aiSettings.mode !== 'demo'
              ? 'Multi-platform generative intelligence active.'
              : 'Interactive voice practice with realistic role evaluator.'}
          </p>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full mt-3 py-1.5 px-3 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-100/60 rounded-lg border border-purple-200 transition-colors shadow-2xs"
          >
            Configure AI Settings
          </button>
        </div>
      </aside>
    </>
  );
};
