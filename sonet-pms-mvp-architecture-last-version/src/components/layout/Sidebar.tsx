// ============================================================
// Sonet PMS — Sidebar (Responsive: Drawer on mobile, Collapse on desktop)
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardList, FlaskConical,
  Receipt, BarChart3, Settings,
  Microscope, Bell, LogOut, X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { NavSection } from '../../types';

interface NavItem { id: NavSection; labelAr: string; icon: React.ReactNode; badge?: string | number }

const navItems: NavItem[] = [
  { id: 'dashboard', labelAr: 'الرئيسية', icon: <LayoutDashboard size={18} /> },
  { id: 'patients', labelAr: 'المرضى', icon: <Users size={18} />, badge: '1,247' },
  { id: 'orders', labelAr: 'الطلبات', icon: <ClipboardList size={18} />, badge: 7 },
  { id: 'results', labelAr: 'النتائج', icon: <FlaskConical size={18} />, badge: '3!' },
  { id: 'invoices', labelAr: 'الفواتير', icon: <Receipt size={18} /> },
  { id: 'reports', labelAr: 'التقارير', icon: <BarChart3 size={18} /> },
  { id: 'settings', labelAr: 'الإعدادات', icon: <Settings size={18} /> },
];

function NavContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { activeSection, setActiveSection, unreadCount } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      {/* ─── Logo ─── */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-border/40 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow-purple-sm">
            <Microscope size={17} className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-bg-base" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="overflow-hidden">
              <p className="text-sm font-bold gradient-text leading-tight">Sonet PMS</p>
              <p className="text-[10px] text-text-muted font-medium tracking-wide">إدارة المعمل الذكي</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Section Label ─── */}
      {!collapsed && <p className="px-5 mt-4 mb-2 text-[9px] font-semibold text-text-muted uppercase tracking-widest">التنقل</p>}

      {/* ─── Nav Items ─── */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isCritical = typeof item.badge === 'string' && item.badge.includes('!');
            return (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveSection(item.id); onNavigate?.(); }}
                  title={collapsed ? item.labelAr : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${collapsed ? 'justify-center' : ''} ${
                    isActive ? 'nav-item-active bg-primary/15 border border-primary/25' : 'nav-item border border-transparent text-text-secondary'
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-primary" />}
                  <span className={`flex-shrink-0 ${isActive ? 'text-primary-light' : ''}`}>{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-[13px] font-medium truncate font-cairo">{item.labelAr}</span>
                      {item.badge !== undefined && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                          isCritical ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-primary/15 text-primary-light border border-primary/20'
                        }`}>{item.badge}</span>
                      )}
                    </>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-bg-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl font-cairo">
                      {item.labelAr}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Bottom Section ─── */}
      <div className="border-t border-border/40 p-2 space-y-1">
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-all relative ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative flex-shrink-0"><Bell size={17} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-danger text-[8px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
          </div>
          {!collapsed && <span className="text-[13px] font-medium font-cairo">الإشعارات</span>}
        </button>
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-bg-hover cursor-pointer transition-all ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">د.أ</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-text-primary truncate font-cairo">د. أحمد المدير</p>
              <p className="text-[9px] text-text-muted truncate">مدير المعمل</p>
            </div>
          )}
          {!collapsed && <LogOut size={14} className="text-text-muted hover:text-danger flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen } = useAppStore();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // ─── Mobile: Drawer overlay ───
  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: 260 }} animate={{ x: 0 }} exit={{ x: 260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="fixed top-0 right-0 h-full w-[260px] gradient-sidebar border-l border-border/60 z-50 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 left-3 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-hover transition-colors z-10"
              >
                <X size={18} />
              </button>
              <NavContent collapsed={false} onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ─── Desktop: Collapsible sidebar ───
  return (
    <aside
      className={`relative flex flex-col h-full gradient-sidebar border-l border-border/60 transition-all duration-300 ease-in-out flex-shrink-0 ${
        sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      <NavContent collapsed={sidebarCollapsed} />
    </aside>
  );
}
