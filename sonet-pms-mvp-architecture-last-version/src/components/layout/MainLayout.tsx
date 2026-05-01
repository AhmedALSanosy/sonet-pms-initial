// ============================================================
// Sonet PMS — Main Layout (Auth + Search + Responsive)
// ============================================================
import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import VoiceWidget from '../voice/VoiceWidget';
import GlobalSearch from './GlobalSearch';
import { useAppStore } from '../../store/useAppStore';

const Dashboard = lazy(() => import('../dashboard/Dashboard'));
const Patients = lazy(() => import('../../pages/Patients'));
const TestOrders = lazy(() => import('../../pages/TestOrders'));
const Results = lazy(() => import('../../pages/Results'));
const Invoices = lazy(() => import('../../pages/Invoices'));
const Reports = lazy(() => import('../../pages/Reports'));
const Settings = lazy(() => import('../../pages/Settings'));

const pages: Record<string, React.LazyExoticComponent<React.FC>> = {
  dashboard: Dashboard, patients: Patients, orders: TestOrders,
  results: Results, invoices: Invoices, reports: Reports, settings: Settings,
};

const PageLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
      </div>
      <p className="text-xs text-text-muted font-cairo">جاري التحميل...</p>
    </div>
  </div>
);

export default function MainLayout() {
  const { activeSection } = useAppStore();
  const PageComponent = pages[activeSection] || Dashboard;
  const [searchOpen, setSearchOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    if (e.key === 'Escape') setSearchOpen(false);
  }, []);

  useEffect(() => { document.addEventListener('keydown', handleKeyDown); return () => document.removeEventListener('keydown', handleKeyDown); }, [handleKeyDown]);

  return (
    <div className="flex h-dvh h-screen bg-bg-base overflow-hidden" dir="rtl">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }} className="h-full">
              <Suspense fallback={<PageLoader />}><PageComponent /></Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <VoiceWidget />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
