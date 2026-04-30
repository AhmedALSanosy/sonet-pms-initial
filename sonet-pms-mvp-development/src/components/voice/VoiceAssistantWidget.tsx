// ============================================================
// Sonet PMS — Voice Assistant Widget
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  X,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  ChevronDown,
  Minimize2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { VoiceMessage } from '../../types';

// ---- Sound Wave Visualization ----
const SoundWave: React.FC<{ active: boolean; bars?: number }> = ({ active, bars = 12 }) => {
  const heights = [4, 8, 12, 16, 20, 24, 20, 16, 12, 8, 12, 6];
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            height: active ? `${heights[i % heights.length]}px` : '3px',
            animationDelay: `${i * 60}ms`,
            animationDuration: `${600 + (i % 4) * 120}ms`,
            background: `linear-gradient(to top, #7C3AED, #3B82F6)`,
            width: '3px',
            borderRadius: '99px',
            transition: active ? 'none' : 'height 0.3s ease',
            animation: active ? 'voice-bar 0.8s ease-in-out infinite' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ---- Circular Pulse Ring ----
const PulseRing: React.FC<{ active: boolean; color?: string }> = ({
  active,
  color = '#7C3AED',
}) => {
  if (!active) return null;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            opacity: 0,
            animation: `ripple 2s ease-out ${i * 0.6}s infinite`,
          }}
        />
      ))}
    </>
  );
};

// ---- Message Bubble ----
const MessageBubble: React.FC<{ message: VoiceMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-in-bottom`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-800'
            : 'bg-gradient-to-br from-purple-600 to-purple-900'
        }`}
      >
        {isUser ? (
          <span className="text-[10px] font-bold text-white">أنت</span>
        ) : (
          <Bot size={14} className="text-purple-200" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'bg-blue-600/20 border border-blue-500/30 rounded-tr-sm'
            : 'bg-purple-900/30 border border-purple-500/20 rounded-tl-sm'
        }`}
      >
        <p
          className="text-sm leading-relaxed text-white font-cairo"
          style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl', textAlign: 'right' }}
        >
          {message.content}
        </p>
        <p className="text-[10px] text-[#6B6890] mt-1 text-right">
          {message.timestamp.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

// ---- Main Widget ----
const VoiceAssistantWidget: React.FC = () => {
  const {
    voicePanelOpen,
    closeVoicePanel,
    voiceState,
    voiceMessages,
    transcript,
    isListening,
    startListening,
    stopListening,
    clearVoiceMessages,
    addVoiceMessage,
    setVoiceState,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState('');
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceMessages, transcript]);

  const handleTextSend = () => {
    if (!textInput.trim()) return;
    const text = textInput.trim();
    setTextInput('');
    addVoiceMessage({ role: 'user', content: text });
    setVoiceState('processing');
    setTimeout(() => {
      setVoiceState('speaking');
      addVoiceMessage({
        role: 'assistant',
        content: 'تم استلام رسالتك! أنا بشتغل على طلبك دلوقتي. في النسخة الكاملة هيتم معالجة الطلب بواسطة Gemma AI متصل بالبيانات الحقيقية للمعمل.',
      });
      setTimeout(() => setVoiceState('idle'), 1500);
    }, 1000);
  };

  const stateConfig = {
    idle: { color: '#7C3AED', label: 'جاهز للاستماع', pulse: false },
    listening: { color: '#3B82F6', label: 'بسمع...', pulse: true },
    processing: { color: '#F59E0B', label: 'بفكر...', pulse: true },
    speaking: { color: '#10B981', label: 'بيتكلم...', pulse: true },
  };

  const cfg = stateConfig[voiceState];

  if (!voicePanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeVoicePanel}
      />

      {/* Panel */}
      <div
        className={`
          fixed bottom-5 right-5 z-50
          w-[400px] rounded-2xl overflow-hidden
          bg-[#161625] border border-[#2D2D4E]
          shadow-2xl shadow-black/60
          animate-slide-in-bottom
          transition-all duration-300
          ${minimized ? 'h-[68px]' : 'h-[580px]'}
        `}
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2D2D4E] bg-gradient-to-r from-purple-900/30 to-blue-900/20 flex-shrink-0">
          {/* Mic Orb */}
          <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${cfg.color}40, ${cfg.color}10)`, border: `1.5px solid ${cfg.color}50` }}
            >
              <Bot size={18} style={{ color: cfg.color }} />
            </div>
            <PulseRing active={cfg.pulse} color={cfg.color} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white">سونيت</p>
              <Sparkles size={10} className="text-purple-400" />
              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full font-medium">AI</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
              <p className="text-[11px]" style={{ color: cfg.color }}>{cfg.label}</p>
            </div>
          </div>

          {/* Sound Wave (when speaking) */}
          {voiceState === 'speaking' && <SoundWave active={true} bars={8} />}

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMuted(!muted)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B6890] hover:text-white hover:bg-[#22223A] transition-colors"
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <button
              onClick={() => setMinimized(!minimized)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B6890] hover:text-white hover:bg-[#22223A] transition-colors"
            >
              {minimized ? <ChevronDown size={12} /> : <Minimize2 size={12} />}
            </button>
            <button
              onClick={closeVoicePanel}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B6890] hover:text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: 'calc(100% - 68px - 120px)' }}>
              {voiceMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Live Transcript */}
              {transcript && (
                <div className="flex gap-2.5 flex-row-reverse animate-slide-in-bottom">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white">أنت</span>
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 bg-blue-600/10 border border-blue-500/20 border-dashed">
                    <p
                      className="text-sm leading-relaxed text-blue-200 opacity-80"
                      style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl', textAlign: 'right' }}
                    >
                      {transcript}
                      <span className="inline-block w-0.5 h-3.5 bg-blue-400 ml-1 animate-pulse" />
                    </p>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {voiceState === 'processing' && (
                <div className="flex gap-2.5 animate-slide-in-bottom">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-purple-200" />
                  </div>
                  <div className="bg-purple-900/30 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="text-purple-400 animate-spin" />
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Visualizer */}
            <div className="px-4 py-2 border-t border-b border-[#2D2D4E] flex items-center justify-center gap-3 bg-[#161625]/50" style={{ height: '52px' }}>
              {isListening ? (
                <>
                  <span className="text-xs text-blue-400 font-medium">بسمع...</span>
                  <SoundWave active={true} bars={16} />
                  <span className="text-xs text-blue-400 font-medium">تكلم!</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <SoundWave active={false} bars={16} />
                  {voiceState === 'speaking' && (
                    <span className="text-xs text-emerald-400 font-medium mr-2">سونيت بيتكلم</span>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-[#0F0F1A]/50 flex-shrink-0" style={{ height: '68px' }}>
              <div className="flex items-center gap-2">
                {/* Text Input */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
                  placeholder="اكتب أو تكلم..."
                  className="
                    flex-1 px-3 py-2 rounded-xl text-sm
                    bg-[#161625] border border-[#2D2D4E]
                    text-white placeholder-[#6B6890]
                    focus:border-purple-500/60 focus:outline-none
                    transition-all duration-200
                  "
                  style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}
                />

                {/* Send Button */}
                <button
                  onClick={handleTextSend}
                  disabled={!textInput.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={14} />
                </button>

                {/* Clear */}
                <button
                  onClick={clearVoiceMessages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#22223A] border border-[#2D2D4E] text-[#6B6890] hover:text-white hover:border-[#3D3D65] transition-all flex-shrink-0"
                >
                  <RotateCcw size={13} />
                </button>

                {/* Mic Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={voiceState === 'processing' || voiceState === 'speaking'}
                  className={`
                    w-10 h-9 rounded-xl flex items-center justify-center
                    transition-all duration-200 flex-shrink-0 relative
                    ${isListening
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  {isListening && (
                    <span className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VoiceAssistantWidget;
