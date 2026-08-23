import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            style={{ 
              position: 'fixed', top: '5vh', left: '50%', transform: 'translateX(-50%)', 
              width: '90%', maxWidth: '800px', height: '90vh',
              backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '16px', 
              zIndex: 1051, display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>{title}</h2>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.5rem' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', color: 'var(--text-main)', lineHeight: 1.6 }} className="support-markdown">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
