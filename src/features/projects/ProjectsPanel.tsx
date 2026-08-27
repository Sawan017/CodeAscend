import React, { useState } from 'react';
import { Folder, ArrowRight, Plus, Github, X, Save, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: '#F8FAFC',
  border: '1px solid rgba(140, 135, 125, 0.2)',
  borderRadius: '12px',
  fontSize: '0.95rem',
  color: '#1E1D1B',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  marginBottom: '16px'
}

export const ProjectsPanel = ({ 
  projects = [], 
  onSelectProject, 
  onAddProject,
  onSyncGithub,
  isSyncingGithub,
  githubMessage
}: any) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [techInput, setTechInput] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');
  const [status, setStatus] = useState('PLANNING');

  const handleCreateProject = () => {
    if (!name.trim()) return
    const newProj = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'A newly launched project.',
      image: image.trim() || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
      technologies: techInput ? techInput.split(',').map((t) => t.trim()).filter(Boolean) : ['React', 'TypeScript'],
      status,
      progress: status === 'COMPLETED' ? 100 : status === 'BUILDING' ? 50 : 10,
      github: github.trim() || '',
      demo: demo.trim() || '',
      features: ['Core functionality architecture'],
      whatILearned: ['Shipped new project capabilities'],
      startDate: new Date().toISOString().slice(0, 10),
      completed: status === 'COMPLETED',
    }

    onAddProject?.(newProj)
    setName('')
    setDescription('')
    setImage('')
    setTechInput('')
    setGithub('')
    setDemo('')
    setStatus('PLANNING')
    setShowForm(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        ...card, padding: '48px', position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #FFFBEB 100%)',
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '600px' }}>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {onSyncGithub && (
              <button
                onClick={onSyncGithub}
                disabled={isSyncingGithub}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: isSyncingGithub ? '#E2E8F0' : '#1E293B',
                  color: isSyncingGithub ? '#94A3B8' : '#fff',
                  border: 'none', borderRadius: '12px', padding: '12px 20px',
                  fontSize: '0.95rem', fontWeight: 700, cursor: isSyncingGithub ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSyncingGithub ? 'none' : '0 4px 12px rgba(30, 41, 59, 0.15)'
                }}
              >
                {isSyncingGithub ? <RefreshCw size={18} className="spin" /> : <Github size={18} />}
                {isSyncingGithub ? 'Syncing GitHub...' : 'Sync GitHub Repos'}
              </button>
            )}
            {githubMessage && (
              <div style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '200px', textAlign: 'right' }}>
                {githubMessage}
              </div>
            )}
          </div>
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
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1E1D1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {project.provider === 'github' && <Github size={16} color="#64748B" />}
                  {project.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: project.status === 'COMPLETED' ? '#3EA354' : '#F59E0B', textTransform: 'uppercase', fontWeight: 800, padding: '4px 8px', background: project.status === 'COMPLETED' ? 'rgba(62,163,84,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
                  {project.status === 'COMPLETED' ? 'DEPLOYED' : project.status === 'PLANNING' ? 'PLANNING' : 'IN PROGRESS'}
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
          onClick={() => setShowForm(true)}
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

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ ...card, width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1E1D1B' }}>New Project</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9A958C' }}>
                  <X size={24} />
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Project Name</label>
                <input style={inputStyle} placeholder="e.g., CodeAscend" value={name} onChange={(e) => setName(e.target.value)} />

                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What are you building?" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Image URL (Optional)</label>
                <input style={inputStyle} placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />

                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Technologies</label>
                <input style={inputStyle} placeholder="React, TypeScript, Node (comma separated)" value={techInput} onChange={(e) => setTechInput(e.target.value)} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>GitHub URL</label>
                    <input style={inputStyle} placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Live Demo URL</label>
                    <input style={inputStyle} placeholder="https://..." value={demo} onChange={(e) => setDemo(e.target.value)} />
                  </div>
                </div>

                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#5A5750', marginBottom: '8px', textTransform: 'uppercase' }}>Status</label>
                <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="PLANNING">Planning</option>
                  <option value="BUILDING">Building</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(140, 135, 125, 0.2)', background: 'transparent', color: '#5A5750', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#F59E0B', color: '#fff', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={18} />
                  Save Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
