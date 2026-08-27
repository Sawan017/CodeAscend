import React from 'react';
import { Folder, ArrowRight, Plus } from 'lucide-react';
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

export const ProjectsPanel = ({ projects = [], onSelectProject }: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        ...card, padding: '48px', position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #FFFBEB 100%)',
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
            Workshop & Inventions
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Your Projects
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#5A5750', lineHeight: 1.6, margin: '0 0 32px' }}>
            Build, track, and deploy your creations. Turn your ideas into experience points.
          </p>
        </div>
      </motion.div>
      <h3 style={sectionTitle}><Folder size={16} color="#F59E0B" /> ACTIVE BLUEPRINTS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {projects.map((project: any, i: number) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelectProject?.(project)}
            style={{ ...card, padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(245,158,11,0.15)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; e.currentTarget.style.borderColor = card.border.split(' ')[2]; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1E1D1B', fontWeight: 800 }}>{project.name}</h3>
                <span style={{ fontSize: '0.75rem', color: project.status === 'COMPLETED' ? '#3EA354' : '#F59E0B', textTransform: 'uppercase', fontWeight: 800, padding: '4px 8px', background: project.status === 'COMPLETED' ? 'rgba(62,163,84,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
                  {project.status === 'COMPLETED' ? 'DEPLOYED' : 'IN PROGRESS'}
                </span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245,158,11,0.08)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Folder size={20} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#5A5750', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(project.technologies || []).slice(0, 3).map((tech: string) => (
                <span key={tech} style={{ background: 'rgba(140,135,125,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#5A5750', fontWeight: 700 }}>
                  {tech}
                </span>
              ))}
              {(project.technologies?.length || 0) > 3 && <span style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#9A958C', fontWeight: 700 }}>+{project.technologies.length - 3}</span>}
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(140,135,125,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ width: `${project.progress || 0}%`, height: '100%', background: project.status === 'COMPLETED' ? '#3EA354' : '#F59E0B', borderRadius: '4px' }} />
            </div>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: projects.length * 0.05 }}
          style={{ ...card, border: '2px dashed rgba(140,135,125,0.2)', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '220px', transition: 'all 0.2s', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.02)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.2)'; }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} />
          </div>
          <div style={{ fontWeight: 800, color: '#1E1D1B' }}>Start New Project</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#9A958C', textAlign: 'center' }}>Create a new blueprint to begin tracking progress.</p>
        </motion.div>
      </div>
    </div>
  );
};