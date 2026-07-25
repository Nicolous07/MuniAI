import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code, Image, Globe, Brain, Zap, Terminal, Command } from 'lucide-react';
import { AppMode, Attachment, Conversation, Message } from '../../types';
import { MessageItem } from './MessageItem';
import { PromptBox } from './PromptBox';

interface ChatAreaProps {
  conversation: Conversation | null;
  onSendMessage: (text: string, options: { enableSearch?: boolean; deepThink?: boolean; attachments?: Attachment[] }) => void;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenVoice: () => void;
  isStreaming: boolean;
  onRegenerate: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  onSendMessage,
  activeMode,
  onSelectMode,
  onOpenVoice,
  isStreaming,
  onRegenerate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isStreaming]);

  const messages = conversation?.messages || [];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden">
      {/* Scrollable Message List / Hero Empty State */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-6 scroll-smooth">
        {messages.length === 0 ? (
          /* Hero Empty State */
          <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[2px] shadow-2xl shadow-cyan-500/30 overflow-hidden"
            >
              <img src="/logo.jpg" alt="MuniAI" className="h-full w-full object-cover rounded-[22px]" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-400 mb-3"
            >
              MuniAI Omega
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-light"
            >
              The world's most advanced enterprise AI platform. Autonomous reasoning, code studio, multimodal generation, and deep research.
            </motion.p>

            {/* Feature Starter Cards Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left"
            >
              <button
                onClick={() =>
                  onSendMessage(
                    'Architect a resilient microservice system on Cloud Run with PostgreSQL, Redis, and event streaming.',
                    {}
                  )
                }
                className="group p-4 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all hover:bg-indigo-950/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs text-slate-200">Systems Architecture</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Architect resilient microservices with event streaming & PostgreSQL
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('code');
                  onSendMessage(
                    'Write a full production TypeScript hook for WebSockets with automatic reconnection and state management.',
                    {}
                  );
                }}
                className="group p-4 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all hover:bg-emerald-950/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Code className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs text-slate-200">Code Studio</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Write production TypeScript hooks with WebSocket state handling
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('image');
                  onSendMessage(
                    'Generate a futuristic dark glass luxury dashboard background with glowing cyan light trails.',
                    {}
                  );
                }}
                className="group p-4 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 transition-all hover:bg-purple-950/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Image className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs text-slate-200">Image Generation</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Synthesize high-resolution dark luxury glass art & UI mockups
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('research');
                  onSendMessage(
                    'Perform an in-depth research briefing on quantum cryptography and NIST lattice standards.',
                    { enableSearch: true, deepThink: true }
                  );
                }}
                className="group p-4 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all hover:bg-cyan-950/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs text-slate-200">Deep Research</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Execute multi-source web grounding research & executive briefs
                </p>
              </button>
            </motion.div>
          </div>
        ) : (
          /* Render Active Message History */
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} onRegenerate={onRegenerate} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Prompt Box */}
      <PromptBox
        onSendMessage={onSendMessage}
        activeMode={activeMode}
        onSelectMode={onSelectMode}
        onOpenVoice={onOpenVoice}
        isStreaming={isStreaming}
      />
    </div>
  );
};
