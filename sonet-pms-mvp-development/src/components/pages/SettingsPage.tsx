// ============================================================
// Sonet PMS — Settings Page
// ============================================================

import React, { useState } from 'react';
import {
  Building2, Bell, Shield, Database,
  Mic, Brain, Save, RefreshCw,
  ChevronRight, CheckCircle2,
} from 'lucide-react';

type SettingTab = 'general' | 'voice' | 'ai' | 'database' | 'notifications' | 'security';

const tabs: { id: SettingTab; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'general', label: 'عام', icon: Building2 },
  { id: 'voice', label: 'المساعد الصوتي', icon: Mic },
  { id: 'ai', label: 'الذكاء الاصطناعي', icon: Brain },
  { id: 'database', label: 'قاعدة البيانات', icon: Database },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'security', label: 'الأمان', icon: Shield },
];

interface ToggleProps { checked: boolean; onChange: () => void; }
const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-purple-600' : 'bg-[#2D2D4E]'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'left-5' : 'left-0.5'}`} />
  </button>
);

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [settings, setSettings] = useState({
    labName: 'معمل سونيت التخصصي',
    labPhone: '02-1234-5678',
    labEmail: 'info@sonetlab.com',
    currency: 'EGP',
    language: 'ar',
    voiceEnabled: true,
    sttModel: 'whisper-small',
    ttsModel: 'xtts-v2',
    llmModel: 'gemma-4',
    autoListen: false,
    aiEnabled: true,
    offlineMode: true,
    dbType: 'sqlite',
    dbPath: './sonet_pms.db',
    notifyCritical: true,
    notifyOrders: true,
    notifyReminders: false,
    autoBackup: true,
    sessionTimeout: 60,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const renderGeneral = () => (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-white">بيانات المعمل</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'اسم المعمل', key: 'labName', type: 'text' },
          { label: 'رقم الهاتف', key: 'labPhone', type: 'tel' },
          { label: 'البريد الإلكتروني', key: 'labEmail', type: 'email' },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">{f.label}</label>
            <input
              type={f.type}
              value={(settings as any)[f.key]}
              onChange={(e) => setSettings((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>
        ))}
        <div>
          <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">العملة</label>
          <select
            value={settings.currency}
            onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-sm text-white focus:outline-none focus:border-purple-500/60"
          >
            <option value="EGP">جنيه مصري (EGP)</option>
            <option value="USD">دولار (USD)</option>
            <option value="SAR">ريال سعودي (SAR)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderVoice = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <div>
          <p className="text-sm font-bold text-white">تفعيل المساعد الصوتي</p>
          <p className="text-[11px] text-[#6B6890] mt-0.5">تفعيل مساعد سونيت الصوتي بالكامل</p>
        </div>
        <Toggle checked={settings.voiceEnabled} onChange={() => toggle('voiceEnabled')} />
      </div>

      {settings.voiceEnabled && (
        <>
          <div>
            <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">نموذج التعرف على الصوت (STT)</label>
            <select
              value={settings.sttModel}
              onChange={(e) => setSettings((s) => ({ ...s, sttModel: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-sm text-white focus:outline-none focus:border-purple-500/60"
            >
              <option value="whisper-tiny">Whisper Tiny (سريع جداً)</option>
              <option value="whisper-small">Whisper Small (مُوصى به)</option>
              <option value="whisper-medium">Whisper Medium (دقيق)</option>
              <option value="whisper-large">Whisper Large-v3 (أفضل دقة)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">نموذج تركيب الصوت (TTS)</label>
            <select
              value={settings.ttsModel}
              onChange={(e) => setSettings((s) => ({ ...s, ttsModel: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-sm text-white focus:outline-none focus:border-purple-500/60"
            >
              <option value="xtts-v2">XTTS-v2 (عربي محسوب)</option>
              <option value="melotts">MeloTTS (سريع وخفيف)</option>
              <option value="fastspeech2">FastSpeech2 (احترافي)</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#22223A] border border-[#2D2D4E]">
            <div>
              <p className="text-xs font-semibold text-white">الاستماع التلقائي</p>
              <p className="text-[10px] text-[#6B6890]">تفعيل الميكروفون تلقائياً عند فتح النظام</p>
            </div>
            <Toggle checked={settings.autoListen} onChange={() => toggle('autoListen')} />
          </div>
        </>
      )}
    </div>
  );

  const renderAI = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <div>
          <p className="text-sm font-bold text-white">تفعيل الذكاء الاصطناعي</p>
          <p className="text-[11px] text-[#6B6890] mt-0.5">LLM للتحليل الذكي والإجابة على الأسئلة</p>
        </div>
        <Toggle checked={settings.aiEnabled} onChange={() => toggle('aiEnabled')} />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">نموذج اللغة (LLM)</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'gemma-4', name: 'Gemma 4 (Q4)', desc: 'Google — سريع ودقيق للعربية', size: '4.8GB' },
            { id: 'qwen-3.5', name: 'Qwen 3.5 (Q4)', desc: 'Alibaba — ممتاز للعربية', size: '5.2GB' },
            { id: 'llama-3', name: 'Llama 3 8B (Q4)', desc: 'Meta — متعدد المهام', size: '5.7GB' },
          ].map((model) => (
            <div
              key={model.id}
              onClick={() => setSettings((s) => ({ ...s, llmModel: model.id }))}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                settings.llmModel === model.id
                  ? 'bg-purple-500/15 border-purple-500/40'
                  : 'bg-[#22223A] border-[#2D2D4E] hover:border-[#3D3D65]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.llmModel === model.id && (
                    <CheckCircle2 size={14} className="text-purple-400" />
                  )}
                  <span className="text-xs font-bold text-white">{model.name}</span>
                </div>
                <span className="text-[10px] text-[#6B6890] bg-[#161625] px-2 py-0.5 rounded-lg">{model.size}</span>
              </div>
              <p className="text-[10px] text-[#A8A4CC] mt-1">{model.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#22223A] border border-[#2D2D4E]">
        <div>
          <p className="text-xs font-semibold text-white">وضع Offline الكامل</p>
          <p className="text-[10px] text-[#6B6890]">لا يحتاج إنترنت — كل شيء يعمل محلياً</p>
        </div>
        <Toggle checked={settings.offlineMode} onChange={() => toggle('offlineMode')} />
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-300">قاعدة البيانات تعمل بشكل طبيعي</p>
          <p className="text-[10px] text-[#6B6890]">SQLite — {settings.dbPath}</p>
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-2">نوع قاعدة البيانات</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'sqlite', name: 'SQLite', desc: 'محلي — مُوصى به للمعامل الصغيرة', icon: '🗄️' },
            { id: 'postgresql', name: 'PostgreSQL', desc: 'شبكي — للمعامل الكبيرة', icon: '🐘' },
          ].map((db) => (
            <div
              key={db.id}
              onClick={() => setSettings((s) => ({ ...s, dbType: db.id }))}
              className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                settings.dbType === db.id
                  ? 'bg-purple-500/15 border-purple-500/40'
                  : 'bg-[#22223A] border-[#2D2D4E] hover:border-[#3D3D65]'
              }`}
            >
              <span className="text-2xl">{db.icon}</span>
              <p className="text-xs font-bold text-white mt-2">{db.name}</p>
              <p className="text-[10px] text-[#6B6890] mt-1">{db.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#22223A] border border-[#2D2D4E]">
        <div>
          <p className="text-xs font-semibold text-white">نسخ احتياطي تلقائي</p>
          <p className="text-[10px] text-[#6B6890]">كل 24 ساعة — في مجلد Backups</p>
        </div>
        <Toggle checked={settings.autoBackup} onChange={() => toggle('autoBackup')} />
      </div>
      <div className="flex gap-3">
        <button className="flex-1 btn-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2">
          <RefreshCw size={13} /> نسخ احتياطي الآن
        </button>
        <button className="flex-1 bg-[#22223A] border border-[#2D2D4E] text-white text-xs font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2A2A45] transition-colors">
          <Database size={13} /> استعادة نسخة
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {[
        { key: 'notifyCritical', label: 'إشعارات النتائج الحرجة', desc: 'تنبيه فوري عند اكتشاف نتيجة حرجة', important: true },
        { key: 'notifyOrders', label: 'إشعارات الطلبات المكتملة', desc: 'تنبيه عند اكتمال طلب التحليل', important: false },
        { key: 'notifyReminders', label: 'تذكيرات المواعيد', desc: 'تذكير بالمرضى الذين لم يستلموا نتائجهم', important: false },
      ].map((n) => (
        <div key={n.key} className={`flex items-center justify-between p-4 rounded-xl border ${n.important ? 'bg-red-500/5 border-red-500/20' : 'bg-[#22223A] border-[#2D2D4E]'}`}>
          <div>
            <p className="text-xs font-semibold text-white">{n.label}</p>
            <p className="text-[10px] text-[#6B6890] mt-0.5">{n.desc}</p>
          </div>
          <Toggle checked={(settings as any)[n.key]} onChange={() => toggle(n.key as keyof typeof settings)} />
        </div>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-[11px] font-semibold text-[#A8A4CC] mb-1.5">مهلة انتهاء الجلسة (دقيقة)</label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings((s) => ({ ...s, sessionTimeout: parseInt(e.target.value) || 60 }))}
          min={5} max={480}
          className="w-full px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-sm text-white focus:outline-none focus:border-purple-500/60"
        />
      </div>
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs font-bold text-amber-300 mb-2">⚠️ منطقة الخطر</p>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-xs text-white hover:bg-red-900/20 hover:border-red-500/30 transition-all">
            🗑️ حذف جميع البيانات
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-[#22223A] border border-[#2D2D4E] text-xs text-white hover:bg-amber-900/20 hover:border-amber-500/30 transition-all">
            🔄 إعادة ضبط المصنع
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneral();
      case 'voice': return renderVoice();
      case 'ai': return renderAI();
      case 'database': return renderDatabase();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar Tabs */}
      <div className="w-48 flex-shrink-0 border-r border-[#2D2D4E] bg-[#0F0F1A]/50 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-[#A8A4CC] hover:bg-[#22223A] hover:text-white border border-transparent'
              }`}
            >
              <Icon size={15} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto" />}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-5">
          {renderContent()}

          {/* Save Button */}
          <div className="flex gap-3 pt-4 border-t border-[#2D2D4E]">
            <button className="btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2">
              <Save size={14} /> حفظ الإعدادات
            </button>
            <button className="bg-[#22223A] border border-[#2D2D4E] text-[#A8A4CC] text-sm font-medium px-5 py-2.5 rounded-xl hover:text-white hover:bg-[#2A2A45] transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
