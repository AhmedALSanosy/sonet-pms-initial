// ============================================================
// Sonet PMS — Settings Page (Tab Navigation + AI Section)
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Bell, Shield, Database, Mic, Brain, Save, CheckCircle2 } from 'lucide-react';

type SettingTab = 'general' | 'voice' | 'ai' | 'database' | 'notifications' | 'security';

const tabs: { id: SettingTab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'عام', icon: <Building2 size={16} /> },
  { id: 'voice', label: 'المساعد الصوتي', icon: <Mic size={16} /> },
  { id: 'ai', label: 'الذكاء الاصطناعي', icon: <Brain size={16} /> },
  { id: 'database', label: 'قاعدة البيانات', icon: <Database size={16} /> },
  { id: 'notifications', label: 'الإشعارات', icon: <Bell size={16} /> },
  { id: 'security', label: 'الأمان', icon: <Shield size={16} /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-primary' : 'bg-bg-hover'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [s, set] = useState({
    labName: 'معمل سونيت التخصصي', labPhone: '02-1234-5678', labEmail: 'info@sonetlab.com',
    currency: 'EGP', language: 'ar',
    voiceEnabled: true, sttModel: 'whisper-small', ttsModel: 'xtts-v2', autoListen: false,
    aiEnabled: true, llmModel: 'gemma-4', offlineMode: true,
    dbType: 'sqlite', dbPath: './sonet_pms.db',
    notifyCritical: true, notifyOrders: true, notifyReminders: false, autoBackup: true,
    sessionTimeout: 60,
  });
  const toggle = (key: keyof typeof s) => set(prev => ({ ...prev, [key]: !prev[key] }));

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-text-primary font-cairo">بيانات المعمل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ l: 'اسم المعمل', k: 'labName', t: 'text' }, { l: 'رقم الهاتف', k: 'labPhone', t: 'tel' }, { l: 'البريد الإلكتروني', k: 'labEmail', t: 'email' }].map(f => (
                <div key={f.k}>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">{f.l}</label>
                  <input type={f.t} value={(s as unknown as Record<string, string>)[f.k]} onChange={e => set(prev => ({ ...prev, [f.k]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none focus:border-primary/60 font-cairo" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">العملة</label>
                <select value={s.currency} onChange={e => set(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none focus:border-primary/60 font-cairo">
                  <option value="EGP">جنيه مصري (EGP)</option><option value="USD">دولار (USD)</option><option value="SAR">ريال (SAR)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">اللغة</label>
                <select value={s.language} onChange={e => set(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none focus:border-primary/60 font-cairo">
                  <option value="ar">العربية</option><option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div><p className="text-sm font-bold text-text-primary font-cairo">تفعيل المساعد الصوتي</p><p className="text-[11px] text-text-muted mt-0.5 font-cairo">تفعيل مساعد سونيت الصوتي بالكامل</p></div>
              <Toggle checked={s.voiceEnabled} onChange={() => toggle('voiceEnabled')} />
            </div>
            {s.voiceEnabled && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">نموذج التعرف على الصوت (STT)</label>
                  <select value={s.sttModel} onChange={e => set(prev => ({ ...prev, sttModel: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none font-cairo">
                    <option value="whisper-tiny">Whisper Tiny (سريع جداً)</option>
                    <option value="whisper-small">Whisper Small (مُوصى به)</option>
                    <option value="whisper-medium">Whisper Medium (دقيق)</option>
                    <option value="whisper-large">Whisper Large-v3 (أفضل دقة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">نموذج تركيب الصوت (TTS)</label>
                  <select value={s.ttsModel} onChange={e => set(prev => ({ ...prev, ttsModel: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none font-cairo">
                    <option value="xtts-v2">XTTS-v2 (عربي محسوب)</option>
                    <option value="melotts">MeloTTS (سريع وخفيف)</option>
                    <option value="fastspeech2">FastSpeech2 (احترافي)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg-card border border-border/50">
                  <div><p className="text-xs font-semibold text-text-primary font-cairo">الاستماع التلقائي</p><p className="text-[10px] text-text-muted font-cairo">تفعيل الميكروفون تلقائياً عند فتح النظام</p></div>
                  <Toggle checked={s.autoListen} onChange={() => toggle('autoListen')} />
                </div>
              </>
            )}
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div><p className="text-sm font-bold text-text-primary font-cairo">تفعيل الذكاء الاصطناعي</p><p className="text-[11px] text-text-muted mt-0.5 font-cairo">LLM للتحليل الذكي والإجابة على الأسئلة</p></div>
              <Toggle checked={s.aiEnabled} onChange={() => toggle('aiEnabled')} />
            </div>
            {s.aiEnabled && (
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-3 font-cairo">نموذج اللغة (LLM)</label>
                <div className="space-y-2">
                  {[
                    { id: 'gemma-4', name: 'Gemma 4 (Q4)', desc: 'Google — سريع ودقيق للعربية', size: '4.8GB' },
                    { id: 'qwen-3.5', name: 'Qwen 3.5 (Q4)', desc: 'Alibaba — ممتاز للعربية', size: '5.2GB' },
                    { id: 'llama-3', name: 'Llama 3 8B (Q4)', desc: 'Meta — متعدد المهام', size: '5.7GB' },
                  ].map(model => (
                    <div key={model.id} onClick={() => set(prev => ({ ...prev, llmModel: model.id }))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        s.llmModel === model.id ? 'bg-primary/15 border-primary/40' : 'bg-bg-card border-border/50 hover:border-border'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {s.llmModel === model.id && <CheckCircle2 size={14} className="text-primary-light" />}
                          <span className="text-xs font-bold text-text-primary">{model.name}</span>
                          <span className="text-[10px] text-text-muted">({model.size})</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted mt-1 font-cairo">{model.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg-card border border-border/50 mt-4">
                  <div><p className="text-xs font-semibold text-text-primary font-cairo">الوضع Offline</p><p className="text-[10px] text-text-muted font-cairo">تشغيل النماذج محلياً بدون إنترنت</p></div>
                  <Toggle checked={s.offlineMode} onChange={() => toggle('offlineMode')} />
                </div>
              </div>
            )}
          </div>
        );
      case 'database':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-text-primary font-cairo">قاعدة البيانات</h3>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">النوع</label>
              <select value={s.dbType} onChange={e => set(prev => ({ ...prev, dbType: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none font-cairo">
                <option value="sqlite">SQLite (محلي — خفيف)</option><option value="postgresql">PostgreSQL (شبكي)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">مسار قاعدة البيانات</label>
              <input type="text" value={s.dbPath} onChange={e => set(prev => ({ ...prev, dbPath: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none font-mono" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-card border border-border/50">
              <div><p className="text-xs font-semibold text-text-primary font-cairo">النسخ الاحتياطي التلقائي</p><p className="text-[10px] text-text-muted font-cairo">نسخة احتياطية يومية تلقائية</p></div>
              <Toggle checked={s.autoBackup} onChange={() => toggle('autoBackup')} />
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary font-cairo">إعدادات الإشعارات</h3>
            {[
              { key: 'notifyCritical' as const, label: 'نتائج حرجة', desc: 'تنبيه فوري عند ظهور نتائج حرجة' },
              { key: 'notifyOrders' as const, label: 'الطلبات الجديدة', desc: 'تنبيه عند إنشاء طلب تحليل جديد' },
              { key: 'notifyReminders' as const, label: 'التذكيرات', desc: 'تذكير بالمواعيد والنتائج المعلقة' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-bg-card border border-border/50">
                <div><p className="text-xs font-semibold text-text-primary font-cairo">{item.label}</p><p className="text-[10px] text-text-muted font-cairo">{item.desc}</p></div>
                <Toggle checked={s[item.key] as boolean} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-text-primary font-cairo">الأمان والخصوصية</h3>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 font-cairo">مدة الجلسة (دقيقة)</label>
              <input type="number" value={s.sessionTimeout} onChange={e => set(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border/50 text-sm text-text-primary focus:outline-none" />
              <p className="text-[10px] text-text-muted mt-1 font-cairo">يتم تسجيل الخروج تلقائياً بعد هذه المدة</p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning font-cairo font-semibold">⚠️ تنبيه أمني</p>
              <p className="text-[10px] text-text-secondary mt-1 font-cairo">يجب تفعيل التشفير للبيانات الطبية حسب اللوائح المحلية</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-5 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-text-primary font-cairo">الإعدادات</h2><p className="text-xs text-text-muted font-cairo">تخصيص إعدادات النظام</p></div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-medium font-cairo"><Save size={14} /> حفظ التغييرات</motion.button>
      </div>

      <div className="flex gap-5">
        {/* Tabs Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all font-cairo ${
                activeTab === tab.id ? 'bg-primary/15 text-primary-light border border-primary/25' : 'text-text-muted hover:bg-bg-hover hover:text-text-primary border border-transparent'
              }`}>
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-bg-surface rounded-2xl border border-border/40 p-5">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
