import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar } from 'lucide-react';

const reportCategories = [
  { title: 'تقرير المرضى اليومي', desc: 'ملخص المرضى والزيارات', icon: '👥', count: '2,847' },
  { title: 'تقرير التحاليل', desc: 'تفاصيل التحاليل المُنجزة', icon: '🧪', count: '156' },
  { title: 'التقرير المالي', desc: 'الإيرادات والمصروفات', icon: '💰', count: '٤٥,٢٠٠ ج.م' },
  { title: 'تقرير المخزون', desc: 'المستلزمات والمواد الكيميائية', icon: '📦', count: '87%' },
  { title: 'تقرير الأداء', desc: 'أوقات التسليم والإنتاجية', icon: '⚡', count: '95%' },
  { title: 'تقرير الجودة', desc: 'معايير الجودة والدقة', icon: '✅', count: '99.2%' },
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">التقارير</h2>
          <p className="text-sm text-text-muted font-cairo">تقارير شاملة عن أداء المعمل</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
            <Calendar size={16} />
            اختيار فترة
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
            <Download size={16} />
            تصدير الكل
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCategories.map((report, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-surface-secondary rounded-2xl p-5 border border-border/50 hover:border-border transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{report.icon}</span>
              <span className="text-xs text-text-muted bg-surface-tertiary px-2 py-1 rounded-lg">آخر تحديث: اليوم</span>
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1 font-cairo group-hover:text-primary-light transition-colors">
              {report.title}
            </h3>
            <p className="text-xs text-text-muted mb-3 font-cairo">{report.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gradient">{report.count}</span>
              <button className="text-xs text-primary-light hover:text-primary font-cairo flex items-center gap-1">
                عرض التقرير
                <BarChart3 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface-secondary rounded-2xl border border-border/50 p-5"
      >
        <h3 className="text-sm font-semibold text-text-primary font-cairo mb-4">إحصائيات شهرية</h3>
        <div className="flex items-end gap-2 h-48">
          {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'].map((month, i) => {
            const h = 30 + Math.random() * 70;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-lg gradient-primary opacity-70 min-h-[4px]"
                />
                <span className="text-[8px] text-text-muted rotate-0 truncate w-full text-center">{month.substring(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
