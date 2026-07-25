export type AppMode = 'chat' | 'image' | 'code' | 'research' | 'voice';

export interface AIModel {
  id: string;
  name: string;
  provider: 'MuniAI' | 'Google' | 'DeepMind';
  badge: string;
  description: string;
  speed: 'Fast' | 'Ultra' | 'Reasoning';
  contextLength: string;
  isPro?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'code' | 'file';
  size?: string;
  url?: string;
  base64?: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface ReasoningStep {
  id: string;
  title: string;
  detail?: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  reasoningSteps?: ReasoningStep[];
  citations?: Citation[];
  modelUsed?: string;
  isStreaming?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
  generatedImage?: string;
  audioUrl?: string;
  reactions?: {
    upvoted?: boolean;
    downvoted?: boolean;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  mode: AppMode;
  messages: Message[];
  isPinned?: boolean;
  isFavorite?: boolean;
  folderId?: string;
  tags?: string[];
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  conversationIds: string[];
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isDefault?: boolean;
}

export interface SlashCommand {
  command: string;
  label: string;
  description: string;
  icon: string;
  modeTarget?: AppMode;
  actionPrompt?: string;
}

export interface GeneratedImageAsset {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  style: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'Enterprise Pro' | 'Individual Ultra' | 'Free Tier';
  creditsUsed: number;
  creditsMax: number;
  tokensThisMonth: string;
  connectedApps: string[];
}

export interface AppSettings {
  theme: 'dark-luxury' | 'midnight-cyber' | 'deep-oled' | 'titanium-glass';
  fontSize: 'sm' | 'md' | 'lg';
  enableSoundEffects: boolean;
  enableAutoReadAloud: boolean;
  defaultModel: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
  reasoningDepth: 'low' | 'medium' | 'high';
  streamResponses: boolean;
  autoSaveHistory: boolean;
  codeHighlightTheme: 'vitesse-dark' | 'github-dark' | 'one-dark';
  glassOpacity: number;
  glowIntensity: number;
}
