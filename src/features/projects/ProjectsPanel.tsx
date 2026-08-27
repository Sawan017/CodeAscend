import React from 'react';
import { Folder } from 'lucide-react';
import type { Project } from '../../types';

export const ProjectsPanel = ({ projects, onSelectProject }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div><h1 className="game-title">WORKSHOP / INVENTIONS</h1><p className="game-body" style={{marginTop: "8px"}}>Build and track your projects.</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {projects.map((project: Project) => (
          <div key={project.id} className="game-panel" onClick={() => onSelectProject?.(project)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: "var(--text-main)" }}>{project.name}</h3>
              <Folder color="var(--accent-blue)" size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', flex: 1 }}>{project.description}</p>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(project.technologies || []).map(tech => (
                <span key={tech} style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#38BDF8', fontWeight: 'bold' }}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ width: '100%', height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginTop: '8px' }}>
              <div style={{ width: `${project.progress || 0}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '2px' }} />
            </div>
          </div>
        ))}

        <div className="game-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.2)', gap: '12px' }}>
          <Folder size={32} color="rgba(255,255,255,0.4)" />
          <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>START NEW BLUEPRINT</div>
        </div>
      </div>
    </div>
  );
};
