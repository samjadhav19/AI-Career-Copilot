import { InterviewConfig, InterviewSession, ResumeProfile, AISettings } from '../types';

const KEYS = {
  RESUME_PROFILE: 'ai_copilot_resume_profile',
  INTERVIEW_CONFIG: 'ai_copilot_interview_config',
  INTERVIEW_HISTORY: 'ai_copilot_history',
  AI_SETTINGS: 'ai_copilot_ai_settings',
  THEME_MODE: 'ai_copilot_theme',
};

export const DEFAULT_CONFIG: InterviewConfig = {
  roleId: 'frontend-dev',
  roleTitle: 'Frontend Developer',
  difficulty: 'Intermediate',
  type: 'Mixed',
  customJobDescription: '',
  questionCount: 5,
};

export const DEFAULT_AI_SETTINGS: AISettings = {
  mode: 'demo',
  apiKey: '',
  selectedModel: 'gemini-3.8-flash',
};

// Clear all storage on initial script load / page refresh as requested
export function clearAllStorageData(): void {
  try {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (e) {
    console.warn('Storage clear notice:', e);
  }
}

// Immediately wipe stored data on page refresh/load
if (typeof window !== 'undefined') {
  clearAllStorageData();

  // Also clear on unload/refresh event to ensure a pristine slate on reload
  window.addEventListener('beforeunload', () => {
    clearAllStorageData();
  });
}

export const storageService = {
  getResumeProfile(): ResumeProfile | null {
    // Fresh session returns null on refresh
    try {
      const data = sessionStorage.getItem(KEYS.RESUME_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveResumeProfile(profile: ResumeProfile | null): void {
    try {
      if (!profile) {
        sessionStorage.removeItem(KEYS.RESUME_PROFILE);
      } else {
        sessionStorage.setItem(KEYS.RESUME_PROFILE, JSON.stringify(profile));
      }
    } catch (e) {
      console.error('Error saving resume profile:', e);
    }
  },

  getInterviewConfig(): InterviewConfig {
    try {
      const data = sessionStorage.getItem(KEYS.INTERVIEW_CONFIG);
      return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  saveInterviewConfig(config: InterviewConfig): void {
    try {
      sessionStorage.setItem(KEYS.INTERVIEW_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving interview config:', e);
    }
  },

  getHistory(): InterviewSession[] {
    try {
      const data = sessionStorage.getItem(KEYS.INTERVIEW_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(history: InterviewSession[]): void {
    try {
      sessionStorage.setItem(KEYS.INTERVIEW_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  },

  addSessionToHistory(session: InterviewSession): void {
    const list = this.getHistory();
    const updated = [session, ...list];
    this.saveHistory(updated);
  },

  deleteSession(sessionId: string): void {
    const list = this.getHistory().filter((s) => s.id !== sessionId);
    this.saveHistory(list);
  },

  clearHistory(): void {
    try {
      sessionStorage.removeItem(KEYS.INTERVIEW_HISTORY);
      localStorage.removeItem(KEYS.INTERVIEW_HISTORY);
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  },

  getAISettings(): AISettings {
    try {
      const data = sessionStorage.getItem(KEYS.AI_SETTINGS);
      return data ? { ...DEFAULT_AI_SETTINGS, ...JSON.parse(data) } : DEFAULT_AI_SETTINGS;
    } catch {
      return DEFAULT_AI_SETTINGS;
    }
  },

  saveAISettings(settings: AISettings): void {
    try {
      sessionStorage.setItem(KEYS.AI_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving AI settings:', e);
    }
  },

  clearAll(): void {
    clearAllStorageData();
  },
};
