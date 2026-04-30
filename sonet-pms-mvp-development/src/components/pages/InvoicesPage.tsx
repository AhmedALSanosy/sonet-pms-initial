// ============================================================
// Sonet PMS — Invoices Page
// ============================================================

import React, { useState, useMemo } from 'react';
import { Search, Plus, Printer, Download, CreditCard, Banknote, Shield } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const statusConfig = {
  paid: { label: 'مدفوع', class: 'badge-success' },
  partial: { label: 'جزئي', class: 'badge-warning' },
  unpaid: { label: 'غير مدفوع', class: 'badge-danger' },
};

const paymentIcons: Record<string, React.ReactNode> = {
  cash: <Banknote size={12} className="text-emerald-400" />,
  card: <CreditCard size={12} className="text-blue-400" />,
  insurance: <Shield size={12} className="text-purple-400" />,
};

const InvoicesPage: React.FC = () => {
  const { invoices } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch = !q || inv.patientName.includes(q) || inv.id.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, filterStatus]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.remaining, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Summary Cards */}
      <div className="flex gap-4 px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex-1 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[10px] text-[#6B6890] mb-1">إجمالي المحصل</p>
          <p className="text-xl font-bold text-emerald-300">{totalRevenue.toLocaleString()} ج</p>
        </div>
        <div className="flex-1 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-[10px] text-[#6B6890] mb-1">متبقي للتحصيل</p>
          <p className="text-xl font-bold text-amber-300">{totalPending.toLocaleString()} ج</p>
        </div>
        <div className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-[10px] text-[#6B6890] mb-1">إجمالي الفواتير</p>
          <p className="text-xl font-bold text-purple-300">{invoices.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 pb-4 flex-shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6890]" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو المريض..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-white placeholder-[#6B6890] focus:border-purple-500/60 focus:outline-none transition-all"
            style={{ direction: 'rtl' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-[#A8A4CC] focus:outline-none"
        >
          <option value="all">كل الحالات</option>
          <option value="paid">مدفوع</option>
          <option value="partial">جزئي</option>
          <option value="unpaid">غير مدفوع</option>
        </select>
        <div className="flex-1" />
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E1E32] border border-[#2D2D4E] text-xs text-[#A8A4CC] hover:text-white transition-all">
          <Download size={13} /> تصدير
        </button>
        <button className="btn-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={13} /> فاتورة جديدة
        </button>
      </div>

      {/* Invoices List */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="space-y-3">
          {filtered.map((inv) => {
            const sc = statusConfig[inv.status];
            const progressPct = (inv.paid / inv.total) * 100;
            return (
              <div key={inv.id} className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5 card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-purple-300">{inv.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.class}`}>{sc.label}</span>
                      {inv.paymentMethod && (
                        <div className="flex items-center gap-1 text-[10px] text-[#6B6890]">
                          {paymentIcons[inv.paymentMethod]}
                          <span>
                            {inv.paymentMethod === 'cash' ? 'كاش' : inv.paymentMethod === 'card' ? 'كارت' : 'تأمين'}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-base font-bold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {inv.patientName}
                    </p>
                    <p className="text-[10px] text-[#6B6890]">{inv.createdAt.split('T')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{inv.total.toLocaleString()} <span className="text-sm font-normal text-[#6B6890]">ج</span></p>
                    {inv.discount > 0 && (
                      <p className="text-[11px] text-emerald-400">خصم: {inv.discount} ج</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {inv.items.map((item, i) => (
                    <div key={i} className="bg-[#22223A]/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-[#A8A4CC] truncate">{item.testName}</p>
                      <p className="text-xs font-bold text-white">{item.price} ج</p>
                    </div>
                  ))}
                </div>

                {/* Payment Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#6B6890]">مدفوع: <span className="text-emerald-400 font-bold">{inv.paid} ج</span></span>
                    <span className="text-[10px] text-[#6B6890]">متبقي: <span className="text-amber-400 font-bold">{inv.remaining} ج</span></span>
                  </div>
                  <div className="h-1.5 bg-[#22223A] rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-[#2D2D4E]/50">
                  {inv.remaining > 0 && (
                    <button className="btn-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <CreditCard size={11} /> دفع المتبقي
                    </button>
                  )}
                  <button className="bg-[#22223A] border border-[#2D2D4E] text-[#A8A4CC] text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:border-[#3D3D65] transition-all">
                    <Printer size={11} /> طباعة
                  </button>
                  <button className="bg-[#22223A] border border-[#2D2D4E] text-[#A8A4CC] text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:border-[#3D3D65] transition-all">
                    <Download size={11} /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
