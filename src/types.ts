export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Mixed';

export interface ResumeProfile {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  rawText: string;
  candidateName?: string;
  email?: string;
  skills: string[];
  education: string[];
  experienceYears: number;
  experienceSummary: string[];
  topMatchedRoles: string[];
  estimatedMatchScore: number;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: DifficultyLevel;
  iconName: string;
  category: 'Engineering' | 'Design' | 'Data' | 'Operations';
}

export interface InterviewConfig {
  roleId: string;
  roleTitle: string;
  difficulty: DifficultyLevel;
  type: InterviewType;
  customJobDescription: string;
  questionCount: number;
}

export interface InterviewQuestion {
  id: number;
  questionText: string;
  category: string;
  difficulty: DifficultyLevel;
  type: InterviewType;
  hint?: string;
  expectedKeyPoints?: string[];
  modelAnswer?: string;
  whyAsked?: string;
}

export interface AnswerEvaluation {
  questionId: number;
  score: number; // 0-100
  relevanceScore: number;
  completenessScore: number;
  communicationScore: number;
  goodPoints: string[];
  improvementPoints: string[];
  missingKeyPoints: string[];
  suggestedAnswer: string;
  actionableTip: string;
  verdict?: 'correct' | 'partial' | 'incorrect' | 'unknown';
}

export interface QuestionAnswerRecord {
  question: InterviewQuestion;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  timeSpentSeconds: number;
}

export interface InterviewSession {
  id: string;
  date: string;
  config: InterviewConfig;
  records: QuestionAnswerRecord[];
  overallScore: number;
  relevanceScore: number;
  completenessScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  areasForImprovement: string[];
  skillsToImprove: string[];
  recommendedNextSteps: string[];
  durationSeconds: number;
}

export type AIProvider = 'demo' | 'gemini' | 'openai' | 'grok' | 'anthropic' | 'deepseek';

export interface AISettings {
  mode: AIProvider;
  apiKey: string;
  selectedModel: string;
  customBaseUrl?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  experienceLevel?: string;
}
