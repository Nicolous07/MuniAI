import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MessageSquare,
  Code,
  Image as ImageIcon,
  Compass,
  Settings,
  User,
  Sparkles,
  Command,
  ArrowRight,
  X,
} from 'lucide-react';
import { AppMode, Conversation } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onSelectMode: (mode: AppMode) => void;
  onOpenSettings: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  conversations,
  onSelectConversation,
  onSelectMode,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-indigo-500/30 bg-[#080d19]/95 p-4 shadow-2xl overflow-hidden space-y-4"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 px-2">
            <Search className="h-5 w-5 text-indigo-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations, switch studios, or trigger commands..."
              autoFocus
              className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-3 max-h-96 overflow-y-auto px-1">
            {/* Navigation Modes */}
            <div>
              <span className="block text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1.5">
                Switch Studio Modes
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    onSelectMode('chat');
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl glass-pill px-3 py-2 text-xs text-slate-200 hover:border-indigo-500/40"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Chat Studio</span>
                </button>
                <button
                  onClick={() => {
                    onSelectMode('code');
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl glass-pill px-3 py-2 text-xs text-slate-200 hover:border-emerald-500/40"
                >
                  <Code className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Code Studio</span>
                </button>
                <button
                  onClick={() => {
                    onSelectMode('image');
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl glass-pill px-3 py-2 text-xs text-slate-200 hover:border-purple-500/40"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                  <span>Vision Studio</span>
                </button>
                <button
                  onClick={() => {
                    onSelectMode('research');
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl glass-pill px-3 py-2 text-xs text-slate-200 hover:border-cyan-500/40"
                >
                  <Compass className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Research Lab</span>
                </button>
              </div>
            </div>

            {/* Conversations Search */}
            <div>
              <span className="block text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1.5">
                Conversations ({filteredConversations.length})
              </span>
              <div className="space-y-1">
                {filteredConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectConversation(c.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
