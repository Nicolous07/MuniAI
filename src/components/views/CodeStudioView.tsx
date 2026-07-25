import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code,
  Terminal,
  Play,
  FileCode,
  FolderTree,
  Check,
  Copy,
  Download,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  RotateCw,
} from 'lucide-react';

interface CodeFile {
  name: string;
  language: string;
  code: string;
}

const INITIAL_FILES: CodeFile[] = [
  {
    name: 'server.ts',
    language: 'typescript',
    code: `import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/synthesize", async (req, res) => {
  const { prompt } = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });
  res.json({ output: response.text });
});

app.listen(3000, () => console.log("MuniAI Engine Online"));`,
  },
  {
    name: 'App.tsx',
    language: 'typescript',
    code: `import React, { useState } from "react";

export default function App() {
  const [data, setData] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold text-indigo-400">MuniAI Client Studio</h1>
      <pre className="mt-4 p-4 rounded bg-slate-900 border border-slate-800">
        {data || "Ready for request stream..."}
      </pre>
    </div>
  );
}`,
  },
  {
    name: 'schema.sql',
    language: 'sql',
    code: `CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'Enterprise Pro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
  },
];

export const CodeStudioView: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>(INITIAL_FILES);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ MuniAI Code Studio initialized v10.0',
    '✔ TypeScript compiler ready (0.02s)',
    'Type "Run" to test execution output.',
  ]);

  const activeFile = files[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTerminalLogs((prev) => [...prev, `> Executing ${activeFile.name}...`]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `✔ ${activeFile.name} compiled with 0 type errors.`,
        `[Process] Exited with code 0 (14.2ms)`,
        `[MuniAI Runtime] Output validated successfully.`,
      ]);
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-4 md:p-6">
      {/* Studio Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#080d19] p-4 rounded-2xl border border-slate-800 glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              MuniAI Code Studio <span className="text-xs font-mono text-emerald-400">VSCode Quality</span>
            </h1>
            <p className="text-xs text-slate-400">Real-time TypeScript compiler & VM sandbox environment</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>{isRunning ? 'Compiling...' : 'Run Module'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Main Split IDE Workspace */}
      <div className="flex flex-1 flex-col md:flex-row gap-4 overflow-hidden">
        {/* Left File Navigation */}
        <div className="w-full md:w-64 rounded-2xl glass-panel border border-slate-800/80 bg-[#070b16] p-3 flex flex-col shrink-0">
          <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-800/80 text-xs font-mono text-slate-400 font-semibold uppercase">
            <FolderTree className="h-4 w-4 text-indigo-400" />
            Workspace Files
          </div>
          <div className="mt-2 space-y-1 overflow-y-auto flex-1">
            {files.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-mono transition-all ${
                  activeFileIndex === idx
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`}
              >
                <FileCode className="h-4 w-4 text-indigo-400" />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Code Editor Pane */}
        <div className="flex-1 flex flex-col rounded-2xl glass-panel border border-slate-800/80 bg-[#050811] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#090e1c] border-b border-slate-800 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              {activeFile.name}
            </span>
            <span className="text-slate-500 uppercase">{activeFile.language}</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs md:text-sm text-slate-200 leading-relaxed selection:bg-indigo-500/30">
            <textarea
              value={activeFile.code}
              onChange={(e) => {
                const val = e.target.value;
                setFiles((prev) =>
                  prev.map((item, idx) => (idx === activeFileIndex ? { ...item, code: val } : item))
                );
              }}
              className="w-full h-full min-h-[300px] resize-none bg-transparent font-mono focus:outline-none text-slate-100"
            />
          </div>
        </div>

        {/* Right / Bottom Terminal Output Panel */}
        <div className="w-full md:w-80 rounded-2xl glass-panel border border-slate-800/80 bg-[#04060d] p-3 flex flex-col shrink-0 font-mono text-xs text-emerald-400">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" /> Terminal Console
            </span>
            <button
              onClick={() => setTerminalLogs(['Console cleared.'])}
              className="p-1 hover:text-white"
              title="Clear Terminal"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex-1 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300">
            {terminalLogs.map((log, i) => (
              <p key={i} className={log.startsWith('✔') ? 'text-emerald-400' : log.startsWith('>') ? 'text-indigo-300' : 'text-slate-300'}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
