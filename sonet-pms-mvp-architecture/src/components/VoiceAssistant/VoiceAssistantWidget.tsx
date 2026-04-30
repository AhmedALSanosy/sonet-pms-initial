import { useAppStore } from '../../store/useAppStore';
import { Mic, MicOff, X, Send, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SoundWave from './SoundWave';

export default function VoiceAssistantWidget() {
  const { voiceAssistantOpen, setVoiceAssistantOpen, voice, setVoice } = useAppStore();

  const toggleListening = () => {
    if (voice.isListening) {
      setVoice({ isListening: false, isProcessing: true });
      // Simulate processing
      setTimeout(() => {
        setVoice({
          isProcessing: false,
          transcript: 'عايز أسجل تحليل دم كامل للمريض محمد أحمد',
          response: 'تمام يا دكتور، هنسجل تحليل CBC للمريض محمد أحمد. هل نضيف تحاليل تانية؟',
        });
      }, 1500);
    } else {
      setVoice({
        isListening: true,
        isProcessing: false,
        transcript: '',
        response: '',
      });
    }
  };

  const closeWidget = () => {
    setVoiceAssistantOpen(false);
    setVoice({ isListening: false, isProcessing: false, transcript: '', response: '' });
  };

  return (
    <AnimatePresence>
      {voiceAssistantOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWidget}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Widget Panel */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[420px] max-h-[520px] bg-surface-secondary border border-border rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary font-cairo">المساعد الصوتي</h3>
                  <p className="text-[10px] text-text-muted">Sonet Voice Assistant — باللهجة المصرية</p>
                </div>
              </div>
              <button
                onClick={closeWidget}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sound Wave Visualization */}
            <div className="px-5 pt-5 pb-3">
              <div className="bg-surface/60 rounded-xl p-4 border border-border/50">
                <SoundWave isActive={voice.isListening || voice.isProcessing} />
                <div className="text-center mt-2">
                  {voice.isListening && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-primary-light font-cairo"
                    >
                      🎤 بسمعك يا دكتور... اتكلم دلوقتي
                    </motion.p>
                  )}
                  {voice.isProcessing && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-accent-light font-cairo"
                    >
                      ⏳ بشوف يا دكتور... ثواني وأرد عليك
                    </motion.p>
                  )}
                  {!voice.isListening && !voice.isProcessing && !voice.transcript && (
                    <p className="text-xs text-text-muted font-cairo">
                      اضغط على الميكروفون واتكلم
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Transcript & Response */}
            <div className="px-5 py-2 space-y-3 max-h-[180px] overflow-y-auto">
              {voice.transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-tertiary/50 rounded-xl p-3 border border-border/30"
                >
                  <p className="text-[10px] text-text-muted mb-1 font-cairo">📋 اللي قلته:</p>
                  <p className="text-sm text-text-primary font-cairo">{voice.transcript}</p>
                </motion.div>
              )}
              {voice.response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary/10 rounded-xl p-3 border border-primary/20"
                >
                  <div className="flex items-start gap-2">
                    <Volume2 size={14} className="text-primary-light mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-primary-light mb-1 font-cairo">🤖 رد المساعد:</p>
                      <p className="text-sm text-text-primary font-cairo leading-relaxed">{voice.response}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="px-5 py-4 border-t border-border flex items-center gap-3">
              {/* Text Input */}
              <div className="flex-1 flex items-center gap-2 bg-surface-tertiary/60 rounded-xl px-3 py-2 border border-border/50">
                <input
                  type="text"
                  placeholder="اكتب أمر..."
                  className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full font-cairo"
                />
                <button className="p-1 text-text-muted hover:text-primary-light transition-colors">
                  <Send size={14} />
                </button>
              </div>

              {/* Mic Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                disabled={voice.isProcessing}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                  ${voice.isListening
                    ? 'gradient-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-surface-tertiary text-text-muted hover:text-primary-light border border-border/50'
                  }
                  ${voice.isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {voice.isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
