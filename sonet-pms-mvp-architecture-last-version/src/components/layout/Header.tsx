// ============================================================
// Sonet PMS — Header (Responsive + Hamburger for mobile)
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Bell, Search, Maximize2, Wifi, WifiOff, RefreshCw, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useVoiceStore } from '../../store/useVoiceStore';

export default function Header({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { activeSection, notifications, unreadCount, globalSearch, setGlobalSearch, markNotificationRead, toggleSidebar, sidebarCollapsed, setSidebarOpen } = useAppStore();
  const { togglePanel, voiceState } = useVoiceStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const check = async () => { try { const r = await fetch('http://localhost:8000/api/health'); setBackendOnline(r.ok); } catch { setBackendOnline(false); } };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, []);

  const sectionLabels: Record<string, string> = {
    dashboard: 'لوحة التحكم', patients: 'إدارة المرضى', orders: 'طلبات التحاليل',
    results: 'النتائج', invoices: 'الفواتير', reports: 'التقارير', settings: 'الإعدادات',
  };

  const notifTypeColors: Record<string, string> = { error: 'bg-danger', warning: 'bg-warning', success: 'bg-success', info: 'bg-info' };
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <header className="h-14 border-b border-border/40 bg-bg-base/80 backdrop-blur-md flex items-center justify-between px-3 md:px-5 relative z-30 flex-shrink-0 gap-2">
      {/* ─── Left: Menu + Title ─── */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {isMobile ? (
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
            <Menu size={20} />
          </button>
        ) : (
          <button onClick={toggleSidebar} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title={sidebarCollapsed ? 'فتح القائمة' : 'طي القائمة'}>
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
        <h2 className="text-sm font-semibold text-text-primary font-cairo truncate hidden sm:block">{sectionLabels[activeSection]}</h2>
      </div>

      {/* ─── Center: Search ─── */}
      <button onClick={() => onOpenSearch?.()} className="hidden lg:flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-1.5 w-72 border border-border/40 flex-shrink hover:border-border transition-colors">
        <Search size={14} className="text-text-muted flex-shrink-0" />
        <span className="text-xs text-text-muted font-cairo">بحث عن مريض، تحليل، فاتورة...</span>
        <kbd className="text-[9px] text-text-muted bg-bg-hover px-1.5 py-0.5 rounded border border-border/50 ml-auto font-mono">⌘K</kbd>
      </button>

      {/* Mobile search toggle */}
      <button onClick={() => onOpenSearch?.()} className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
        <Search size={18} />
      </button>

      {/* ─── Actions ─── */}
      <div className="flex items-center gap-1 md:gap-1.5">
        {/* Backend Status — desktop only */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] border border-border/30">
          {backendOnline ? <><Wifi size={11} className="text-success" /><span className="text-success font-cairo">متصل</span></> : <><WifiOff size={11} className="text-text-muted" /><span className="text-text-muted font-cairo">غير متصل</span></>}
          <span className="text-text-muted">API</span>
        </div>

        {/* Refresh */}
        <button className="hidden md:block p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"><RefreshCw size={14} /></button>

        {/* ─── Notifications ─── */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
            <Bell size={16} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-danger rounded-full text-[8px] text-white flex items-center justify-center font-bold px-0.5">{unreadCount}</span>}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-80 max-h-64 bg-bg-elevated border border-border/60 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                  <span className="text-xs font-semibold text-text-primary font-cairo">الإشعارات</span>
                  <span className="text-[10px] text-primary-light font-cairo">{unreadCount} غير مقروء</span>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-right px-4 py-2.5 border-b border-border/15 cursor-pointer hover:bg-bg-hover transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notifTypeColors[n.type] || 'bg-info'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-text-primary font-cairo">{n.title}</p>
                          <p className="text-[10px] text-text-muted font-cairo mt-0.5 truncate">{n.message}</p>
                          <p className="text-[9px] text-text-muted mt-1">{Math.round((Date.now() - n.timestamp.getTime()) / 60000)} د مضت</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice Button */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={togglePanel}
          className={`relative flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 font-cairo ${
            voiceState !== 'idle' ? 'btn-primary text-white glow-purple-sm' : 'bg-bg-surface text-text-secondary border border-border/40 hover:text-primary-light hover:border-primary/30'
          }`}>
          <Mic size={14} className={voiceState !== 'idle' ? 'animate-pulse' : ''} />
          <span className="hidden md:inline">المساعد</span>
        </motion.button>

        {/* Fullscreen */}
        <button className="hidden md:block p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"><Maximize2 size={14} /></button>

        {/* User */}
        <div className="flex items-center gap-2 pr-2 md:pr-3 mr-0.5 md:mr-1 border-r border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-medium text-text-primary font-cairo">د. أحمد</p>
            <p className="text-[9px] text-text-muted">مدير المعمل</p>
          </div>
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">دأ</div>
        </div>
      </div>

      {/* ─── Mobile Search Overlay ─── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-bg-elevated border-b border-border/50 p-3 z-50 shadow-xl"
          >
            <div className="flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2.5 border border-border/40">
              <Search size={14} className="text-text-muted" />
              <input autoFocus type="text" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="بحث..." className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
