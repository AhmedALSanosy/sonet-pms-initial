// ============================================================
// Sonet PMS — Dashboard (Fixed + Rich)
// ============================================================
import { motion } from 'framer-motion';
import { Users, TestTube2, FileCheck2, Receipt, TrendingUp, AlertCircle, ArrowUpRight, Activity, Zap } from 'lucide-react';
import { mockOrders, mockResults, mockStats } from '../../data/mockData';
import type { OrderStatus } from '../../types';

function StatCard({ icon, label, value, change, trend, color, delay }: { icon: React.ReactNode; label: string; value: string; change: string; trend: 'up' | 'down'; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
      className="rounded-2xl p-4 card-hover" style={{ background: `linear-gradient(135deg, ${color}12, rgba(30,30,50,0.8))`, border: `1px solid ${color}30` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>{icon}</div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-0.5 ${trend === 'up' ? 'badge-success' : 'badge-danger'}`}>
          {trend === 'up' ? <TrendingUp size={9} /> : <Activity size={9} />}{change}
        </span>
      </div>
      <p className="text-xl font-bold text-text-primary">{value}</p>
      <p className="text-[10px] text-text-muted mt-0.5 font-cairo">{label}</p>
    </motion.div>
  );
}

function CompletionRing({ rate }: { rate: number }) {
  const c = 2 * Math.PI * 36;
  const offset = c - (rate / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 flex-shrink-0" dir="ltr">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#2D2D4E" strokeWidth="5" />
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c}
            initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ delay: 0.5, duration: 1.2 }} />
          <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold gradient-text">{rate}%</span></div>
      </div>
      <div><p className="text-xs font-semibold text-text-primary font-cairo">نسبة الإنجاز</p><p className="text-[10px] text-text-muted font-cairo">أداء المعمل اليوم</p></div>
    </div>
  );
}

const orderStatusConfig: Record<OrderStatus, { label: string; class: string }> = {
  completed: { label: 'مكتمل', class: 'badge-success' },
  'in-progress': { label: 'قيد التنفيذ', class: 'badge-info' },
  pending: { label: 'معلق', class: 'badge-warning' },
};

export default function Dashboard() {
  const { setActiveSection } = useAppStore();
  const stats = [
    { icon: <Users size={18} />, label: 'إجمالي المرضى', value: mockStats.totalPatients.toLocaleString(), change: '+12.5%', trend: 'up' as const, color: '#7C3AED' },
    { icon: <TestTube2 size={18} />, label: 'طلبات اليوم', value: String(mockStats.todayOrders), change: '+8.2%', trend: 'up' as const, color: '#3B82F6' },
    { icon: <FileCheck2 size={18} />, label: 'نتائج معلقة', value: String(mockStats.pendingResults), change: '-2.4%', trend: 'down' as const, color: '#10B981' },
    { icon: <Receipt size={18} />, label: 'إيرادات اليوم', value: `${mockStats.todayRevenue.toLocaleString()} ج.م`, change: '+18.7%', trend: 'up' as const, color: '#F59E0B' },
  ];

  const criticalResults = mockResults.filter(r => r.status === 'critical' || r.status === 'abnormal');
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-5 space-y-5">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl gradient-primary p-5">
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] text-white/50 font-cairo mb-1">الأربعاء، ٣٠ أبريل ٢٠٢٥</p>
              <h2 className="text-xl font-bold text-white font-cairo mb-1.5">صباح الخير، د. أحمد! 👋</h2>
              <p className="text-xs text-white/70 font-cairo">عندك <span className="text-white font-semibold">{mockStats.todayOrders} طلب</span> و <span className="text-white font-semibold">{mockStats.pendingResults} نتيجة معلقة</span> و <span className="text-yellow-200 font-semibold">{mockStats.urgentCases} عاجلة</span> ⚠️</p>
            </div>
            <CompletionRing rate={mockStats.completionRate} />
          </div>
          <div className="absolute top-0 left-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/4" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.06} />)}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold text-text-primary font-cairo mb-3">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { icon: '👤', label: 'مريض جديد', g: 'from-purple-600 to-purple-800' },
              { icon: '🧪', label: 'طلب جديد', g: 'from-blue-600 to-blue-800' },
              { icon: '✅', label: 'استلام نتيجة', g: 'from-emerald-600 to-emerald-800' },
              { icon: '🧾', label: 'إصدار فاتورة', g: 'from-amber-600 to-amber-800' },
              { icon: '📊', label: 'باركود', g: 'from-pink-600 to-pink-800' },
              { icon: '📈', label: 'تقرير يومي', g: 'from-cyan-600 to-cyan-800' },
            ].map((a, i) => (
              <motion.button key={i} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${a.g} text-white text-xs font-medium font-cairo shadow-lg hover:shadow-xl`}>
                <span className="text-base">{a.icon}</span><span>{a.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3 bg-bg-surface rounded-2xl border border-border/40 p-4">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-xs font-semibold text-text-primary font-cairo">إيرادات الأسبوع</h3><p className="text-[10px] text-text-muted">Weekly Revenue</p></div>
              <div className="flex items-center gap-1">
                {['أسبوع', 'شهر', 'سنة'].map((p, i) => (
                  <button key={i} className={`text-[10px] px-2.5 py-1 rounded-lg font-cairo ${i === 0 ? 'badge-purple' : 'text-text-muted bg-bg-hover'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-2 h-36" dir="ltr">
              {['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'].map((day, i) => {
                const h = [45, 62, 78, 55, 90, 72, 85][i];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                    <div className="text-[9px] text-text-muted mb-1">{(h * 500).toLocaleString()}</div>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }} className="w-full rounded-t-md gradient-primary opacity-75 min-h-[3px]" />
                    <span className="text-[8px] text-text-muted truncate w-full text-center font-cairo">{day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 bg-bg-surface rounded-2xl border border-border/40 p-4">
            <h3 className="text-xs font-semibold text-text-primary font-cairo mb-1">فئات التحاليل</h3>
            <p className="text-[10px] text-text-muted mb-4">Test Categories</p>
            <div className="space-y-3">
              {[{ n: 'CBC - صورة دم', p: 35, c: '#7C3AED' }, { n: 'Chemistry - كيميائي', p: 28, c: '#3B82F6' }, { n: 'Thyroid - درقية', p: 15, c: '#10B981' }, { n: 'Urine - بول', p: 12, c: '#F59E0B' }, { n: 'أخرى', p: 10, c: '#06B6D4' }].map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1"><span className="text-[11px] text-text-secondary font-cairo">{cat.n}</span><span className="text-[11px] font-medium text-text-primary">{cat.p}%</span></div>
                  <div className="w-full h-2 bg-bg-hover rounded-full overflow-hidden" dir="ltr">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.p}%` }} transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: cat.c }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-bg-surface rounded-2xl border border-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <h3 className="text-xs font-semibold text-text-primary font-cairo">آخر الطلبات</h3>
              <button className="text-[10px] text-primary-light hover:text-primary flex items-center gap-0.5 font-cairo">عرض الكل <ArrowUpRight size={10} /></button>
            </div>
            <div className="divide-y divide-border/15">
              {recentOrders.map((order) => {
                const st = orderStatusConfig[order.status];
                return (
                  <div key={order.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light flex-shrink-0"><TestTube2 size={14} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-text-primary font-cairo truncate">{order.patientName}</p>
                      <p className="text-[9px] text-text-muted font-cairo truncate">{order.tests.join(' + ')}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${st.class} flex-shrink-0`}>{st.label}</span>
                    {order.priority === 'urgent' && <Zap size={12} className="text-warning flex-shrink-0" />}
                    <span className="text-[9px] text-text-muted flex-shrink-0 font-cairo">{order.totalAmount} ج.م</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Critical Results */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-bg-surface rounded-2xl border border-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2"><AlertCircle size={14} className="text-danger" /><h3 className="text-xs font-semibold text-text-primary font-cairo">نتائج حرجة / غير طبيعية</h3></div>
              <span className="text-[10px] text-danger bg-danger/10 px-2 py-0.5 rounded-lg font-cairo">{criticalResults.length}</span>
            </div>
            <div className="divide-y divide-border/15">
              {criticalResults.map((r) => (
                <div key={r.id} className="px-4 py-3 hover:bg-bg-hover/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-text-primary font-cairo">{r.patientName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${r.status === 'critical' ? 'badge-danger' : 'badge-warning'}`}>{r.status === 'critical' ? 'حرج' : 'غير طبيعي'}</span>
                  </div>
                  <p className="text-[10px] text-text-muted font-cairo">{r.testName}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono font-bold text-danger">{r.value} {r.unit}</span>
                    <span className="text-[9px] text-text-muted">(الطبيعي: {r.referenceRange})</span>
                    {r.reviewedBy && <span className="text-[9px] text-text-muted mr-auto font-cairo">✓ {r.reviewedBy}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-bg-surface rounded-2xl border border-border/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <h3 className="text-xs font-semibold text-text-primary font-cairo">آخر النشاطات</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/15">
            {[
              { icon: <FileCheck2 size={13} />, t: 'نتيجة جاهزة', s: 'أحمد علي — CBC', b: 'success' },
              { icon: <AlertCircle size={13} />, t: 'نتيجة حرجة ⚠️', s: 'خالد سمير — Troponin 2.8', b: 'danger' },
              { icon: <Users size={13} />, t: 'مريض جديد', s: 'سارة نور — P-1004', b: 'info' },
              { icon: <Activity size={13} />, t: 'تحليل جاري', s: 'فاطمة حسن — Thyroid', b: 'warning' },
              { icon: <Receipt size={13} />, t: 'فاتورة جديدة', s: 'INV-2025-003 — 1,200 ج.م', b: 'info' },
              { icon: <Zap size={13} />, t: 'أوردر عاجل', s: 'سارة نور — HCG + Prog.', b: 'danger' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-bg-hover/30 transition-colors cursor-pointer">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 badge-${a.b}`}>{a.icon}</div>
                <div className="flex-1 min-w-0"><p className="text-[11px] font-medium text-text-primary font-cairo truncate">{a.t}</p><p className="text-[9px] text-text-muted font-cairo truncate">{a.s}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
