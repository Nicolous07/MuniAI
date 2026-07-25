import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, ShieldCheck, CheckCircle2, Cpu, Zap, Activity, LogOut, UserPlus, LogIn } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onLogout,
}) => {
  if (!isOpen) return null;

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
          className="relative w-full max-w-lg rounded-3xl bg-[#0c0c0c]/90 backdrop-blur-3xl border border-white/10 p-6 shadow-2xl overflow-hidden space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* User Identity Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-3xl border-2 border-cyan-500/40 object-cover shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white">
                <Crown className="h-3 w-3" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                <Crown className="h-3 w-3 text-amber-400" /> {user.plan}
              </span>
            </div>
          </div>

          {/* Credits & Token Consumption Meter */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">Monthly API Credits</span>
              <span className="text-cyan-400 font-bold">
                {user.creditsUsed} / {user.creditsMax}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500"
                style={{ width: `${(user.creditsUsed / user.creditsMax) * 100}%` }}
              />
            </div>
            <span className="block text-[11px] text-slate-400 font-mono">
              Tokens Consumed This Month: {user.tokensThisMonth}
            </span>
          </div>

          {/* Connected Applications */}
          <div>
            <span className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Connected Enterprise Integrations
            </span>
            <div className="space-y-1.5 text-xs">
              {user.connectedApps.map((app) => (
                <div
                  key={app}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200"
                >
                  <span className="font-medium">{app}</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Active Sync
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Switch Account / Sign Out */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenAuth?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-2.5 px-4 text-xs font-bold text-slate-200 hover:bg-white/10 transition-colors"
            >
              <LogIn className="h-4 w-4 text-cyan-400" />
              Switch Account / Sign In
            </button>

            <button
              onClick={() => {
                onClose();
                onLogout?.();
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 py-2.5 px-4 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
