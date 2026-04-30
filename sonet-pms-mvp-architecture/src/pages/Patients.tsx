import { motion } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, Phone, Mail } from 'lucide-react';

const patients = [
  { id: 'P-2847', name: 'أحمد حسن إبراهيم', age: 45, phone: '01012345678', lastVisit: 'اليوم', tests: 12 },
  { id: 'P-2846', name: 'سارة محمود علي', age: 32, phone: '01198765432', lastVisit: 'أمس', tests: 8 },
  { id: 'P-2845', name: 'محمد عبدالرحمن', age: 58, phone: '01234567890', lastVisit: 'اليوم', tests: 15 },
  { id: 'P-2844', name: 'فاطمة أحمد سعيد', age: 27, phone: '01087654321', lastVisit: 'من 2 يوم', tests: 5 },
  { id: 'P-2843', name: 'حسين محمد حسن', age: 63, phone: '01512345678', lastVisit: 'أمس', tests: 22 },
  { id: 'P-2842', name: 'نورا خالد عبدالله', age: 19, phone: '01298765432', lastVisit: 'اليوم', tests: 3 },
];

export default function Patients() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">إدارة المرضى</h2>
          <p className="text-sm text-text-muted font-cairo">إجمالي المرضى: 2,847 مريض</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary rounded-xl text-white text-sm font-medium shadow-lg shadow-primary/20 font-cairo"
        >
          <Plus size={18} />
          تسجيل مريض جديد
        </motion.button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-surface-secondary rounded-xl px-4 py-2.5 border border-border/50">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكود أو رقم التليفون..."
            className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 hover:border-border transition-colors">
          <Filter size={16} />
          تصفية
        </button>
      </div>

      {/* Patients Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-secondary rounded-2xl border border-border/50 overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">الكود</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">الاسم</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">السن</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">التواصل</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">آخر زيارة</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5 font-cairo">التحاليل</th>
              <th className="text-right text-xs font-medium text-text-muted py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, i) => (
              <motion.tr
                key={patient.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/20 hover:bg-surface-tertiary/30 transition-colors cursor-pointer"
              >
                <td className="py-3 px-5">
                  <span className="text-xs font-mono text-primary-light bg-primary/10 px-2 py-1 rounded-lg">
                    {patient.id}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-text-primary font-cairo">{patient.name}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-text-secondary font-cairo">{patient.age} سنة</td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <a href={`tel:${patient.phone}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-primary-light transition-colors">
                      <Phone size={14} />
                    </a>
                    <a href={`mailto:`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-accent-light transition-colors">
                      <Mail size={14} />
                    </a>
                    <span className="text-xs text-text-muted font-mono">{patient.phone}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-text-secondary font-cairo">{patient.lastVisit}</td>
                <td className="py-3 px-5">
                  <span className="text-sm font-medium text-text-primary">{patient.tests}</span>
                </td>
                <td className="py-3 px-5">
                  <button className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
