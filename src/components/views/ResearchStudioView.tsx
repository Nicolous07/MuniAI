import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import {
  Compass,
  Search,
  Globe,
  Loader2,
  FileText,
  ExternalLink,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ResearchStudioViewProps {
  onPerformResearch: (topic: string) => Promise<{ report: string; sources: any[] } | null>;
}

export const ResearchStudioView: React.FC<ResearchStudioViewProps> = ({ onPerformResearch }) => {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  const handleStartResearch = async () => {
    if (!topic.trim() || isSearching) return;
    setIsSearching(true);
    setReport(null);

    try {
      const res = await onPerformResearch(topic);
      if (res) {
        setReport(res.report);
        setSources(res.sources || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muniai-deep-research-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">MuniAI Deep Research Lab</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Autonomous multi-source deep web research, thesis synthesis, and executive briefing engine.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="rounded-3xl glass-panel border border-cyan-500/30 p-6 bg-[#080d19]/90 mb-8 shadow-2xl space-y-4">
        <label className="block text-xs font-mono uppercase text-slate-400 font-semibold">
          Deep Research Query or Thesis Topic
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
            placeholder="E.g., Quantum computing breakthroughs in drug discovery & molecular docking 2026..."
            className="flex-1 rounded-2xl glass-input px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={handleStartResearch}
            disabled={!topic.trim() || isSearching}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-xs transition-all shadow-lg shrink-0 ${
              topic.trim() && !isSearching
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-cyan-500/30 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Scraping & Synthesizing...</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Start Research</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Executive Report View */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-panel border border-slate-800 bg-[#070b16] p-6 md:p-8 shadow-2xl space-y-6"
        >
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-sm">
              <BookOpen className="h-5 w-5 text-cyan-400" /> Executive Deep Research Briefing
            </div>
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Export Markdown</span>
            </button>
          </div>

          {/* Sources Badge List */}
          {sources.length > 0 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
              <span className="block font-mono text-cyan-300 mb-2 font-semibold uppercase tracking-wider text-[11px]">
                Grounding Web Sources Analyzed ({sources.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.web?.uri || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 text-xs text-indigo-300 hover:text-white border border-slate-800"
                  >
                    <ExternalLink className="h-3 w-3 text-cyan-400" />
                    <span className="truncate max-w-[200px]">{s.web?.title || s.web?.uri || 'Web Source'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Report Markdown Body */}
          <div className="markdown-body text-slate-200 text-sm md:text-base leading-relaxed space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};
