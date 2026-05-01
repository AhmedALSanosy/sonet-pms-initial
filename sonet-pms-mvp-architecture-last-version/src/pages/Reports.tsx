// ============================================================
// Sonet PMS — Reports Page
// ============================================================
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar } from 'lucide-react';

const reports = [
  { title: 'تقرير المرضى اليومي', desc: 'ملخص المرضى والزيارات', icon: '👥', value: '2,847' },
  { title: 'تقرير التحاليل', desc: 'تفاصيل التحاليل المُنجزة', icon: '🧪', value: '156' },
  { title: 'التقرير المالي', desc: 'الإيرادات والمصروفات', icon: '💰', value: '٤٥,٢٠٠ ج.م' },
  { title: 'تقرير المخزون', desc: 'المستلزمات والكيماويات', icon: '📦', value: '87%' },
  { title: 'تقرير الأداء', desc: 'أوقات التسليم والإنتاجية', icon: '⚡', value: '95%' },
  { title: 'تقرير الجودة', desc: 'معايير الجودة والدقة', icon: '✅', value: '99.2%' },
];

export default function Reports() {
  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary font-cairo">التقارير</h2>
          <p className="text-xs text-text-muted font-cairo">تقارير شاملة عن أداء المعمل</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-bg-surface rounded-xl text-text-secondary text-xs border border-border/40 font-cairo">
            <Calendar size={14} /> اختيار فترة
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-bg-surface rounded-xl text-text-secondary text-xs border border-border/40 font-cairo">
            <Download size={14} /> تصدير الكل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {reports.map((report, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-bg-surface rounded-2xl p-4 border border-border/40 card-hover cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{report.icon}</span>
              <span className="text-[9px] text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">اليوم</span>
            </div>
            <h3 className="text-xs font-semibold text-text-primary font-cairo mb-0.5 group-hover:text-primary-light transition-colors">{report.title}</h3>
            <p className="text-[10px] text-text-muted mb-2 font-cairo">{report.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold gradient-text">{report.value}</span>
              <span className="text-[10px] text-primary-light font-cairo flex items-center gap-0.5">
                عرض <BarChart3 size={10} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-bg-surface rounded-2xl border border-border/40 p-4">
        <h3 className="text-xs font-semibold text-text-primary font-cairo mb-3">إحصائيات شهرية</h3>
        <div className="flex items-end gap-1.5 h-36" dir="ltr">
          {['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'].map((m, i) => {
            const h = 25 + Math.sin(i * 0.8 + 1) * 30 + 15;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5">
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                  className="w-full rounded-t-md gradient-primary opacity-60 min-h-[2px]" />
                <span className="text-[7px] text-text-muted truncate w-full text-center">{m.substring(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
