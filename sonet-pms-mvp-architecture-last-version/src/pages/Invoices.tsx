import { motion } from 'framer-motion';
import { Receipt, Plus, CheckCircle2, Clock, CreditCard, Banknote, Shield, Download, Printer } from 'lucide-react';
import { mockInvoices } from '../data/mockData';
import { useState } from 'react';
import { Modal, useToast } from '../components/ui/Modal';
import type { Invoice, InvoiceStatus } from '../types';

const st: Record<InvoiceStatus, { label: string; class: string }> = { paid: { label: 'مدفوعة', class: 'badge-success' }, partial: { label: 'جزئي', class: 'badge-warning' }, unpaid: { label: 'غير مدفوعة', class: 'badge-danger' } };
const mIcons: Record<string, { icon: React.ReactNode; l: string }> = { cash: { icon: <Banknote size={12} />, l: 'كاش' }, card: { icon: <CreditCard size={12} />, l: 'بطاقة' }, insurance: { icon: <Shield size={12} />, l: 'تأمين' } };

function PaymentModal({ inv, open, onClose }: { inv: Invoice; open: boolean; onClose: () => void }) {
  const [amt, setAmt] = useState(String(inv.remaining));
  const toast = useToast();
  const submit = (e: React.FormEvent) => { e.preventDefault(); const v = parseFloat(amt); if (!v || v <= 0) { toast.add('ادخل مبلغ صحيح', 'error'); return; } toast.add(`تم تسجيل دفعة ${v} ج ✓`); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title={`تسجيل دفعة — ${inv.id}`}>
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-bg-card/50 space-y-1 text-xs">
          <p className="text-text-muted font-cairo">المريض: <span className="text-text-primary">{inv.patientName}</span></p>
          <p className="text-text-muted font-cairo">الإجمالي: <span className="text-text-primary font-bold">{inv.total} ج</span></p>
          <p className="text-text-muted font-cairo">متبقي: <span className="text-danger font-bold">{inv.remaining} ج</span></p>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1 font-cairo">مبلغ الدفعة</label>
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none font-cairo" />
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold font-cairo">تسجيل الدفعة</button>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-bg-card border border-border/50 text-text-secondary text-sm font-cairo">إلغاء</button>
        </div>
      </div>
    </Modal>
  );
}

export default function Invoices() {
  const [payInv, setPayInv] = useState<Invoice | null>(null);
  const toast = useToast();
  const totalR = mockInvoices.reduce((s, i) => s + i.total, 0);
  const totalP = mockInvoices.reduce((s, i) => s + i.paid, 0);
  const totalRem = mockInvoices.reduce((s, i) => s + i.remaining, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-text-primary font-cairo">الفواتير</h2>
        <div className="flex gap-2">
          <button onClick={() => toast.add('جاري التصدير...')} className="flex items-center gap-1 px-3 py-2 bg-bg-surface rounded-xl text-xs border border-border/40 font-cairo"><Download size={14} /> تصدير</button>
          <button onClick={() => toast.add('جاري الطباعة...')} className="flex items-center gap-1 px-3 py-2 bg-bg-surface rounded-xl text-xs border border-border/40 font-cairo"><Printer size={14} /> طباعة</button>
          <button onClick={() => toast.add('خطوة إنشاء فاتورة جديدة')} className="btn-primary flex items-center gap-1 px-3 py-2 rounded-xl text-white text-xs font-cairo"><Plus size={14} /> جديدة</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 px-5 pb-3 flex-shrink-0">
        {[{ l: 'الإجمالي', v: totalR, c: '#7C3AED', i: <Receipt size={16} /> }, { l: 'مدفوع', v: totalP, c: '#10B981', i: <CheckCircle2 size={16} /> }, { l: 'متبقي', v: totalRem, c: '#EF4444', i: <Clock size={16} /> }].map((x, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-surface rounded-xl p-3 border border-border/40">
            <div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${x.c}15`, color: x.c }}>{x.i}</div><span className="text-[10px] text-text-muted font-cairo">{x.l}</span></div>
            <p className="text-base font-bold">{x.v.toLocaleString()} ج</p>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
        {mockInvoices.map((inv, i) => {
          const s = st[inv.status]; const m = inv.paymentMethod ? mIcons[inv.paymentMethod] : null;
          const pct = inv.total > 0 ? (inv.paid / inv.total) * 100 : 0;
          const barC = pct === 100 ? '#10B981' : pct > 0 ? '#F59E0B' : '#EF4444';
          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-bg-surface rounded-2xl border border-border/40 card-hover overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2"><span className="text-[10px] font-mono text-primary-light">{inv.id}</span><span className={`text-[8px] px-2 py-0.5 rounded-full ${s.class}`}>{s.label}</span>{m && <span className="flex items-center gap-1 text-[9px] text-text-muted">{m.icon} {m.l}</span>}</div>
                    <p className="text-sm font-bold text-text-primary font-cairo mt-0.5">{inv.patientName}</p>
                  </div>
                  <p className="text-base font-bold">{inv.total.toLocaleString()} ج</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">{inv.items.map((it, j) => <span key={j} className="text-[9px] bg-bg-hover px-2 py-0.5 rounded text-text-muted font-cairo">{it.testName} {it.price} ج</span>)}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]"><span className="text-success font-cairo">مدفوع: {inv.paid} ج</span>{inv.remaining > 0 ? <span className="text-danger font-cairo">متبقي: {inv.remaining} ج</span> : <span className="text-success">✓</span>}</div>
                  <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden" dir="ltr"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: .3, duration: .6 }} className="h-full rounded-full" style={{ backgroundColor: barC }} /></div>
                </div>
              </div>
              {inv.remaining > 0 && (
                <div className="px-4 py-2 border-t border-border/20 flex items-center justify-between bg-bg-hover/20">
                  <span className="text-[10px] text-danger font-cairo">⚠️ رصيد مستحق</span>
                  <button onClick={() => setPayInv(inv)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg gradient-primary text-white text-[10px] font-cairo"><CreditCard size={10} /> تسجيل دفعة</button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {payInv && <PaymentModal inv={payInv} open={!!payInv} onClose={() => setPayInv(null)} />}
    </div>
  );
}
