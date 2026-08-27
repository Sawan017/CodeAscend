import React from 'react';
import { BookOpen, Map, ChevronRight } from 'lucide-react';

export const SkillsPanel = ({ skills = [], onSelectSkill }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div><h1 className="game-title">TRAINING GROUNDS</h1><p className="game-body" style={{marginTop: "8px"}}>Select a skill to begin training.</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {skills.map((skill: any) => (
          <div key={skill.id} className="game-panel" onClick={() => onSelectSkill?.(skill.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: "var(--text-main)" }}>{skill.name}</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {skill.progress >= 100 ? 'MASTERED' : 'IN TRAINING'}
                </span>
              </div>
              <Map color="var(--border-light)" size={24} />
            </div>

            <div style={{ width: '100%', height: '6px', background: 'var(--border-light)', borderRadius: '3px' }}>
              <div style={{ width: `${Math.min(100, skill.progress || 0)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', borderRadius: '3px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{skill.subtopics?.length || 0} Locations</div>
              <button className="game-btn-primary" style={{ padding: '6px 12px', width: 'auto' }}><ChevronRight size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
