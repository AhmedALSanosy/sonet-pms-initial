import { useAppStore } from '../../store/useAppStore';
import { Mic, Bell, Search, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const pageLabels: Record<string, { ar: string; en: string }> = {
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  patients: { ar: 'إدارة المرضى', en: 'Patient Management' },
  orders: { ar: 'طلبات التحاليل', en: 'Test Orders' },
  results: { ar: 'النتائج', en: 'Results' },
  invoices: { ar: 'الفواتير', en: 'Invoices' },
  reports: { ar: 'التقارير', en: 'Reports' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
};

export default function Header() {
  const { currentPage, userName, toggleVoiceAssistant, voice } = useAppStore();
  const currentLabel = pageLabels[currentPage];

  return (
    <header className="h-16 border-b border-border bg-surface-secondary/50 backdrop-blur-md flex items-center justify-between px-6 relative z-20">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary font-cairo">
            {currentLabel?.ar}
          </h2>
          <p className="text-xs text-text-muted">{currentLabel?.en}</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface-tertiary/60 rounded-xl px-4 py-2 w-96 border border-border/50 focus-within:border-primary/50 transition-colors">
        <Search size={16} className="text-text-muted" />
        <input
          type="text"
          placeholder="بحث عن مريض، تحليل، فاتورة..."
          className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo"
        />
        <kbd className="text-[10px] text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-border">
          ⌘K
        </kbd>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Voice Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleVoiceAssistant}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
            ${voice.isListening
              ? 'gradient-primary text-white shadow-lg shadow-primary/30'
              : 'bg-surface-tertiary text-text-secondary hover:text-primary-light hover:bg-surface-tertiary/80 border border-border/50'
            }
          `}
        >
          {voice.isListening && (
            <span className="absolute inset-0 rounded-xl gradient-primary animate-pulse-ring opacity-50" />
          )}
          <Mic size={18} className={voice.isListening ? 'animate-pulse' : ''} />
          <span className="hidden sm:inline font-cairo">المساعد الصوتي</span>
        </motion.button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Fullscreen */}
        <button className="p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors">
          <Maximize2 size={18} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary font-cairo">{userName}</p>
            <p className="text-[10px] text-text-muted">مدير المعمل</p>
          </div>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold">
            د
          </div>
        </div>
      </div>
    </header>
  );
}
