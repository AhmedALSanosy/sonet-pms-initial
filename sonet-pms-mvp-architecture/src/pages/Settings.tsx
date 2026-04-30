import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Database, Mic, Bell, Save } from 'lucide-react';

interface SettingSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingSection({ icon, title, description, children }: SettingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-secondary rounded-2xl p-5 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-light">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary font-cairo">{title}</h3>
          <p className="text-xs text-text-muted font-cairo">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

interface ToggleProps {
  label: string;
  enabled: boolean;
}

function Toggle({ label, enabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-text-secondary font-cairo">{label}</span>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-primary' : 'bg-surface-tertiary'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-cairo">الإعدادات</h2>
          <p className="text-sm text-text-muted font-cairo">إعدادات النظام والتخصيص</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary rounded-xl text-white text-sm font-medium shadow-lg shadow-primary/20 font-cairo"
        >
          <Save size={16} />
          حفظ التغييرات
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* General */}
        <SettingSection icon={<SettingsIcon size={18} />} title="عام" description="الإعدادات الأساسية للنظام">
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">اسم المعمل</span>
              <input
                type="text"
                defaultValue="Sonet Medical Lab"
                className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors w-48 text-left font-cairo"
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">اللغة</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>العربية</option>
                <option>English</option>
              </select>
            </div>
            <Toggle label="الوضع الداكن" enabled={true} />
          </div>
        </SettingSection>

        {/* Voice Assistant */}
        <SettingSection icon={<Mic size={18} />} title="المساعد الصوتي" description="إعدادات التعرف على الصوت">
          <div className="space-y-1">
            <Toggle label="تفعيل المساعد الصوتي" enabled={true} />
            <Toggle label="التشغيل التلقائي عند الفتح" enabled={false} />
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">نموذج STT</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>Whisper (Local)</option>
                <option>Whisper Tiny</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">نموذج LLM</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>Gemma 4 (Local)</option>
                <option>Qwen 3.5 (Local)</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">نموذج TTS</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>XTTS-v2 (Local)</option>
                <option>MeloTTS (Local)</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Database */}
        <SettingSection icon={<Database size={18} />} title="قاعدة البيانات" description="إعدادات التخزين والنسخ الاحتياطي">
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">نوع قاعدة البيانات</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>SQLite (محلي)</option>
                <option>PostgreSQL (شبكي)</option>
              </select>
            </div>
            <Toggle label="النسخ الاحتياطي التلقائي" enabled={true} />
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary font-cairo">تكرار النسخ</span>
              <select className="bg-surface-tertiary text-sm text-text-primary rounded-lg px-3 py-1.5 border border-border/50 outline-none focus:border-primary/50 transition-colors font-cairo">
                <option>يومياً</option>
                <option>أسبوعياً</option>
                <option>شهرياً</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={<Bell size={18} />} title="الإشعارات" description="تنبيهات النظام والتقارير">
          <div className="space-y-1">
            <Toggle label="إشعارات النتائج الحرجة" enabled={true} />
            <Toggle label="تنبيهات المخزون" enabled={true} />
            <Toggle label="إشعارات الفواتير المتأخرة" enabled={false} />
            <Toggle label="تنبيهات صوتية" enabled={true} />
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
