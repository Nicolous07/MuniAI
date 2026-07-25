import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  Globe,
  Brain,
  Code,
  Paperclip,
  Mic,
  Camera,
  X,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';
import { AppMode, Attachment, SlashCommand } from '../../types';
import { SlashCommandMenu } from './SlashCommandMenu';

interface PromptBoxProps {
  onSendMessage: (text: string, options: { enableSearch?: boolean; deepThink?: boolean; attachments?: Attachment[] }) => void;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenVoice: () => void;
  isStreaming?: boolean;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  onSendMessage,
  activeMode,
  onSelectMode,
  onOpenVoice,
  isStreaming,
}) => {
  const [input, setInput] = useState('');
  const [enableSearch, setEnableSearch] = useState(false);
  const [deepThink, setDeepThink] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(val.slice(1));
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;
    onSendMessage(input, { enableSearch, deepThink, attachments });
    setInput('');
    setAttachments([]);
    setShowSlashMenu(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAtt: Attachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'file',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          base64,
        };
        setAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSelectSlashCommand = (cmd: SlashCommand) => {
    if (cmd.modeTarget) {
      onSelectMode(cmd.modeTarget);
    }
    if (cmd.actionPrompt) {
      setInput(cmd.actionPrompt);
    } else {
      setInput(`${cmd.command} `);
    }
    setShowSlashMenu(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 pb-6">
      {/* Quick Mode Inspiration Pills Above Input */}
      <div className="mb-2 flex items-center justify-between text-xs px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              enableSearch
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 glow-cyan'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Web Search</span>
          </button>

          <button
            onClick={() => setDeepThink(!deepThink)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              deepThink
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 glow-primary'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>Deep Think</span>
          </button>

          <button
            onClick={() => onSelectMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeMode === 'code'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Code Mode</span>
          </button>

          <button
            onClick={() => onSelectMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeMode === 'image'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Generate Image</span>
          </button>
        </div>

        <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
          Type <code className="text-indigo-400">/</code> for commands
        </span>
      </div>

      {/* Main Glass Prompt Box Container with Immersive UI Ambient Glowing Border */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-500 rounded-[34px] blur opacity-25 transition-opacity group-focus-within:opacity-50 pointer-events-none"></div>
        <div className="relative rounded-[32px] bg-[#0c0c0c]/90 backdrop-blur-3xl border border-white/10 p-3 shadow-2xl shadow-black transition-all">
          {/* Slash Menu Dropdown */}
          <AnimatePresence>
            {showSlashMenu && (
              <SlashCommandMenu
                filter={slashFilter}
                onSelectCommand={handleSelectSlashCommand}
                onClose={() => setShowSlashMenu(false)}
              />
            )}
          </AnimatePresence>

          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs text-slate-200 border border-white/10"
                >
                  {att.type === 'image' ? (
                    <img src={att.base64} alt={att.name} className="h-6 w-6 rounded object-cover" />
                  ) : (
                    <FileText className="h-4 w-4 text-cyan-400" />
                  )}
                  <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Area Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMode === 'code'
                ? 'Ask MuniAI Code Studio for architecture, code generation, or refactoring...'
                : activeMode === 'image'
                ? 'Describe the visual artwork or photo you want MuniAI to synthesize...'
                : activeMode === 'research'
                ? 'Enter a deep research query or scientific thesis topic...'
                : 'Ask MuniAI anything or type / for slash commands...'
            }
            rows={1}
            className="w-full resize-none bg-transparent px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Bottom Control Actions */}
          <div className="flex items-center justify-between pt-2 px-2 border-t border-white/5">
            <div className="flex items-center gap-1">
              {/* Attachment Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Attach File or Image"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Voice Mode Toggle */}
              <button
                onClick={onOpenVoice}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-cyan-500/20 text-cyan-400 hover:text-white transition-colors"
                title="Open Neural Voice Interaction"
              >
                <Mic className="h-4 w-4" />
              </button>

              {/* Model Badge */}
              <span className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300">
                <Zap className="h-3 w-3 text-cyan-400" />
                MuniAI 3.6 Ultra
              </span>
            </div>

            {/* Send Action Button */}
            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && attachments.length === 0) || isStreaming}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                input.trim() || attachments.length > 0
                  ? 'bg-white text-black font-bold shadow-lg shadow-white/20 hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
