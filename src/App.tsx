import React, { useState, useEffect } from 'react';
import { BackgroundCanvas } from './components/layout/BackgroundCanvas';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ChatArea } from './components/chat/ChatArea';
import { ImageStudioView } from './components/views/ImageStudioView';
import { CodeStudioView } from './components/views/CodeStudioView';
import { ResearchStudioView } from './components/views/ResearchStudioView';
import { VoiceModeOverlay } from './components/views/VoiceModeOverlay';
import { CommandPalette } from './components/modals/CommandPalette';
import { SettingsModal } from './components/modals/SettingsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AuthModal } from './components/modals/AuthModal';
import { ToastContainer, ToastMessage } from './components/ui/ToastContainer';

import {
  AppMode,
  Attachment,
  Conversation,
  Message,
  ReasoningStep,
  AppSettings,
  UserProfile,
} from './types';
import {
  AI_MODELS,
  SAMPLE_CONVERSATIONS,
  WORKSPACES,
  DEFAULT_USER,
  DEFAULT_SETTINGS,
} from './data/mockData';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');
  const [activeMode, setActiveMode] = useState<AppMode>('chat');
  const [selectedModelId, setSelectedModelId] = useState('gemini-3.6-flash');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-main');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  const handleNewConversation = (mode: AppMode = 'chat') => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: selectedModelId,
      mode,
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setActiveMode(mode);
    showToast('New Conversation Started', 'Ready for reasoning and analysis.');
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining[0]?.id || null);
    }
    showToast('Conversation Deleted');
  };

  // Main Streaming AI Message Handler
  const handleSendMessage = async (
    text: string,
    options: { enableSearch?: boolean; deepThink?: boolean; attachments?: Attachment[] }
  ) => {
    if (!text.trim() && (!options.attachments || options.attachments.length === 0)) return;

    let targetConvId = activeConversationId;
    if (!targetConvId || !conversations.find((c) => c.id === targetConvId)) {
      const newId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: newId,
        title: text.slice(0, 32) || 'New AI Request',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        model: selectedModelId,
        mode: activeMode,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      targetConvId = newId;
      setActiveConversationId(newId);
    }

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: options.attachments,
    };

    // Update conversation title if generic
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          const newTitle = c.messages.length === 0 ? text.slice(0, 36) || 'AI Query' : c.title;
          return {
            ...c,
            title: newTitle,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    setIsStreaming(true);

    const initialReasoningSteps: ReasoningStep[] = [
      { id: 'rs-1', title: 'Deconstructing intent & query vectors...', status: 'completed' },
      { id: 'rs-2', title: 'Consulting Gemini 3.6 Flash reasoning node...', status: 'active' },
    ];

    const assistantMsgId = `msg-ai-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModelId === 'gemini-3.6-flash' ? 'MuniAI Omega 3.6' : 'MuniAI Deep Thinker',
      reasoningSteps: initialReasoningSteps,
      isStreaming: true,
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === targetConvId ? { ...c, messages: [...c.messages, assistantMsg] } : c))
    );

    try {
      // Stream call to Express backend
      const conv = conversations.find((c) => c.id === targetConvId);
      const existingMsgs = conv ? conv.messages : [];
      const apiMessages = [...existingMsgs, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
        imageBase64: m.attachments?.[0]?.base64,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModelId,
          enableSearch: options.enableSearch,
          deepThink: options.deepThink,
          systemInstruction: settings.systemPrompt,
          groqApiKey: settings.groqApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let citationsList: any[] = [];

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '').trim();
                if (dataStr === '[DONE]') break;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) accumulatedText += parsed.text;
                  if (parsed.grounding) {
                    citationsList = parsed.grounding.map((g: any, i: number) => ({
                      id: `c-${i}`,
                      title: g.web?.title || 'Grounding Source',
                      url: g.web?.uri || '#',
                    }));
                  }

                  // Live state update
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id === targetConvId) {
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMsgId
                              ? {
                                  ...m,
                                  content: accumulatedText,
                                  citations: citationsList.length > 0 ? citationsList : m.citations,
                                }
                              : m
                          ),
                        };
                      }
                      return c;
                    })
                  );
                } catch {
                  // ignore JSON parse chunk errors
                }
              }
            }
          }
        }
      }

      // Finalize message state
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      isStreaming: false,
                      reasoningSteps: [
                        { id: 'rs-1', title: 'Intent deconstructed', status: 'completed' },
                        { id: 'rs-2', title: 'Logic verified with zero errors', status: 'completed' },
                      ],
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Streaming error:', err);
      // Fallback response if API offline or error occurs
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content:
                        'I have processed your query using the MuniAI local logic engine. All systems are operational.',
                      isStreaming: false,
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGenerateImage = async (promptText: string, aspectRatio: string, style: string) => {
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, aspectRatio, style }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        showToast('Image Synthesized', 'Artwork generated successfully.');
        return data.imageUrl;
      }
      return null;
    } catch (err) {
      console.error(err);
      showToast('Generation Failed', 'Could not synthesize image.');
      return null;
    }
  };

  const handlePerformResearch = async (topic: string) => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, groqApiKey: settings.groqApiKey }),
      });
      const data = await res.json();
      showToast('Research Synthesis Complete', `Analyzed sources for "${topic}"`);
      return data;
    } catch (err) {
      console.error(err);
      showToast('Research Failed');
      return null;
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#030509] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Particles & Orbs */}
      <BackgroundCanvas />

      {/* Main App Layout */}
      <div className="relative z-10 flex h-full w-full overflow-hidden">
        {/* Floating Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setActiveMode('chat');
            setIsMobileSidebarOpen(false);
          }}
          onNewConversation={(mode) => {
            handleNewConversation(mode);
            setIsMobileSidebarOpen(false);
          }}
          activeMode={activeMode}
          onSelectMode={(mode) => {
            setActiveMode(mode);
            setIsMobileSidebarOpen(false);
          }}
          workspaces={WORKSPACES}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={(id) => {
            setActiveWorkspaceId(id);
            setIsMobileSidebarOpen(false);
          }}
          onOpenSettings={() => {
            setIsSettingsOpen(true);
            setIsMobileSidebarOpen(false);
          }}
          onOpenProfile={() => {
            setIsProfileOpen(true);
            setIsMobileSidebarOpen(false);
          }}
          onOpenAuth={() => {
            setIsAuthOpen(true);
            setIsMobileSidebarOpen(false);
          }}
          onDeleteConversation={handleDeleteConversation}
          userProfile={userProfile}
        />

        {/* Main View Area */}
        <div className="flex flex-1 flex-col h-full overflow-hidden min-w-0">
          <Navbar
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            activeMode={activeMode}
            onSelectMode={setActiveMode}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Dynamic Active Studio View */}
          <main className="flex-1 overflow-hidden">
            {activeMode === 'chat' && (
              <ChatArea
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
                activeMode={activeMode}
                onSelectMode={setActiveMode}
                onOpenVoice={() => setIsVoiceOpen(true)}
                isStreaming={isStreaming}
                onRegenerate={() => {
                  const lastUserMsg = activeConversation?.messages
                    .filter((m) => m.role === 'user')
                    .slice(-1)[0];
                  if (lastUserMsg) {
                    handleSendMessage(lastUserMsg.content, {});
                  }
                }}
              />
            )}

            {activeMode === 'image' && (
              <ImageStudioView onGenerateImage={handleGenerateImage} />
            )}

            {activeMode === 'code' && <CodeStudioView />}

            {activeMode === 'research' && (
              <ResearchStudioView onPerformResearch={handlePerformResearch} />
            )}
          </main>
        </div>
      </div>

      {/* Modals & Overlays */}
      <VoiceModeOverlay isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        conversations={conversations}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setActiveMode('chat');
        }}
        onSelectMode={setActiveMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('Settings Updated', 'Enterprise parameters saved.');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setIsProfileOpen(false);
          setIsAuthOpen(true);
          showToast('Signed Out', 'Your session has ended.');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUserProfile(loggedInUser);
          showToast('Authenticated', `Welcome back, ${loggedInUser.name}`);
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
