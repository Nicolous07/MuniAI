import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Plus,
  Pin,
  Folder,
  Code,
  Image as ImageIcon,
  Compass,
  Trash2,
  Settings,
  User,
  Crown,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Layers,
  Star,
  ChevronDown,
  X,
  Menu,
} from 'lucide-react';
import { AppMode, Conversation, Folder as FolderType, Workspace, UserProfile } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: (mode?: AppMode) => void;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: () => void;
  onDeleteConversation: (id: string) => void;
  userProfile?: UserProfile;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  activeMode,
  onSelectMode,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  onDeleteConversation,
  userProfile,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filteredConversations.filter((c) => c.isPinned);
  const recent = filteredConversations.filter((c) => !c.isPinned);

  const handleMobileClick = (action: () => void) => {
    action();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isCollapsed ? 76 : 280 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-white/10 bg-[#080808]/95 backdrop-blur-2xl shrink-0 select-none overflow-hidden transition-transform duration-300 md:relative md:z-30 md:bg-[#080808]/70 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Close Button (Top Right on Mobile) */}
        <div className="flex md:hidden items-center justify-between p-3 border-b border-white/10 bg-[#0c0c0c]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] text-white shadow-md">
              <img src="/logo.svg" alt="MuniAI" className="h-full w-full object-cover rounded-[7px]" />
            </div>
            <span className="font-extrabold text-sm text-white">MuniAI</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Collapse Toggle Button (Desktop Only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex absolute -right-3 top-6 z-40 h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0c0c0c] text-slate-300 shadow-xl hover:text-white transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

      {/* Workspace Selector Bar */}
      <div className="p-3 border-b border-white/5">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex w-full items-center justify-between rounded-2xl glass-pill px-3 py-2 text-left hover:border-cyan-500/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] text-white shadow-md shadow-cyan-500/20 overflow-hidden">
                  <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover rounded-[7px]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="block font-bold text-xs text-slate-100">{activeWorkspace.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[130px]">
                    {activeWorkspace.description}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {/* Workspace Dropdown */}
            {showWorkspaceMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl glass-panel border border-white/10 p-2 shadow-2xl bg-[#0c0c0c]">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws.id);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      ws.id === activeWorkspaceId ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Crown className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{ws.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] text-white shadow-lg shadow-cyan-500/20 overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover rounded-[15px]" />
            </div>
          </div>
        )}
      </div>

      {/* New Chat Action */}
      <div className="p-3">
        <button
          onClick={() => handleMobileClick(() => onNewConversation('chat'))}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-500 p-[1px] shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 hover:scale-[1.02]`}
        >
          <div className="flex h-full w-full items-center justify-center gap-2 rounded-[15px] bg-[#0c0c0c] px-4 py-2.5 text-xs font-bold text-slate-100">
            <Plus className="h-4 w-4 text-cyan-400" />
            {!isCollapsed && <span>New Conversation</span>}
          </div>
        </button>
      </div>

      {/* Mode Navigation Items */}
      <div className="px-3 py-2 space-y-1 border-b border-white/5">
        <button
          onClick={() => handleMobileClick(() => onSelectMode('chat'))}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            activeMode === 'chat'
              ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="h-4 w-4 text-cyan-400 shrink-0" />
          {!isCollapsed && <span>Chat Studio</span>}
        </button>

        <button
          onClick={() => handleMobileClick(() => onSelectMode('code'))}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            activeMode === 'code'
              ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code className="h-4 w-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>Code Studio</span>}
        </button>

        <button
          onClick={() => handleMobileClick(() => onSelectMode('image'))}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            activeMode === 'image'
              ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-400 border border-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="h-4 w-4 text-purple-400 shrink-0" />
          {!isCollapsed && <span>Vision & Images</span>}
        </button>

        <button
          onClick={() => handleMobileClick(() => onSelectMode('research'))}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            activeMode === 'research'
              ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="h-4 w-4 text-cyan-400 shrink-0" />
          {!isCollapsed && <span>Deep Research</span>}
        </button>
      </div>

      {/* History Search & Conversation List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter chats..."
              className="w-full rounded-xl glass-input pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Pinned Section */}
          {pinned.length > 0 && (
            <div>
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-indigo-400 font-semibold mb-2 px-1">
                <Pin className="h-3 w-3" /> Pinned
              </span>
              <div className="space-y-1">
                {pinned.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                      c.id === activeConversationId
                        ? 'bg-indigo-600/25 text-white border border-indigo-500/40 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <button
                      onClick={() => handleMobileClick(() => onSelectConversation(c.id))}
                      className="flex-1 text-left truncate pr-2"
                    >
                      {c.title}
                    </button>
                    <button
                      onClick={() => onDeleteConversation(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Section */}
          <div>
            <span className="block text-[10px] font-mono uppercase text-slate-500 font-semibold mb-2 px-1">
              Recent Conversations
            </span>
            <div className="space-y-1">
              {recent.map((c) => (
                <div
                  key={c.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                    c.id === activeConversationId
                      ? 'bg-indigo-600/25 text-white border border-indigo-500/40 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    onClick={() => onSelectConversation(c.id)}
                    className="flex-1 text-left truncate pr-2"
                  >
                    {c.title}
                  </button>
                  <button
                    onClick={() => onDeleteConversation(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Profile & Settings Controls */}
      <div className="p-3 border-t border-white/5 space-y-2 bg-[#080808]">
        {!isCollapsed && (
          <div className="p-2.5 rounded-2xl glass-panel border border-white/10 text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between font-mono text-[11px] text-slate-400">
              <span>Omega Tokens</span>
              <span className="text-cyan-400">4.8M / 10M</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <img
              src={userProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt="Avatar"
              className="h-8 w-8 rounded-full border border-cyan-500/40 object-cover"
            />
            {!isCollapsed && (
              <div className="truncate">
                <span className="block font-semibold text-xs text-slate-200">
                  {userProfile?.name || 'Nicolous Munisi'}
                </span>
                <span className="block text-[10px] text-cyan-400 font-mono">
                  {userProfile?.plan || 'Enterprise Pro'}
                </span>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
    </>
  );
};
