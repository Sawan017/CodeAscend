import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Info, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
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
        // preserve newlines in blockquote if any
      } else if (!line.startsWith('## ')) {
        inNotice = false; 
      }
    }
    
    if (line.startsWith('## ')) {
      inNotice = false; 
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
  h3: ({node, ...props}: any) => <h3 style={{ fontSize: '1rem', color: '#00c8ff', marginTop: '1.5rem', marginBottom: '0.75rem', letterSpacing: '0.02em', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }} {...props} />,
  p: ({node, ...props}: any) => <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }} {...props} />,
  ul: ({node, ...props}: any) => <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} {...props} />,
  li: ({node, ...props}: any) => <li style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} {...props} />,
  strong: ({node, ...props}: any) => <strong style={{ color: '#fff', fontWeight: 600 }} {...props} />,
  a: ({node, ...props}: any) => <a style={{ color: '#00c8ff', textDecoration: 'none' }} {...props} />
};

function SectionCard({ section, index }: { section: { title: string, content: string }, index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = section.content.length > 500;
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1.5rem',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <div 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isLong ? 'pointer' : 'default', userSelect: 'none' }}
        onClick={() => isLong && setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0, 200, 255, 0.1)', color: '#00c8ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0
          }}>
            {index + 1}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>
            {section.title.replace(/^\d+\.\s*/, '')}
          </h2>
        </div>
        {isLong && (
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: expanded || !isLong ? 'auto' : '100px' }}
        style={{ position: 'relative', marginTop: '1.25rem', overflow: 'hidden' }}
      >
        <ReactMarkdown components={MarkdownComponents}>
          {section.content}
        </ReactMarkdown>
        
        {!expanded && isLong && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, rgba(10,12,16,0) 0%, #0c0e14 100%)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: '0.5rem', pointerEvents: 'none'
          }}>
            <span style={{ color: '#00c8ff', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', pointerEvents: 'auto', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '12px' }} onClick={() => setExpanded(true)}>
              READ MORE
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

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
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1050 }}
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            style={{ 
              position: 'fixed', top: '5vh', left: '50%', transform: 'translateX(-50%)', 
              width: '100%', maxWidth: '800px', height: '90vh',
              backgroundColor: '#0c0e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', 
              zIndex: 1051, display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={24} color="#00c8ff" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</h2>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
              
              {/* Metadata Pills */}
              {parsed.metadata.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {parsed.metadata.map((meta, i) => (
                    <div key={i} style={{ 
                      padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', 
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {meta.replace(/^(Last Updated|Operated by):\s*/i, (match) => match)}
                    </div>
                  ))}
                </div>
              )}

              {/* Development Notice */}
              {parsed.notice && (
                <div style={{ 
                  padding: '1.25rem', background: 'rgba(0, 200, 255, 0.05)', border: '1px solid rgba(0, 200, 255, 0.2)', 
                  borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
                }}>
                  <Info size={24} color="#00c8ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <ReactMarkdown components={MarkdownComponents}>
                      {parsed.notice}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {parsed.sections.map((section, idx) => (
                  <SectionCard key={idx} section={section} index={idx} />
                ))}
              </div>
              
              {/* Fallback for unparsed plain text */}
              {parsed.sections.length === 0 && !parsed.notice && (
                 <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
              )}
            </div>

            {/* Back to top FAB */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToTop}
                  style={{
                    position: 'absolute', bottom: '2rem', right: '2rem',
                    background: '#00c8ff', color: '#000', border: 'none', borderRadius: '50%',
                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', zIndex: 10
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
