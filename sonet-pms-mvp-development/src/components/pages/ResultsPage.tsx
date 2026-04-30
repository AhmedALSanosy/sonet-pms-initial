// ============================================================
// Sonet PMS — Results Page
// ============================================================

import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, TrendingUp, Printer, Share2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const statusConfig = {
  normal: { label: 'طبيعي', class: 'badge-success', dot: 'bg-emerald-400' },
  abnormal: { label: 'غير طبيعي', class: 'badge-warning', dot: 'bg-amber-400' },
  critical: { label: 'حرج', class: 'badge-danger', dot: 'bg-red-400' },
  pending: { label: 'معلق', class: 'badge-purple', dot: 'bg-purple-400' },
};

const ResultsPage: React.FC = () => {
  const { results } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.patientName.includes(q) || r.testName.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [results, search, filterStatus]);

  const criticalCount = results.filter((r) => r.status === 'critical').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex-shrink-0 animate-slide-in-bottom">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-sm text-red-300 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
            تنبيه! يوجد <span className="font-bold">{criticalCount}</span> نتيجة حرجة تحتاج مراجعة فورية
          </p>
          <button className="ml-auto text-[11px] text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
            مراجعة الآن
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6890]" />
          <input
            type="text"
            placeholder="بحث باسم المريض أو التحليل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-white placeholder-[#6B6890] focus:border-purple-500/60 focus:outline-none transition-all"
            style={{ direction: 'rtl' }}
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'critical', 'abnormal', 'normal', 'pending'].map((s) => {
            const labels: Record<string, string> = { all: 'الكل', critical: 'حرج', abnormal: 'غير طبيعي', normal: 'طبيعي', pending: 'معلق' };
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-[#6B6890] hover:text-white border border-transparent hover:border-[#2D2D4E]'
                }`}
              >
                {labels[s]}
                {s === 'critical' && criticalCount > 0 && (
                  <span className="ml-1 text-[9px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">{criticalCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2D2D4E] bg-[#0F0F1A]/50">
                {['المريض', 'التحليل', 'النتيجة', 'الوحدة', 'المرجع', 'الحالة', 'المراجع', 'إجراءات'].map((h, i) => (
                  <th key={i} className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((result, i) => {
                const sc = statusConfig[result.status];
                const isCritical = result.status === 'critical';
                return (
                  <tr
                    key={result.id}
                    className={`border-b border-[#2D2D4E]/30 table-row-hover cursor-pointer transition-colors ${
                      isCritical ? 'bg-red-900/5' : i % 2 === 0 ? '' : 'bg-white/[0.02]'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                        {result.patientName}
                      </p>
                      <p className="text-[10px] text-[#6B6890] font-mono">{result.orderId}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-[#A8A4CC]">{result.testName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className={`text-sm font-bold ${
                        isCritical ? 'text-red-300' :
                        result.status === 'abnormal' ? 'text-amber-300' :
                        result.status === 'normal' ? 'text-emerald-300' : 'text-[#6B6890]'
                      }`}>
                        {isCritical && '⚠️ '}{result.value}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-[#6B6890]">{result.unit || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-[#A8A4CC]">{result.referenceRange}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.class}`}>{sc.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-[#A8A4CC]">{result.reviewedBy || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                          <TrendingUp size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <Printer size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                          <Share2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
