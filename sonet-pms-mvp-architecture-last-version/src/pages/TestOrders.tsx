import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Plus, Search, Printer, FlaskConical, AlertTriangle } from 'lucide-react';
import { mockOrders, mockPatients } from '../data/mockData';
import { useToast } from '../components/ui/Modal';
import OrderFormModal from '../components/orders/OrderFormModal';
import type { OrderStatus } from '../types';

const sc: Record<OrderStatus, { label: string; class: string; icon: React.ReactNode }> = {
  pending: { label: 'معلق', class: 'badge-warning', icon: <Clock size={12} /> },
  'in-progress': { label: 'جاري', class: 'badge-info', icon: <Clock size={12} /> },
  completed: { label: 'مكتمل', class: 'badge-success', icon: <CheckCircle2 size={12} /> },
};

export default function TestOrders() {
  const [search, setSearch] = useState('');
  const [fStatus, setFStatus] = useState('all');
  const [fPrio, setFPrio] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const toast = useToast();

  const filtered = useMemo(() => mockOrders.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.patientName.includes(q) || o.id.toLowerCase().includes(q)) && (fStatus === 'all' || o.status === fStatus) && (fPrio === 'all' || o.priority === fPrio);
  }), [search, fStatus, fPrio]);

  const urgent = mockOrders.filter(o => o.priority === 'urgent').length;
  const pending = mockOrders.filter(o => o.status === 'pending').length;
  const completed = mockOrders.filter(o => o.status === 'completed').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex gap-3 px-5 pt-4 pb-2 flex-shrink-0 flex-wrap">
        {[
          { l: 'إجمالي', v: mockOrders.length, c: 'text-primary-light bg-primary/10 border-primary/20' },
          { l: 'معلق', v: pending, c: 'text-warning bg-warning/10 border-warning/20' },
          { l: 'عاجل', v: urgent, c: 'text-danger bg-danger/10 border-danger/20' },
          { l: 'مكتمل', v: completed, c: 'text-success bg-success/10 border-success/20' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${s.c}`}><span className="text-lg font-bold">{s.v}</span><span className="text-[10px] text-text-secondary font-cairo">{s.l}</span></div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-5 pb-2 flex-shrink-0 flex-wrap">
        <div className="flex-1 min-w-[160px] max-w-xs flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 border border-border/40">
          <Search size={14} className="text-text-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
        </div>
        <select value={fStatus} onChange={e => setFStatus(e.target.value)} className="px-2 py-2 rounded-xl bg-bg-surface border border-border/40 text-xs text-text-secondary font-cairo">
          <option value="all">الكل</option><option value="pending">معلق</option><option value="in-progress">جاري</option><option value="completed">مكتمل</option>
        </select>
        <select value={fPrio} onChange={e => setFPrio(e.target.value)} className="px-2 py-2 rounded-xl bg-bg-surface border border-border/40 text-xs text-text-secondary font-cairo">
          <option value="all">الكل</option><option value="urgent">عاجل</option><option value="normal">عادي</option>
        </select>
        <div className="flex-1" />
        <button onClick={() => setFormOpen(true)} className="btn-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 font-cairo"><Plus size={13} /> طلب جديد</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((order, i) => {
            const s = sc[order.status]; const isU = order.priority === 'urgent';
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`rounded-2xl p-4 border card-hover cursor-pointer ${isU ? 'bg-danger/5 border-danger/30' : 'bg-bg-surface border-border/40'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-primary-light">{order.id}</span>
                      {isU && <span className="text-[8px] px-2 py-0.5 rounded-full bg-danger/20 text-danger border border-danger/30 font-bold flex items-center gap-0.5"><AlertTriangle size={8} /> عاجل</span>}
                    </div>
                    <p className="text-sm font-bold text-text-primary font-cairo">{order.patientName}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${s.class} flex items-center gap-0.5`}>{s.icon} {s.label}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">{order.tests.map((t, j) => <span key={j} className="text-[9px] bg-bg-hover px-2 py-0.5 rounded text-text-muted font-cairo">{t}</span>)}</div>
                {order.notes && <p className="text-[10px] text-warning/90 bg-warning/10 border border-warning/20 px-2 py-1 rounded-lg mb-2 font-cairo">💬 {order.notes}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-border/20 text-[10px]">
                  <span className="text-text-muted font-mono">{order.dueAt.split('T')[1]}</span>
                  <span className="font-bold text-text-primary">{order.totalAmount} ج</span>
                  <div className="flex gap-1">
                    <button onClick={() => toast.add(`فتح تفاصيل الطلب ${order.id}`)} className="p-1 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10"><FlaskConical size={12} /></button>
                    <button onClick={() => toast.add('جاري الطباعة...')} className="p-1 rounded-lg text-text-muted hover:text-accent-light hover:bg-accent/10"><Printer size={12} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <OrderFormModal open={formOpen} onClose={() => setFormOpen(false)} patients={mockPatients} />
    </div>
  );
}
