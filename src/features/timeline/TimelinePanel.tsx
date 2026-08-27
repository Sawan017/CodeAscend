import React from 'react';
import { Target, Check, Map, Lock, Zap, BookOpen, Compass } from "lucide-react";
import { motion } from 'framer-motion';

const card = {
  background: '#fff',
  borderRadius: '20px',
  border: '1px solid rgba(140, 135, 125, 0.12)',
  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
  overflow: 'hidden'
} as const;

const sectionTitle = {
  fontSize: '0.85rem',
  fontWeight: 800 as const,
  color: '#5A5750',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export function TimelinePanel({ milestones = [], futureMilestones = [], timelineEvents = [] }: any) {
  const roadmapNodes = [
    { id: 'village', icon: Check, title: 'STARTING VILLAGE', subtitle: 'Frontend Foundations', status: 'completed', color: '#3EA354' },
    { id: 'training', icon: Target, title: 'TRAINING GROUNDS', subtitle: 'Master Frontend Basics', status: 'in-progress', color: '#06B6D4' },
    { id: 'city', icon: Lock, title: 'CODING CITY', subtitle: 'Advanced Development', status: 'locked', color: '#9A958C' },
    { id: 'mountain', icon: Lock, title: 'ARCHITECT PEAK', subtitle: 'System Design & Architecture', status: 'locked', color: '#9A958C' }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px', margin: '0 auto', paddingBottom: '40px' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        ...card, padding: '48px', position: 'relative', textAlign: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #ECFEFF 100%)',
      }}>
        <div style={{ width: 64, height: 64, background: 'rgba(6,182,212,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', margin: '0 auto 20px' }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 12px', lineHeight: 1.1 }}>
          Adventure Roadmap
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#5A5750', margin: 0 }}>
          Your journey through the world of development. Keep pushing forward.
        </p>
      </motion.div>
      <div style={{ position: 'relative', padding: '20px 0', marginLeft: '16px' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38px', width: '4px', background: 'rgba(140,135,125,0.1)', zIndex: 0, borderRadius: '4px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
          {roadmapNodes.map((node, i) => {
            const isCompleted = node.status === 'completed';
            const isProgress = node.status === 'in-progress';
            return (
              <motion.div key={node.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: isProgress ? node.color : '#fff',
                  border: `3px solid ${isCompleted ? node.color : isProgress ? '#fff' : 'rgba(140,135,125,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isProgress ? `0 0 0 4px ${node.color}, 0 4px 12px rgba(6,182,212,0.3)` : '0 2px 8px rgba(0,0,0,0.05)',
                  color: isProgress ? '#fff' : isCompleted ? node.color : '#9A958C',
                  zIndex: 2, marginLeft: '16px'
                }}>
                  <node.icon size={20} />
                </div>
                <div style={{ 
                  ...card, flex: 1, padding: '24px', opacity: node.status === 'locked' ? 0.7 : 1, 
                  transform: isProgress ? 'scale(1.02)' : 'none', 
                  borderColor: isProgress ? node.color : card.border.split(' ')[2],
                  boxShadow: isProgress ? '0 8px 24px -6px rgba(6,182,212,0.15)' : card.boxShadow
                }}>
                  <h3 style={{ fontSize: '1.1rem', color: isProgress ? node.color : '#1E1D1B', margin: '0 0 8px 0', fontWeight: 800 }}>{node.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#5A5750', margin: '0 0 16px 0' }}>{node.subtitle}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(140,135,125,0.08)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: isProgress ? node.color : isCompleted ? '#3EA354' : '#9A958C' }}>
                    {isCompleted && <><Check size={14} /> COMPLETED</>}
                    {isProgress && <><Zap size={14} /> IN PROGRESS</>}
                    {node.status === 'locked' && <><Lock size={14} /> LOCKED</>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}