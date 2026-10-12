import React, { useState } from 'react';
import {
  Layout,
  Layers,
  Coffee,
  BarChart2,
  Headphones,
  Palette,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JOB_ROLES } from '../utils/constants';
import { DifficultyLevel, InterviewType, JobRole } from '../types';

export const JobRoleSelection: React.FC = () => {
  const { interviewConfig, setInterviewConfig, resumeProfile, setActiveTab } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState(interviewConfig.roleId);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(interviewConfig.difficulty);
  const [interviewType, setInterviewType] = useState<InterviewType>(interviewConfig.type);
  const [customJobDescription, setCustomJobDescription] = useState(interviewConfig.customJobDescription || '');
  const [questionCount, setQuestionCount] = useState(interviewConfig.questionCount || 5);

  const iconMap: Record<string, any> = {
    Layout,
    Layers,
    Coffee,
    BarChart2,
    Headphones,
    Palette,
  };

  const selectedRole = JOB_ROLES.find((r) => r.id === selectedRoleId) || JOB_ROLES[0];

  const handleSaveAndProceed = () => {
    setInterviewConfig({
      roleId: selectedRoleId,
      roleTitle: selectedRole.title,
      difficulty,
      type: interviewType,
      customJobDescription,
      questionCount,
    });
    setActiveTab('interview');
  };

  // Compute skill overlap with resume
  const userSkills = new Set((resumeProfile?.skills || []).map((s) => s.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Target Job Role & Interview Setup
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Choose the position you’re targeting, adjust difficulty, and tailor interview question formats.
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-600/20 transition-all hover:scale-[1.01]"
        >
          <span>Enter Voice Interview Room</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6 Job Role Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Role (6 Positions)
          </span>
          <span className="text-xs text-purple-600 font-semibold">
            Active: {selectedRole.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOB_ROLES.map((role) => {
            const Icon = iconMap[role.iconName] || Layout;
            const isSelected = role.id === selectedRoleId;

            // Count matching skills
            const matchingCount = role.skills.filter((s) => userSkills.has(s.toLowerCase())).length;
            const matchPercent = Math.round((matchingCount / role.skills.length) * 100);

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`relative p-5 bg-white rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 shadow-lg shadow-purple-600/10 ring-4 ring-purple-50'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-2xl ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                        {role.category}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{role.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {role.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 4).map((skill, idx) => {
                        const hasSkill = userSkills.has(skill.toLowerCase());
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${
                              hasSkill
                                ? 'bg-purple-50 text-purple-700 border border-purple-200/80 font-semibold'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {hasSkill && '✓ '}
                            {skill}
                          </span>
                        );
                      })}
                      {role.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{role.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match percentage pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Resume Match:</span>
                  <span
                    className={`font-bold ${
                      matchPercent >= 60 ? 'text-emerald-600' : 'text-purple-600'
                    }`}
                  >
                    {matchPercent}% overlap ({matchingCount}/{role.skills.length})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Controls (Difficulty & Interview Type) */}
      <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">Customize Interview Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Difficulty Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    difficulty === level
                      ? 'bg-white text-purple-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              {difficulty === 'Beginner' && 'Focuses on core fundamentals, definitions, and basic logic.'}
              {difficulty === 'Intermediate' && 'Covers system trade-offs, practical debugging, and architectural decisions.'}
              {difficulty === 'Advanced' && 'Deep dive into concurrency, high-scale performance, and edge case resilience.'}
            </p>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Question Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl">
              {(['Mixed', 'Technical', 'Behavioral', 'HR'] as InterviewType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInterviewType(type)}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    interviewType === type
                      ? 'bg-white text-purple-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              {interviewType === 'Mixed' && 'Blend of coding/architecture, teamwork scenarios, and career motivation.'}
              {interviewType === 'Technical' && 'In-depth conceptual questions and technical problem-solving.'}
              {interviewType === 'Behavioral' && 'STAR-format questions assessing conflict resolution, leadership, and deadlines.'}
              {interviewType === 'HR' && 'Introductory screening, cultural alignment, and career aspirations.'}
            </p>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Session Length
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl">
              {[3, 5, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    questionCount === count
                      ? 'bg-white text-purple-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Estimated duration: ~{questionCount * 2} minutes of voice mock practice.
            </p>
          </div>
        </div>

        {/* Custom Job Description Text Area */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Custom Job Description / Company Context (Optional)
          </label>
          <textarea
            value={customJobDescription}
            onChange={(e) => setCustomJobDescription(e.target.value)}
            rows={3}
            placeholder="Paste target job posting bullets, key tech stack requirements, or company name to tailor questions specifically..."
            className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50/50 rounded-3xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-purple-900">Ready to test your skills out loud?</h4>
          <p className="text-xs text-purple-700/80 mt-0.5">
            Targeting <strong>{selectedRole.title}</strong> ({difficulty} · {interviewType} · {questionCount} questions)
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          className="flex items-center gap-2 px-6 py-3 text-xs md:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all hover:scale-[1.01]"
        >
          <span>Launch Voice Interview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
