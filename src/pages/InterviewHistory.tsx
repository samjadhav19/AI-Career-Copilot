import React, { useState } from 'react';
import {
  History,
  Trash2,
  Award,
  ChevronRight,
  RotateCcw,
  Calendar,
  Clock,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const InterviewHistory: React.FC = () => {
  const {
    history,
    deleteHistoryItem,
    clearAllHistory,
    setLastReport,
    setActiveTab,
    startMockInterview,
  } = useApp();

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);

  const handleViewReport = (session: any) => {
    setLastReport(session);
    setActiveTab('report');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Interview History & Analytics
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Track past mock interviews, review score trends, and inspect earlier evaluations.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsClearAllConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
            <button
              onClick={() => startMockInterview()}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
            >
              New Mock Interview
            </button>
          </div>
        )}
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-100 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Prior Sessions Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your completed mock interviews and feedback reports will be stored locally in your browser for easy review.
          </p>
          <button
            onClick={() => startMockInterview()}
            className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
          >
            Start Your First Mock Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => (
            <div
              key={session.id}
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {session.config.roleTitle}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-purple-50 text-purple-700">
                    {session.config.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-100 text-slate-600">
                    {session.config.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(session.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>·</span>
                  <span>{session.records.length} Questions Answered</span>
                  <span>·</span>
                  <span>{Math.round(session.durationSeconds / 60)} min duration</span>
                </div>
              </div>

              {/* Score and actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-purple-600">
                      {session.overallScore}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Overall Score
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleViewReport(session)}
                    className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                  >
                    View Report
                  </button>
                  <button
                    onClick={() => setSessionToDelete(session.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Single Item Modal */}
      <ConfirmDialog
        isOpen={Boolean(sessionToDelete)}
        title="Delete Interview Record?"
        message="Are you sure you want to permanently delete this interview report from your local browser storage?"
        confirmLabel="Delete"
        onConfirm={() => {
          if (sessionToDelete) {
            deleteHistoryItem(sessionToDelete);
            setSessionToDelete(null);
          }
        }}
        onCancel={() => setSessionToDelete(null)}
      />

      {/* Clear All Modal */}
      <ConfirmDialog
        isOpen={isClearAllConfirmOpen}
        title="Clear All Interview History?"
        message="This action will delete all recorded mock interview sessions from your local browser storage. This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={() => {
          clearAllHistory();
          setIsClearAllConfirmOpen(false);
        }}
        onCancel={() => setIsClearAllConfirmOpen(false)}
      />
    </div>
  );
};
