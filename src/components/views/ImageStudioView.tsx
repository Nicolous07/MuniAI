import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Maximize2,
  X,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Layers,
  Loader2,
} from 'lucide-react';
import { GeneratedImageAsset } from '../../types';

interface ImageStudioViewProps {
  onGenerateImage: (prompt: string, aspectRatio: string, style: string) => Promise<string | null>;
}

const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic Glass', icon: '🎬' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '🏙️' },
  { id: 'photorealistic', label: '8K Photorealistic', icon: '📷' },
  { id: '3d-render', label: '3D Luxury Render', icon: '💎' },
  { id: 'minimalist', label: 'Minimalist Vector', icon: '🎨' },
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({ onGenerateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImageAsset | null>(null);

  const [gallery, setGallery] = useState<GeneratedImageAsset[]>([
    {
      id: 'img-1',
      prompt: 'A sleek futuristic dark glass AI orb floating in deep space with vibrant cyan and violet light refractions.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      aspectRatio: '1:1',
      style: 'Cinematic Glass',
      createdAt: 'Just now',
    },
    {
      id: 'img-2',
      prompt: 'Ultra-luxury interior architect lounge with floating glass walls, dark obsidian marble, and ambient aurora lighting.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
      aspectRatio: '16:9',
      style: '3D Luxury Render',
      createdAt: '10m ago',
    },
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const generatedUrl = await onGenerateImage(prompt, selectedRatio, selectedStyle);
      if (generatedUrl) {
        const newAsset: GeneratedImageAsset = {
          id: `img-${Date.now()}`,
          prompt,
          imageUrl: generatedUrl,
          aspectRatio: selectedRatio,
          style: selectedStyle,
          createdAt: 'Just now',
        };
        setGallery((prev) => [newAsset, ...prev]);
        setPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">MuniAI Vision Studio</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Synthesize 8K photorealistic artwork, 3D luxury renders, and UI graphics powered by Gemini Vision Engine.
            </p>
          </div>
        </div>
      </div>

      {/* Generation Control Panel */}
      <div className="rounded-3xl glass-panel border border-purple-500/25 p-5 md:p-6 mb-8 bg-[#080d19]/90 shadow-2xl space-y-5">
        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
            Artwork Generation Prompt
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A floating hyper-realistic holographic sphere made of liquid dark glass with vibrant cyan light trails..."
              rows={3}
              className="w-full rounded-2xl glass-input p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`absolute bottom-3 right-3 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
                prompt.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 text-white shadow-purple-500/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Art</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Style Presets */}
          <div>
            <span className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
              Aesthetic Style Preset
            </span>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedStyle === s.id
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 glow-purple'
                      : 'glass-pill text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratios */}
          <div>
            <span className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
              Canvas Aspect Ratio
            </span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSelectedRatio(ratio)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium border transition-all ${
                    selectedRatio === ratio
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 glow-primary'
                      : 'glass-pill text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2 font-mono">
          <ImageIcon className="h-5 w-5 text-purple-400" />
          Generated Artwork Gallery ({gallery.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-3xl glass-panel border border-slate-800/80 bg-[#070b14] transition-all hover:border-purple-500/40 hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-slate-200 line-clamp-2 mb-2 font-light">{item.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-purple-500/30 px-2 py-0.5 text-[10px] font-mono text-purple-200">
                      {item.aspectRatio} • {item.style}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFullscreenImage(item)}
                        className="p-2 rounded-lg bg-black/60 text-white hover:bg-purple-600 transition-colors"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={item.imageUrl}
                        download={`muniai-${item.id}.png`}
                        className="p-2 rounded-lg bg-black/60 text-white hover:bg-purple-600 transition-colors"
                        title="Download Image"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-rose-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={fullscreenImage.imageUrl}
                alt={fullscreenImage.prompt}
                className="max-h-[75vh] w-auto rounded-2xl border border-slate-800 object-contain shadow-2xl"
              />
              <div className="mt-4 p-4 rounded-2xl glass-panel border border-slate-800 w-full text-slate-200 text-xs font-mono">
                <p className="text-sm font-sans mb-1 text-slate-100">{fullscreenImage.prompt}</p>
                <span className="text-slate-400">
                  {fullscreenImage.aspectRatio} • {fullscreenImage.style} • {fullscreenImage.createdAt}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
