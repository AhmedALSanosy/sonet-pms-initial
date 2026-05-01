// ============================================================
// Sonet PMS — Voice Assistant (Centered Modal + Responsive)
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Send, Sparkles, Volume2, Trash2, Minimize2 } from 'lucide-react';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import SoundWave from './SoundWave';
import type { VoiceMessage } from '../../types';

function MessageBubble({ msg }: { msg: VoiceMessage }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-cairo ${
        isUser ? 'bg-bg-hover text-text-primary rounded-br-sm' : 'bg-primary/15 text-text-primary border border-primary/20 rounded-bl-sm'
      }`}>
        {!isUser && <Volume2 size={11} className="inline-block ml-1 text-primary-light mb-0.5" />}
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function VoiceWidget() {
  const { voiceState, panelOpen, messages, closePanel, setTranscript, startConversation, clearMessages } = useVoiceStore();
  const { startListening, stopListening } = useVoiceCapture();
  const [textInput, setTextInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setMinimized(false); }, [panelOpen]);

  const handleMicToggle = () => {
    if (voiceState === 'listening') stopListening();
    else startListening();
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput.trim());
    startConversation(textInput.trim());
    setTextInput('');
  };

  const stateLabels: Record<string, { text: string; emoji: string }> = {
    idle: { text: 'اضغط على الميكروفون واتكلم', emoji: '🎤' },
    listening: { text: 'بسمعك يا دكتور... اتكلم!', emoji: '🔴' },
    processing: { text: 'بشوف يا دكتور... ثواني وأرد', emoji: '⏳' },
    speaking: { text: 'قولتلك... حاجة تانية؟', emoji: '💬' },
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* ─── Backdrop ─── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* ─── Centered Modal ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
              sm:w-[460px] sm:max-w-[calc(100vw-2rem)] sm:max-h-[min(540px,calc(100vh-4rem)]
              w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] sm:h-auto
              bg-bg-elevated border border-border/60 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden flex flex-col"
          >
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 glass flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-purple-sm"><Sparkles size={14} className="text-white" /></div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary font-cairo">المساعد الصوتي — سونيت</h3>
                  <p className="text-[9px] text-text-muted font-cairo">Sonet Voice — باللهجة المصرية</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(!minimized)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"><Minimize2 size={13} /></button>
                <button onClick={clearMessages} className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 size={13} /></button>
                <button onClick={closePanel} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"><X size={14} /></button>
              </div>
            </div>

            {/* ─── Sound Wave (always visible) ─── */}
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
              <div className="bg-bg-base/60 rounded-xl p-3 border border-border/30">
                <SoundWave state={voiceState} />
                <p className="text-center text-[11px] text-text-muted mt-1.5 font-cairo">
                  {stateLabels[voiceState].emoji}{' '}
                  <span className={voiceState === 'listening' ? 'text-primary-light' : voiceState === 'processing' ? 'text-accent-light' : ''}>
                    {stateLabels[voiceState].text}
                  </span>
                </p>
              </div>
            </div>

            {!minimized && (
              <>
                {/* ─── Messages ─── */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0">
                  {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                  {voiceState === 'processing' && (
                    <div className="flex justify-end">
                      <div className="bg-primary/10 px-3 py-2 rounded-xl border border-primary/15">
                        <div className="flex items-center gap-1.5"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ─── Controls ─── */}
                <div className="px-4 py-3 border-t border-border/30 flex items-center gap-2 flex-shrink-0">
                  <div className="flex-1 flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 border border-border/30">
                    <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                      placeholder="اكتب أو تكلم..." className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none w-full font-cairo" />
                    <button onClick={handleTextSubmit} disabled={!textInput.trim()} className="p-1 text-text-muted hover:text-primary-light transition-colors disabled:opacity-30"><Send size={13} /></button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleMicToggle} disabled={voiceState === 'processing'}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      voiceState === 'listening' ? 'gradient-primary text-white glow-purple' : 'bg-bg-surface text-text-muted hover:text-primary-light border border-border/30'
                    } ${voiceState === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {voiceState === 'listening' ? <MicOff size={18} /> : <Mic size={18} />}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
