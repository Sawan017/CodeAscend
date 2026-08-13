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
  onDisassociateSkill?: (skillId: string, domainId: string) => void
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
  onDisassociateSkill,
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
      isIndependent: true,
      activeDomains: [],
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
    // Check if explicitly associated
    activePathways.forEach(pid => {
      const isExplicit = skill.activeDomains?.includes(pid);
      if (isExplicit) {
        skillsByPathway[pid].push(skill);
      }
    });

    // Independent skills are explicitly those marked isIndependent
    // They appear here regardless of domain associations.
    if (skill.isIndependent) {
      standaloneSkills.push(skill)
    }
  })

  return (
    <div className="section-shell">
      <div className="panel" style={{ width: '100%', margin: '0', padding: '1.5rem', background: 'rgba(10,13,20,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Learning Discovery</p>
        </div>

        {/* Global Search */}
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              placeholder="Query matrix (e.g. HTML, React, Frontend Development)..." 
              value={globalSearch} 
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button style={{ padding: '0.85rem 1.5rem', background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }} onClick={handleStartSkillGlobally} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <Plus size={16} /> Add Custom Skill
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            <button 
              style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s', border: globalSearchFilter === 'all' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)', background: globalSearchFilter === 'all' ? 'rgba(6,182,212,0.1)' : 'transparent', color: globalSearchFilter === 'all' ? 'var(--cyan)' : 'var(--text-muted)' }} 
              onClick={() => setGlobalSearchFilter('all')}
            >
              All Data
            </button>
            <button 
              style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s', border: globalSearchFilter === 'domains' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)', background: globalSearchFilter === 'domains' ? 'rgba(6,182,212,0.1)' : 'transparent', color: globalSearchFilter === 'domains' ? 'var(--cyan)' : 'var(--text-muted)' }} 
              onClick={() => setGlobalSearchFilter('domains')}
            >
              Domains
            </button>
            <button 
              style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s', border: globalSearchFilter === 'skills' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)', background: globalSearchFilter === 'skills' ? 'rgba(6,182,212,0.1)' : 'transparent', color: globalSearchFilter === 'skills' ? 'var(--cyan)' : 'var(--text-muted)' }} 
              onClick={() => setGlobalSearchFilter('skills')}
            >
              Isolated Skills
            </button>
          </div>
          
          {globalSearch.trim().length > 0 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Domain Results */}
              {(globalSearchFilter === 'all' || globalSearchFilter === 'domains') && PATHWAY_REGISTRY
                .filter((p: any) => p.name.toLowerCase().includes(globalSearch.toLowerCase().trim()) || p.aliases?.some((a: any) => a.toLowerCase().includes(globalSearch.toLowerCase().trim())))
                .map((p: any) => {
                  const isActive = activePathways.includes(p.id)
                  const domainSkills = getSkillsForPathway(p.id)
                  
                  return (
                    <div key={p.id} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      
                      {domainSkills.length > 0 && (
                        <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Associated Skills</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {domainSkills.map(ds => (
                               <span key={ds.id} style={{ fontSize: '0.75rem', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                                 {ds.canonicalName}
                               </span>
                            ))}
                          </div>
                        </div>
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
                    <div key={s.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '4px 8px', borderRadius: '6px', marginRight: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>SKILL</span>
                        <strong style={{ fontSize: '1rem', color: '#fff' }}>{s.canonicalName}</strong>
                      </div>
                      {isStarted ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Already in progress</span>
                      ) : (
                        <button style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(168,85,247,0.3)' }} onClick={() => { 
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
                    <div key={s.id} style={{ cursor: 'pointer', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div onClick={() => onSelectSkill(s.id)} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{s.canonicalName || s.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span onClick={() => onSelectSkill(s.id)} style={{ fontSize: '0.875rem', color: s.progress === 100 ? 'var(--cyan)' : 'var(--text-muted)' }}>
                          {s.progress}%
                        </span>
                        <ChevronRight onClick={() => onSelectSkill(s.id)} size={16} color="var(--text-muted)" />
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            // Using a direct callback if we add a prop for it. If not, we fallback to global remove.
                            if (onDisassociateSkill) {
                              onDisassociateSkill(s.id, pid);
                            } else {
                              setSkillToRemove(s.id);
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '0.25rem', cursor: 'pointer', borderRadius: '4px' }}
                          onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          title="Remove from domain"
                        >
                          <X size={16} />
                        </button>
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
