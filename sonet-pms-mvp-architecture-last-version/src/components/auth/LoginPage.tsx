// ============================================================
// Sonet PMS — Login Page
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Eye, EyeOff, LogIn, FlaskConical } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('admin@sonetlab.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('من فضلك ادخل البيانات'); return; }
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    if (!ok) setError('بيانات الدخول غلط');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ─── Left: Decorative Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 text-center max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20">
              <FlaskConical size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 font-cairo">Sonet PMS</h1>
            <p className="text-lg text-white/70 font-cairo mb-8">نظام إدارة معمل التحاليل الذكي</p>
            <div className="space-y-4 text-right">
              {[
                { icon: '🧪', text: 'إدارة شاملة للتحاليل والعينات' },
                { icon: '🎤', text: 'مساعد صوتي باللهجة المصرية' },
                { icon: '📊', text: 'تقارير وإحصائيات لحظية' },
                { icon: '🔒', text: 'يعمل بالكامل Offline' },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm text-white/80 font-cairo">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* ─── Right: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-bg-base">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center"><Microscope size={20} className="text-white" /></div>
            <div><h1 className="text-lg font-bold gradient-text">Sonet PMS</h1><p className="text-[10px] text-text-muted">Lab Management System</p></div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary font-cairo">مرحباً بيك 👋</h2>
            <p className="text-sm text-text-muted mt-1 font-cairo">ادخل بياناتك عشان تبدأ شغلك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border/50 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none transition-colors font-cairo"
                placeholder="doctor@sonetlab.com" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">كلمة المرور</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border/50 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-danger font-cairo bg-danger/10 px-3 py-2 rounded-lg border border-danger/20">
                ⚠️ {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-3 rounded-xl gradient-primary text-white text-sm font-semibold font-cairo flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> تسجيل الدخول</>
              )}
            </motion.button>
          </form>

          <p className="text-[10px] text-text-muted text-center mt-6 font-cairo">
            لتجربة النظام: admin@sonetlab.com / أي كلمة مرور
          </p>

          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-[10px] text-text-muted font-cairo">Sonet PMS v0.3.0 — Offline-First LIMS</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
