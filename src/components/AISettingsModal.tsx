import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Lock,
  Cpu,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIProvider } from '../types';

interface ProviderMeta {
  id: AIProvider;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  defaultModel: string;
  availableModels: string[];
  keyHelp: string;
  keyUrl: string;
}

const PROVIDERS: ProviderMeta[] = [
  {
    id: 'demo',
    name: 'Demo Mode (Offline)',
    badge: 'Zero Config',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Instant, resilient practice mode. Uses tailored role question banks and high-accuracy STAR answer scoring with zero API keys.',
    defaultModel: 'local-star-engine',
    availableModels: ['local-star-engine'],
    keyHelp: 'No API key needed. Runs 100% locally in your browser.',
    keyUrl: '',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Google AI',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'Connect directly to Google AI Studio for dynamic generative questions and STAR answer evaluations.',
    defaultModel: 'gemini-2.5-flash',
    availableModels: ['gemini-2.5-flash', 'gemini-3.8-flash'],
    keyHelp: 'Get your free Gemini API key from Google AI Studio.',
    keyUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    badge: 'GPT-4o',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Use OpenAI GPT-4o or GPT-4o Mini models to evaluate answers and synthesize challenging interview prompts.',
    defaultModel: 'gpt-4o-mini',
    availableModels: ['gpt-4o-mini', 'gpt-4o'],
    keyHelp: 'Obtain an OpenAI API key from the OpenAI Developer Platform.',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'grok',
    name: 'xAI (Grok)',
    badge: 'Grok 2',
    badgeColor: 'bg-slate-800 text-white',
    description: 'Connect to xAI Grok API for witty, rigorous technical questioning and sharp answer critique.',
    defaultModel: 'grok-2-latest',
    availableModels: ['grok-2-latest', 'grok-beta'],
    keyHelp: 'Get your xAI API key from the xAI Developer Console.',
    keyUrl: 'https://console.x.ai/',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    badge: 'Claude 3.5',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Leverage Claude 3.5 Sonnet or Haiku for nuanced reasoning, communication feedback, and architectural deep-dives.',
    defaultModel: 'claude-3-5-haiku-20241022',
    availableModels: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022'],
    keyHelp: 'Get your Anthropic API key from the Anthropic Console.',
    keyUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    badge: 'DeepSeek V3 / R1',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Connect to DeepSeek-V3 or DeepSeek-R1 reasoning models for rigorous technical interview questions and deep conceptual critique.',
    defaultModel: 'deepseek-chat',
    availableModels: ['deepseek-chat', 'deepseek-reasoner'],
    keyHelp: 'Get your DeepSeek API key from platform.deepseek.com.',
    keyUrl: 'https://platform.deepseek.com/api_keys',
  },
];

export const AISettingsModal: React.FC = () => {
  const { aiSettings, setAISettings, setActiveTab } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiSettings.mode || 'demo');
  const [apiKey, setApiKey] = useState(aiSettings.apiKey || '');
  const [selectedModel, setSelectedModel] = useState(aiSettings.selectedModel || 'gemini-2.5-flash');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const activeMeta = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const handleProviderSelect = (provider: AIProvider) => {
    setSelectedProvider(provider);
    const meta = PROVIDERS.find((p) => p.id === provider);
    if (meta) {
      setSelectedModel(meta.defaultModel);
    }
    setTestStatus('idle');
    setErrorMessage('');
  };

  const handleSave = () => {
    setAISettings({
      mode: selectedProvider,
      apiKey: apiKey.trim(),
      selectedModel: selectedModel,
    });
    setActiveTab('dashboard');
  };

  const handleTestKey = async () => {
    if (selectedProvider === 'demo') {
      setTestStatus('success');
      return;
    }

    if (!apiKey.trim()) {
      setErrorMessage(`Please enter your ${activeMeta.name} API key.`);
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    try {
      if (selectedProvider === 'gemini') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] }),
          }
        );
        if (!res.ok) throw new Error(`Gemini HTTP error ${res.status}`);
      } else if (selectedProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey.trim()}` },
        });
        if (!res.ok) throw new Error(`OpenAI HTTP error ${res.status}`);
      } else if (selectedProvider === 'grok') {
        const res = await fetch('https://api.x.ai/v1/models', {
          headers: { Authorization: `Bearer ${apiKey.trim()}` },
        });
        if (!res.ok) throw new Error(`xAI Grok HTTP error ${res.status}`);
      } else if (selectedProvider === 'deepseek') {
        const res = await fetch('https://api.deepseek.com/models', {
          headers: { Authorization: `Bearer ${apiKey.trim()}` },
        });
        if (!res.ok) throw new Error(`DeepSeek HTTP error ${res.status}`);
      } else if (selectedProvider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true',
          },
          body: JSON.stringify({
            model: selectedModel || 'claude-3-5-haiku-20241022',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Ping' }],
          }),
        });
        if (!res.ok) throw new Error(`Anthropic HTTP error ${res.status}`);
      }

      setTestStatus('success');
    } catch (e: any) {
      setTestStatus('error');
      setErrorMessage(
        e.message || `Failed to authenticate with ${activeMeta.name}. Please check the key.`
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Multi-Platform AI Engine Settings
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-500 leading-relaxed">
              Choose your preferred AI intelligence provider. AI Career Copilot supports <strong>Google Gemini</strong>, <strong>OpenAI (ChatGPT)</strong>, <strong>xAI (Grok)</strong>, <strong>Anthropic (Claude)</strong>, or <strong>High-Fidelity Demo Mode</strong>.
            </p>
          </div>
        </div>

        {/* Security & Client-Side Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Browser-Safe API Key Usage</span>
          </div>
          <p>
            API keys you enter are saved only in your active browser session and never sent to any intermediary server. If no external key is provided, the platform automatically switches to our high-accuracy built-in evaluator without interruption.
          </p>
        </div>
      </div>

      {/* Provider Selection Cards */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select AI Platform (5 Options)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROVIDERS.map((provider) => {
            const isSelected = selectedProvider === provider.id;

            return (
              <div
                key={provider.id}
                onClick={() => handleProviderSelect(provider.id)}
                className={`p-5 bg-white rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 shadow-lg shadow-purple-600/10 ring-4 ring-purple-50'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-900">{provider.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${provider.badgeColor}`}
                    >
                      {provider.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {provider.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Model:</span>
                  <span className="font-mono font-semibold text-purple-700">
                    {provider.defaultModel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Card for Selected Provider */}
      <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">
              Configure {activeMeta.name}
            </h3>
          </div>
          {activeMeta.keyUrl && (
            <a
              href={activeMeta.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-600 font-semibold hover:underline"
            >
              <span>Get {activeMeta.name} API Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {selectedProvider === 'demo' ? (
          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-900 space-y-1">
            <p className="font-bold">⚡ Zero API Key Required</p>
            <p className="text-emerald-800 leading-relaxed">
              High-Fidelity Demo Mode uses pre-packaged, role-specific question banks for Frontend, Full Stack, Java, Data, Support, and UI/UX roles, combined with our semantic STAR answer evaluator. Perfect for free, offline, instant mock practice!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Model Version
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-slate-800"
              >
                {activeMeta.availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {activeMeta.name} API Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestStatus('idle');
                  }}
                  placeholder={
                    selectedProvider === 'openai'
                      ? 'sk-...'
                      : selectedProvider === 'grok'
                      ? 'xai-...'
                      : selectedProvider === 'anthropic'
                      ? 'sk-ant-...'
                      : 'AIzaSy...'
                  }
                  className="w-full pl-10 pr-28 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testStatus === 'testing' || !apiKey.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-purple-700 border border-slate-200 rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
                >
                  {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">{activeMeta.keyHelp}</p>
            </div>

            {/* Test Status Banner */}
            {testStatus === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Connection verified! {activeMeta.name} is ready for mock questions & evaluations.</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all active:scale-[0.99]"
          >
            Save & Apply Platform Settings
          </button>
        </div>
      </div>
    </div>
  );
};
