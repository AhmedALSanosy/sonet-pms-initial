// ============================================================
// Sonet PMS — Global Search (Command Palette ⌘K)
// ============================================================
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, TestTube2, FileCheck2, Receipt, ArrowUpLeft, Command } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { mockPatients, mockOrders, mockResults, mockInvoices } from '../../data/mockData';
import type { NavSection } from '../../types';

type SearchType = 'patient' | 'order' | 'result' | 'invoice' | 'nav';
interface SearchResult { id: string; type: SearchType; title: string; subtitle: string; section: NavSection }

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setActiveSection } = useAppStore();

  useEffect(() => { if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 100); } }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const patientResults = mockPatients
      .filter(p => p.nameAr.includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q))
      .map(p => ({ id: p.id, type: 'patient' as const, title: p.nameAr, subtitle: `${p.id} · ${p.phone}`, section: 'patients' as NavSection }));

    const orderResults = mockOrders
      .filter(o => o.patientName.includes(q) || o.id.toLowerCase().includes(q))
      .map(o => ({ id: o.id, type: 'order' as const, title: o.patientName, subtitle: `${o.id} · ${o.tests.join(', ')}`, section: 'orders' as NavSection }));

    const resultResults = mockResults
      .filter(r => r.patientName.includes(q) || r.testName.toLowerCase().includes(q))
      .map(r => ({ id: r.id, type: 'result' as const, title: `${r.patientName} — ${r.testName}`, subtitle: `${r.value} ${r.unit}`, section: 'results' as NavSection }));

    const invoiceResults = mockInvoices
      .filter(inv => inv.patientName.includes(q) || inv.id.toLowerCase().includes(q))
      .map(inv => ({ id: inv.id, type: 'invoice' as const, title: inv.patientName, subtitle: `${inv.id} · ${inv.total} ج`, section: 'invoices' as NavSection }));

    const navItems = [
      { title: 'لوحة التحكم', sub: 'Dashboard', s: 'dashboard' as NavSection },
      { title: 'المرضى', sub: 'Patients', s: 'patients' as NavSection },
      { title: 'طلبات التحاليل', sub: 'Orders', s: 'orders' as NavSection },
      { title: 'النتائج', sub: 'Results', s: 'results' as NavSection },
      { title: 'الفواتير', sub: 'Invoices', s: 'invoices' as NavSection },
      { title: 'التقارير', sub: 'Reports', s: 'reports' as NavSection },
      { title: 'الإعدادات', sub: 'Settings', s: 'settings' as NavSection },
    ];
    const navResults = navItems
      .filter(n => n.title.includes(q) || n.sub.toLowerCase().includes(q))
      .map((n, idx) => ({ id: `nav-${idx}`, type: 'nav' as const, title: n.title, subtitle: n.sub, section: n.s }));

    return [...patientResults, ...orderResults, ...resultResults, ...invoiceResults, ...navResults].slice(0, 12);
  }, [query]);

  const icons: Record<string, React.ReactNode> = { patient: <Users size={14} />, order: <TestTube2 size={14} />, result: <FileCheck2 size={14} />, invoice: <Receipt size={14} />, nav: <Command size={14} /> };
  const colors: Record<string, string> = { patient: 'text-primary-light bg-primary/10', order: 'text-accent-light bg-accent/10', result: 'text-success bg-success/10', invoice: 'text-warning bg-warning/10', nav: 'text-text-muted bg-bg-hover' };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }} transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-lg bg-bg-elevated border border-border/60 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <Search size={18} className="text-text-muted flex-shrink-0" />
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="بحث عن مريض، طلب، نتيجة، فاتورة..." className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none font-cairo" />
              <kbd className="text-[9px] text-text-muted bg-bg-hover px-2 py-0.5 rounded border border-border/50 font-mono">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {results.length === 0 && query.trim() && <div className="px-5 py-8 text-center"><p className="text-xs text-text-muted font-cairo">مفيش نتايج لـ "{query}"</p></div>}
              {results.length === 0 && !query.trim() && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-text-muted font-cairo mb-3">ابحث في كل بيانات المعمل</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {[{ l: 'المرضى', s: 'patients' }, { l: 'الطلبات', s: 'orders' }, { l: 'النتائج', s: 'results' }, { l: 'الفواتير', s: 'invoices' }, { l: 'التقارير', s: 'reports' }, { l: 'الإعدادات', s: 'settings' }].map(n => (
                      <button key={n.s} onClick={() => { setActiveSection(n.s as NavSection); onClose(); }} className="text-[10px] px-2.5 py-1 rounded-lg bg-bg-hover text-text-secondary hover:text-primary-light transition-colors font-cairo">{n.l}</button>
                    ))}
                  </div>
                </div>
              )}
              {results.map(r => (
                <button key={`${r.type}-${r.id}`} onClick={() => { setActiveSection(r.section); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover/50 transition-colors text-right">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[r.type]}`}>{icons[r.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate font-cairo">{r.title}</p>
                    <p className="text-[10px] text-text-muted truncate">{r.subtitle}</p>
                  </div>
                  <ArrowUpLeft size={12} className="text-text-muted flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
