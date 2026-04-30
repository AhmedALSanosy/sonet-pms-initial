// ============================================================
// Sonet PMS — Main Layout Shell
// ============================================================

import React, { Suspense, lazy } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import VoiceAssistantWidget from '../voice/VoiceAssistantWidget';
import { useAppStore } from '../../store/useAppStore';

// Lazy load pages
const Dashboard = lazy(() => import('../dashboard/Dashboard'));
const PatientsPage = lazy(() => import('../pages/PatientsPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const ResultsPage = lazy(() => import('../pages/ResultsPage'));
const InvoicesPage = lazy(() => import('../pages/InvoicesPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const PageLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
      </div>
      <p className="text-sm text-[#6B6890]">جاري التحميل...</p>
    </div>
  </div>
);

const MainLayout: React.FC = () => {
  const { activeSection } = useAppStore();

  const renderPage = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <PatientsPage />;
      case 'orders': return <OrdersPage />;
      case 'results': return <ResultsPage />;
      case 'invoices': return <InvoicesPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0F0F1A]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>

      {/* Voice Assistant Widget — Floating */}
      <VoiceAssistantWidget />
    </div>
  );
};

export default MainLayout;
