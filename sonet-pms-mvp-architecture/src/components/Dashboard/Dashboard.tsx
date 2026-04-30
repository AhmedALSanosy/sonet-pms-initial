import { motion } from 'framer-motion';
import {
  Users,
  TestTube2,
  FileCheck2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Activity,
  FlaskConical,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function StatCard({ title, value, change, trend, icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface-secondary rounded-2xl p-5 border border-border/50 hover:border-border transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            trend === 'up'
              ? 'text-success bg-success/10'
              : 'text-danger bg-danger/10'
          }`}
        >
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
      <p className="text-xs text-text-muted font-cairo">{title}</p>
    </motion.div>
  );
}

interface RecentActivityProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}

function RecentActivity({ icon, title, subtitle, time, status }: RecentActivityProps) {
  const statusColors = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-tertiary/50 transition-colors">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${statusColors[status]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate font-cairo">{title}</p>
        <p className="text-[11px] text-text-muted font-cairo">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1 text-text-muted">
        <Clock size={11} />
        <span className="text-[11px]">{time}</span>
      </div>
    </div>
  );
}

const stats: StatCardProps[] = [
  {
    title: 'إجمالي المرضى',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: <Users size={20} />,
    color: '#7C3AED',
    delay: 0,
  },
  {
    title: 'طلبات التحاليل اليوم',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: <TestTube2 size={20} />,
    color: '#3B82F6',
    delay: 0.1,
  },
  {
    title: 'نتائج جاهزة',
    value: '89',
    change: '-2.4%',
    trend: 'down',
    icon: <FileCheck2 size={20} />,
    color: '#10B981',
    delay: 0.2,
  },
  {
    title: 'إيرادات اليوم',
    value: '٤٥,٢٠٠ ج.م',
    change: '+18.7%',
    trend: 'up',
    icon: <Receipt size={20} />,
    color: '#F59E0B',
    delay: 0.3,
  },
];

const activities = [
  {
    icon: <FileCheck2 size={16} />,
    title: 'نتيجة تحاليل جاهزة',
    subtitle: 'محمد أحمد سعيد — CBC + Chemistry',
    time: 'من 2 دقيقة',
    status: 'success' as const,
  },
  {
    icon: <AlertCircle size={16} />,
    title: 'تنبيه: نتيجة غير طبيعية',
    subtitle: 'سارة محمود — Glucose: 280 mg/dL',
    time: 'من 5 دقائق',
    status: 'danger' as const,
  },
  {
    icon: <Users size={16} />,
    title: 'مريض جديد مسجل',
    subtitle: 'أحمد حسن إبراهيم — كود: P-2847',
    time: 'من 12 دقيقة',
    status: 'info' as const,
  },
  {
    icon: <Activity size={16} />,
    title: 'تحليل قيد التنفيذ',
    subtitle: 'فاطمة علي — Thyroid Panel',
    time: 'من 18 دقيقة',
    status: 'warning' as const,
  },
  {
    icon: <Receipt size={16} />,
    title: 'فاتورة جديدة',
    subtitle: 'INV-2024-1456 — ١,٨٥٠ ج.م',
    time: 'من 25 دقيقة',
    status: 'info' as const,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl gradient-primary p-6"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical size={20} className="text-white/80" />
            <span className="text-sm text-white/70 font-cairo">Sonet Medical Lab</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 font-cairo">
            صباح الخير يا دكتور أحمد 👋
          </h2>
          <p className="text-sm text-white/70 font-cairo">
            عندك <span className="text-white font-semibold">156 طلب تحليل</span> النهارده —{' '}
            <span className="text-white font-semibold">89 نتيجة جاهزة</span> للتسليم
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-surface-secondary rounded-2xl border border-border/50"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h3 className="text-sm font-semibold text-text-primary font-cairo">آخر النشاطات</h3>
            <button className="flex items-center gap-1 text-xs text-primary-light hover:text-primary transition-colors">
              عرض الكل
              <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {activities.map((activity, i) => (
              <RecentActivity key={i} {...activity} />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-secondary rounded-2xl border border-border/50"
        >
          <div className="px-5 py-4 border-b border-border/50">
            <h3 className="text-sm font-semibold text-text-primary font-cairo">إجراءات سريعة</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'تسجيل مريض جديد', icon: <Users size={18} />, color: '#7C3AED' },
              { label: 'طلب تحاليل جديد', icon: <TestTube2 size={18} />, color: '#3B82F6' },
              { label: 'إدخال نتائج', icon: <FileCheck2 size={18} />, color: '#10B981' },
              { label: 'إنشاء فاتورة', icon: <Receipt size={18} />, color: '#F59E0B' },
              { label: 'طباعة تقرير', icon: <Activity size={18} />, color: '#06B6D4' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-tertiary/50 transition-all duration-200 group text-right"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors font-cairo">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Today's Tests Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface-secondary rounded-2xl border border-border/50 p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-text-primary font-cairo">تحاليل اليوم</h3>
            <p className="text-xs text-text-muted mt-0.5">توزيع التحاليل حسب النوع</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {[
              { label: 'CBC', color: '#7C3AED', count: 42 },
              { label: 'Chemistry', color: '#3B82F6', count: 38 },
              { label: 'Thyroid', color: '#10B981', count: 24 },
              { label: 'Urine', color: '#F59E0B', count: 31 },
              { label: 'Others', color: '#06B6D4', count: 21 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-text-muted">{item.label}</span>
                <span className="text-text-primary font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bar chart placeholder */}
        <div className="flex items-end gap-3 h-40">
          {[
            { h: '85%', color: '#7C3AED' },
            { h: '70%', color: '#3B82F6' },
            { h: '50%', color: '#10B981' },
            { h: '65%', color: '#F59E0B' },
            { h: '40%', color: '#06B6D4' },
            { h: '90%', color: '#7C3AED' },
            { h: '75%', color: '#3B82F6' },
            { h: '55%', color: '#10B981' },
            { h: '80%', color: '#F59E0B' },
            { h: '60%', color: '#06B6D4' },
            { h: '95%', color: '#7C3AED' },
            { h: '45%', color: '#3B82F6' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: bar.h }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                className="w-full rounded-t-lg min-h-[4px]"
                style={{
                  backgroundColor: bar.color,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-text-muted">
          <span>8:00 ص</span>
          <span>10:00 ص</span>
          <span>12:00 م</span>
          <span>2:00 م</span>
          <span>4:00 م</span>
          <span>6:00 م</span>
        </div>
      </motion.div>
    </div>
  );
}
