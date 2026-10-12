import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    setIsMobileMenuOpen,
    aiSettings,
    resumeProfile,
    resetAllData,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Practice Reminder',
      description: 'Strengthen your STAR storytelling for behavioral questions.',
      time: '1h ago',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 2,
      title: 'Resume Analyzed',
      description: `${resumeProfile?.skills.length || 12} skills extracted from ${resumeProfile?.fileName || 'profile'}.`,
      time: 'Today',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Voice Readiness',
      description: 'Web Speech API detected and ready for spoken mock interviews.',
      time: 'System',
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Prepare for your upcoming interviews' },
    resume: { title: 'Resume Analyzer', subtitle: 'Upload and parse your resume in-browser to identify core skills' },
    roles: { title: 'Job Role Selection', subtitle: 'Choose your target position and customize interview settings' },
    interview: { title: 'Voice Interview Room', subtitle: 'Live mock interview session with spoken AI questions' },
    report: { title: 'Interview Report', subtitle: 'In-depth performance evaluation, scoring, and improvement steps' },
    history: { title: 'Interview History', subtitle: 'Review and compare your past interview practice sessions' },
    settings: { title: 'AI Engine Settings', subtitle: 'Configure AI provider, Gemini API keys, or practice in Demo Mode' },
  };

  const currentMeta = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 md:px-8 bg-white/95 backdrop-blur-md border-b border-slate-100">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
            {currentMeta.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-400 font-medium truncate max-w-xs md:max-w-md">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Input */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, questions..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* AI Mode Pill */}
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200/60"
          title="Click to change AI configuration"
        >
          <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
          <span className="font-bold">
            {aiSettings.mode === 'gemini'
              ? 'Gemini'
              : aiSettings.mode === 'openai'
              ? 'ChatGPT'
              : aiSettings.mode === 'grok'
              ? 'Grok'
              : aiSettings.mode === 'anthropic'
              ? 'Claude'
              : '⚡ Demo'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-purple-600 font-semibold">3 Unread</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-3">
                      <div className={`p-2 rounded-xl h-fit ${n.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-purple-600 font-semibold hover:underline"
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {(currentUser?.name || resumeProfile?.candidateName || 'Candidate')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">
                {currentUser?.name || resumeProfile?.candidateName || 'Candidate Profile'}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                {currentUser?.targetRole ? 'Active Candidate' : 'Job Seeker'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">
                  {currentUser?.name || resumeProfile?.candidateName || 'Candidate User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || resumeProfile?.email || 'candidate@example.com'}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('resume');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between"
                >
                  <span>My Resume Profile</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    {resumeProfile?.skills.length || 0} skills
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  AI Configuration
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                >
                  Reset Session Data
                </button>
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
