import { Plus, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../../types'
import { resolveSkill, PATHWAY_REGISTRY, getSkillsForPathway, SKILL_REGISTRY } from '../../data/learningData'
import { ConfirmDialog } from '../../components/ConfirmDialog'

type SkillsPanelProps = {
  skills: Skill[]
  activePathways: string[]
  onSelectSkill: (id: string) => void
  onAddSkill?: (skill: Skill) => void
  onStartPathway?: (pathwayId: string) => void
  onRemovePathway?: (pathwayId: string) => void
  onAssociateSkill?: (skillId: string, domainId: string) => void
  onRemoveSkill?: (skillId: string) => void
}

export function SkillsPanel({
  skills,
  activePathways = [],
  onSelectSkill,
  onAddSkill,
  onStartPathway,
  onRemovePathway,
  onAssociateSkill,
  onRemoveSkill
}: SkillsPanelProps) {
  const [globalSearch, setGlobalSearch] = useState('')
  const [globalSearchFilter, setGlobalSearchFilter] = useState<'all' | 'domains' | 'skills'>('all')
  const [domainSearches, setDomainSearches] = useState<Record<string, string>>({})
  const [skillToRemove, setSkillToRemove] = useState<string | null>(null)
  const [domainToRemove, setDomainToRemove] = useState<{id: string, name: string} | null>(null)

  // Global start skill
  const handleStartSkillGlobally = () => {
    if (!globalSearch.trim()) return
    const resolved = resolveSkill(globalSearch.trim())
    const searchCanon = (resolved.canonicalName || '').toLowerCase().trim()
    
    const matchedDomains = activePathways.filter(pid => 
      getSkillsForPathway(pid).some(ps => (ps.canonicalName||'').toLowerCase().trim() === searchCanon)
    )

    const newSkill: Skill = {
      id: resolved.id,
      name: resolved.canonicalName,
      canonicalName: resolved.canonicalName,
      type: resolved.type,
      progress: 0,
      status: 'LEARNING',
      started: new Date().toISOString().slice(0, 10),
      completed: '',
      relatedProjects: [],
      notes: 'Focusing on core principles and practice exercises.',
      isIndependent: matchedDomains.length === 0,
      activeDomains: matchedDomains,
    }
    onAddSkill?.(newSkill)
    setGlobalSearch('')
  }
  
  // Start skill within a domain
  const handleStartSkillInDomain = (resolved: any, domainId: string) => {
    // Check if skill already exists
    const searchCanon = (resolved.canonicalName || '').toLowerCase().trim()
    const existing = skills.find(s => 
      s.id === resolved.id || 
      (s.canonicalName || s.name || '').toLowerCase().trim() === searchCanon
    )
    if (existing) {
      // Just associate it
      onAssociateSkill?.(existing.id, domainId)
    } else {
      // Create new and associate
      const newSkill: Skill = {
        id: resolved.id,
        name: resolved.canonicalName,
        canonicalName: resolved.canonicalName,
        type: resolved.type,
        progress: 0,
        status: 'LEARNING',
        started: new Date().toISOString().slice(0, 10),
        completed: '',
        relatedProjects: [],
        notes: 'Focusing on core principles and practice exercises.',
        isIndependent: false,
        activeDomains: [domainId],
      }
      onAddSkill?.(newSkill)
    }
    setDomainSearches(prev => ({ ...prev, [domainId]: '' }))
  }

  // Domain search handling
  const setDomainSearch = (pid: string, value: string) => {
    setDomainSearches(prev => ({ ...prev, [pid]: value }))
  }

  // Determine independent vs domain skills
  const standaloneSkills: Skill[] = []
  const skillsByPathway: Record<string, Skill[]> = {}
  
  activePathways.forEach(pid => {
    skillsByPathway[pid] = []
  })

  skills.forEach(skill => {
    let isAssociatedWithActiveDomain = false
    if (skill.activeDomains && skill.activeDomains.length > 0) {
      skill.activeDomains.forEach(pid => {
        if (skillsByPathway[pid]) {
          skillsByPathway[pid].push(skill)
          isAssociatedWithActiveDomain = true
        }
      })
    }
    
    // Only push to standalone if explicitly independent AND not associated with any active domain
    if (skill.isIndependent && !isAssociatedWithActiveDomain) {
      standaloneSkills.push(skill)
    }
  })

  return (
    <div className="section-shell">
      <div className="panel" style={{ width: '100%', margin: '0' }}>
        <div className="card-heading">
          <p className="eyebrow">LEARNING DISCOVERY</p>
        </div>

        {/* Global Search */}
        <div className="goal-form" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              placeholder="Global Search (e.g. HTML, React, Frontend Development)..." 
              value={globalSearch} 
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{ width: '100%' }}
            />
            <button className="primary-btn" onClick={handleStartSkillGlobally} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Add Custom Skill
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            <button 
              className={globalSearchFilter === 'all' ? 'primary-btn' : 'secondary-btn'} 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '4px' }} 
              onClick={() => setGlobalSearchFilter('all')}
            >
              All
            </button>
            <button 
              className={globalSearchFilter === 'domains' ? 'primary-btn' : 'secondary-btn'} 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '4px' }} 
              onClick={() => setGlobalSearchFilter('domains')}
            >
              Domains
            </button>
            <button 
              className={globalSearchFilter === 'skills' ? 'primary-btn' : 'secondary-btn'} 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '4px' }} 
              onClick={() => setGlobalSearchFilter('skills')}
            >
              Skills
            </button>
          </div>
          
          {globalSearch.trim().length > 0 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Domain Results */}
              {(globalSearchFilter === 'all' || globalSearchFilter === 'domains') && PATHWAY_REGISTRY
                .filter((p: any) => p.name.toLowerCase().includes(globalSearch.toLowerCase().trim()) || p.aliases?.some((a: any) => a.toLowerCase().includes(globalSearch.toLowerCase().trim())))
                .map((p: any) => {
                  const isActive = activePathways.includes(p.id)
                  return (
                    <div key={p.id} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', background: 'var(--cyan-glow)', padding: '2px 6px', borderRadius: '4px', marginRight: '0.5rem' }}>DOMAIN</span>
                        <strong>{p.name}</strong>
                      </div>
                      {isActive ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Already active</span>
                      ) : (
                        <button className="primary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }} onClick={() => { onStartPathway?.(p.id); setGlobalSearch(''); }}>Start Domain</button>
                      )}
                    </div>
                  )
              })}
              {/* Skill Results */}
              {(globalSearchFilter === 'all' || globalSearchFilter === 'skills') && Array.from(new Map(
                  SKILL_REGISTRY
                    .filter((s: any) => s.canonicalName.toLowerCase().includes(globalSearch.toLowerCase().trim()) || s.aliases?.some((a: any) => a.toLowerCase().includes(globalSearch.toLowerCase().trim())))
                    .map((s: any) => [(s.canonicalName || '').toLowerCase().trim(), s])
                ).values())
                .map((s: any) => {
                  const searchCanon = (s.canonicalName || '').toLowerCase().trim()
                  const existingSkill = skills.find(sk => sk.id === s.id || (sk.canonicalName || sk.name || '').toLowerCase().trim() === searchCanon)
                  const isStarted = !!existingSkill && (existingSkill.isIndependent || existingSkill.activeDomains?.some(d => activePathways.includes(d)))
                  return (
                    <div key={s.id} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--violet)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--violet)', background: 'var(--violet-glow)', padding: '2px 6px', borderRadius: '4px', marginRight: '0.5rem' }}>SKILL</span>
                        <strong>{s.canonicalName}</strong>
                      </div>
                      {isStarted ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Already started</span>
                      ) : (
                        <button className="primary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }} onClick={() => { 
                          const sCanon = (s.canonicalName || '').toLowerCase().trim()
                          const matchedDomains = activePathways.filter(pid => 
                            getSkillsForPathway(pid).some(ps => (ps.canonicalName||'').toLowerCase().trim() === sCanon)
                          )
                          const newSkill: Skill = {
                            id: s.id,
                            name: s.canonicalName,
                            canonicalName: s.canonicalName,
                            type: s.type,
                            progress: 0,
                            status: 'LEARNING',
                            started: new Date().toISOString().slice(0, 10),
                            completed: '',
                            relatedProjects: [],
                            notes: 'Focusing on core principles and practice exercises.',
                            isIndependent: matchedDomains.length === 0,
                            activeDomains: matchedDomains,
                          }
                          onAddSkill?.(newSkill)
                          setGlobalSearch('')
                        }}>Start Skill</button>
                      )}
                    </div>
                  )
              })}
            </div>
          )}
        </div>

        {/* Domain Containers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activePathways.map(pid => {
            const def = PATHWAY_REGISTRY.find((p: any) => p.id === pid)
            if (!def) return null
            const domainSkills = skillsByPathway[pid] || []
            const ds = domainSearches[pid] || ''
            
            return (
              <div key={pid} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'var(--bg-card)', position: 'relative' }}>
                <button 
                  onClick={() => setDomainToRemove({ id: pid, name: def.name })}
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>{def.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {domainSkills.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>No skills started in this domain yet.</p>
                  )}
                  {domainSkills.map(s => (
                    <div key={s.id} onClick={() => onSelectSkill(s.id)} style={{ cursor: 'pointer', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{s.canonicalName || s.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', color: s.progress === 100 ? 'var(--cyan)' : 'var(--text-muted)' }}>
                          {s.progress}%
                        </span>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Domain Scoped Search */}
                <div className="goal-form" style={{ marginTop: '1rem' }}>
                  <input 
                    placeholder={`Search ${def.name} skills...`}
                    value={ds}
                    onChange={(e) => setDomainSearch(pid, e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-surface)' }}
                  />
                  
                  {ds.trim().length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {getSkillsForPathway(pid)
                        .filter(s => s.canonicalName.toLowerCase().includes(ds.toLowerCase().trim()))
                        .map(s => {
                          const searchCanon = (s.canonicalName || '').toLowerCase().trim()
                          const existingSkill = skills.find(sk => sk.id === s.id || (sk.canonicalName || sk.name || '').toLowerCase().trim() === searchCanon)
                          const isAssociated = existingSkill?.activeDomains?.includes(pid)
                          const isStarted = !!existingSkill
                          
                          return (
                            <div key={s.id} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--violet)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--violet)', background: 'var(--violet-glow)', padding: '2px 6px', borderRadius: '4px', marginRight: '0.5rem' }}>SKILL</span>
                                <strong>{s.canonicalName}</strong>
                              </div>
                              {isAssociated ? (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Already in this domain</span>
                              ) : isStarted ? (
                                <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleStartSkillInDomain(s, pid)}>Add to Domain</button>
                              ) : (
                                <button className="primary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleStartSkillInDomain(s, pid)}>Start Learning</button>
                              )}
                            </div>
                          )
                        })
                      }
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Independent Skills Container */}
          {(standaloneSkills.length > 0 || activePathways.length === 0) && (
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'var(--bg-card)' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Independent Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {standaloneSkills.map(s => (
                  <div key={s.id} style={{ cursor: 'pointer', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => onSelectSkill(s.id)} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{s.canonicalName || s.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span onClick={() => onSelectSkill(s.id)} style={{ fontSize: '0.875rem', color: s.progress === 100 ? 'var(--cyan)' : 'var(--text-muted)' }}>
                        {s.progress}%
                      </span>
                      <ChevronRight size={16} color="var(--text-muted)" onClick={() => onSelectSkill(s.id)} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSkillToRemove(s.id); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '0.25rem', cursor: 'pointer', borderRadius: '4px' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Remove skill"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {standaloneSkills.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>No independent skills started yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog 
        isOpen={!!skillToRemove}
        title="Remove Skill?"
        message="This removes the skill from your active learning list."
        subMessage="Your existing progress will be preserved if you add it again."
        confirmLabel="Remove Skill"
        onConfirm={() => { if(skillToRemove) onRemoveSkill?.(skillToRemove); setSkillToRemove(null); }}
        onCancel={() => setSkillToRemove(null)}
      />
      <ConfirmDialog 
        isOpen={!!domainToRemove}
        title={`Remove ${domainToRemove?.name}?`}
        message={`This removes ${domainToRemove?.name} from your active learning list.`}
        subMessage="Skills associated with this domain will also be removed from your active learning list. Your existing skill progress will be preserved and restored if you start those skills again."
        confirmLabel="Remove Domain"
        onConfirm={() => { if(domainToRemove) onRemovePathway?.(domainToRemove.id); setDomainToRemove(null); }}
        onCancel={() => setDomainToRemove(null)}
      />
    </div>
  )
}
