import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  Award,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreRing } from '../components/ScoreRing';

export const InterviewReport: React.FC = () => {
  const { lastReport, startMockInterview, setActiveTab } = useApp();

  useEffect(() => {
    if (lastReport && lastReport.overallScore >= 75) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#6D28D9', '#10B981', '#6366F1'],
        });
      } catch {
        // ignore if confetti blocked
      }
    }
  }, [lastReport]);

  if (!lastReport) {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-3xl border border-slate-100 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Interview Report Available</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Complete a mock interview session to generate a comprehensive AI evaluation report with scores, strengths, and model answers.
        </p>
        <button
          onClick={() => startMockInterview()}
          className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
        >
          Start Mock Interview Now
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 print-full">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Mock Performance Evaluation
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {lastReport.config.roleTitle} Interview Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Conducted on {new Date(lastReport.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            · {Math.round(lastReport.durationSeconds / 60)} minutes session
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={() => startMockInterview()}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </button>
        </div>
      </div>

      {/* Accuracy Disclaimer Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Educational Practice Disclaimer:</span> Automated AI scoring provides simulated feedback based on length, keywords, and relevance. It is a preparation coaching tool and does not represent an actual hiring decision or official employer evaluation.
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Score Card */}
        <div className="md:col-span-1 p-6 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Overall Score
          </span>
          <ScoreRing
            score={lastReport.overallScore}
            size={130}
            strokeWidth={11}
            colorScheme={lastReport.overallScore >= 75 ? 'purple' : 'indigo'}
          />
          <p className="mt-3 text-xs font-semibold text-slate-700">
            {lastReport.overallScore >= 85
              ? 'Strong Performance'
              : lastReport.overallScore >= 70
              ? 'Competent Foundation'
              : 'Needs Practice'}
          </p>
        </div>

        {/* Breakdown Metric Rings */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Relevance
            </span>
            <ScoreRing
              score={lastReport.relevanceScore}
              size={100}
              strokeWidth={9}
              colorScheme="emerald"
            />
            <p className="mt-2 text-[11px] text-slate-500">
              Alignment with core question intent
            </p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Completeness
            </span>
            <ScoreRing
              score={lastReport.completenessScore}
              size={100}
              strokeWidth={9}
              colorScheme="indigo"
            />
            <p className="mt-2 text-[11px] text-slate-500">
              Depth of examples and key points
            </p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Communication
            </span>
            <ScoreRing
              score={lastReport.communicationScore}
              size={100}
              strokeWidth={9}
              colorScheme="purple"
            />
            <p className="mt-2 text-[11px] text-slate-500">
              STAR phrasing and spoken clarity
            </p>
          </div>
        </div>
      </div>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Observed Strengths</h3>
              <p className="text-[11px] text-slate-400">Highlights from your answers</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {lastReport.strengths.map((str, idx) => (
              <li
                key={idx}
                className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 text-xs text-emerald-950 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Areas for Improvement</h3>
              <p className="text-[11px] text-slate-400">Targeted growth opportunities</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {lastReport.areasForImprovement.map((area, idx) => (
              <li
                key={idx}
                className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100/60 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Steps & Skill Gaps */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-purple-50/80 to-indigo-50/40 rounded-3xl border border-purple-100 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-purple-900">
            Recommended Actionable Next Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lastReport.recommendedNextSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl border border-purple-100/80 shadow-2xs space-y-2"
            >
              <span className="text-[10px] font-bold text-purple-600 uppercase">
                Step 0{idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Question by Question Detailed Breakdown */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Questions Asked & Answers Delivered
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed transcripts, individual question scores, and suggested improvements.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-100">
          {lastReport.records.map((rec, idx) => (
            <div key={idx} className="pt-6 first:pt-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {rec.question.category || 'General'}
                  </span>
                </div>
                {rec.evaluation && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        rec.evaluation.score < 35 || rec.evaluation.verdict === 'incorrect'
                          ? 'bg-rose-100 text-rose-800'
                          : rec.evaluation.verdict === 'unknown'
                          ? 'bg-amber-100 text-amber-800'
                          : rec.evaluation.score >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {rec.evaluation.score < 35 || rec.evaluation.verdict === 'incorrect'
                        ? 'Low Mark / Needs Review'
                        : rec.evaluation.verdict === 'unknown'
                        ? 'Unknown / Study Topic'
                        : rec.evaluation.score >= 75
                        ? 'Strong Response'
                        : 'Partial Response'}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Score:</span>
                    <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-100 text-purple-800">
                      {rec.evaluation.score}/100
                    </span>
                  </div>
                )}
              </div>

              {/* Question text */}
              <h4 className="text-sm font-bold text-slate-900">{rec.question.questionText}</h4>

              {/* User Answer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Your Response
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  “{rec.userAnswer}”
                </p>
              </div>

              {/* Suggested Model Answer */}
              {rec.evaluation?.suggestedAnswer && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Official Senior Model Answer:</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white/70 p-3 rounded-xl border border-purple-100/60">
                    {rec.evaluation.suggestedAnswer}
                  </p>
                </div>
              )}

              {/* Actionable tip */}
              {rec.evaluation?.actionableTip && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    <strong>Quick Tip:</strong> {rec.evaluation.actionableTip}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
