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

  return (
    <div className="section-shell split-shell">
      <div className="panel">
        <div className="card-heading">
          <p className="eyebrow">PROJECTS</p>
          {onAddProject && (
            <button className="icon-button" onClick={() => setShowForm((v) => !v)} aria-label="Add project">
              <Plus size={16} />
            </button>
          )}
        </div>

        {showForm && (
          <div className="goal-form" style={{ marginBottom: '1rem' }}>
            <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
            <input placeholder="Technologies (comma separated)" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
            <div className="form-row">
              <input placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} />
              <input placeholder="Live Demo URL" value={demo} onChange={(e) => setDemo(e.target.value)} />
              <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
                <option value="PLANNING">PLANNING</option>
                <option value="BUILDING">BUILDING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className="action-row">
              <button className="secondary-btn" onClick={handleCreateProject}>Save project</button>
              <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="project-list">
          {projects.map((project) => (
            <motion.button
              key={project.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`project-card ${activeProject?.id === project.id ? 'active' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <div className="project-preview" style={{ backgroundImage: `url(${project.image})` }} />
              <div className="project-body">
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="chip">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {activeProject && (
        <div className="panel detail-panel">
          <div className="card-heading">
            <p className="eyebrow">WORKSHOP</p>
            {onDeleteProject && projects.length > 1 && (
              <button className="goal-delete" onClick={() => onDeleteProject(activeProject.id)} aria-label="Delete project">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <h3>{activeProject.name}</h3>
          <p className="copy">{activeProject.description}</p>
          <div className="chip-row">
            {activeProject.technologies.map((tech) => (
              <span key={tech} className="chip">{tech}</span>
            ))}
          </div>
          <div className="meta-row">
            <span>Status: {activeProject.status}</span>
            <span>Progress: {activeProject.progress}%</span>
          </div>
          <div className="detail-list">
            <h4>Features</h4>
            <ul>
              {activeProject.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="detail-list">
            <h4>What I learned</h4>
            <ul>
              {activeProject.whatILearned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="action-row">
            <a className="secondary-btn" href={activeProject.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="secondary-btn" href={activeProject.demo} target="_blank" rel="noreferrer">Live Demo</a>
            {activeProject.completed ? (
              <button className="secondary-btn" disabled>Completed ✓</button>
            ) : (
              <button className="secondary-btn" onClick={() => onMarkComplete(activeProject.id)}>Mark complete</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

