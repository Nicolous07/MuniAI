import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  ExternalLink,
  Share2,
  Brain,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { Message } from '../../types';
import { ReasoningTimeline } from './ReasoningTimeline';
import { CodeBlock } from './CodeBlock';

interface MessageItemProps {
  message: Message;
  onRegenerate?: () => void;
  onReadAloud?: (text: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onRegenerate, onReadAloud }) => {
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(message.reactions?.upvoted || false);
  const [downvoted, setDownvoted] = useState(message.reactions?.downvoted || false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`_]/g, ''));
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
        if (onReadAloud) onReadAloud(message.content);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex w-full gap-4 px-4 py-5 md:px-6 transition-all ${
        isAssistant ? 'bg-transparent' : 'bg-white/[0.02] border-y border-white/[0.03]'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isAssistant ? (
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 shadow-md shadow-cyan-500/20 text-white">
            <Sparkles className="h-4 w-4" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#050505]" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Author Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-100">
              {isAssistant ? 'MuniAI Omega' : 'You'}
            </span>
            {isAssistant && message.modelUsed && (
              <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-white/10">
                {message.modelUsed}
              </span>
            )}
            <span className="text-xs text-slate-500">{message.timestamp}</span>
          </div>
        </div>

        {/* Reasoning Steps if present */}
        {message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <ReasoningTimeline steps={message.reasoningSteps} isThinking={message.isStreaming} />
        )}

        {/* Code Snippet Attachment if present */}
        {message.codeSnippet && (
          <CodeBlock
            language={message.codeSnippet.language}
            code={message.codeSnippet.code}
            filename={message.codeSnippet.filename}
          />
        )}

        {/* Generated Image Preview if present */}
        {message.generatedImage && (
          <div className="my-3 overflow-hidden rounded-2xl border border-indigo-500/30 glass-panel max-w-lg shadow-2xl">
            <img
              src={message.generatedImage}
              alt="AI Generated Artwork"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="p-3 bg-indigo-950/40 border-t border-indigo-500/20 flex items-center justify-between text-xs text-indigo-200">
              <span className="flex items-center gap-1.5 font-mono">
                <ImageIcon className="h-3.5 w-3.5 text-indigo-400" /> High Res AI Artifact
              </span>
              <a
                href={message.generatedImage}
                download="muniai-generated.png"
                className="text-xs text-indigo-300 hover:text-white underline font-mono"
              >
                Download PNG
              </a>
            </div>
          </div>
        )}

        {/* Message Markdown Body */}
        <div className="markdown-body text-slate-200 text-sm md:text-base leading-relaxed space-y-3 selection:bg-indigo-500/30">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                if (!inline && (match || codeString.includes('\n'))) {
                  return (
                    <CodeBlock
                      language={match ? match[1] : 'typescript'}
                      code={codeString}
                    />
                  );
                }
                return (
                  <code
                    className="rounded bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.5 font-mono text-xs text-indigo-300"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Search / Citation Links */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider self-center">
              Sources:
            </span>
            {message.citations.map((citation) => (
              <a
                key={citation.id}
                href={citation.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-all"
              >
                <ExternalLink className="h-3 w-3 text-indigo-400" />
                <span className="truncate max-w-[180px] font-medium">{citation.title}</span>
              </a>
            ))}
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 pt-2 opacity-80 group-hover:opacity-100 transition-opacity text-slate-400">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-xs transition-colors"
            title="Copy response"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handleSpeech}
            className={`p-1.5 rounded-lg hover:bg-slate-800 text-xs transition-colors ${
              isPlayingAudio ? 'text-indigo-400 bg-indigo-500/10' : 'hover:text-slate-200'
            }`}
            title="Read aloud"
          >
            {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {isAssistant && (
            <>
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-xs transition-colors"
                title="Regenerate answer"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  setUpvoted(!upvoted);
                  setDownvoted(false);
                }}
                className={`p-1.5 rounded-lg hover:bg-slate-800 text-xs transition-colors ${
                  upvoted ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-slate-200'
                }`}
                title="Upvote"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  setDownvoted(!downvoted);
                  setUpvoted(false);
                }}
                className={`p-1.5 rounded-lg hover:bg-slate-800 text-xs transition-colors ${
                  downvoted ? 'text-rose-400 bg-rose-500/10' : 'hover:text-slate-200'
                }`}
                title="Downvote"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
