import React, { useState } from 'react';
import {
  Sparkles,
  Command,
  Bell,
  Zap,
  ChevronDown,
  Globe,
  Brain,
  SlidersHorizontal,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { AIModel, AppMode } from '../../types';
import { AI_MODELS } from '../../data/mockData';

interface NavbarProps {
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: () => void;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedModelId,
  onSelectModel,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  activeMode,
  onSelectMode,
}) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/5 glass-panel bg-[#050505]/60 backdrop-blur-md px-4 md:px-6 shrink-0">
      {/* Left Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#050505]">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-lg font-black tracking-tight text-gradient-primary">
            MuniAI
          </span>
          <span className="ml-2 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            Omega 10.0 Ultra
          </span>
        </div>
      </div>

      {/* Center AI Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowModelDropdown(!showModelDropdown)}
          className="flex items-center gap-2 rounded-2xl glass-pill px-3.5 py-1.5 text-xs font-semibold text-slate-100 hover:border-indigo-500/50 shadow-md transition-all"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>{selectedModel.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Model Menu Dropdown */}
        {showModelDropdown && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 z-50 rounded-2xl glass-panel border border-indigo-500/30 p-2 shadow-2xl bg-[#080d19]/95 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-semibold border-b border-slate-800">
              Select MuniAI Model Engine
            </div>
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onSelectModel(model.id);
                  setShowModelDropdown(false);
                }}
                className={`flex w-full items-start justify-between gap-3 rounded-xl p-2.5 text-left transition-all ${
                  model.id === selectedModelId
                    ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{model.name}</span>
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-mono text-indigo-300">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">{model.description}</p>
                </div>
                {model.id === selectedModelId && <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Palette Cmd+K Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 rounded-xl glass-pill px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-all border border-slate-800"
        >
          <Command className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono text-[11px]">Search (Cmd+K)</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 z-50 rounded-2xl glass-panel border border-indigo-500/30 p-3 shadow-2xl bg-[#080d19] text-xs text-slate-200 space-y-2">
              <div className="font-mono font-semibold uppercase text-indigo-300 text-[11px]">
                Platform System Alerts
              </div>
              <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/20 space-y-1">
                <span className="font-bold text-slate-100 block">MuniAI Omega 10.0 Online</span>
                <p className="text-slate-400 text-[11px]">
                  Updated Gemini 3.6 Flash reasoning timeline & code execution sandbox.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Credits Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>5,000 Credits</span>
        </div>

        {/* Sign In / Sign Up Button */}
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-sm"
          >
            <span>Log In / Sign Up</span>
          </button>
        )}

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/40 overflow-hidden shadow-md hover:scale-105 transition-transform"
          title="Account Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
