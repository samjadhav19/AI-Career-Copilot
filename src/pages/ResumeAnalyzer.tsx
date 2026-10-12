import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Layers,
  GraduationCap,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractTextFromFile, analyzeResumeText } from '../services/resumeParser';
import { SkillChip } from '../components/SkillChip';
import { ScoreRing } from '../components/ScoreRing';
import { SAMPLE_RESUME_PROFILES } from '../utils/constants';

export const ResumeAnalyzer: React.FC = () => {
  const { resumeProfile, setResumeProfile, setActiveTab } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editableText, setEditableText] = useState(resumeProfile?.rawText || '');
  const [isEditingText, setIsEditingText] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(true);

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller file.');
      setIsProcessing(false);
      return;
    }

    try {
      const extracted = await extractTextFromFile(file);
      setEditableText(extracted);
      const parsedProfile = analyzeResumeText(extracted, file.name, file.size);
      setResumeProfile(parsedProfile);
      setSuccessMessage(`Successfully extracted ${parsedProfile.skills.length} skills from ${file.name}!`);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(err.message || 'Failed to extract text from document. Please ensure it is a text-based PDF or DOCX.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleReanalyzeEditedText = () => {
    if (!editableText.trim()) {
      setErrorMessage('Resume text cannot be empty.');
      return;
    }
    const updated = analyzeResumeText(
      editableText,
      resumeProfile?.fileName || 'custom_resume.txt',
      editableText.length
    );
    setResumeProfile(updated);
    setIsEditingText(false);
    setSuccessMessage('Updated skills and profile from edited text!');
  };

  const handleLoadSample = (sampleKey: 'softwareEngineer' | 'dataAnalyst') => {
    const sample = SAMPLE_RESUME_PROFILES[sampleKey];
    setResumeProfile(sample);
    setEditableText(sample.rawText);
    setErrorMessage(null);
    setSuccessMessage(`Loaded sample resume for ${sample.candidateName}!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Privacy Notice Banner */}
      <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between text-xs text-purple-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>100% Client-Side Parsing:</strong> Your resume is processed exclusively inside your web browser using PDF.js and Mammoth. No resume data is uploaded or stored on external servers.
          </span>
        </div>
      </div>

      {/* Upload Zone & Actions */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Your Resume</h2>
            <p className="text-xs text-slate-500 mt-1">
              Supports <strong>PDF</strong>, <strong>DOCX</strong>, and <strong>TXT</strong> files up to 10MB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quick Try:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('softwareEngineer')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors"
            >
              Software Eng. Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('dataAnalyst')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors"
            >
              Data Analyst Sample
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-4 ${
            isDragging
              ? 'border-purple-600 bg-purple-50/60 scale-[0.99]'
              : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shadow-inner">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm md:text-base font-bold text-slate-800">
              {isProcessing
                ? 'Parsing document text in browser...'
                : 'Drag & drop your resume file here, or click to browse'}
            </p>
            <p className="text-xs text-slate-400">
              Selectable PDF, Microsoft Word (.docx), or plain text (.txt)
            </p>
          </div>

          <button
            type="button"
            className="px-5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200/80 transition-colors shadow-2xs pointer-events-none"
          >
            Browse Files
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Extraction Notice</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}
      </div>

      {/* Analysis Results Section */}
      {resumeProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Detected Skills & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Extracted Profile Overview */}
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Extracted Skills & Attributes</h3>
                  <p className="text-xs text-slate-400">
                    File: <span className="font-medium text-slate-600">{resumeProfile.fileName}</span> ({(resumeProfile.fileSize / 1024).toFixed(1)} KB)
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700">
                  {resumeProfile.skills.length} Skills Identified
                </span>
              </div>

              {/* Skills Chips */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {resumeProfile.skills.map((skill, idx) => (
                    <SkillChip key={idx} label={skill} matched={true} />
                  ))}
                </div>
              </div>

              {/* Education & Experience Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Education Credentials</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {resumeProfile.education.map((edu, idx) => (
                      <li key={idx} className="leading-relaxed">{edu}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Experience Highlights</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    ~{resumeProfile.experienceYears} Years estimated professional experience
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {resumeProfile.experienceSummary.slice(0, 2).map((exp, idx) => (
                      <li key={idx} className="leading-relaxed truncate">{exp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Editable Text Area */}
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Extracted Resume Text</h3>
                  <p className="text-xs text-slate-400">
                    Edit or append additional details to refine skill detection.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingText(!isEditingText)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingText ? 'Done Editing' : 'Edit Text'}</span>
                </button>
              </div>

              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                readOnly={!isEditingText}
                rows={10}
                className={`w-full p-4 text-xs font-mono rounded-2xl border transition-all ${
                  isEditingText
                    ? 'border-purple-400 bg-white ring-2 ring-purple-100 focus:outline-none'
                    : 'border-slate-100 bg-slate-50/60 text-slate-600'
                }`}
                placeholder="Extracted plain text will show here..."
              />

              {isEditingText && (
                <div className="flex justify-end">
                  <button
                    onClick={handleReanalyzeEditedText}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-analyze Edited Text</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Match Score & Action Card */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-6 text-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Profile Readiness</h3>
                <p className="text-xs text-slate-400 mt-0.5">Based on parsed keywords & depth</p>
              </div>

              <ScoreRing
                score={resumeProfile.estimatedMatchScore}
                size={160}
                strokeWidth={12}
                sublabel="Match"
                colorScheme="purple"
              />

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-left space-y-2">
                <p className="text-xs font-bold text-purple-900">Top Matched Roles:</p>
                <div className="space-y-1">
                  {resumeProfile.topMatchedRoles.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-purple-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('roles')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-600/20 transition-all hover:scale-[1.01]"
              >
                <span>Continue to Job Role Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
