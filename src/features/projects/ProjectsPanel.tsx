import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Project, ProjectStatus } from '../../types'

type ProjectsPanelProps = {
  projects: Project[]
  activeProject: Project
  onSelectProject: (project: Project) => void
  onMarkComplete: (projectId: string) => void
  onAddProject?: (project: Project) => void
  onDeleteProject?: (projectId: string) => void
}

export function ProjectsPanel({
  projects,
  activeProject,
  onSelectProject,
  onMarkComplete,
  onAddProject,
  onDeleteProject,
}: ProjectsPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [techInput, setTechInput] = useState('')
  const [github, setGithub] = useState('')
  const [demo, setDemo] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('PLANNING')

  const handleCreateProject = () => {
    if (!name.trim()) return
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'A newly launched project.',
      image: image.trim() || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
      technologies: techInput ? techInput.split(',').map((t) => t.trim()).filter(Boolean) : ['React', 'TypeScript'],
      status,
      progress: status === 'COMPLETED' ? 100 : status === 'BUILDING' ? 50 : 10,
      github: github.trim() || 'https://github.com',
      demo: demo.trim() || 'https://example.com',
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="section-shell split-shell">
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(10,13,20,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Project Portfolio</p>
          {onAddProject && (
            <button style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: 'var(--cyan)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setShowForm((v) => !v)} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.3)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; e.currentTarget.style.boxShadow = 'none' }} aria-label="Add project">
              <Plus size={16} />
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
            <input placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
            <input placeholder="Technologies (comma separated)" value={techInput} onChange={(e) => setTechInput(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <input placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <input placeholder="Live Demo URL" value={demo} onChange={(e) => setDemo(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}>
                <option value="PLANNING">PLANNING</option>
                <option value="BUILDING">BUILDING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={{ padding: '0.75rem 1.5rem', background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }} onClick={handleCreateProject}>Create Project</button>
            </div>
          </div>
        )}

        <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map((p) => (
            <motion.div
              key={p.id}
              variants={item}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                background: activeProject.id === p.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                border: activeProject.id === p.id ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeProject.id === p.id ? '0 0 20px rgba(6,182,212,0.1)' : 'none'
              }}
              onClick={() => onSelectProject(p)}
              onMouseEnter={(e) => { if (activeProject.id !== p.id) { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; } }}
              onMouseLeave={(e) => { if (activeProject.id !== p.id) { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; } }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: `url(${p.image}) center/cover no-repeat`, border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {p.provider === 'github' && <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--primary)', color: 'white', borderRadius: '4px' }}>GitHub</span>}
                  {p.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {p.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {activeProject && (
        <div className="panel" style={{ padding: '2rem', background: 'rgba(3,4,7,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--cyan)', margin: 0, textTransform: 'uppercase' }}>Workspace</p>
            {onDeleteProject && projects.length > 1 && (
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px' }} onClick={() => onDeleteProject(activeProject.id)} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} aria-label="Delete project">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{activeProject.name}</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{activeProject.description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {activeProject.technologies.map((tech) => (
              <span key={tech} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '0.8rem', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{tech}</span>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</span>
              <strong style={{ color: activeProject.completed ? 'var(--cyan)' : '#fff' }}>{activeProject.status}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Completion</span>
              <strong style={{ color: '#fff' }}>{activeProject.progress}%</strong>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Architecture</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeProject.features.map((feature) => (
                <li key={feature} style={{ paddingLeft: '1.5rem', position: 'relative', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', background: 'var(--cyan)', borderRadius: '50%' }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginBottom: '3rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acquired Intel</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeProject.whatILearned.map((item) => (
                <li key={item} style={{ paddingLeft: '1.5rem', position: 'relative', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={activeProject.github} target="_blank" rel="noreferrer" style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>Source Code</a>
            <a href={activeProject.demo} target="_blank" rel="noreferrer" style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>Deployment</a>
            <div style={{ flex: 1 }} />
            {activeProject.completed ? (
              <button style={{ padding: '0.75rem 1.5rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'not-allowed' }} disabled>Verified ✓</button>
            ) : (
              <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, var(--cyan) 0%, var(--primary) 100%)', color: '#000', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(6,182,212,0.4)' }} onClick={() => onMarkComplete(activeProject.id)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Mark Complete</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

