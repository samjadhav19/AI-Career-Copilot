import React from 'react';
import {
  FileText,
  Briefcase,
  Mic,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Layers,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreRing } from '../components/ScoreRing';
import { ProgressCard } from '../components/ProgressCard';
import { SkillChip } from '../components/SkillChip';
import { DEFAULT_TIPS, JOB_ROLES } from '../utils/constants';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    resumeProfile,
    interviewConfig,
    history,
    setActiveTab,
    startMockInterview,
    loadSampleResume,
    resetAllData,
  } = useApp();

  // Selected target role object
  const currentRole = JOB_ROLES.find((r) => r.id === interviewConfig.roleId) || JOB_ROLES[0];

  // Calculate skill gap between selected target role and uploaded resume
  const targetSkills = currentRole.skills;
  const userSkillsSet = new Set((resumeProfile?.skills || []).map((s) => s.toLowerCase()));
  const acquiredSkills = targetSkills.filter((s) => userSkillsSet.has(s.toLowerCase()));
  const missingSkills = targetSkills.filter((s) => !userSkillsSet.has(s.toLowerCase()));

  // Average performance numbers derived from actual history
  const latestSession = history.length > 0 ? history[0] : null;
  const technicalScore = latestSession ? latestSession.technicalScore : 0;
  const communicationScore = latestSession ? latestSession.communicationScore : 0;
  const problemSolvingScore = latestSession ? latestSession.problemSolvingScore : 0;
  const confidenceScore = latestSession ? latestSession.confidenceScore : 0;

  const quickActions = [
    {
      title: 'Upload Resume',
      subtitle: resumeProfile ? `${resumeProfile.skills.length} skills parsed` : 'Parse PDF or DOCX file',
      icon: FileText,
      tab: 'resume',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: 'Select Job Role',
      subtitle: currentRole.title,
      icon: Briefcase,
      tab: 'roles',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Start Voice Room',
      subtitle: `${interviewConfig.difficulty} · ${interviewConfig.type}`,
      icon: Mic,
      tab: 'interview',
      color: 'bg-violet-50 text-violet-600 border-violet-100',
    },
    {
      title: 'View Reports',
      subtitle: history.length > 0 ? `${history.length} completed sessions` : 'No sessions yet',
      icon: Award,
      tab: history.length > 0 ? 'report' : 'interview',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 rounded-3xl text-white shadow-xl shadow-purple-900/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Suite Ready</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            {currentUser?.name ? `Welcome back, ${currentUser.name}!` : 'Elevate Your Mock Interview Performance'}
          </h2>
          <p className="text-sm md:text-base text-purple-100/90 leading-relaxed font-normal">
            Prepare for upcoming {interviewConfig.roleTitle} rounds. Practice spoken technical, behavioral, and HR questions with instant structured STAR feedback.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => startMockInterview()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold text-purple-900 bg-white hover:bg-purple-50 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Mic className="w-4 h-4 text-purple-600" />
              <span>Start Voice Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold text-white bg-purple-800/40 hover:bg-purple-800/60 border border-white/20 rounded-xl transition-colors backdrop-blur-xs"
            >
              <FileText className="w-4 h-4" />
              <span>{resumeProfile ? 'Update Resume' : 'Upload Resume'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(action.tab as any)}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Action
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                  {action.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Profile Match & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Match Score & Detected Skills Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Resume Profile Match</h3>
              <p className="text-xs text-slate-400">Target Role: {currentRole.title}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
              {resumeProfile ? 'Estimate Only' : 'Pending Upload'}
            </span>
          </div>

          <div className="py-2">
            <ScoreRing
              score={resumeProfile?.estimatedMatchScore || 0}
              size={140}
              sublabel={resumeProfile ? 'Match Score' : 'No Resume'}
              label={
                resumeProfile
                  ? 'Estimated profile alignment'
                  : 'Upload a resume to calculate profile alignment'
              }
              colorScheme={resumeProfile ? 'purple' : 'indigo'}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Detected Resume Skills</span>
              <span className="text-xs text-purple-600 font-semibold">
                {resumeProfile?.skills.length || 0} extracted
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {resumeProfile && resumeProfile.skills.length > 0 ? (
                resumeProfile.skills.map((skill, i) => (
                  <SkillChip
                    key={i}
                    label={skill}
                    matched={targetSkills.some((ts) => ts.toLowerCase() === skill.toLowerCase())}
                  />
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center w-full space-y-1">
                  <p className="text-xs text-slate-500 font-medium">No resume uploaded yet</p>
                  <p className="text-[11px] text-slate-400">
                    Upload a PDF or select a sample resume below to populate detected skills.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
              <span className="truncate max-w-[150px]">
                {resumeProfile?.fileName || 'No file uploaded'}
              </span>
              <button
                onClick={() => setActiveTab('resume')}
                className="text-purple-600 font-semibold hover:underline"
              >
                {resumeProfile ? 'Edit & re-scan' : 'Upload Resume →'}
              </button>
            </div>
          </div>
        </div>

        {/* Performance Overview (Progress Bars) */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressCard
            title="Interview Performance Overview"
            items={[
              {
                label: 'Technical Accuracy & Knowledge',
                value: technicalScore,
                color: 'bg-purple-600',
                tip:
                  history.length > 0
                    ? 'Solid grasp of core architectural and library concepts'
                    : 'Complete a mock interview to evaluate technical accuracy',
              },
              {
                label: 'Communication & STAR Structure',
                value: communicationScore,
                color: 'bg-indigo-600',
                tip:
                  history.length > 0
                    ? 'Concise, coherent delivery with clear situation framing'
                    : 'Complete a mock interview to assess communication clarity',
              },
              {
                label: 'Problem Solving & Trade-offs',
                value: problemSolvingScore,
                color: 'bg-violet-600',
                tip:
                  history.length > 0
                    ? 'Articulates performance versus maintainability balances'
                    : 'Complete a mock interview to measure trade-off handling',
              },
              {
                label: 'Confidence & Voice Delivery',
                value: confidenceScore,
                color: 'bg-emerald-500',
                tip:
                  history.length > 0
                    ? 'Consistent spoken cadence with minimal filler pauses'
                    : 'Complete a mock interview to measure delivery confidence',
              },
            ]}
          />

          {/* Skill Gap Analysis Box */}
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Gap Analysis</h3>
                <p className="text-xs text-slate-400">
                  Benchmarked against standard expectations for <strong>{currentRole.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveTab('roles')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Change Role →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Covered Skills ({acquiredSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {acquiredSkills.length > 0 ? (
                    acquiredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white text-emerald-700 border border-emerald-200/60"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      {resumeProfile ? 'None detected from target list.' : 'Upload resume to see covered skills.'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Recommended to Highlight ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white text-amber-700 border border-amber-200/60"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">100% skill alignment!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Preparation Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Interview Activity */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Interview Activity</h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                View Full History ({history.length})
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveTab('report');
                  }}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{item.config.roleTitle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {item.config.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                        {item.config.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {item.records.length} questions answered
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-purple-600">{item.overallScore}</span>
                      <span className="text-[10px] text-slate-400">/100</span>
                      <p className="text-[10px] text-slate-400">Overall</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 bg-slate-50/60 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                No mock interviews recorded yet in this session.
              </p>
              <button
                onClick={() => startMockInterview()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Start your first mock session now →</span>
              </button>
            </div>
          )}
        </div>

        {/* Interview Preparation Tips */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">AI Preparation Tips</h3>
          </div>

          <div className="space-y-3">
            {DEFAULT_TIPS.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{tip.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-purple-600">{tip.category}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Demo Preload Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-[11px] text-slate-400">Load sample profile for testing:</p>
            <div className="flex gap-2">
              <button
                onClick={() => loadSampleResume('softwareEngineer')}
                className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors"
              >
                Software Engineer
              </button>
              <button
                onClick={() => loadSampleResume('dataAnalyst')}
                className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors"
              >
                Data Analyst
              </button>
            </div>

            {/* Clear All / Reset Data button */}
            {(resumeProfile || history.length > 0) && (
              <button
                onClick={resetAllData}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Session Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
