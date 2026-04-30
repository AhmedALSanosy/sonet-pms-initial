// ============================================================
// Sonet PMS — Orders Page
// ============================================================

import React, { useState, useMemo } from 'react';
import { Search, Plus, Clock, CheckCircle2, AlertTriangle, FlaskConical, Printer } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const statusConfig = {
  completed: { label: 'مكتمل', class: 'badge-success', icon: CheckCircle2 },
  'in-progress': { label: 'جاري', class: 'badge-info', icon: Clock },
  pending: { label: 'معلق', class: 'badge-warning', icon: Clock },
};

const OrdersPage: React.FC = () => {
  const { orders } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.patientName.includes(q) || o.id.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchPriority = filterPriority === 'all' || o.priority === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [orders, search, filterStatus, filterPriority]);

  const urgentCount = orders.filter((o) => o.priority === 'urgent').length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Stats Bar */}
      <div className="flex gap-3 px-5 pt-4 pb-3 flex-shrink-0">
        {[
          { label: 'إجمالي اليوم', value: orders.length, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'معلق', value: pendingCount, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'عاجل', value: urgentCount, color: 'text-red-300', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'مكتمل', value: completedCount, color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${s.bg}`}>
            <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            <span className="text-[11px] text-[#A8A4CC]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 pb-3 flex-shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6890]" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو اسم المريض..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-white placeholder-[#6B6890] focus:border-purple-500/60 focus:outline-none transition-all"
            style={{ direction: 'rtl' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-[#A8A4CC] focus:outline-none focus:border-purple-500/60"
        >
          <option value="all">كل الحالات</option>
          <option value="pending">معلق</option>
          <option value="in-progress">جاري</option>
          <option value="completed">مكتمل</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-[#A8A4CC] focus:outline-none focus:border-purple-500/60"
        >
          <option value="all">كل الأولويات</option>
          <option value="urgent">عاجل</option>
          <option value="normal">عادي</option>
        </select>
        <div className="flex-1" />
        <button className="btn-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={13} /> طلب جديد
        </button>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((order) => {
            const isUrgent = order.priority === 'urgent';
            const sc = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            return (
              <div
                key={order.id}
                className={`rounded-2xl p-4 border card-hover cursor-pointer transition-all ${
                  isUrgent
                    ? 'bg-red-900/10 border-red-500/30'
                    : 'bg-gradient-card border-[#2D2D4E]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-300">{order.id}</span>
                      {isUrgent && (
                        <span className="badge-danger text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <AlertTriangle size={8} /> عاجل
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {order.patientName}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc.class}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Tests */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {order.tests.map((t, i) => (
                    <span key={i} className="text-[10px] bg-[#22223A] text-[#A8A4CC] border border-[#2D2D4E] px-2 py-0.5 rounded-lg font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <p className="text-[10px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg mb-3" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    💬 {order.notes}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#2D2D4E]/50">
                  <div>
                    <p className="text-[10px] text-[#6B6890]">موعد التسليم</p>
                    <p className="text-xs font-medium text-[#A8A4CC]">
                      {new Date(order.dueAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#6B6890]">المبلغ</p>
                    <p className="text-sm font-bold text-white">{order.totalAmount.toLocaleString()} ج</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                      <FlaskConical size={13} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Printer size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
