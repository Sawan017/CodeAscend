import React from 'react';
import { Target, Check, Map, Lock, Zap, BookOpen } from "lucide-react";
import type { Progression, Goal } from "../../types";

type TimelinePanelProps = { milestones?: any[]; futureMilestones?: any[]; timelineEvents?: any[]; onNavigateSection?: any; };

export function TimelinePanel(props: any) {
  // We'll map the existing milestones into the requested "World Node" roadmap format
  const roadmapNodes = [
    {
      id: 'village',
      icon: Check,
      title: 'STARTING VILLAGE',
      subtitle: 'Frontend Foundations',
      status: 'completed',
      color: 'var(--accent-sage)'
    },
    {
      id: 'training',
      icon: Target,
      title: 'TRAINING GROUNDS',
      subtitle: 'Master Frontend Basics',
      status: 'in-progress',
      color: 'var(--accent-blue)'
    },
    {
      id: 'city',
      icon: Lock,
      title: 'CODING CITY',
      subtitle: 'Advanced Development',
      status: 'locked',
      color: 'var(--text-muted)'
    },
    {
      id: 'mountain',
      icon: Lock,
      title: 'ARCHITECT PEAK',
      subtitle: 'System Design & Architecture',
      status: 'locked',
      color: 'var(--text-muted)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px', margin: '0 auto' }}>
      
      <div className="dashboard-hero" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <div>
          <h1 className="game-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Adventure Roadmap</h1>
          <p className="game-body" style={{ fontSize: '1rem' }}>Your journey through the world of development.</p>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '20px 0', marginLeft: '16px' }}>
        {/* Winding path line behind the nodes */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38px', width: '4px', background: 'var(--surface-mid)', zIndex: 0, borderRadius: '4px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
          {roadmapNodes.map((node, i) => {
            const isCompleted = node.status === 'completed';
            const isProgress = node.status === 'in-progress';
            
            return (
              <div key={node.id} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                
                {/* Node Icon */}
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: isProgress ? node.color : 'var(--surface-inset)',
                  border: `3px solid ${isCompleted ? node.color : isProgress ? 'var(--surface-top)' : 'var(--border-medium)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isProgress ? `0 0 0 3px ${node.color}, 0 4px 12px rgba(50, 133, 199, 0.2)` : 'var(--shadow-sm)',
                  color: isProgress ? '#fff' : isCompleted ? node.color : 'var(--text-muted)',
                  zIndex: 2,
                  marginLeft: '16px'
                }}>
                  <node.icon size={20} />
                </div>

                {/* Node Card */}
                <div className="dash-card" style={{ flex: 1, padding: '20px', opacity: node.status === 'locked' ? 0.6 : 1, transform: isProgress ? 'scale(1.02)' : 'none', borderColor: isProgress ? node.color : 'var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h3 className="game-card-title" style={{ fontSize: '1.05rem', color: isProgress ? node.color : 'var(--text-dark)' }}>{node.title}</h3>
                  </div>
                  <p className="game-body" style={{ fontSize: '0.95rem', color: 'var(--text-medium)', fontWeight: 500, marginBottom: '12px' }}>{node.subtitle}</p>
                  
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--surface-inset)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, color: isProgress ? node.color : isCompleted ? 'var(--accent-sage)' : 'var(--text-muted)' }}>
                    {isCompleted && <><Check size={14} /> COMPLETED</>}
                    {isProgress && <><Zap size={14} /> IN PROGRESS</>}
                    {node.status === 'locked' && <><Lock size={14} /> LOCKED</>}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}