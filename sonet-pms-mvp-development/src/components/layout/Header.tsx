// ============================================================
// Sonet PMS — Header
// ============================================================

import React, { useState } from 'react';
import {
  Search,
  Mic,
  Bell,
  RefreshCw,
  ChevronDown,
  Activity,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const sectionTitles: Record<string, { ar: string; en: string }> = {
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  patients: { ar: 'إدارة المرضى', en: 'Patients Management' },
  orders: { ar: 'طلبات التحاليل', en: 'Test Orders' },
  results: { ar: 'نتائج التحاليل', en: 'Test Results' },
  invoices: { ar: 'الفواتير والمدفوعات', en: 'Invoices & Payments' },
  reports: { ar: 'التقارير والإحصائيات', en: 'Reports & Analytics' },
  settings: { ar: 'إعدادات النظام', en: 'System Settings' },
};

const Header: React.FC = () => {
  const {
    activeSection,
    globalSearch,
    setGlobalSearch,
    toggleVoicePanel,
    voicePanelOpen,
    voiceState,
    unreadCount,
    notifications,
    markNotificationRead,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [backendOnline] = useState(true);
  const title = sectionTitles[activeSection] || sectionTitles.dashboard;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isVoiceActive = voiceState !== 'idle' || voicePanelOpen;

  return (
    <header className="flex items-center gap-4 px-5 py-3 border-b border-[#2D2D4E] bg-[#0F0F1A]/80 backdrop-blur-sm flex-shrink-0">
      {/* Section Title */}
      <div className="flex-shrink-0">
        <h1 className="text-base font-bold text-white">{title.ar}</h1>
        <p className="text-[10px] text-[#6B6890] font-medium">{title.en}</p>
      </div>

      {/* Date/Time */}
      <div className="hidden lg:flex flex-col items-start ml-2 pl-4 border-l border-[#2D2D4E]">
        <p className="text-xs font-semibold text-[#A8A4CC]">{timeStr}</p>
        <p className="text-[10px] text-[#6B6890]">{dateStr}</p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={14} className="absolute left-3 text-[#6B6890] pointer-events-none" />
        <input
          type="text"
          placeholder="ابحث عن مريض، طلب، نتيجة..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="
            w-64 pl-9 pr-4 py-2 rounded-xl
            bg-[#161625] border border-[#2D2D4E]
            text-sm text-white placeholder-[#6B6890]
            focus:border-purple-500/60 focus:outline-none
            transition-all duration-200
          "
        />
        {globalSearch && (
          <button
            onClick={() => setGlobalSearch('')}
            className="absolute right-3 text-[#6B6890] hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Backend Status */}
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161625] border border-[#2D2D4E]">
        {backendOnline ? (
          <>
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">متصل</span>
          </>
        ) : (
          <>
            <WifiOff size={12} className="text-red-400" />
            <span className="text-[10px] text-red-400 font-medium">غير متصل</span>
          </>
        )}
        <span className="text-[10px] text-[#6B6890] ml-1">API</span>
      </div>

      {/* Refresh */}
      <button className="w-8 h-8 rounded-lg bg-[#161625] border border-[#2D2D4E] flex items-center justify-center text-[#A8A4CC] hover:text-white hover:border-[#3D3D65] transition-all">
        <RefreshCw size={14} />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-8 h-8 rounded-lg bg-[#161625] border border-[#2D2D4E] flex items-center justify-center text-[#A8A4CC] hover:text-white hover:border-[#3D3D65] transition-all"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold border border-[#0F0F1A]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#1E1E32] border border-[#2D2D4E] rounded-xl shadow-2xl z-50 animate-slide-in-bottom overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D2D4E]">
              <h3 className="text-sm font-semibold text-white">الإشعارات</h3>
              <span className="text-[10px] text-[#6B6890]">{unreadCount} غير مقروء</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`px-4 py-3 border-b border-[#2D2D4E]/50 cursor-pointer hover:bg-[#22223A] transition-colors ${
                    !n.read ? 'bg-purple-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        n.type === 'warning' ? 'bg-yellow-400' :
                        n.type === 'success' ? 'bg-emerald-400' :
                        n.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-[#A8A4CC] mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-[#6B6890] mt-1">
                        {Math.round((Date.now() - n.timestamp.getTime()) / 60000)} د مضت
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 text-center">
              <button className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                عرض كل الإشعارات
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Voice Assistant Button */}
      <button
        onClick={toggleVoicePanel}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
          transition-all duration-300
          ${isVoiceActive
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white glow-purple border border-purple-400/50'
            : 'bg-gradient-to-r from-purple-700/80 to-blue-700/80 text-white border border-purple-500/40 hover:from-purple-600 hover:to-blue-600 hover:glow-purple'
          }
        `}
      >
        {isVoiceActive && (
          <span className="absolute inset-0 rounded-xl animate-pulse-ring bg-purple-500/20 pointer-events-none" />
        )}
        <Mic size={15} className={isVoiceActive ? 'animate-pulse' : ''} />
        <span className="hidden sm:block">
          {isVoiceActive ? 'سونيت نشط' : 'سونيت AI'}
        </span>
        {isVoiceActive && (
          <Activity size={12} className="animate-pulse" />
        )}
      </button>

      {/* User Menu */}
      <div className="flex items-center gap-2 pl-3 border-l border-[#2D2D4E] cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">د.أ</span>
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-semibold text-white leading-tight">د. أحمد</p>
          <p className="text-[10px] text-[#6B6890]">مدير</p>
        </div>
        <ChevronDown size={12} className="text-[#6B6890]" />
      </div>
    </header>
  );
};

export default Header;
