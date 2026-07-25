import React from 'react';
import { motion } from 'motion/react';
import { SLASH_COMMANDS } from '../../data/mockData';
import { SlashCommand } from '../../types';
import { Code, Image, Globe, Search, Mic, FileText, HelpCircle, Calculator, Sparkles } from 'lucide-react';

interface SlashCommandMenuProps {
  filter: string;
  onSelectCommand: (cmd: SlashCommand) => void;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="h-4 w-4 text-indigo-400" />,
  Image: <Image className="h-4 w-4 text-purple-400" />,
  Globe: <Globe className="h-4 w-4 text-cyan-400" />,
  Search: <Search className="h-4 w-4 text-emerald-400" />,
  Mic: <Mic className="h-4 w-4 text-amber-400" />,
  FileText: <FileText className="h-4 w-4 text-blue-400" />,
  HelpCircle: <HelpCircle className="h-4 w-4 text-rose-400" />,
  Calculator: <Calculator className="h-4 w-4 text-teal-400" />,
  Sparkles: <Sparkles className="h-4 w-4 text-indigo-300" />,
};

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ filter, onSelectCommand, onClose }) => {
  const filteredCommands = SLASH_COMMANDS.filter(
    (c) =>
      c.command.toLowerCase().includes(filter.toLowerCase()) ||
      c.label.toLowerCase().includes(filter.toLowerCase()) ||
      c.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCommands.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      className="absolute bottom-full mb-3 left-0 right-0 z-50 overflow-hidden rounded-2xl glass-panel border border-indigo-500/30 p-2 shadow-2xl bg-[#090e1a]/95 max-h-72 overflow-y-auto"
    >
      <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
        MuniAI Command Palette ({filteredCommands.length})
      </div>
      <div className="space-y-1">
        {filteredCommands.map((cmd) => (
          <button
            key={cmd.command}
            onClick={() => onSelectCommand(cmd)}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 transition-colors">
                {iconMap[cmd.icon] || <Sparkles className="h-4 w-4 text-indigo-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-300 group-hover:text-white">
                    {cmd.command}
                  </span>
                  <span className="text-xs font-medium text-slate-200">{cmd.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-sm">{cmd.description}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-300">
              Select ↵
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
