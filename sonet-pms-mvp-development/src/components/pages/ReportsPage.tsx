// ============================================================
// Sonet PMS — Reports Page
// ============================================================

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { Download, Calendar, Users, FlaskConical, DollarSign } from 'lucide-react';
import { weeklyRevenueData, testCategoryData } from '../../data/mockData';

const monthlyData = [
  { month: 'نوفمبر', patients: 180, revenue: 42000, tests: 520 },
  { month: 'ديسمبر', patients: 220, revenue: 58000, tests: 680 },
  { month: 'يناير', patients: 195, revenue: 48000, tests: 590 },
  { month: 'فبراير', patients: 240, revenue: 63000, tests: 720 },
  { month: 'مارس', patients: 280, revenue: 71000, tests: 840 },
  { month: 'أبريل', patients: 310, revenue: 82000, tests: 920 },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E32] border border-[#2D2D4E] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-[#A8A4CC] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const ReportsPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">التقارير والإحصائيات</h2>
          <p className="text-[11px] text-[#6B6890]">Analytics & Reports — أبريل 2025</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-xl bg-[#161625] border border-[#2D2D4E] text-xs text-[#A8A4CC] focus:outline-none">
            <option>6 أشهر</option>
            <option>3 أشهر</option>
            <option>شهر</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E1E32] border border-[#2D2D4E] text-xs text-[#A8A4CC] hover:text-white transition-all">
            <Download size={13} /> تصدير PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المرضى (أبريل)', value: '310', icon: Users, change: '+12%', up: true, color: 'purple' },
          { label: 'إجمالي التحاليل', value: '920', icon: FlaskConical, change: '+9%', up: true, color: 'blue' },
          { label: 'إجمالي الإيرادات', value: '82,000 ج', icon: DollarSign, change: '+15%', up: true, color: 'green' },
          { label: 'متوسط وقت التسليم', value: '2.4 ساعة', icon: Calendar, change: '-18%', up: false, color: 'amber' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-2xl p-4 border stat-card-${kpi.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={`text-${kpi.color === 'purple' ? 'purple' : kpi.color === 'blue' ? 'blue' : kpi.color === 'green' ? 'emerald' : 'amber'}-400`} />
                <span className={`text-[10px] font-semibold ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change}</span>
              </div>
              <p className={`text-xl font-bold text-${kpi.color === 'purple' ? 'purple' : kpi.color === 'blue' ? 'blue' : kpi.color === 'green' ? 'emerald' : 'amber'}-300`}>{kpi.value}</p>
              <p className="text-[10px] text-[#A8A4CC] mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <h3 className="text-sm font-bold text-white mb-4">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
              <XAxis dataKey="month" tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="الإيراد" stroke="#7C3AED" strokeWidth={2} fill="url(#revenueGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Patients & Tests */}
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <h3 className="text-sm font-bold text-white mb-4">المرضى والتحاليل شهرياً</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
              <XAxis dataKey="month" tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="patients" name="المرضى" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tests" name="التحاليل" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <h3 className="text-sm font-bold text-white mb-4">إيرادات الأسبوع الحالي</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
              <XAxis dataKey="day" tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="الإيراد" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
              <Line type="monotone" dataKey="orders" name="الطلبات" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <h3 className="text-sm font-bold text-white mb-4">توزيع فئات التحاليل</h3>
          <div className="space-y-3">
            {testCategoryData.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: cat.color }} />
                    <span className="text-xs text-[#A8A4CC]">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{cat.value}%</span>
                </div>
                <div className="h-1.5 bg-[#22223A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.value}%`, background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5 pb-4">
        <h3 className="text-sm font-bold text-white mb-4">تقارير جاهزة</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'تقرير يومي', desc: 'ملخص اليوم الحالي', icon: '📊', color: 'bg-purple-500/10 border-purple-500/20' },
            { name: 'تقرير شهري', desc: 'إحصائيات الشهر', icon: '📈', color: 'bg-blue-500/10 border-blue-500/20' },
            { name: 'كشف الذمم', desc: 'المبالغ المستحقة', icon: '💰', color: 'bg-amber-500/10 border-amber-500/20' },
            { name: 'تقرير الجودة', desc: 'معدلات الأخطاء', icon: '🔬', color: 'bg-emerald-500/10 border-emerald-500/20' },
          ].map((r, i) => (
            <button key={i} className={`p-4 rounded-xl border ${r.color} text-left hover:opacity-80 transition-all group`}>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{r.icon}</span>
              <p className="text-xs font-bold text-white">{r.name}</p>
              <p className="text-[10px] text-[#6B6890] mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
