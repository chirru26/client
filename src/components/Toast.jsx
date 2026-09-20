import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type || 'info'}`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
          >
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--accent-rose)" />}
            {(!toast.type || toast.type === 'info') && <Info size={18} color="var(--primary-light)" />}
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex', marginLeft: 8 }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
