import { motion } from 'framer-motion';
import { FileCheck2, Printer, Download, Eye, Search } from 'lucide-react';

const results = [
  { id: 'RES-3201', patient: 'محمد عبدالرحمن', test: 'CBC', status: 'normal', date: 'اليوم — 10:30 ص' },
  { id: 'RES-3200', patient: 'سارة محمود علي', test: 'Glucose', status: 'abnormal', date: 'اليوم — 9:45 ص' },
  { id: 'RES-3199', patient: 'أحمد حسن إبراهيم', test: 'Liver Function', status: 'normal', date: 'اليوم — 9:15 ص' },
  { id: 'RES-3198', patient: 'فاطمة أحمد سعيد', test: 'Thyroid Panel', status: 'critical', date: 'أمس — 4:30 م' },
  { id: 'RES-3197', patient: 'حسين محمد حسن', test: 'Lipid Profile', status: 'normal', date: 'أمس — 3:00 م' },
];

const statusColors: Record<string, { label: string; class: string }> = {
  normal: { label: 'طبيعي', class: 'text-success bg-success/10 border-success/20' },
  abnormal: { label: 'غير طبيعي', class: 'text-warning bg-warning/10 border-warning/20' },
  critical: { label: 'حرج', class: 'text-danger bg-danger/10 border-danger/20' },
};

export default function Results() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">النتائج</h2>
          <p className="text-sm text-text-muted font-cairo">89 نتيجة جاهزة للتسليم</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
            <Printer size={16} />
            طباعة
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
            <Download size={16} />
            تصدير
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-surface-secondary rounded-xl px-4 py-2.5 border border-border/50">
          <Search size={16} className="text-text-muted" />
          <input type="text" placeholder="بحث بالنتائج..." className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, i) => {
          const status = statusColors[result.status];
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-secondary rounded-xl p-4 border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light">
                    <FileCheck2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary-light">{result.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border ${status.class}`}>{status.label}</span>
                    </div>
                    <h4 className="text-sm font-medium text-text-primary font-cairo mt-1">{result.patient}</h4>
                    <p className="text-xs text-text-muted mt-0.5 font-cairo">{result.test} — {result.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors">
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
