import { motion } from 'framer-motion';
import { Receipt, Plus, Search, Printer, Download, CheckCircle2, Clock } from 'lucide-react';

const invoices = [
  { id: 'INV-1456', patient: 'أحمد حسن إبراهيم', amount: '١,٨٥٠ ج.م', status: 'paid', date: 'اليوم' },
  { id: 'INV-1455', patient: 'سارة محمود علي', amount: '٦٥٠ ج.م', status: 'pending', date: 'اليوم' },
  { id: 'INV-1454', patient: 'محمد عبدالرحمن', amount: '٢,٤٠٠ ج.م', status: 'paid', date: 'أمس' },
  { id: 'INV-1453', patient: 'فاطمة أحمد سعيد', amount: '٣٥٠ ج.م', status: 'paid', date: 'أمس' },
  { id: 'INV-1452', patient: 'حسين محمد حسن', amount: '١,٢٠٠ ج.م', status: 'pending', date: 'من 2 يوم' },
];

export default function Invoices() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">الفواتير</h2>
          <p className="text-sm text-text-muted font-cairo">إجمالي اليوم: ٤٥,٢٠٠ ج.م</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary rounded-xl text-white text-sm font-medium shadow-lg shadow-primary/20 font-cairo"
        >
          <Plus size={18} />
          فاتورة جديدة
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'مدفوعة', count: 67, amount: '٣٢,٥٠٠ ج.م', color: '#10B981', icon: <CheckCircle2 size={20} /> },
          { label: 'في الانتظار', count: 12, amount: '٨,٧٠٠ ج.م', color: '#F59E0B', icon: <Clock size={20} /> },
          { label: 'إجمالي الشهر', count: 79, amount: '٤٥,٢٠٠ ج.م', color: '#7C3AED', icon: <Receipt size={20} /> },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-secondary rounded-xl p-4 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <span className="text-xs text-text-muted font-cairo">{item.label}</span>
            </div>
            <p className="text-lg font-bold text-text-primary">{item.amount}</p>
            <p className="text-xs text-text-muted font-cairo">{item.count} فاتورة</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-surface-secondary rounded-xl px-4 py-2.5 border border-border/50">
          <Search size={16} className="text-text-muted" />
          <input type="text" placeholder="بحث بكود الفاتورة أو اسم المريض..." className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
          <Printer size={16} />
        </button>
        <button className="flex items-center gap-2 px-3 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 font-cairo">
          <Download size={16} />
        </button>
      </div>

      <div className="bg-surface-secondary rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">الكود</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">المريض</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">المبلغ</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">الحالة</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <motion.tr
                key={inv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/20 hover:bg-surface-tertiary/30 transition-colors cursor-pointer"
              >
                <td className="py-3 px-5 text-xs font-mono text-primary-light">{inv.id}</td>
                <td className="py-3 px-5 text-sm text-text-primary font-cairo">{inv.patient}</td>
                <td className="py-3 px-5 text-sm font-medium text-text-primary">{inv.amount}</td>
                <td className="py-3 px-5">
                  <span className={`text-[11px] px-2 py-1 rounded-lg border font-cairo ${
                    inv.status === 'paid'
                      ? 'text-success bg-success/10 border-success/20'
                      : 'text-warning bg-warning/10 border-warning/20'
                  }`}>
                    {inv.status === 'paid' ? 'مدفوعة' : 'في الانتظار'}
                  </span>
                </td>
                <td className="py-3 px-5 text-sm text-text-muted font-cairo">{inv.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
