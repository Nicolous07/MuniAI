import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, X, Sparkles, Radio, Play, Pause, RefreshCw } from 'lucide-react';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const VOICE_PRESETS = [
  { id: 'Zephyr', name: 'Zephyr (Warm & Professional)', gender: 'Female' },
  { id: 'Kore', name: 'Kore (Clear & Articulate)', gender: 'Female' },
  { id: 'Puck', name: 'Puck (Dynamic & Energetic)', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir (Deep & authoritative)', gender: 'Male' },
  { id: 'Charon', name: 'Charon (Calm & Reflective)', gender: 'Male' },
];

export const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({ isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [voiceState, setVoiceState] = useState<'listening' | 'speaking' | 'thinking'>('listening');
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [transcript, setTranscript] = useState('MuniAI Neural Voice is listening to your command...');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 3;

      for (let x = 0; x < width; x++) {
        const amplitude = voiceState === 'speaking' ? 35 : voiceState === 'thinking' ? 15 : 10;
        const frequency = 0.02;
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#06b6d4');
      gradient.addColorStop(1, '#a855f7');

      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#6366f1';
      ctx.stroke();

      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();

    // Toggle simulated state
    const timer = setInterval(() => {
      setVoiceState((prev) => {
        if (prev === 'listening') {
          setTranscript("Synthesizing answer with MuniAI Neural Audio...");
          return 'thinking';
        }
        if (prev === 'thinking') {
          setTranscript("MuniAI: I have completed the architectural analysis for your request.");
          return 'speaking';
        }
        setTranscript("MuniAI Neural Voice is listening to your command...");
        return 'listening';
      });
    }, 4500);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timer);
    };
  }, [isOpen, voiceState]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#030509]/95 backdrop-blur-2xl p-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center justify-center max-w-xl w-full text-center space-y-8">
          {/* Glowing Animated Orb */}
          <div className="relative flex items-center justify-center">
            <div
              className={`h-44 w-44 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-[2px] transition-all duration-700 shadow-2xl ${
                voiceState === 'speaking'
                  ? 'shadow-cyan-500/50 scale-110 glow-cyan'
                  : voiceState === 'thinking'
                  ? 'shadow-purple-500/50 scale-100 animate-pulse'
                  : 'shadow-indigo-500/30 scale-95'
              }`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070b16]">
                <Radio className="h-16 w-16 text-indigo-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Audio Waveform Canvas */}
          <div className="w-full h-24 overflow-hidden rounded-2xl glass-panel border border-indigo-500/20 p-2 bg-[#080d19]/60">
            <canvas ref={canvasRef} width={500} height={80} className="w-full h-full" />
          </div>

          {/* Transcript Display */}
          <div className="space-y-2">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-mono text-xs text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">
              State: {voiceState}
            </span>
            <p className="text-lg md:text-xl font-medium text-slate-100 font-sans leading-relaxed">
              "{transcript}"
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-all shadow-xl ${
                isMuted
                  ? 'bg-rose-600 text-white shadow-rose-600/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40'
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {/* Voice Character Select */}
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="rounded-full glass-input px-4 py-3 text-xs font-mono text-indigo-200 focus:outline-none border border-slate-700"
            >
              {VOICE_PRESETS.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
