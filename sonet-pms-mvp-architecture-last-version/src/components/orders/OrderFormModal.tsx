// ============================================================
// Sonet PMS — Order Create Modal
// ============================================================
import { useState } from 'react';
import { Modal, useToast } from '../ui/Modal';
import type { Patient } from '../../types';

const availableTests = [
  'CBC — صورة دم كاملة', 'Blood Sugar — سكر صائم', 'HbA1c — تراكمي السكر',
  'Lipid Profile — دهون الدم', 'Liver Function — وظائف كبد', 'Kidney Function — وظائف كلى',
  'Thyroid Panel — غدة درقية', 'Urine Analysis — تحليل بول', 'CRP — بروتين تفاعلي',
  'Iron Studies — دراسات الحديد', 'Vitamin D — فيتامين د', 'Hepatitis B — التهاب كبدي ب',
  'Hepatitis C — التهاب كبدي سي', 'PT/INR — سيولة الدم', 'Troponin — تروبونين',
];

export default function OrderFormModal({ open, onClose, patients }: {
  open: boolean; onClose: () => void; patients: Patient[]
}) {
  const [patientId, setPatientId] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');
  const toast = useToast();

  const toggle = (t: string) => setSelected(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    if (!patientId || selected.length === 0) { toast.add('اختار المريض والتحاليل المطلوبة', 'error'); return; }
    toast.add(`تم إنشاء طلب تحليل لـ ${patient?.nameAr} — ${selected.length} تحليل ✓`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="طلب تحاليل جديد" wide>
      <form onSubmit={submit} className="space-y-4">
        {/* Patient Select */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1 font-cairo">المريض *</label>
          <select value={patientId} onChange={e => setPatientId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary font-cairo focus:outline-none">
            <option value="">— اختار المريض —</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.nameAr} ({p.id})</option>)}
          </select>
        </div>

        {/* Tests Selection */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-2 font-cairo">التحاليل المطلوبة * <span className="text-text-muted">({selected.length} محدد)</span></label>
          <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto p-1">
            {availableTests.map(t => {
              const active = selected.includes(t);
              return (
                <button key={t} type="button" onClick={() => toggle(t)}
                  className={`text-right text-[10px] px-2.5 py-2 rounded-lg border transition-all font-cairo ${
                    active ? 'bg-primary/15 border-primary/30 text-primary-light' : 'bg-bg-card border-border/30 text-text-secondary hover:border-border'
                  }`}>
                  {active ? '✓ ' : ''}{t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="priority" value="normal" checked={priority === 'normal'} onChange={e => setPriority(e.target.value)} className="accent-primary" />
            <span className="text-xs text-text-secondary font-cairo">عادي</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="priority" value="urgent" checked={priority === 'urgent'} onChange={e => setPriority(e.target.value)} className="accent-danger" />
            <span className="text-xs text-danger font-cairo">⚠️ عاجل</span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1 font-cairo">ملاحظات</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="مثلاً: فحص دوري / متابعة سكر / حالة طارئة..."
            className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none font-cairo" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold font-cairo">إنشاء الطلب</button>
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl bg-bg-card border border-border/50 text-text-secondary text-sm font-cairo">إلغاء</button>
        </div>
      </form>
    </Modal>
  );
}
