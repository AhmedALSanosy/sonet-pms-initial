// ============================================================
// Sonet PMS — Zustand Global Store
// ============================================================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  NavSection,
  VoiceState,
  VoiceMessage,
  Patient,
  TestOrder,
  TestResult,
  Invoice,
  Notification,
  DashboardStats,
} from '../types';
import { mockPatients, mockOrders, mockResults, mockInvoices } from '../data/mockData';

interface AppState {
  // ---- Navigation ----
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // ---- Voice Assistant ----
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  voicePanelOpen: boolean;
  toggleVoicePanel: () => void;
  closeVoicePanel: () => void;
  voiceMessages: VoiceMessage[];
  addVoiceMessage: (msg: Omit<VoiceMessage, 'id' | 'timestamp'>) => void;
  clearVoiceMessages: () => void;
  transcript: string;
  setTranscript: (text: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;

  // ---- Data ----
  patients: Patient[];
  orders: TestOrder[];
  results: TestResult[];
  invoices: Invoice[];

  // ---- Notifications ----
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;

  // ---- Dashboard Stats ----
  stats: DashboardStats;

  // ---- Search ----
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // ---- Theme ----
  accentColor: 'purple' | 'blue';
  setAccentColor: (c: 'purple' | 'blue') => void;
}

let msgCounter = 0;
let notifCounter = 0;

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // ---- Navigation ----
    activeSection: 'dashboard',
    setActiveSection: (section) => set({ activeSection: section }),
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

    // ---- Voice Assistant ----
    voiceState: 'idle',
    setVoiceState: (state) => set({ voiceState: state }),
    voicePanelOpen: false,
    toggleVoicePanel: () => set((s) => ({ voicePanelOpen: !s.voicePanelOpen })),
    closeVoicePanel: () => set({ voicePanelOpen: false, voiceState: 'idle', isListening: false }),
    voiceMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'أهلاً! أنا سونيت، مساعدك الذكي في المعمل. ازاي أقدر أساعدك النهارده؟',
        timestamp: new Date(),
      },
    ],
    addVoiceMessage: (msg) =>
      set((s) => ({
        voiceMessages: [
          ...s.voiceMessages,
          { ...msg, id: `msg_${++msgCounter}`, timestamp: new Date() },
        ],
      })),
    clearVoiceMessages: () =>
      set({
        voiceMessages: [
          {
            id: 'welcome',
            role: 'assistant',
            content: 'أهلاً! أنا سونيت، مساعدك الذكي في المعمل. ازاي أقدر أساعدك النهارده؟',
            timestamp: new Date(),
          },
        ],
      }),
    transcript: '',
    setTranscript: (text) => set({ transcript: text }),
    isListening: false,
    startListening: () => {
      set({ isListening: true, voiceState: 'listening', transcript: '' });
      // Simulate voice recognition (replace with Whisper in Tauri)
      const responses = [
        'أعرض لي نتايج المريض أحمد محمد',
        'فيه كام أوردر معلق النهارده؟',
        'افتح ملف المريض رقم 1042',
        'امسح الكاش وحدث البيانات',
        'عرّف لي نتيجة CBC للمريض ده',
      ];
      const r = responses[Math.floor(Math.random() * responses.length)];
      let i = 0;
      const iv = setInterval(() => {
        if (i < r.length) {
          set((s) => ({ transcript: s.transcript + r[i] }));
          i++;
        } else {
          clearInterval(iv);
          set({ isListening: false, voiceState: 'processing' });
          // Add user message
          get().addVoiceMessage({ role: 'user', content: r });
          // Simulate assistant response
          setTimeout(() => {
            set({ voiceState: 'speaking' });
            const assistantResponses: Record<string, string> = {
              'أعرض لي نتايج المريض أحمد محمد': 'حاضر! نتايج المريض أحمد محمد جاهزة. فيه نتيجة CBC كاملة ونتيجة Blood Sugar. الـ CBC اتمت النهارده الساعة 10 الصبح وكل الأرقام في النطاق الطبيعي.',
              'فيه كام أوردر معلق النهارده؟': 'عندك 7 أوردرات معلقة النهارده. 2 منهم عاجلين: مريضة سارة علي وطفل محمد حسن. باقي الـ 5 أوردرات عادية ومفروض تتمم قبل الساعة 4 العصر.',
              'افتح ملف المريض رقم 1042': 'بفتح ملف المريض رقم 1042 — فاطمة إبراهيم، عمرها 34 سنة. آخر زيارة كانت 3 أيام فاتوا. عندها طلب تحاليل بتاريخ النهارده جاهز للاستلام.',
              'امسح الكاش وحدث البيانات': 'تم تحديث البيانات بنجاح! الكاش اتمسح وكل الداتا محدودة دلوقتي.',
              'عرّف لي نتيجة CBC للمريض ده': 'نتيجة CBC للمريض: Hemoglobin 13.5 g/dL — طبيعي. WBC 7200 — طبيعي. Platelets 250,000 — طبيعي. الصورة الدموية الكاملة تمام والحمد لله!',
            };
            get().addVoiceMessage({
              role: 'assistant',
              content: assistantResponses[r] || 'تمام، بشتغل على طلبك دلوقتي!',
            });
            setTimeout(() => set({ voiceState: 'idle', transcript: '' }), 2000);
          }, 1500);
        }
      }, 40);
    },
    stopListening: () => set({ isListening: false, voiceState: 'idle', transcript: '' }),

    // ---- Data ----
    patients: mockPatients,
    orders: mockOrders,
    results: mockResults,
    invoices: mockInvoices,

    // ---- Notifications ----
    notifications: [
      { id: 'n1', type: 'warning', title: 'نتيجة حرجة', message: 'مريض: محمد علي — Potassium 6.8 mEq/L', timestamp: new Date(Date.now() - 300000), read: false },
      { id: 'n2', type: 'success', title: 'أوردر مكتمل', message: 'CBC + LFT للمريضة فاطمة إبراهيم جاهزة', timestamp: new Date(Date.now() - 900000), read: false },
      { id: 'n3', type: 'info', title: 'تحديث النظام', message: 'إصدار Sonet PMS v1.2.0 متاح', timestamp: new Date(Date.now() - 3600000), read: true },
    ],
    addNotification: (n) =>
      set((s) => ({
        notifications: [
          { ...n, id: `notif_${++notifCounter}`, timestamp: new Date(), read: false },
          ...s.notifications,
        ],
        unreadCount: s.unreadCount + 1,
      })),
    markNotificationRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    unreadCount: 2,

    // ---- Dashboard Stats ----
    stats: {
      totalPatients: 1247,
      todayOrders: 38,
      pendingResults: 12,
      todayRevenue: 15840,
      completionRate: 94,
      urgentCases: 3,
    },

    // ---- Search ----
    globalSearch: '',
    setGlobalSearch: (q) => set({ globalSearch: q }),

    // ---- Theme ----
    accentColor: 'purple',
    setAccentColor: (c) => set({ accentColor: c }),
  }))
);
