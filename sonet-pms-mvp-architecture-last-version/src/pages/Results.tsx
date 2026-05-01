// ============================================================
// Sonet PMS — Results Page (with Critical Alert Banner + Full Table)
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Printer, AlertTriangle, TrendingUp, Share2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { mockResults } from '../data/mockData';
import type { ResultStatus } from '../types';

const statusConfig: Record<ResultStatus, { label: string; class: string; dot: string }> = {
  normal: { label: 'طبيعي', class: 'badge-success', dot: 'bg-success' },
  abnormal: { label: 'غير طبيعي', class: 'badge-warning', dot: 'bg-warning' },
  critical: { label: 'حرج', class: 'badge-danger', dot: 'bg-danger' },
  pending: { label: 'معلق', class: 'badge-purple', dot: 'bg-primary' },
};

export default function Results() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return mockResults.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.patientName.includes(q) || r.testName.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  const criticalCount = mockResults.filter(r => r.status === 'critical').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Critical Alert Banner */}
      <AnimatePresence>
        {criticalCount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 flex-shrink-0">
            <AlertTriangle size={16} className="text-danger flex-shrink-0 animate-pulse" />
            <p className="text-xs text-danger/90 font-semibold font-cairo">
              تنبيه! يوجد <span className="font-bold">{criticalCount}</span> نتيجة حرجة تحتاج مراجعة فورية
            </p>
            <button onClick={() => setFilterStatus('critical')} className="mr-auto text-[10px] text-danger border border-danger/30 px-3 py-1 rounded-lg hover:bg-danger/10 transition-colors font-cairo">
              مراجعة الآن
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-sm flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 border border-border/40">
          <Eye size={14} className="text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث باسم المريض أو التحليل..." className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'critical', label: 'حرج' },
            { key: 'abnormal', label: 'غير طبيعي' },
            { key: 'normal', label: 'طبيعي' },
            { key: 'pending', label: 'معلق' },
          ].map(s => (
            <button key={s.key} onClick={() => setFilterStatus(s.key)}
              className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all font-cairo ${
                filterStatus === s.key ? 'badge-purple' : 'text-text-muted border border-transparent hover:border-border/50'
              }`}>
              {s.label}
              {s.key === 'critical' && criticalCount > 0 && (
                <span className="ml-1 text-[9px] bg-danger text-white rounded-full px-1.5 py-0.5 font-bold">{criticalCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="bg-bg-surface rounded-2xl border border-border/40 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border/30 bg-bg-base/50">
                {['المريض', 'التحليل', 'النتيجة', 'الوحدة', 'المرجع', 'الحالة', 'المراجع', 'إجراءات'].map((h, i) => (
                  <th key={i} className="text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5 font-cairo">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((result, i) => {
                const sc = statusConfig[result.status];
                const isCritical = result.status === 'critical';
                return (
                  <motion.tr key={result.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className={`border-b border-border/15 cursor-pointer transition-colors ${isCritical ? 'bg-danger/5' : i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className="px-5 py-3">
                      <p className="text-xs font-semibold text-text-primary font-cairo">{result.patientName}</p>
                      <p className="text-[10px] text-text-muted font-mono">{result.orderId}</p>
                    </td>
                    <td className="px-5 py-3"><p className="text-xs text-text-secondary font-cairo">{result.testName}</p></td>
                    <td className="px-5 py-3">
                      <p className={`text-sm font-bold font-mono ${
                        isCritical ? 'text-danger' : result.status === 'abnormal' ? 'text-warning' : result.status === 'normal' ? 'text-success' : 'text-text-muted'
                      }`}>
                        {isCritical && '⚠️ '}{result.value}
                      </p>
                    </td>
                    <td className="px-5 py-3"><span className="text-[11px] text-text-muted">{result.unit || '—'}</span></td>
                    <td className="px-5 py-3"><span className="text-[11px] text-text-secondary">{result.referenceRange}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sc.class}`}>{sc.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="text-xs text-text-secondary font-cairo">{result.reviewedBy || '—'}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"><TrendingUp size={13} /></button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-light hover:bg-accent/10 transition-all"><Printer size={13} /></button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-success hover:bg-success/10 transition-all"><Share2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
