import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Info, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

function parseLegalText(markdown: string) {
  const lines = markdown.split('\n');
  const metadata: string[] = [];
  let notice = '';
  const sections: { title: string; content: string }[] = [];
  let currentSection: { title: string; content: string } | null = null;
  
  let inNotice = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('# ')) continue;
    
    if (line.startsWith('**Last Updated**') || line.startsWith('**Operated by**')) {
      metadata.push(line.replace(/\*\*/g, '').trim());
      continue;
    }
    
    if (line.startsWith('> **DEVELOPMENT')) {
      inNotice = true;
      notice += line.replace(/^> /, '') + '\n';
      continue;
    }
    if (inNotice) {
      if (line.startsWith('>')) {
        notice += line.replace(/^> /, '') + '\n';
      } else if (line.trim() === '') {
        // empty line still inside notice block if we want, but let's assume notice block ends when a header starts
      }
      if (line.startsWith('## ')) {
        inNotice = false;
      } else {
        continue;
      }
    }
    
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({ title: currentSection.title, content: currentSection.content.trim() });
      }
      currentSection = { title: line.replace(/^## /, '').trim(), content: '' };
      continue;
    }
    
    if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push({ title: currentSection.title, content: currentSection.content.trim() });
  }
  
  return { metadata, notice: notice.trim(), sections };
}

const MarkdownComponents = {
  h1: ({node, ...props}: any) => <h1 style={{ fontSize: '1.75rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }} {...props} />,
  h2: ({node, ...props}: any) => <h2 style={{ fontSize: '1.35rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }} {...props} />,
  h3: ({node, ...props}: any) => <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: 600 }} {...props} />,
  p: ({node, ...props}: any) => <p style={{ fontSize: '0.95rem', color: '#172033', lineHeight: 1.7, margin: '0 0 12px 0' }} {...props} />,
  ul: ({node, ...props}: any) => <ul style={{ margin: '0 0 12px 0', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }} {...props} />,
  ol: ({node, ...props}: any) => <ol style={{ margin: '0 0 12px 0', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }} {...props} />,
  li: ({node, ...props}: any) => <li style={{ fontSize: '0.95rem', color: '#172033', lineHeight: 1.7 }} {...props} />,
  strong: ({node, ...props}: any) => <strong style={{ color: '#0f172a', fontWeight: 700 }} {...props} />,
  a: ({node, ...props}: any) => <a style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }} {...props} />
};

export function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  const parsed = parseLegalText(content);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollTop(scrollRef.current.scrollTop > 300);
      }
    };
    const ref = scrollRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, [isOpen]);

  const scrollToTop = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            style={{ 
              position: 'fixed', top: '3rem', bottom: '3rem', left: '50%', width: '90%', maxWidth: '850px', overflow: 'hidden',
              background: '#ffffff', borderRadius: '16px', 
              zIndex: 1051, display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={24} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, letterSpacing: '0.02em' }}>{title}</h2>
              </div>
              <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', color: '#475569', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '2rem', position: 'relative', background: '#ffffff' }}>
              
              <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                {/* Metadata Pills */}
                {parsed.metadata.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {parsed.metadata.map((meta, i) => (
                      <div key={i} style={{ 
                        padding: '6px 14px', background: '#f1f5f9', borderRadius: '20px', 
                        fontSize: '0.8rem', color: '#64748b', fontWeight: 500, border: '1px solid #e2e8f0'
                      }}>
                        {meta.replace(/^(Last Updated|Operated by):\s*/i, (match) => match)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Development Notice */}
                {parsed.notice && (
                  <div style={{ 
                    padding: '1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', 
                    borderRadius: '12px', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
                  }}>
                    <Info size={24} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ color: '#1e3a8a', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      <ReactMarkdown components={{...MarkdownComponents, p: ({node, ...props}: any) => <p style={{ margin: 0 }} {...props} />}}>{parsed.notice}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {parsed.sections.map((section, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                      <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>{idx + 1}.</span> 
                        {section.title.replace(/^\d+\.\s*/, '')}
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ReactMarkdown components={MarkdownComponents}>
                          {section.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Fallback for unparsed plain text */}
                {parsed.sections.length === 0 && !parsed.notice && (
                   <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
                )}
              </div>
            </div>

            {/* Back to top FAB */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToTop}
                  style={{
                    position: 'absolute', bottom: '2rem', right: '2rem',
                    background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '50%',
                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)', zIndex: 10
                  }}
                >
                  <ArrowUp size={24} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
