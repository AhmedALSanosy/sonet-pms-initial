// ============================================================
// Sonet PMS — Sidebar Navigation
// ============================================================

import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FlaskConical,
  Receipt,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { NavSection } from '../../types';

interface NavItem {
  id: NavSection;
  label: string;
  labelAr: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number | string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelAr: 'الرئيسية', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', labelAr: 'المرضى', icon: Users, badge: 1247 },
  { id: 'orders', label: 'Orders', labelAr: 'الطلبات', icon: ClipboardList, badge: 7 },
  { id: 'results', label: 'Results', labelAr: 'النتائج', icon: FlaskConical, badge: '3!' },
  { id: 'invoices', label: 'Invoices', labelAr: 'الفواتير', icon: Receipt },
  { id: 'reports', label: 'Reports', labelAr: 'التقارير', icon: BarChart3 },
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, sidebarCollapsed, toggleSidebar, unreadCount } =
    useAppStore();

  return (
    <aside
      className={`
        relative flex flex-col h-full
        bg-gradient-sidebar border-r border-[#2D2D4E]
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-[#2D2D4E] ${
          sidebarCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center glow-purple-sm">
            <Microscope size={18} className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F0F1A]" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold gradient-text leading-tight">Sonet PMS</p>
            <p className="text-[10px] text-[#6B6890] font-medium tracking-wide">إدارة المعمل الذكي</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="
          absolute -right-3 top-16 z-10
          w-6 h-6 rounded-full
          bg-[#22223A] border border-[#3D3D65]
          flex items-center justify-center
          text-[#A8A4CC] hover:text-white
          hover:border-purple-500 hover:bg-purple-900/30
          transition-all duration-200
        "
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {!sidebarCollapsed && (
          <p className="px-4 mb-2 text-[10px] font-semibold text-[#6B6890] uppercase tracking-widest">
            التنقل
          </p>
        )}
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isCritical = typeof item.badge === 'string' && item.badge.includes('!');

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  title={sidebarCollapsed ? item.labelAr : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-left transition-all duration-200 relative group
                    ${isActive
                      ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
                      : 'text-[#A8A4CC] hover:bg-purple-900/15 hover:text-purple-200 border border-transparent'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-purple-500" />
                  )}

                  <span className={`flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`}>
                    <Icon size={18} />
                  </span>

                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium truncate">{item.labelAr}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`
                            text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                            ${isCritical
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed */}
                  {sidebarCollapsed && (
                    <div className="
                      absolute left-full ml-3 top-1/2 -translate-y-1/2
                      bg-[#22223A] border border-[#3D3D65] rounded-lg px-3 py-1.5
                      text-xs text-white whitespace-nowrap
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200 z-50
                    ">
                      {item.labelAr}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#2D2D4E] p-3 space-y-1">
        {/* Notifications */}
        <button
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-[#A8A4CC] hover:bg-[#22223A] hover:text-white
            transition-all duration-200 relative
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="relative flex-shrink-0">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {!sidebarCollapsed && <span className="text-sm font-medium">الإشعارات</span>}
        </button>

        {/* User Profile */}
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#22223A] cursor-pointer transition-all ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">د.أ</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">د. أحمد المدير</p>
              <p className="text-[10px] text-[#6B6890] truncate">مدير المعمل</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <LogOut size={14} className="text-[#6B6890] hover:text-red-400 transition-colors flex-shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
