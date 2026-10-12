import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Layers,
  Mic,
  ShieldCheck,
  Eye,
  EyeOff,
  Zap,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JOB_ROLES } from '../utils/constants';
import { authService } from '../services/authService';

export const AuthPage: React.FC = () => {
  const { login, loadSampleResume } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState(JOB_ROLES[0].id);
  const [regExperience, setRegExperience] = useState('Intermediate');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const cleanEmail = loginEmail.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Authenticate via persistent authService
      const result = authService.login(cleanEmail, cleanPassword);

      if (!result.success) {
        setError(result.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (result.user) {
        // Preload sample resume if standard seed demo user
        if (result.user.email === 'alex@example.com') {
          loadSampleResume('softwareEngineer');
        } else if (result.user.email === 'maya@example.com') {
          loadSampleResume('dataAnalyst');
        }

        login(result.user);
      }
      setIsLoading(false);
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const cleanEmail = regEmail.trim();
    const cleanPassword = regPassword.trim();
    const cleanConfirm = regConfirmPassword.trim();

    if (!regName.trim() || regName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the practice guidelines to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Register via persistent authService
      const result = authService.register({
        name: regName.trim(),
        email: cleanEmail,
        password: cleanPassword,
        targetRole: regRole,
        experienceLevel: regExperience,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // Prepopulate login credentials for this session so there's never a mismatch
      setLoginEmail(cleanEmail);
      setLoginPassword(cleanPassword);

      // Account saved permanently! Enter dashboard
      if (result.user) {
        login(result.user);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleFillDemoCredentials = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setError(null);
  };

  const handleDemoCandidateLogin = (type: 'softwareEngineer' | 'dataAnalyst') => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === 'softwareEngineer') {
        const result = authService.login('alex@example.com', 'password123');
        if (result.user) {
          loadSampleResume('softwareEngineer');
          login(result.user);
        }
      } else {
        const result = authService.login('maya@example.com', 'password123');
        if (result.user) {
          loadSampleResume('dataAnalyst');
          login(result.user);
        }
      }
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Left Hero Panel (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md">
                <Sparkles className="w-6 h-6 text-purple-200" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                  AI Career Copilot
                </h1>
                <p className="text-xs text-purple-200 font-medium">Your AI Interview Partner</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                Master Your Spoken Mock Interviews with Instant AI Feedback.
              </h2>
              <p className="text-xs text-purple-100/90 leading-relaxed font-normal">
                Practice realistic technical and behavioral interviews, analyze your resume skills, and receive structured STAR ratings before speaking with recruiters.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-white/15 text-purple-200 mt-0.5">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-white">Voice & Speech Recognition:</strong> Live audio questions with real-time speech-to-text.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-white/15 text-purple-200 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-white">In-Browser Resume Parsing:</strong> Extract skills from PDF & Word files privately.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-white/15 text-purple-200 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-white">Persistent Credential Verification:</strong> Register any email & password, and sign in reliably anytime.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-8 border-t border-white/15 flex items-center justify-between text-[11px] text-purple-200">
            <span>Client-Side Architecture</span>
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Access
            </span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header Switcher Tabs */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {authMode === 'login' ? 'Sign in to Copilot' : 'Create Candidate Account'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {authMode === 'login'
                  ? 'Sign in with your registered email and password'
                  : 'Register a new account to save your credentials'}
              </p>
            </div>

            {/* Segmented Tab Control */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Authentication Notice:</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Sign In Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Verified Credentials Helper Card */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start justify-between gap-3 text-xs text-purple-900">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Info className="w-3.5 h-3.5 text-purple-600" />
                    <span>Demo Candidate Credentials:</span>
                  </div>
                  <p className="text-[11px] text-purple-700 font-mono">
                    Email: <strong>alex@example.com</strong> · Pass: <strong>password123</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials('alex@example.com', 'password123')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-purple-700 rounded-lg border border-purple-200 shadow-2xs hover:bg-purple-100 transition-colors shrink-0"
                >
                  Auto-Fill
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your registered email"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      error && error.includes('Account not found')
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setLoginPassword('password123')}
                    className="text-[11px] text-purple-600 hover:underline font-semibold"
                  >
                    Fill sample password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter account password"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      error && error.includes('Incorrect password')
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500">
                  Registered accounts are strictly validated.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setError(null);
                  }}
                  className="text-[11px] text-purple-600 font-semibold hover:underline"
                >
                  Register new account →
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant 1-Click Demo Profiles */}
              <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Instant 1-Click Quick Access
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoCandidateLogin('softwareEngineer')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                    <span>Alex Chen (Eng)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoCandidateLogin('dataAnalyst')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                    <span>Maya Patel (Data)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Register with any email and password below. Your credentials will be saved and you can sign in anytime with them!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Job Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 transition-all"
                    >
                      {JOB_ROLES.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience Level
                  </label>
                  <select
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 transition-all"
                  >
                    <option value="Beginner">Beginner (0-2 yrs)</option>
                    <option value="Intermediate">Intermediate (2-5 yrs)</option>
                    <option value="Advanced">Advanced (5+ yrs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>I agree to practice guidelines and credential storage policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating & Saving Account...' : 'Register & Enter Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-purple-600 font-semibold"
                >
                  Already registered? <span className="text-purple-600 underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
