import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipForward,
  Send,
  StopCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Bot,
  User,
  Keyboard,
  Check,
  BookOpen,
  Lightbulb,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { aiService } from '../services/aiService';
import { AnswerEvaluation, InterviewQuestion, QuestionAnswerRecord } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const VoiceInterview: React.FC = () => {
  const {
    interviewConfig,
    resumeProfile,
    aiSettings,
    saveCompletedSession,
    setActiveTab,
  } = useApp();

  // Interview state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [records, setRecords] = useState<QuestionAnswerRecord[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<AnswerEvaluation | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [modeInput, setModeInput] = useState<'voice' | 'text'>('voice');

  // Answer text (synced with voice transcript or user typing)
  const [userAnswer, setUserAnswer] = useState('');

  // Speech hooks
  const {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { isSpeaking, speak, stop: stopSpeaking, isSupported: isTtsSupported } = useSpeechSynthesis();

  // Initialize questions on load
  useEffect(() => {
    let isMounted = true;
    const loadInterview = async () => {
      setIsLoadingQuestions(true);
      try {
        const generated = await aiService.generateQuestions(
          interviewConfig,
          resumeProfile,
          aiSettings
        );
        if (isMounted) {
          setQuestions(generated);
          setIsLoadingQuestions(false);
          // Automatically speak first question if supported
          if (generated.length > 0) {
            setTimeout(() => {
              speak(generated[0].questionText);
            }, 600);
          }
        }
      } catch (e) {
        console.error('Failed to initialize questions:', e);
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    };

    loadInterview();

    return () => {
      isMounted = false;
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Update userAnswer when speech recognition produces new text
  useEffect(() => {
    if (transcript) {
      setUserAnswer(transcript);
    }
  }, [transcript]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // Helper to format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  const handleRepeatQuestion = () => {
    if (currentQuestion) {
      stopListening();
      speak(currentQuestion.questionText);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    stopListening();
    stopSpeaking();
    setIsEvaluating(true);

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      const evaluation = await aiService.evaluateAnswer(
        currentQuestion,
        userAnswer,
        interviewConfig,
        resumeProfile,
        aiSettings
      );

      const record: QuestionAnswerRecord = {
        question: currentQuestion,
        userAnswer: userAnswer.trim() || 'No answer submitted.',
        evaluation,
        timeSpentSeconds: timeSpent,
      };

      setRecords((prev) => [...prev, record]);
      setEvaluationFeedback(evaluation);
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * Action when candidate indicates they do not know the answer and wants to accept low marks (10/100) and learn the solution
   */
  const handleAcceptUnknownAndContinue = async () => {
    if (!currentQuestion) return;
    setIsSolutionModalOpen(false);
    stopListening();
    stopSpeaking();
    setIsEvaluating(true);

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      const evaluation = await aiService.evaluateAnswer(
        currentQuestion,
        '[Candidate requested solution - Marked as topic to study]',
        interviewConfig,
        resumeProfile,
        aiSettings
      );

      const record: QuestionAnswerRecord = {
        question: currentQuestion,
        userAnswer: '[I do not know this answer - Solution requested]',
        evaluation,
        timeSpentSeconds: timeSpent,
      };

      setRecords((prev) => [...prev, record]);
      setEvaluationFeedback(evaluation);
    } catch (err) {
      console.error('Unknown answer evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluationFeedback(null);
    setUserAnswer('');
    resetTranscript();

    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionStartTime(Date.now());
      // Speak next question
      setTimeout(() => {
        speak(questions[nextIndex].questionText);
      }, 400);
    } else {
      // Finished all questions! Generate report
      finishInterview();
    }
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;
    stopListening();
    stopSpeaking();

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const modelAns =
      currentQuestion.modelAnswer ||
      'A thorough answer should define the fundamental concept and walk through an implementation example.';

    const skippedRecord: QuestionAnswerRecord = {
      question: currentQuestion,
      userAnswer: '[Question Skipped]',
      timeSpentSeconds: timeSpent,
      evaluation: {
        questionId: currentQuestion.id,
        score: 0,
        relevanceScore: 0,
        completenessScore: 0,
        communicationScore: 0,
        verdict: 'unknown',
        goodPoints: [],
        improvementPoints: ['Question was skipped without an answer.'],
        missingKeyPoints: currentQuestion.expectedKeyPoints || ['Core concept definition'],
        suggestedAnswer: modelAns,
        actionableTip: 'Even if unsure, try outlining your initial approach to demonstrate problem-solving instincts.',
      },
    };

    setRecords((prev) => [...prev, skippedRecord]);
    handleNextQuestion();
  };

  const finishInterview = () => {
    stopListening();
    stopSpeaking();

    const finalRecords = [...records];
    const report = aiService.generateFinalReport(
      finalRecords,
      interviewConfig,
      resumeProfile,
      elapsedSeconds
    );

    saveCompletedSession(report);
  };

  if (isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-800">
            Synthesizing Interview Room
          </h3>
          <p className="text-xs text-slate-400">
            Generating tailored questions for {interviewConfig.roleTitle} ({interviewConfig.difficulty})...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Room Header & Controls */}
      <div className="flex items-center justify-between p-4 md:px-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-bold text-slate-900">
                {interviewConfig.roleTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                {interviewConfig.difficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mock Room · {interviewConfig.type} Format · Provider: {aiSettings.mode.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-mono font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* End Button */}
          <button
            onClick={() => setIsEndConfirmOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Conversation Stage */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        {/* Question Counter Bar */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  i < currentQuestionIndex
                    ? 'bg-purple-600'
                    : i === currentQuestionIndex
                    ? 'bg-purple-400 animate-pulse'
                    : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* AI Interviewer Avatar & Question Box */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/40 border border-purple-100/70">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md transition-all ${
                isSpeaking ? 'ring-4 ring-purple-300 ring-offset-2' : ''
              }`}
            >
              <Bot className="w-7 h-7" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900">
                  {currentQuestion?.category || 'Question'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-purple-700 border border-purple-200">
                  {currentQuestion?.type}
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={handleRepeatQuestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Repeat Audio</span>
                </button>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Mute spoken question"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion?.questionText}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentQuestion?.hint && (
                <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-medium bg-white/80 px-3 py-1 rounded-lg border border-purple-100">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Tip: {currentQuestion.hint}</span>
                </div>
              )}

              {/* Explicit "Don't Know Answer" prompt directly in question card */}
              <button
                type="button"
                onClick={() => setIsSolutionModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Don't know? Show Model Answer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Audio Waves (Shown when speaking or listening) */}
        {(isSpeaking || isListening) && (
          <div className="flex items-center justify-center gap-1.5 py-2">
            <div className="w-1 bg-purple-600 rounded-full animate-soundwave-1" />
            <div className="w-1 bg-purple-500 rounded-full animate-soundwave-2" />
            <div className="w-1 bg-purple-600 rounded-full animate-soundwave-3" />
            <div className="w-1 bg-indigo-500 rounded-full animate-soundwave-4" />
            <div className="w-1 bg-purple-600 rounded-full animate-soundwave-5" />
            <span className="ml-2 text-xs font-semibold text-purple-700">
              {isSpeaking ? 'AI Speaking question...' : 'Listening to your speech...'}
            </span>
          </div>
        )}

        {/* Evaluation Feedback Card (Shown after submitting or revealing answer) */}
        {evaluationFeedback ? (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Verdict Alert Header */}
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold ${
                evaluationFeedback.score < 35 || evaluationFeedback.verdict === 'incorrect'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : evaluationFeedback.verdict === 'unknown'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : evaluationFeedback.score >= 75
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {evaluationFeedback.score < 35 || evaluationFeedback.verdict === 'incorrect' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : evaluationFeedback.verdict === 'unknown' ? (
                  <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>
                  {evaluationFeedback.score < 35 || evaluationFeedback.verdict === 'incorrect'
                    ? 'Low Score: The answer was incorrect, too brief, or missed core concepts.'
                    : evaluationFeedback.verdict === 'unknown'
                    ? 'Marked as Unknown (10/100): Marked for study and future revision.'
                    : evaluationFeedback.score >= 75
                    ? 'Strong Answer: Successfully addressed the key principles.'
                    : 'Partially Correct: Addressed basic concepts but missed depth.'}
                </span>
              </div>

              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-xl font-black">{evaluationFeedback.score}</span>
                <span className="text-[11px] opacity-70">/100</span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Relevance</span>
                <span className="text-base font-extrabold text-slate-800">{evaluationFeedback.relevanceScore}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Completeness</span>
                <span className="text-base font-extrabold text-slate-800">{evaluationFeedback.completenessScore}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Communication</span>
                <span className="text-base font-extrabold text-slate-800">{evaluationFeedback.communicationScore}%</span>
              </div>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1 text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-100">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  What went well:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1">
                  {evaluationFeedback.goodPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-100">
                <span className="font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Areas to refine:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1">
                  {evaluationFeedback.improvementPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Complete Model Answer Box so candidate learns the exact answer! */}
            <div className="p-4 bg-purple-50/80 border border-purple-100 rounded-2xl text-xs text-purple-950 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Official Senior Model Answer:</span>
                </div>
                <button
                  type="button"
                  onClick={() => speak(evaluationFeedback.suggestedAnswer)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-100 rounded-md border border-purple-200 transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen to Answer</span>
                </button>
              </div>

              <p className="text-slate-700 leading-relaxed font-normal bg-white/70 p-3 rounded-xl border border-purple-100/60">
                {evaluationFeedback.suggestedAnswer}
              </p>

              {/* Missing key points if any */}
              {evaluationFeedback.missingKeyPoints && evaluationFeedback.missingKeyPoints.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-purple-800">Key Concepts Expected by Interviewers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {evaluationFeedback.missingKeyPoints.map((mp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-700 text-[11px]">
                        • {mp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actionable Tip */}
            {evaluationFeedback.actionableTip && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-600">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Interview Coach Tip:</strong> {evaluationFeedback.actionableTip}
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all hover:scale-[1.01]"
              >
                <span>
                  {currentQuestionIndex + 1 < questions.length
                    ? 'Continue to Next Question'
                    : 'View Final Comprehensive Report'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Live Answer Recording & Input Stage */
          <div className="space-y-5">
            {/* Input Mode Switcher */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span>Input Mode:</span>
                <button
                  type="button"
                  onClick={() => setModeInput('voice')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    modeInput === 'voice'
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Voice Recording
                </button>
                <button
                  type="button"
                  onClick={() => setModeInput('text')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    modeInput === 'text'
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Keyboard Typing
                </button>
              </div>

              {isSpeechSupported ? (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Web Speech API Supported
                </span>
              ) : (
                <span className="text-[11px] text-amber-600 font-semibold">
                  Voice recognition unsupported in this browser — text input enabled
                </span>
              )}
            </div>

            {/* Voice Control Center (Mic button) */}
            {modeInput === 'voice' && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50/60 rounded-3xl border border-slate-100 space-y-4">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-mic-pulse scale-105 shadow-xl shadow-rose-600/30'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 hover:scale-105'
                  }`}
                  aria-label={isListening ? 'Stop recording voice' : 'Start recording voice'}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    {isListening ? 'Listening... Speak your answer now' : 'Click microphone to begin speaking'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Your speech is transcribed live below. You can edit text before submitting.
                  </p>
                </div>
              </div>
            )}

            {/* Transcript & Answer Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  {modeInput === 'voice' ? 'Live Spoken Transcript (Editable)' : 'Type Your Answer'}
                </label>
                <span className="text-[11px] text-slate-400">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={userAnswer + (interimTranscript ? ` (${interimTranscript})` : '')}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setTranscript(e.target.value);
                }}
                rows={5}
                placeholder={
                  modeInput === 'voice'
                    ? 'Your spoken transcript will appear here automatically. You can also edit it by typing...'
                    : 'Type your answer here. If unsure of the concept, click "Don\'t Know Answer" below to reveal the solution...'
                }
                className="w-full p-4 text-xs md:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Error notice if microphone denied */}
            {speechError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Actions: Don't Know / Skip, Clear, Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {/* Explicit Option for when candidate does not know the answer */}
                <button
                  type="button"
                  onClick={() => setIsSolutionModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Don't Know Answer (Show Solution)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Skip
                </button>
              </div>

              <div className="flex items-center gap-2">
                {userAnswer && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserAnswer('');
                      resetTranscript();
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-md shadow-purple-600/20 transition-all active:scale-95"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer for Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Answer & Solution Guide Modal (When candidate does not know the answer) */}
      {isSolutionModalOpen && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Candidate Solution & Answer Guide
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  {currentQuestion.questionText}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSolutionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why interviewers ask this */}
            {currentQuestion.whyAsked && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-800">Why Interviewers Ask This:</span>
                <p className="text-slate-600 leading-relaxed">{currentQuestion.whyAsked}</p>
              </div>
            )}

            {/* Complete Model Answer */}
            <div className="p-4 bg-gradient-to-br from-purple-50/90 to-indigo-50/60 border border-purple-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Official Model Answer:
                </span>
                <button
                  type="button"
                  onClick={() => speak(currentQuestion.modelAnswer || currentQuestion.questionText)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen to Spoken Answer</span>
                </button>
              </div>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-purple-100/70 font-medium">
                {currentQuestion.modelAnswer || 'Review the expected technical mechanics to explain this concept.'}
              </p>
            </div>

            {/* Expected Key Points Checklist */}
            {currentQuestion.expectedKeyPoints && currentQuestion.expectedKeyPoints.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800">Key Points to Memorize:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQuestion.expectedKeyPoints.map((pt, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                Choose whether to mark as unknown or try articulating now:
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsSolutionModalOpen(false);
                    // Switch to text mode so candidate can adapt the learned answer
                    setModeInput('text');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
                >
                  I Understand, Let Me Answer
                </button>

                <button
                  type="button"
                  onClick={handleAcceptUnknownAndContinue}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 transition-all"
                >
                  Accept 10/100 & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for ending early */}
      <ConfirmDialog
        isOpen={isEndConfirmOpen}
        title="End Interview Early?"
        message="Are you sure you want to conclude the mock session? A report will be generated using the questions you have answered so far."
        confirmLabel="Generate Report"
        cancelLabel="Continue Practicing"
        isDestructive={false}
        onConfirm={() => {
          setIsEndConfirmOpen(false);
          finishInterview();
        }}
        onCancel={() => setIsEndConfirmOpen(false)}
      />
    </div>
  );
};
