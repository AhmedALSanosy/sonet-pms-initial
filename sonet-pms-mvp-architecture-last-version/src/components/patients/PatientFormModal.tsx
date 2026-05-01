// ============================================================
// Sonet PMS — Patient Create/Edit Modal
// ============================================================
import { useState, useEffect } from 'react';
import { Modal, useToast } from '../ui/Modal';
import type { Patient } from '../../types';

const empty = { nameAr: '', name: '', age: '', gender: 'male', phone: '', nationalId: '' };

export default function PatientFormModal({ open, onClose, patient }: {
  open: boolean; onClose: () => void; patient?: Patient | null
}) {
  const [f, setF] = useState(empty);
  const toast = useToast();
  const editing = !!patient;

  useEffect(() => {
    if (patient) setF({ nameAr: patient.nameAr, name: patient.name, age: String(patient.age), gender: patient.gender, phone: patient.phone, nationalId: patient.nationalId });
    else setF(empty);
  }, [patient, open]);

  const handle = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nameAr || !f.phone) { toast.add('لازم تدخل الاسم والتليفون', 'error'); return; }
    toast.add(editing ? 'تم تعديل بيانات المريض بنجاح ✓' : 'تم تسجيل المريض الجديد ✓');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'تعديل بيانات المريض' : 'تسجيل مريض جديد'}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="الاسم بالعربي *" value={f.nameAr} onChange={v => handle('nameAr', v)} placeholder="أحمد محمد علي" />
          <Field label="الاسم بالإنجليزي" value={f.name} onChange={v => handle('name', v)} placeholder="Ahmed Mohamed Ali" />
          <Field label="العمر" type="number" value={f.age} onChange={v => handle('age', v)} placeholder="45" />
          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1 font-cairo">الجنس</label>
            <select value={f.gender} onChange={e => handle('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary font-cairo focus:outline-none">
              <option value="male">ذكر</option><option value="female">أنثى</option>
            </select>
          </div>
          <Field label="رقم التليفون *" value={f.phone} onChange={v => handle('phone', v)} placeholder="010-1234-5678" />
          <Field label="الرقم القومي" value={f.nationalId} onChange={v => handle('nationalId', v)} placeholder="12345678901234" />
        </div>
        <div className="flex gap-2 pt-3">
          <button type="submit" className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold font-cairo">{editing ? 'حفظ التعديلات' : 'تسجيل المريض'}</button>
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl bg-bg-card border border-border/50 text-text-secondary text-sm font-cairo hover:bg-bg-hover">إلغاء</button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-text-secondary mb-1 font-cairo">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary placeholder-text-muted focus:outline-none font-cairo" />
    </div>
  );
}
