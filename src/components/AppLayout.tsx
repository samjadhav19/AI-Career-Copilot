import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../context/AppContext';
import { Dashboard } from '../pages/Dashboard';
import { ResumeAnalyzer } from '../pages/ResumeAnalyzer';
import { JobRoleSelection } from '../pages/JobRoleSelection';
import { VoiceInterview } from '../pages/VoiceInterview';
import { InterviewReport } from '../pages/InterviewReport';
import { InterviewHistory } from '../pages/InterviewHistory';
import { AISettingsModal } from './AISettingsModal';

export const AppLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'roles':
        return <JobRoleSelection />;
      case 'interview':
        return <VoiceInterview />;
      case 'report':
        return <InterviewReport />;
      case 'history':
        return <InterviewHistory />;
      case 'settings':
        return <AISettingsModal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 font-sans antialiased">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300">
        <Topbar />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        <footer className="py-6 px-8 border-t border-slate-100 bg-white/60 text-center text-xs text-slate-400 no-print">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <p>
              AI Career Copilot — Practice voice mock interviews, analyze resumes, and receive actionable STAR feedback.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span>Client-Side Privacy</span>
              <span>·</span>
              <span>Zero-Backend Storage</span>
              <span>·</span>
              <span>Web Speech API</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
