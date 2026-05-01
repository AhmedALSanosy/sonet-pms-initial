// ============================================================
// Sonet PMS — Shared UI Components (Modal + Toast)
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState, createContext, useContext, useCallback } from 'react';

// ─── Modal ───
export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean
}) {
  useEffect(() => { if (open) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${wide ? 'w-[90vw] max-w-2xl' : 'w-[90vw] max-w-md'} max-h-[85vh] bg-bg-elevated border border-border/60 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 flex-shrink-0">
              <h3 className="text-sm font-bold text-text-primary font-cairo">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-hover transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Toast ───
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }
interface ToastCtx { add: (m: string, t?: Toast['type']) => void }
const Ctx = createContext<ToastCtx>({ add: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const colors = { success: 'border-success/40 bg-success/10 text-success', error: 'border-danger/40 bg-danger/10 text-danger', info: 'border-info/40 bg-info/10 text-info', warning: 'border-warning/40 bg-warning/10 text-warning' };

  return (
    <Ctx.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-5 left-5 z-[60] space-y-2 pointer-events-none" dir="rtl">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, x: -20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-3 rounded-xl border shadow-xl font-cairo text-sm ${colors[t.type]}`}>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
