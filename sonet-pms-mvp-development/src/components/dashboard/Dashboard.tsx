// ============================================================
// Sonet PMS — Dashboard
// ============================================================

import React from 'react';
import {
  Users,
  ClipboardList,
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { weeklyRevenueData, testCategoryData } from '../../data/mockData';

// ---- Stat Card ----
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: { value: number; up: boolean };
  variant: 'purple' | 'blue' | 'green' | 'amber';
  urgent?: boolean;
}

const variantConfig = {
  purple: {
    card: 'stat-card-purple',
    icon: 'bg-purple-500/20 text-purple-400',
    value: 'text-purple-300',
    trend: 'text-purple-400',
  },
  blue: {
    card: 'stat-card-blue',
    icon: 'bg-blue-500/20 text-blue-400',
    value: 'text-blue-300',
    trend: 'text-blue-400',
  },
  green: {
    card: 'stat-card-green',
    icon: 'bg-emerald-500/20 text-emerald-400',
    value: 'text-emerald-300',
    trend: 'text-emerald-400',
  },
  amber: {
    card: 'stat-card-amber',
    icon: 'bg-amber-500/20 text-amber-400',
    value: 'text-amber-300',
    trend: 'text-amber-400',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon: Icon, trend, variant, urgent
}) => {
  const cfg = variantConfig[variant];
  return (
    <div className={`${cfg.card} rounded-2xl p-4 card-hover relative overflow-hidden`}>
      {urgent && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${cfg.icon} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${cfg.value} leading-tight`}>{value}</p>
      <p className="text-[11px] font-semibold text-[#A8A4CC] mt-0.5">{title}</p>
      {subtitle && <p className="text-[10px] text-[#6B6890] mt-0.5">{subtitle}</p>}
    </div>
  );
};

// ---- Custom Tooltip ----
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E32] border border-[#2D2D4E] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-[#A8A4CC] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {p.name === 'revenue' ? `${p.value.toLocaleString()} جنيه` : p.value}
        </p>
      ))}
    </div>
  );
};

// ---- Recent Orders Table ----
const RecentOrders: React.FC = () => {
  const { orders } = useAppStore();
  const recent = orders.slice(0, 5);

  const statusConfig: Record<string, { label: string; class: string }> = {
    completed: { label: 'مكتمل', class: 'badge-success' },
    'in-progress': { label: 'جاري', class: 'badge-info' },
    pending: { label: 'معلق', class: 'badge-warning' },
    urgent: { label: 'عاجل', class: 'badge-danger' },
  };

  return (
    <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2D4E]">
        <div>
          <h3 className="text-sm font-bold text-white">أحدث الطلبات</h3>
          <p className="text-[10px] text-[#6B6890]">Recent Orders</p>
        </div>
        <button className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition-colors">
          عرض الكل
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D2D4E]/50">
              <th className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-2.5">رقم الطلب</th>
              <th className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-2.5">المريض</th>
              <th className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-2.5">التحاليل</th>
              <th className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-2.5">الحالة</th>
              <th className="text-right text-[10px] font-semibold text-[#6B6890] uppercase tracking-wider px-5 py-2.5">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order, i) => {
              const sc = order.priority === 'urgent'
                ? statusConfig.urgent
                : statusConfig[order.status];
              return (
                <tr key={order.id} className={`border-b border-[#2D2D4E]/30 table-row-hover cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-purple-300">{order.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {order.patientName}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {order.tests.slice(0, 2).map((t, ti) => (
                        <span key={ti} className="text-[9px] bg-[#22223A] text-[#A8A4CC] border border-[#2D2D4E] px-1.5 py-0.5 rounded-md font-medium">{t}</span>
                      ))}
                      {order.tests.length > 2 && (
                        <span className="text-[9px] text-[#6B6890]">+{order.tests.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc?.class || 'badge-info'}`}>
                      {sc?.label}
                      {order.priority === 'urgent' && ' 🔴'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-white">{order.totalAmount.toLocaleString()} ج</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---- Critical Results Alert ----
const CriticalAlerts: React.FC = () => {
  const { results } = useAppStore();
  const critical = results.filter((r) => r.status === 'critical');

  return (
    <div className="bg-gradient-card rounded-2xl border border-red-500/20 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-red-500/20 bg-red-500/5">
        <AlertTriangle size={15} className="text-red-400" />
        <h3 className="text-sm font-bold text-red-300">نتائج حرجة تحتاج مراجعة</h3>
        <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
          {critical.length} حالة
        </span>
      </div>
      <div className="divide-y divide-[#2D2D4E]/30">
        {critical.map((r) => (
          <div key={r.id} className="px-5 py-3 hover:bg-red-500/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {r.patientName}
                </p>
                <p className="text-[10px] text-[#A8A4CC]">{r.testName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-red-300">{r.value} {r.unit}</p>
                <p className="text-[9px] text-[#6B6890]">طبيعي: {r.referenceRange}</p>
              </div>
              <span className="badge-danger text-[9px] px-2 py-0.5 rounded-full font-bold">حرج</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Main Dashboard ----
const Dashboard: React.FC = () => {
  const { stats } = useAppStore();

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-5 border border-purple-500/20" style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(16,185,129,0.05) 100%)',
      }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-purple-300 mb-1">الأربعاء، 30 أبريل 2025</p>
            <h2 className="text-xl font-bold text-white mb-1">صباح الخير، د. أحمد! 👋</h2>
            <p className="text-sm text-[#A8A4CC]">
              عندك <span className="text-purple-300 font-bold">{stats.todayOrders}</span> طلب النهارده و
              <span className="text-amber-300 font-bold"> {stats.pendingResults}</span> نتيجة معلقة
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-[#6B6890]">نسبة الإنجاز</p>
              <p className="text-2xl font-bold gradient-text">{stats.completionRate}%</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Activity size={26} className="text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المرضى"
          value={stats.totalPatients.toLocaleString()}
          subtitle="مسجل في النظام"
          icon={Users}
          trend={{ value: 12, up: true }}
          variant="purple"
        />
        <StatCard
          title="طلبات اليوم"
          value={stats.todayOrders}
          subtitle="تحليل مطلوب"
          icon={ClipboardList}
          trend={{ value: 8, up: true }}
          variant="blue"
        />
        <StatCard
          title="نتائج معلقة"
          value={stats.pendingResults}
          subtitle="تحتاج مراجعة"
          icon={FlaskConical}
          trend={{ value: 3, up: false }}
          variant="amber"
          urgent={stats.urgentCases > 0}
        />
        <StatCard
          title="إيراد اليوم"
          value={`${stats.todayRevenue.toLocaleString()} ج`}
          subtitle="مجموع المدفوعات"
          icon={TrendingUp}
          trend={{ value: 15, up: true }}
          variant="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'مريض جديد', icon: '👤', color: 'from-purple-600 to-purple-800' },
          { label: 'طلب جديد', icon: '🧪', color: 'from-blue-600 to-blue-800' },
          { label: 'استلام نتيجة', icon: '✅', color: 'from-emerald-600 to-emerald-800' },
          { label: 'إصدار فاتورة', icon: '🧾', color: 'from-amber-600 to-amber-800' },
          { label: 'باركود', icon: '📊', color: 'from-pink-600 to-pink-800' },
          { label: 'تقرير يومي', icon: '📈', color: 'from-cyan-600 to-cyan-800' },
        ].map((action, i) => (
          <button
            key={i}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1E1E32] border border-[#2D2D4E] hover:border-purple-500/30 hover:bg-[#22223A] card-hover transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-[10px] font-semibold text-[#A8A4CC] group-hover:text-white transition-colors text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">إيرادات الأسبوع</h3>
              <p className="text-[10px] text-[#6B6890]">Weekly Revenue</p>
            </div>
            <div className="flex gap-2">
              {['أسبوع', 'شهر', 'سنة'].map((p, i) => (
                <button key={i} className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  i === 0 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-[#6B6890] hover:text-white'
                }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyRevenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
              <XAxis dataKey="day" tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6890', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-gradient-card rounded-2xl border border-[#2D2D4E] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">فئات التحاليل</h3>
            <p className="text-[10px] text-[#6B6890]">Test Categories</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={testCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {testCategoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {testCategoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="text-[10px] text-[#A8A4CC] flex-1 truncate">{cat.name}</span>
                <span className="text-[10px] font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        {/* Critical Results */}
        <div>
          <CriticalAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
