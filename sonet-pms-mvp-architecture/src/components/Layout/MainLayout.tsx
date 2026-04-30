import Sidebar from './Sidebar';
import Header from './Header';
import VoiceAssistantWidget from '../VoiceAssistant/VoiceAssistantWidget';
import Dashboard from '../Dashboard/Dashboard';
import Patients from '../../pages/Patients';
import TestOrders from '../../pages/TestOrders';
import Results from '../../pages/Results';
import Invoices from '../../pages/Invoices';
import Reports from '../../pages/Reports';
import Settings from '../../pages/Settings';
import { useAppStore } from '../../store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

const pages: Record<string, React.FC> = {
  dashboard: Dashboard,
  patients: Patients,
  orders: TestOrders,
  results: Results,
  invoices: Invoices,
  reports: Reports,
  settings: Settings,
};

export default function MainLayout() {
  const { currentPage } = useAppStore();
  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Voice Assistant Overlay */}
      <VoiceAssistantWidget />
    </div>
  );
}
