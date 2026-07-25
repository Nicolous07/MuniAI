import { AIModel, Conversation, Folder, SlashCommand, Workspace, UserProfile, AppSettings } from '../types';
import { MUNIAI_SYSTEM_PROMPT_V2 } from './systemPrompt';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'MuniAI Omega 3.6 Ultra',
    provider: 'MuniAI',
    badge: 'DEFAULT',
    description: 'Fastest flagship multi-modal engine for reasoning, synthesis, and creative generation.',
    speed: 'Ultra',
    contextLength: '1.0M tokens',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'MuniAI Pro Deep Thinker',
    provider: 'MuniAI',
    badge: 'REASONING',
    description: 'Advanced multi-step reasoning model specialized in complex STEM, math, and code architecture.',
    speed: 'Reasoning',
    contextLength: '2.0M tokens',
    isPro: true,
  },
  {
    id: 'gemini-3.1-flash-lite-image',
    name: 'MuniAI Studio Vision',
    provider: 'MuniAI',
    badge: 'MULTIMODAL',
    description: 'Ultra-fast visual engine for multi-resolution image synthesis and vision understanding.',
    speed: 'Fast',
    contextLength: '128K tokens',
  },
  {
    id: 'gemini-3.1-flash-tts-preview',
    name: 'MuniAI Neural Voice',
    provider: 'MuniAI',
    badge: 'AUDIO',
    description: 'Real-time conversational voice synthesis model with natural human pitch and inflection.',
    speed: 'Ultra',
    contextLength: '64K tokens',
  },
];

export const WORKSPACES: Workspace[] = [
  { id: 'ws-main', name: 'Main HQ', icon: 'Crown', description: 'Primary enterprise intelligence suite', isDefault: true },
  { id: 'ws-dev', name: 'Engineering & Code', icon: 'Terminal', description: 'Systems architecture & full-stack code studio' },
  { id: 'ws-design', name: 'Creative Studio', icon: 'Sparkles', description: 'UI/UX design system & image generation' },
  { id: 'ws-research', name: 'Deep Research Lab', icon: 'Compass', description: 'Autonomous market & scientific research' },
];

export const SLASH_COMMANDS: SlashCommand[] = [
  { command: '/code', label: 'Code Mode', description: 'Generate production-ready code with diff preview & terminal', icon: 'Code', modeTarget: 'code', actionPrompt: 'Write a full production implementation for: ' },
  { command: '/image', label: 'Generate Image', description: 'Create high-resolution visual art and graphics', icon: 'Image', modeTarget: 'image', actionPrompt: 'Generate a photorealistic 8K image of: ' },
  { command: '/research', label: 'Deep Research', description: 'Autonomous multi-source deep research synthesis', icon: 'Globe', modeTarget: 'research', actionPrompt: 'Perform exhaustive research analysis on: ' },
  { command: '/web', label: 'Search Web', description: 'Query real-time web grounding with source citations', icon: 'Search', actionPrompt: 'Search the web for real-time information about: ' },
  { command: '/voice', label: 'Voice Mode', description: 'Start real-time ambient neural voice session', icon: 'Mic', modeTarget: 'voice' },
  { command: '/summarize', label: 'Summarize Document', description: 'Synthesize executive summaries from notes or files', icon: 'FileText', actionPrompt: 'Summarize the core insights of: ' },
  { command: '/explain', label: 'Explain Concept', description: 'Break down complex concepts with clear math & analogies', icon: 'HelpCircle', actionPrompt: 'Explain step-by-step in simple terms: ' },
  { command: '/math', label: 'LaTeX & Math', description: 'Solve mathematical equations with step-by-step proof', icon: 'Calculator', actionPrompt: 'Solve and explain the mathematical steps for: ' },
  { command: '/support', label: 'MuniAI Assistant', description: 'Ask how to use MuniAI shortcuts and capabilities', icon: 'Sparkles', actionPrompt: 'What are all the advanced features available in MuniAI?' },
];

export const DEFAULT_USER: UserProfile = {
  name: 'Nicolous Munisi',
  email: 'nicolousmunisi07@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  plan: 'Enterprise Pro',
  creditsUsed: 1420,
  creditsMax: 5000,
  tokensThisMonth: '4.8M',
  connectedApps: ['GitHub Enterprise', 'Google Workspace', 'Linear', 'Vercel Cloud'],
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark-luxury',
  fontSize: 'md',
  enableSoundEffects: true,
  enableAutoReadAloud: false,
  defaultModel: 'gemini-3.6-flash',
  systemPrompt: MUNIAI_SYSTEM_PROMPT_V2,
  temperature: 0.7,
  topP: 0.95,
  reasoningDepth: 'high',
  streamResponses: true,
  autoSaveHistory: true,
  codeHighlightTheme: 'vitesse-dark',
  glassOpacity: 85,
  glowIntensity: 90,
};

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Quantum Computing Encryption Breakthroughs',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    model: 'gemini-3.6-flash',
    mode: 'chat',
    isPinned: true,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Analyze post-quantum cryptography standards adopted by NIST and their resilience against Shor algorithm implementations.',
        timestamp: '10:14 AM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: `### Post-Quantum Cryptography (PQC) Standards & Shor's Algorithm Resilience

The National Institute of Standards and Technology (NIST) finalized its first set of post-quantum encryption standards to mitigate risks posed by cryptanalytically relevant quantum computers (CRQCs).

#### 1. Core Primary Algorithms Selected
* **FIPS 203 (ML-KEM)**: Module-Lattice-Based Key-Encapsulation Mechanism (formerly Kyber). Used for general encryption across HTTPS/TLS.
* **FIPS 204 (ML-DSA)**: Module-Lattice-Based Digital Signature Algorithm (formerly Dilithium). Primary standard for digital signatures.
* **FIPS 205 (SLH-DSA)**: Stateless Hash-Based Digital Signature Algorithm (formerly SPHINCS+). Backup signature scheme independent of lattice hardness.

$$\\text{Security Goal}: \\quad \\min_{\\vec{v} \\in \\mathcal{L} \\setminus \\{\\vec{0}\\}} ||\\vec{v}|| \\ge \\lambda$$

#### 2. Structural Mathematical Defense Against Shor's Algorithm
Shor's polynomial-time algorithm ($O((\\log N)^3)$) breaks traditional **RSA** and **ECC** because they rely on the **hidden subgroup problem for finite abelian groups**. Lattice-based cryptography shifts security to hardness problems in high-dimensional vector spaces ($n \\ge 512$), such as:
* **Learning With Errors (LWE)**
* **Shortest Vector Problem (SVP)**

No known quantum algorithm offers polynomial-time reduction for these high-dimensional lattice vector space problems.`,
        timestamp: '10:15 AM',
        modelUsed: 'MuniAI Omega 3.6 Ultra',
        reasoningSteps: [
          { id: 'rs1', title: 'Deconstructed Cryptographic Security Requirements', status: 'completed' },
          { id: 'rs2', title: 'Synthesized NIST FIPS 203/204/205 Lattice Specifications', status: 'completed' },
          { id: 'rs3', title: 'Validated Shor Algorithm Computational Complexity Reductions', status: 'completed' },
        ],
        citations: [
          { id: 'c1', title: 'NIST Post-Quantum Cryptography Standards', url: 'https://csrc.nist.gov/pqc' },
          { id: 'c2', title: 'Quantum Cryptanalysis & Shor Algorithm Impact', url: 'https://nature.com/articles/pqc-analysis' },
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'High-Performance WebGL Fluid Particle Canvas',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    model: 'gemini-3.1-pro-preview',
    mode: 'code',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'Write a zero-dependency React component using HTML5 Canvas that renders glowing, interactive physics particles with cursor attraction.',
        timestamp: 'Yesterday',
      },
      {
        id: 'm4',
        role: 'assistant',
        content: 'Here is an optimized, 60fps React canvas component with vector physics and smooth mouse magnetic attraction:',
        timestamp: 'Yesterday',
        codeSnippet: {
          language: 'typescript',
          filename: 'InteractiveParticleCanvas.tsx',
          code: `import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export const InteractiveParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1.5,
      color: Math.random() > 0.5 ? '#6366f1' : '#06b6d4',
      alpha: Math.random() * 0.6 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};`,
        },
      },
    ],
  },
];
