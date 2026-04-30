import { useAppStore, type Page } from '../../store/useAppStore';
import {
  LayoutDashboard,
  Users,
  TestTube2,
  FileCheck2,
  Receipt,
  BarChart3,
  Settings,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: Page;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: <LayoutDashboard size={22} /> },
  { id: 'patients', label: 'Patients', labelAr: 'المرضى', icon: <Users size={22} /> },
  { id: 'orders', label: 'Test Orders', labelAr: 'طلبات التحاليل', icon: <TestTube2 size={22} /> },
  { id: 'results', label: 'Results', labelAr: 'النتائج', icon: <FileCheck2 size={22} /> },
  { id: 'invoices', label: 'Invoices', labelAr: 'الفواتير', icon: <Receipt size={22} /> },
  { id: 'reports', label: 'Reports', labelAr: 'التقارير', icon: <BarChart3 size={22} /> },
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', icon: <Settings size={22} /> },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen flex flex-col bg-surface-secondary border-r border-border relative z-30"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <FlaskConical size={22} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <h1 className="text-base font-bold text-text-primary whitespace-nowrap font-cairo">
                Sonet PMS
              </h1>
              <p className="text-[10px] text-text-muted whitespace-nowrap">Lab Management System</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'gradient-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                }
              `}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary-light'}`}>
                {item.icon}
              </span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.labelAr}
                  </motion.span>
                )}
              </AnimatePresence>
              {!sidebarOpen && (
                <div className="absolute right-full mr-2 px-2 py-1 bg-surface-tertiary text-text-primary text-xs rounded-md 
                  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.labelAr}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          {sidebarOpen && <span className="text-xs">طي القائمة</span>}
        </button>
      </div>
    </motion.aside>
  );
}
