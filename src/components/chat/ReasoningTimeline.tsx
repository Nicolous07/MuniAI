import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronDown, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ReasoningStep } from '../../types';

interface ReasoningTimelineProps {
  steps: ReasoningStep[];
  isThinking?: boolean;
}

export const ReasoningTimeline: React.FC<ReasoningTimelineProps> = ({ steps, isThinking }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!steps || steps.length === 0) return null;

  const completedCount = steps.filter((s) => s.status === 'completed').length;

  return (
    <div className="my-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300 transition-all max-w-3xl">
      {/* Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-2 text-left font-medium text-slate-200 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Brain className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <span className="font-semibold text-xs tracking-wider uppercase text-cyan-300">
            Synthesis & Thought Reasoning
          </span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10">
            {completedCount}/{steps.length} steps
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isThinking && (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              Synthesizing...
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 border-t border-indigo-500/10 pt-3"
          >
            {steps.map((step, idx) => (
              <div key={step.id || idx} className="flex items-start gap-2.5 text-slate-300">
                {/* Step Status Icon */}
                <div className="mt-0.5">
                  {step.status === 'completed' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {step.status === 'active' && (
                    <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                  )}
                  {step.status === 'pending' && (
                    <div className="h-3.5 w-3.5 rounded-full border border-slate-600 bg-slate-800/50" />
                  )}
                  {step.status === 'failed' && (
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-0.5">
                  <p
                    className={`font-mono text-[11px] leading-relaxed ${
                      step.status === 'completed'
                        ? 'text-slate-200 font-medium'
                        : step.status === 'active'
                        ? 'text-indigo-200 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.detail && (
                    <p className="text-[10px] text-slate-400 leading-normal pl-2 border-l border-indigo-500/20 font-sans">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
