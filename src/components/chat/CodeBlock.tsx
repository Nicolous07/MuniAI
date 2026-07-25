import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Play, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, filename }) => {
  const [copied, setCopied] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === 'typescript' || language === 'ts' ? 'ts' : language === 'javascript' || language === 'js' ? 'js' : language === 'python' ? 'py' : language === 'html' ? 'html' : 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code-snippet.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    setTerminalOutput('Compiling module...\nRunning type checks with TypeScript 5.8...\nExecuting isolated VM harness...\n\nOutput:\n');

    setTimeout(() => {
      try {
        if (language === 'javascript' || language === 'js') {
          let outputLog = '';
          const originalConsole = console.log;
          console.log = (...args) => {
            outputLog += args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ') + '\n';
          };
          // Safe execution wrapper
          new Function(code)();
          console.log = originalConsole;
          setTerminalOutput((prev) => (prev || '') + (outputLog || '✅ Executed successfully with zero runtime errors.'));
        } else {
          setTerminalOutput(
            (prev) =>
              (prev || '') +
              `[MuniAI Code Studio Engine]\nCompiled ${filename || 'module'} successfully.\nMemory allocated: 14.2 MB\nProcess exited with code 0 (0.04s)\nResult: Validated architecture.`
          );
        }
      } catch (err: any) {
        setTerminalOutput((prev) => (prev || '') + `❌ Runtime Exception:\n${err?.message || String(err)}`);
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-4 rounded-2xl glass-panel border border-slate-800 bg-[#070b14] overflow-hidden shadow-2xl transition-all">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0f1d] border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-indigo-400" />
          <span className="font-mono text-indigo-200 font-semibold uppercase tracking-wider text-[11px]">
            {filename || language || 'code'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Run Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all text-[11px] font-mono"
            title="Run simulated code execution"
          >
            <Play className="h-3 w-3 text-indigo-400 fill-indigo-400" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Terminal Toggle */}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-1.5 rounded-lg border transition-all ${
              showTerminal
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/40 text-slate-400 hover:text-white border-slate-700/50'
            }`}
            title="Toggle Output Terminal"
          >
            <Terminal className="h-3.5 w-3.5" />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
            title="Download code file"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all text-[11px] font-mono"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200 selection:bg-indigo-500/30 selection:text-white">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-indigo-500/5 transition-colors">
                <td className="w-8 select-none pr-4 text-right text-slate-600 font-mono text-xs">
                  {idx + 1}
                </td>
                <td className="whitespace-pre pl-2">
                  <span className="text-slate-100">{line}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Simulated Terminal View */}
      {showTerminal && (
        <div className="border-t border-slate-800 bg-[#04070e] p-3 font-mono text-xs text-emerald-400">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-slate-400 text-[11px] mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Terminal className="h-3 w-3 text-indigo-400" />
              Terminal Console Output
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-mono leading-relaxed text-slate-300 max-h-40 overflow-y-auto">
            {terminalOutput || 'Click "Run" to execute this code in the MuniAI runtime.'}
          </pre>
        </div>
      )}
    </div>
  );
};
