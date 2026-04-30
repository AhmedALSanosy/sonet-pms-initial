import { motion } from 'framer-motion';
import { TestTube2, Clock, CheckCircle2, AlertCircle, Plus, Search, Filter } from 'lucide-react';

const orders = [
  { id: 'ORD-4521', patient: 'أحمد حسن إبراهيم', tests: 'CBC, Chemistry Panel', status: 'processing', priority: 'urgent', time: '9:30 ص' },
  { id: 'ORD-4520', patient: 'سارة محمود علي', tests: 'Thyroid Function', status: 'pending', priority: 'normal', time: '9:15 ص' },
  { id: 'ORD-4519', patient: 'محمد عبدالرحمن', tests: 'Liver Function, HbA1c', status: 'completed', priority: 'normal', time: '8:45 ص' },
  { id: 'ORD-4518', patient: 'فاطمة أحمد سعيد', tests: 'Urinalysis', status: 'processing', priority: 'normal', time: '8:30 ص' },
  { id: 'ORD-4517', patient: 'حسين محمد حسن', tests: 'Lipid Profile, Glucose', status: 'completed', priority: 'urgent', time: '8:00 ص' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'في الانتظار', color: 'text-warning bg-warning/10 border-warning/20', icon: <Clock size={14} /> },
  processing: { label: 'قيد التنفيذ', color: 'text-info bg-info/10 border-info/20', icon: <TestTube2 size={14} /> },
  completed: { label: 'مكتمل', color: 'text-success bg-success/10 border-success/20', icon: <CheckCircle2 size={14} /> },
};

export default function TestOrders() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">طلبات التحاليل</h2>
          <p className="text-sm text-text-muted font-cairo">156 طلب اليوم</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary rounded-xl text-white text-sm font-medium shadow-lg shadow-primary/20 font-cairo"
        >
          <Plus size={18} />
          طلب تحليل جديد
        </motion.button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'في الانتظار', count: 23, icon: <Clock size={20} />, color: '#F59E0B' },
          { label: 'قيد التنفيذ', count: 44, icon: <TestTube2 size={20} />, color: '#06B6D4' },
          { label: 'مكتمل', count: 89, icon: <CheckCircle2 size={20} />, color: '#10B981' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-secondary rounded-xl p-4 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{item.count}</p>
                <p className="text-xs text-text-muted font-cairo">{item.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-surface-secondary rounded-xl px-4 py-2.5 border border-border/50">
          <Search size={16} className="text-text-muted" />
          <input type="text" placeholder="بحث بكود الطلب أو اسم المريض..." className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary rounded-xl text-text-secondary text-sm border border-border/50 hover:border-border transition-colors font-cairo">
          <Filter size={16} />
          تصفية
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order, i) => {
          const status = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-secondary rounded-xl p-4 border border-border/50 hover:border-border transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-mono text-primary-light">{order.id}</span>
                    <h4 className="text-sm font-medium text-text-primary font-cairo mt-1">{order.patient}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-xs text-text-muted font-cairo">{order.tests}</p>
                    <p className="text-[11px] text-text-muted mt-1">{order.time}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${status.color} font-cairo`}>
                    {status.icon}
                    {status.label}
                  </div>
                  {order.priority === 'urgent' && (
                    <div className="flex items-center gap-1 text-danger">
                      <AlertCircle size={14} />
                      <span className="text-xs font-cairo">عاجل</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
