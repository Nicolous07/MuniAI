import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Brain,
  SlidersHorizontal,
  Key,
  KeyRound,
  Keyboard,
  ShieldCheck,
  Check,
  Volume2,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'models' | 'system' | 'api' | 'shortcuts'>('appearance');
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [verifyingKey, setVerifyingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(formData);
    onClose();
  };

  const handleVerifyGroqKey = async () => {
    setVerifyingKey(true);
    setKeyStatus(null);
    try {
      const res = await fetch('/api/verify-groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: formData.groqApiKey || '' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKeyStatus({ success: true, message: `Connected! Found ${data.count} Groq models available.` });
      } else {
        setKeyStatus({ success: false, message: data.error || 'Invalid Groq API key or network error.' });
      }
    } catch (err: any) {
      setKeyStatus({ success: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setVerifyingKey(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-3xl rounded-3xl glass-panel border border-indigo-500/30 bg-[#080d19] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-100 font-mono">MuniAI Enterprise Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 pt-4 pb-2 overflow-x-auto border-b border-slate-800/80 shrink-0">
            {[
              { id: 'appearance', label: 'Appearance & FX' },
              { id: 'models', label: 'AI Engine Parameters' },
              { id: 'system', label: 'System Instructions' },
              { id: 'api', label: 'API Keys & Secrets' },
              { id: 'shortcuts', label: 'Keyboard Shortcuts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto py-6 space-y-5 text-xs md:text-sm text-slate-200">
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Luxury Color Theme Preset
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                    className="w-full rounded-2xl glass-input px-4 py-2.5 text-slate-100 bg-slate-900 focus:outline-none"
                  >
                    <option value="dark-luxury">Dark Luxury Glass (Default)</option>
                    <option value="midnight-cyber">Midnight Cyber Neon</option>
                    <option value="deep-oled">Deep OLED Black</option>
                    <option value="titanium-glass">Titanium Metallic</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span>Enable Ambient Sound Effects</span>
                  <input
                    type="checkbox"
                    checked={formData.enableSoundEffects}
                    onChange={(e) => setFormData({ ...formData, enableSoundEffects: e.target.checked })}
                    className="h-4 w-4 rounded accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Temperature (Creativity: {formData.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Reasoning Depth Level
                  </label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((depth) => (
                      <button
                        key={depth}
                        onClick={() => setFormData({ ...formData, reasoningDepth: depth as any })}
                        className={`flex-1 py-2 rounded-xl font-mono text-xs uppercase border transition-all ${
                          formData.reasoningDepth === depth
                            ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                            : 'glass-pill text-slate-400'
                        }`}
                      >
                        {depth}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                  Global System Prompt & Persona Instructions
                </label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  rows={6}
                  className="w-full rounded-2xl glass-input p-4 text-xs font-mono text-slate-100 focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-5">
                {/* GroqCloud API Key Section */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-orange-950/20 to-slate-900 border border-amber-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-sm">
                      <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
                      GroqCloud API Key (Ultra-Fast LPU Engine)
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      GROQ SUB-100MS
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    GroqCloud provides sub-100ms ultra-fast inference for <strong>Llama 3.3 70B</strong>, <strong>DeepSeek R1 Distill</strong>, <strong>Llama 3.1 8B Instant</strong>, and <strong>Mixtral 8x7B</strong>.
                  </p>

                  <div className="space-y-2 pt-1">
                    <label className="block font-mono text-[11px] uppercase text-slate-400 font-semibold">
                      Groq API Key (<code className="text-amber-300">gsk_...</code>)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showGroqKey ? 'text' : 'password'}
                        placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                        value={formData.groqApiKey || ''}
                        onChange={(e) => setFormData({ ...formData, groqApiKey: e.target.value })}
                        className="w-full rounded-xl glass-input pl-3.5 pr-24 py-2.5 text-xs font-mono text-amber-100 bg-slate-900/90 border border-amber-500/30 focus:outline-none focus:border-amber-400"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowGroqKey(!showGroqKey)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 transition-colors"
                          title={showGroqKey ? 'Hide key' : 'Show key'}
                        >
                          {showGroqKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyGroqKey}
                          disabled={verifyingKey}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-mono font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {verifyingKey ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Zap className="h-3 w-3" />
                          )}
                          <span>Test</span>
                        </button>
                      </div>
                    </div>

                    {keyStatus && (
                      <div
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono ${
                          keyStatus.success
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {keyStatus.success ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                        <span>{keyStatus.message}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Don't have a Groq API Key? Get one for free:</span>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>Groq Console</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Gemini API Managed Key Secrets */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    Gemini API Managed Key Secrets
                  </div>
                  <p className="text-slate-300">
                    Gemini API keys are handled securely via server environment variables (<code className="text-indigo-300 font-mono">process.env.GEMINI_API_KEY</code>). Key configuration is managed through your platform Secrets panel.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Open Command Search</span>
                  <code className="text-indigo-400">Cmd + K</code>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span>New Conversation</span>
                  <code className="text-indigo-400">Cmd + Shift + O</code>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Toggle Sidebar</span>
                  <code className="text-indigo-400">Cmd + \</code>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
