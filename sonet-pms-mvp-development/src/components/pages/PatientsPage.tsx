// ============================================================
// Sonet PMS — Patients Page
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download,
  User, Edit2, Trash2, Eye,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Patient } from '../../types';

const statusConfig = {
  active: { label: 'نشط', class: 'badge-success' },
  pending: { label: 'معلق', class: 'badge-warning' },
  completed: { label: 'مكتمل', class: 'badge-info' },
  cancelled: { label: 'ملغي', class: 'badge-danger' },
};

const PatientRow: React.FC<{ patient: Patient; onSelect: (p: Patient) => void }> = ({
  patient, onSelect
}) => {
  const sc = statusConfig[patient.status];
  return (
    <tr
      className="border-b border-[#2D2D4E]/30 table-row-hover cursor-pointer transition-colors"
      onClick={() => onSelect(patient)}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            patient.gender === 'male'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
          }`}>
            {patient.nameAr.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {patient.nameAr}
            </p>
            <p className="text-[10px] text-[#6B6890] font-mono">{patient.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          {patient.gender === 'male'
            ? <span className="text-blue-400 text-xs">♂</span>
            : <span className="text-pink-400 text-xs">♀</span>
          }
          <span className="text-xs text-[#A8A4CC]">{patient.age} سنة</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs text-[#A8A4CC] font-mono">{patient.phone}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs text-[#A8A4CC]">{patient.lastVisit}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs font-bold text-purple-300">{patient.totalOrders}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc.class}`}>
          {sc.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        {patient.balance > 0 ? (
          <span className="text-xs font-bold text-red-300">{patient.balance} ج</span>
        ) : (
          <span className="text-xs text-emerald-400">✓ مسوى</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(patient); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-purple-400 hover:bg-purple-500/10 transition-all"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6890] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ---- Patient Detail Panel ----
const PatientDetail: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient, onClose }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-[#1E1E32] border-l border-[#2D2D4E] flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2D4E] bg-purple-900/10">
        <h3 className="text-sm font-bold text-white">ملف المريض</h3>
        <button onClick={onClose} className="text-[#6B6890] hover:text-white transition-colors text-lg leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pb-4 border-b border-[#2D2D4E]">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
            patient.gender === 'male'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
          }`}>
            {patient.nameAr.charAt(0)}
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {patient.nameAr}
            </p>
            <p className="text-[10px] text-[#6B6890] font-mono mt-0.5">{patient.id}</p>
            <span className={`inline-block mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusConfig[patient.status].class}`}>
              {statusConfig[patient.status].label}
            </span>
          </div>
        </div>

        {/* Info */}
        {[
          { label: 'العمر', value: `${patient.age} سنة`, icon: '🎂' },
          { label: 'الجنس', value: patient.gender === 'male' ? 'ذكر ♂' : 'أنثى ♀', icon: '👤' },
          { label: 'الهاتف', value: patient.phone, icon: '📱' },
          { label: 'الرقم القومي', value: patient.nationalId, icon: '🪪' },
          { label: 'آخر زيارة', value: patient.lastVisit, icon: '📅' },
          { label: 'إجمالي الطلبات', value: patient.totalOrders.toString(), icon: '🧪' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#22223A]/50">
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-[10px] text-[#6B6890]">{item.label}</p>
              <p className="text-xs font-semibold text-white">{item.value}</p>
            </div>
          </div>
        ))}

        {/* Balance */}
        {patient.balance > 0 && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-[10px] text-red-400 font-medium">رصيد مستحق</p>
            <p className="text-lg font-bold text-red-300">{patient.balance} جنيه</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button className="btn-primary text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Plus size={12} /> طلب جديد
          </button>
          <button className="btn-accent text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Eye size={12} /> النتائج
          </button>
          <button className="col-span-2 bg-[#22223A] border border-[#2D2D4E] text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#2A2A45] transition-colors">
            <Edit2 size={12} /> تعديل البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Main Page ----
const PatientsPage: React.FC = () => {
  const { patients, globalSearch } = useAppStore();
  const [search, setSearch] = useState(globalSearch);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        p.nameAr.includes(q) || p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) || p.phone.includes(q);
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchGender = filterGender === 'all' || p.gender === filterGender;
      return matchSearch && matchStatus && matchGender;
    });
  }, [patients, search, filterStatus, filterGender]);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main Table Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2D2D4E] flex-shrink-0">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6890] pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الهاتف أو ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-white placeholder-[#6B6890] focus:border-purple-500/60 focus:outline-none transition-all"
              style={{ direction: 'rtl' }}
            />
          </div>

          {/* Filters */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-[#A8A4CC] focus:outline-none focus:border-purple-500/60 cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="pending">معلق</option>
            <option value="completed">مكتمل</option>
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-sm text-[#A8A4CC] focus:outline-none focus:border-purple-500/60 cursor-pointer"
          >
            <option value="all">الجنسين</option>
            <option value="male">ذكور</option>
            <option value="female">إناث</option>
          </select>

          <div className="flex-1" />

          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E1E32] border border-[#2D2D4E] text-xs text-[#A8A4CC] hover:text-white hover:border-[#3D3D65] transition-all">
            <Download size={13} /> تصدير
          </button>
          <button className="btn-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={13} /> مريض جديد
          </button>
        </div>

        {/* Count */}
        <div className="px-5 py-2.5 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-[#6B6890]">
            يتم عرض <span className="text-purple-300 font-bold">{filtered.length}</span> من إجمالي{' '}
            <span className="text-white font-bold">{patients.length}</span> مريض
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-[#0F0F1A]">
              <tr className="border-b border-[#2D2D4E]">
                {['المريض', 'السن/الجنس', 'الهاتف', 'آخر زيارة', 'الطلبات', 'الحالة', 'الرصيد', 'إجراءات'].map((h, i) => (
                  <th key={i} className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <PatientRow key={p.id} patient={p} onSelect={setSelectedPatient} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-[#6B6890]">
                    <div className="flex flex-col items-center gap-3">
                      <User size={40} className="text-[#2D2D4E]" />
                      <p className="text-sm">لا توجد نتائج مطابقة</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default PatientsPage;
