import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { mockPatients } from '../data/mockData';
import { useToast } from '../components/ui/Modal';
import PatientFormModal from '../components/patients/PatientFormModal';
import type { Patient, PatientStatus } from '../types';

const statusConfig: Record<PatientStatus, { label: string; class: string }> = {
  active: { label: 'نشط', class: 'badge-success' }, pending: { label: 'معلق', class: 'badge-warning' }, completed: { label: 'مكتمل', class: 'badge-info' },
};

function PatientDetail({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
      className="flex-shrink-0 bg-bg-elevated border-l border-border/50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 bg-primary/5">
        <h3 className="text-xs font-bold text-text-primary font-cairo">ملف المريض</h3>
        <button onClick={onClose} className="text-text-muted hover:text-white text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <div className="flex flex-col items-center gap-2 pb-4 border-b border-border/30">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${patient.gender === 'male' ? 'bg-accent/20 text-accent-light' : 'bg-pink-500/20 text-pink-300'}`}>{patient.nameAr.charAt(0)}</div>
          <p className="text-sm font-bold text-text-primary font-cairo">{patient.nameAr}</p>
          <p className="text-[10px] text-text-muted font-mono">{patient.id}</p>
          <span className={`text-[9px] px-2 py-0.5 rounded-full ${statusConfig[patient.status as PatientStatus]?.class || 'badge-success'}`}>{statusConfig[patient.status as PatientStatus]?.label}</span>
        </div>
        {[{ l: '🎂 العمر', v: `${patient.age} سنة` }, { l: '📱 الهاتف', v: patient.phone }, { l: '🪪 القومي', v: patient.nationalId }, { l: '📅 آخر زيارة', v: patient.lastVisit }, { l: '🧪 الطلبات', v: String(patient.totalOrders) }].map((r, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-bg-card/50 text-xs"><span className="text-text-muted">{r.l}</span><span className="text-text-primary font-cairo mr-auto">{r.v}</span></div>
        ))}
        {patient.balance > 0 && <div className="p-3 rounded-xl bg-danger/10 border border-danger/20"><p className="text-[10px] text-danger">رصيد مستحق</p><p className="text-lg font-bold text-danger">{patient.balance} ج</p></div>}
      </div>
    </motion.div>
  );
}

export default function Patients() {
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState<Patient | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const toast = useToast();

  const filtered = useMemo(() => mockPatients.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.nameAr.includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q)) && (filterStatus === 'all' || p.status === filterStatus) && (filterGender === 'all' || p.gender === filterGender);
  }), [search, filterStatus, filterGender]);

  const del = (p: Patient) => { toast.add(`تم حذف المريض ${p.nameAr}`, 'warning'); setSel(null); };
  const openEdit = (p: Patient) => { setEditPatient(p); setFormOpen(true); };
  const openNew = () => { setEditPatient(null); setFormOpen(true); };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div><h2 className="text-lg font-bold text-text-primary font-cairo">إدارة المرضى</h2><p className="text-xs text-text-muted font-cairo">{filtered.length} من {mockPatients.length}</p></div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openNew} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-cairo"><Plus size={16} /> تسجيل مريض جديد</motion.button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 border border-border/40">
              <Search size={14} className="text-text-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-bg-surface border border-border/40 text-xs text-text-secondary font-cairo">
              <option value="all">كل الحالات</option><option value="active">نشط</option><option value="pending">معلق</option>
            </select>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="px-3 py-2 rounded-xl bg-bg-surface border border-border/40 text-xs text-text-secondary font-cairo">
              <option value="all">الجنس</option><option value="male">ذكر</option><option value="female">أنثى</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="bg-bg-surface rounded-2xl border border-border/40 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead><tr className="border-b border-border/30 bg-bg-base/50">
                {['المريض', 'السن', 'التليفون', 'الحالة', 'الرصيد', ''].map((h, i) => <th key={i} className="text-right text-[10px] text-text-muted px-4 py-2 font-cairo">{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((p, i) => {
                  const st = statusConfig[p.status as PatientStatus] || statusConfig.active;
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      onClick={() => setSel(sel?.id === p.id ? null : p)} className={`border-b border-border/10 cursor-pointer transition-colors ${sel?.id === p.id ? 'bg-primary/10' : 'hover:bg-bg-hover/30'}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${p.gender === 'male' ? 'bg-accent/20 text-accent-light' : 'bg-pink-500/20 text-pink-300'}`}>{p.nameAr.charAt(0)}</div>
                          <div><p className="text-xs font-semibold text-text-primary font-cairo">{p.nameAr}</p><p className="text-[9px] text-text-muted font-mono">{p.id}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-secondary font-cairo">{p.gender === 'male' ? '♂' : '♀'} {p.age}</td>
                      <td className="px-4 py-2.5 text-[11px] text-text-muted font-mono">{p.phone}</td>
                      <td className="px-4 py-2.5"><span className={`text-[8px] px-1.5 py-0.5 rounded-full ${st.class}`}>{st.label}</span></td>
                      <td className="px-4 py-2.5 text-xs">{p.balance > 0 ? <span className="text-danger">{p.balance} ج</span> : <span className="text-success">✓</span>}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-0.5">
                          <button onClick={e => { e.stopPropagation(); setSel(p); }} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-primary-light"><Eye size={13} /></button>
                          <button onClick={e => { e.stopPropagation(); openEdit(p); }} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-accent-light"><Edit2 size={13} /></button>
                          <button onClick={e => { e.stopPropagation(); del(p); }} className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AnimatePresence>{sel && <PatientDetail patient={sel} onClose={() => setSel(null)} />}</AnimatePresence>
      <PatientFormModal open={formOpen} onClose={() => setFormOpen(false)} patient={editPatient} />
    </div>
  );
}
