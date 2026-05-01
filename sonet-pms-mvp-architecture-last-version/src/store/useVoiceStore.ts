// ============================================================
// Sonet PMS — Voice Store (Separate Concern)
// ============================================================
import { create } from 'zustand';
import type { VoiceState, VoiceMessage } from '../types';

interface VoiceStore {
  // State
  voiceState: VoiceState;
  panelOpen: boolean;
  messages: VoiceMessage[];
  transcript: string;

  // Actions
  setVoiceState: (s: VoiceState) => void;
  togglePanel: () => void;
  closePanel: () => void;
  addMessage: (msg: Omit<VoiceMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setTranscript: (text: string) => void;

  // Simulated conversation flow
  startConversation: (transcript: string) => void;
}

let msgCounter = 0;

// Pre-built Egyptian dialect responses based on keywords
const responseMap: Record<string, string> = {
  'نتايج': 'حاضر! لسه ما طلعش نتايج جديدة النهارده. عندك 3 نتايج جاهزة للتسليم. عايز أعرضهم؟',
  'مريض': 'أي مريض بالظبط؟ اذكر الاسم أو الكود وهفتحلك الملف على طول.',
  'تحليل': 'تمام، أي تحليلعايز تطلبه؟ CBC، Chemistry، Thyroid، ولا حاجة تانية؟',
  'فاتورة': 'إجمالي فواتير النهارده ٤٥,٢٠٠ جنيه. فيه فاتورتين معلقات. عايز تفاصيلهم؟',
  'عاجل': 'عندك 3 حالات عاجلة النهارده: أوامر CBC لسه معلقة. عايز أعطيهم أولوية؟',
};

const defaultResponse = 'تمام يا دكتور، فهمت. بشتغل على طلبك ده دلوقتي. محتاج حاجة تانية؟';

function findResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const [keyword, response] of Object.entries(responseMap)) {
    if (lower.includes(keyword)) return response;
  }
  return defaultResponse;
}

export const useVoiceStore = create<VoiceStore>()((set, get) => ({
  voiceState: 'idle',
  panelOpen: false,
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'أهلاً يا دكتور! أنا سونيت، مساعدك الذكي في المعمل. ازاي أقدر أساعدك النهارده؟ 🎤',
      timestamp: new Date(),
    },
  ],
  transcript: '',

  setVoiceState: (s) => set({ voiceState: s }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  closePanel: () => set({ panelOpen: false, voiceState: 'idle', transcript: '' }),

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: `msg_${++msgCounter}`, timestamp: new Date() }],
    })),

  clearMessages: () =>
    set({
      messages: [
        { id: 'welcome', role: 'assistant', content: 'أهلاً يا دكتور! ازاي أقدر أساعدك؟ 🎤', timestamp: new Date() },
      ],
    }),

  setTranscript: (text) => set({ transcript: text }),

  startConversation: (transcript) => {
    // Add user message
    get().addMessage({ role: 'user', content: transcript });

    // Simulate processing
    set({ voiceState: 'processing' });

    setTimeout(() => {
      const response = findResponse(transcript);
      get().addMessage({ role: 'assistant', content: response });
      set({ voiceState: 'speaking' });

      setTimeout(() => {
        set({ voiceState: 'idle', transcript: '' });
      }, 2500);
    }, 1200);
  },
}));
