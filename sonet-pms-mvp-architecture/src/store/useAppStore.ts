import { create } from 'zustand';

export type Page = 'dashboard' | 'patients' | 'orders' | 'results' | 'invoices' | 'reports' | 'settings';

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  response: string;
}

interface AppState {
  currentPage: Page;
  sidebarOpen: boolean;
  voiceAssistantOpen: boolean;
  voice: VoiceState;
  userName: string;
  labName: string;

  setCurrentPage: (page: Page) => void;
  setSidebarOpen: (open: boolean) => void;
  setVoiceAssistantOpen: (open: boolean) => void;
  setVoice: (voice: Partial<VoiceState>) => void;
  toggleVoiceAssistant: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,
  voiceAssistantOpen: false,
  userName: 'د. أحمد محمد',
  labName: 'Sonet Medical Lab',
  voice: {
    isListening: false,
    isProcessing: false,
    transcript: '',
    response: '',
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setVoiceAssistantOpen: (open) => set({ voiceAssistantOpen: open }),
  setVoice: (voice) => set((state) => ({ voice: { ...state.voice, ...voice } })),
  toggleVoiceAssistant: () => set((state) => ({ voiceAssistantOpen: !state.voiceAssistantOpen })),
}));
