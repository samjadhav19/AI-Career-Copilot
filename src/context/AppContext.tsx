import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AISettings,
  AuthUser,
  InterviewConfig,
  InterviewSession,
  ResumeProfile,
} from '../types';
import { storageService, DEFAULT_CONFIG, DEFAULT_AI_SETTINGS } from '../services/storageService';
import { SAMPLE_RESUME_PROFILES } from '../utils/constants';

type TabType = 'dashboard' | 'resume' | 'roles' | 'interview' | 'report' | 'history' | 'settings';

interface AppContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resumeProfile: ResumeProfile | null;
  setResumeProfile: (profile: ResumeProfile | null) => void;
  interviewConfig: InterviewConfig;
  setInterviewConfig: (config: InterviewConfig) => void;
  history: InterviewSession[];
  lastReport: InterviewSession | null;
  setLastReport: (report: InterviewSession | null) => void;
  aiSettings: AISettings;
  setAISettings: (settings: AISettings) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  resetAllData: () => void;
  saveCompletedSession: (session: InterviewSession) => void;
  loadSampleResume: (key: 'softwareEngineer' | 'dataAnalyst') => void;
  startMockInterview: (roleId?: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [resumeProfile, setResumeProfileState] = useState<ResumeProfile | null>(() => storageService.getResumeProfile());
  const [interviewConfig, setInterviewConfigState] = useState<InterviewConfig>(() => storageService.getInterviewConfig());
  const [history, setHistoryState] = useState<InterviewSession[]>(() => storageService.getHistory());
  const [lastReport, setLastReport] = useState<InterviewSession | null>(null);
  const [aiSettings, setAISettingsState] = useState<AISettings>(() => storageService.getAISettings());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    // If the registered/logged in user specified a target role, configure it
    if (user.targetRole) {
      setInterviewConfigState((prev) => ({
        ...prev,
        roleId: user.targetRole!,
      }));
    }
    setActiveTab('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    resetAllData();
  };

  const setResumeProfile = (profile: ResumeProfile | null) => {
    setResumeProfileState(profile);
    storageService.saveResumeProfile(profile);
  };

  const setInterviewConfig = (config: InterviewConfig) => {
    setInterviewConfigState(config);
    storageService.saveInterviewConfig(config);
  };

  const setAISettings = (settings: AISettings) => {
    setAISettingsState(settings);
    storageService.saveAISettings(settings);
  };

  const saveCompletedSession = (session: InterviewSession) => {
    storageService.addSessionToHistory(session);
    setHistoryState(storageService.getHistory());
    setLastReport(session);
    setActiveTab('report');
  };

  const deleteHistoryItem = (id: string) => {
    storageService.deleteSession(id);
    setHistoryState(storageService.getHistory());
    if (lastReport && lastReport.id === id) {
      const remaining = storageService.getHistory();
      setLastReport(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const clearAllHistory = () => {
    storageService.clearHistory();
    setHistoryState([]);
    setLastReport(null);
  };

  const resetAllData = () => {
    storageService.clearAll();
    setResumeProfileState(null);
    setInterviewConfigState(DEFAULT_CONFIG);
    setHistoryState([]);
    setLastReport(null);
    setAISettingsState(DEFAULT_AI_SETTINGS);
    setActiveTab('dashboard');
  };

  const loadSampleResume = (key: 'softwareEngineer' | 'dataAnalyst') => {
    const sample = SAMPLE_RESUME_PROFILES[key];
    if (sample) {
      setResumeProfile(sample);
    }
  };

  const startMockInterview = (roleId?: string) => {
    if (roleId) {
      const updatedConfig = { ...interviewConfig, roleId };
      setInterviewConfig(updatedConfig);
    }
    setActiveTab('interview');
  };

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        activeTab,
        setActiveTab,
        resumeProfile,
        setResumeProfile,
        interviewConfig,
        setInterviewConfig,
        history,
        lastReport,
        setLastReport,
        aiSettings,
        setAISettings,
        deleteHistoryItem,
        clearAllHistory,
        resetAllData,
        saveCompletedSession,
        loadSampleResume,
        startMockInterview,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
