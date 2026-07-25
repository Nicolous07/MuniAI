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

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(formData);
    onClose();
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
              <div className="space-y-3 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Gemini API Managed Key Secrets
                </div>
                <p className="text-slate-300">
                  Gemini API keys are handled securely via server environment variables (<code className="text-indigo-300 font-mono">process.env.GEMINI_API_KEY</code>). Key configuration is managed through your platform Secrets panel.
                </p>
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
