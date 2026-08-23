import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, CheckCircle, Code, Globe } from 'lucide-react'
import type { Project } from '../../types'
import { sanitizeUrl } from '../../utils/url'

type ProjectDetailProps = {
  project: Project
  onBack: () => void
  onMarkComplete?: (projectId: string) => void
  onDeleteProject?: (projectId: string) => void
  onUpdateProject?: (project: Project) => void
}

export function ProjectDetail({
  project,
  onBack,
  onMarkComplete,
  onDeleteProject,
  onUpdateProject
}: ProjectDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(project?.name || '')
  const [editDesc, setEditDesc] = useState(project?.description || '')
  const [editImage, setEditImage] = useState(project?.image || '')
  const [editGithub, setEditGithub] = useState(project?.github || '')
  const [editDemo, setEditDemo] = useState(project?.demo || '')

  useEffect(() => {
    if (project) {
      setEditName(project.name || '')
      setEditDesc(project.description || '')
      setEditImage(project.image || '')
      setEditGithub(project.github || '')
      setEditDemo(project.demo || '')
    }
  }, [project])

  if (!project) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>Project not found</h2>
        <p>This project may have been deleted or is still loading.</p>
        <button onClick={onBack} className="secondary-btn" style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    )
  }

  const handleSave = () => {
    onUpdateProject?.({
      ...project,
      name: editName,
      description: editDesc,
      image: editImage,
      github: editGithub,
      demo: editDemo
    })
    setIsEditing(false)
  }

  return (
    <motion.div 
      className="detail-view-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-main)',
        minHeight: '100vh',
        padding: '2rem',
        border: '1px solid var(--border-strong)',
        borderRadius: '16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-strong)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={20} /> Back to Projects
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onUpdateProject && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          )}
          {onDeleteProject && (
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${project.name}? This action cannot be undone.`)) {
                onDeleteProject(project.id)
              }
            }}
            style={{
              background: 'rgba(255, 59, 48, 0.1)',
              color: '#ff3b30',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trash2 size={16} /> Delete
          </button>
        )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div className="main-content">
          {project.image && (
            <div 
              style={{
                width: '100%',
                height: '400px',
                backgroundImage: `url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                marginBottom: '2rem',
                border: '1px solid var(--border-strong)'
              }}
            />
          )}
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '2rem' }} />
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px', minHeight: '100px' }} />
              <input value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="Image URL" style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px' }} />
              <input value={editGithub} onChange={e => setEditGithub(e.target.value)} placeholder="GitHub URL" style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px' }} />
              <input value={editDemo} onChange={e => setEditDemo(e.target.value)} placeholder="Demo URL" style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px' }} />
              <button onClick={handleSave} style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>Save Changes</button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {project.name}
                {project.provider === 'github' && <span style={{ fontSize: '1rem', padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: '8px' }}>GitHub Sync</span>}
              </h1>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                {project.description}
              </p>
            </>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Features</h3>
            {(!project.features || !Array.isArray(project.features) || project.features.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No features documented yet.</p>
            ) : (
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {project.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>What I Learned</h3>
            {(!project.whatILearned || !Array.isArray(project.whatILearned) || project.whatILearned.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No learnings documented yet.</p>
            ) : (
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {project.whatILearned.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: project.status === 'COMPLETED' ? '#34c759' : 'var(--cyan)' }} />
              <span style={{ fontWeight: 500 }}>{project.status}</span>
            </div>
            
            <div style={{ width: '100%', height: '6px', background: 'var(--border-strong)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                style={{ height: '100%', background: 'var(--cyan)' }}
              />
            </div>
            <p style={{ textAlign: 'right', fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{project.progress}% Complete</p>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Technologies</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {(Array.isArray(project.technologies) ? project.technologies : []).map(tech => (
                <span key={tech} style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-surface-sunken)', color: 'var(--cyan)', borderRadius: '16px', fontSize: '0.85rem', border: '1px solid var(--border-strong)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.evidences && project.evidences.length > 0 && (
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Detected Concepts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {project.evidences.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} color={ev.strength === 'strong' ? '#34c759' : '#ff9500'} />
                    <span style={{ color: 'var(--text-main)' }}>
                      {ev.domain} &rarr; {ev.skill} &rarr; {ev.topic} &rarr; {ev.subtopic} &rarr; <span style={{ color: 'var(--cyan)' }}>{ev.filename || ev.file}</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto', textTransform: 'capitalize' }}>
                      {ev.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href={sanitizeUrl(project.github)}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none', border: '1px solid var(--border-strong)' }}
            >
              <Code size={20} /> View Source
            </a>
            <a 
              href={sanitizeUrl(project.demo)}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--cyan)', borderRadius: '8px', color: '#000', textDecoration: 'none', fontWeight: 600 }}
            >
              <Globe size={20} /> Live Demo
            </a>
            
            {onMarkComplete && !project.completed && (
              <button 
                onClick={() => onMarkComplete(project.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'transparent', borderRadius: '8px', color: '#34c759', border: '1px solid #34c759', cursor: 'pointer', fontWeight: 600, marginTop: '1rem' }}
              >
                <CheckCircle size={20} /> Mark as Complete
              </button>
            )}

            {project.provider === 'github' && (
              <button 
                onClick={() => {
                  console.log('--- PROJECT AUDIT TRAIL ---');
                  console.log('Project:', project.name);
                  console.log('External ID:', project.externalId);
                  console.log('Languages detected:', project.technologies);
                  console.log('Extracted Evidences:', project.evidences);
                  alert('Audit log printed to browser console. Open DevTools to inspect full trace of files, evidences, and progression updates.');
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'transparent', borderRadius: '8px', color: 'var(--text-muted)', border: '1px solid var(--border-strong)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Inspect Evidence Audit Log
              </button>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
