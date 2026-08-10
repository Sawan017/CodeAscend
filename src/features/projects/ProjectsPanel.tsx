import { motion } from 'framer-motion'
import type { Project } from '../../types'

type ProjectsPanelProps = {
  projects: Project[]
  activeProject: Project
  onSelectProject: (project: Project) => void
  onMarkComplete: (projectId: string) => void
}

export function ProjectsPanel({ projects, activeProject, onSelectProject, onMarkComplete }: ProjectsPanelProps) {
  return (
    <div className="section-shell split-shell">
      <div className="panel">
        <p className="eyebrow">PROJECTS</p>
        <div className="project-list">
          {projects.map((project) => (
            <motion.button key={project.id} whileHover={{ y: -4, scale: 1.01 }} className={`project-card ${activeProject.id === project.id ? 'active' : ''}`} onClick={() => onSelectProject(project)}>
              <div className="project-preview" style={{ backgroundImage: `url(${project.image})` }} />
              <div className="project-body">
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.technologies.slice(0, 3).map((tech) => <span key={tech} className="chip">{tech}</span>)}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="panel detail-panel">
        <p className="eyebrow">WORKSHOP</p>
        <h3>{activeProject.name}</h3>
        <p className="copy">{activeProject.description}</p>
        <div className="chip-row">
          {activeProject.technologies.map((tech) => <span key={tech} className="chip">{tech}</span>)}
        </div>
        <div className="meta-row"><span>Status: {activeProject.status}</span><span>Progress: {activeProject.progress}%</span></div>
        <div className="detail-list"><h4>Features</h4><ul>{activeProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        <div className="detail-list"><h4>What I learned</h4><ul>{activeProject.whatILearned.map((item) => <li key={item}>{item}</li>)}</ul></div>
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
    </div>
  )
}
