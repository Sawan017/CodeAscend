import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight, Play, Plus, Map, X, Target, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill } from '../../types';
import { resolveSkill, PATHWAY_REGISTRY, getSkillsForPathway, SKILL_REGISTRY } from '../../data/learningData.ts';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const card = {
  background: '#fff',
  borderRadius: '20px',
  border: '1px solid rgba(140, 135, 125, 0.12)',
  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
  overflow: 'hidden'
} as const;

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
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalSearchFilter, setGlobalSearchFilter] = useState<'all' | 'domains' | 'skills'>('all');
  const [domainSearches, setDomainSearches] = useState<Record<string, string>>({});
  const [skillToRemove, setSkillToRemove] = useState<string | null>(null);
  const [domainToRemove, setDomainToRemove] = useState<{id: string, name: string} | null>(null);

  // Global start skill
  const handleStartSkillGlobally = () => {
    if (!globalSearch.trim()) return;
    const resolved = resolveSkill(globalSearch.trim());

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
    };
    onAddSkill?.(newSkill);
    setGlobalSearch('');
  };
  
  // Start skill within a domain
  const handleStartSkillInDomain = (resolved: any, domainId: string) => {
    const searchCanon = (resolved.canonicalName || '').toLowerCase().trim();
    const existing = skills.find(s => 
      s.id === resolved.id || 
      (s.canonicalName || s.name || '').toLowerCase().trim() === searchCanon
    );
    if (existing) {
      onAssociateSkill?.(existing.id, domainId);
    } else {
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
      };
      onAddSkill?.(newSkill);
    }
    setDomainSearches(prev => ({ ...prev, [domainId]: '' }));
  };

  const setDomainSearch = (pid: string, value: string) => {
    setDomainSearches(prev => ({ ...prev, [pid]: value }));
  };

  // 1. Organize Independent vs Domain Skills exactly as originally implemented
  const standaloneSkills: Skill[] = [];
  const skillsByPathway: Record<string, Skill[]> = {};
  
  activePathways.forEach(pid => {
    skillsByPathway[pid] = [];
  });

  skills.forEach(skill => {
    activePathways.forEach(pid => {
      const isExplicit = skill.activeDomains?.includes(pid);
      if (isExplicit) {
        skillsByPathway[pid].push(skill);
      }
    });

    if (skill.isIndependent) {
      standaloneSkills.push(skill);
    }
  });

  // 2. Discoverable Results Mapping
  const q = globalSearch.trim().toLowerCase();
  
  // Show results ONLY if there is a search query
  const showResults = q.length > 0;
  
  const searchResultsDomains = useMemo(() => {
    if (globalSearchFilter === 'skills') return [];
    if (!q) return [];
    return PATHWAY_REGISTRY.filter(p => {
      return p.name.toLowerCase().includes(q) || p.aliases?.some(a => a.toLowerCase().includes(q)) || p.description?.toLowerCase().includes(q);
    });
  }, [q, globalSearchFilter]);

  const searchResultsSkills = useMemo(() => {
    if (globalSearchFilter === 'domains') return [];
    if (!q) return [];
    
    const seen = new Set();
    const nameMatches = [];
    const subtopicMatches = [];

    SKILL_REGISTRY.forEach((s: any) => {
      const sCanon = (s.canonicalName || '').toLowerCase().trim();
      const sAlias = s.aliases?.some((a: any) => a.toLowerCase().includes(q));
      
      const isNameMatch = sCanon.includes(q) || sAlias;
      
      let isSubtopicMatch = false;
      if (!isNameMatch && s.curriculum) {
        for (const c of s.curriculum) {
          if (c.topics) {
            for (const t of c.topics) {
              if (t.title?.toLowerCase().includes(q)) isSubtopicMatch = true;
              if (t.subtopics && t.subtopics.some((st: any) => st.title?.toLowerCase().includes(q))) isSubtopicMatch = true;
            }
          }
        }
      }

      if (isNameMatch && !seen.has(sCanon)) {
        seen.add(sCanon);
        nameMatches.push(s);
      } else if (isSubtopicMatch && !seen.has(sCanon)) {
        seen.add(sCanon);
        subtopicMatches.push(s);
      }
    });

    // Tiered returning: If we have strong name/alias matches, return ONLY those.
    // Otherwise, fall back to returning skills that match via subtopics (e.g. searching "flexbox")
    return nameMatches.length > 0 ? nameMatches : subtopicMatches;
  }, [q, globalSearchFilter]);

  // Determine if we should show the "+ Add Unknown" button
  const hasExactMatch = useMemo(() => {
    if (!q) return false;
    const exactDomain = PATHWAY_REGISTRY.some(p => p.name.toLowerCase() === q);
    const exactSkill = SKILL_REGISTRY.some((s: any) => (s.canonicalName || '').toLowerCase() === q || s.aliases?.some((a: any) => a.toLowerCase() === q));
    return exactDomain || exactSkill;
  }, [q]);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', padding: '0', 
      background: '#F5F7FC', color: '#111827', 
      minHeight: '100%', position: 'relative', overflowX: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '600px', background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 48px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* --- HERO / HEADER --- */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.06) 100%)', 
          borderRadius: '32px', padding: '56px 48px', position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: 'inset 0 0 0 1px #fff, 0 24px 48px -12px rgba(99,102,241,0.05)'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '0.85rem', fontWeight: 800, color: '#6366F1', letterSpacing: '0.15em', 
              textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
            }}>
              <div style={{ width: '8px', height: '8px', background: '#6366F1', borderRadius: '50%' }} />
              BUILD YOUR SKILL TREE
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Learn New Skills
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#64748B', margin: 0, maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
              Explore skills, choose domains, and build your specialized learning path.
            </p>
          </div>
        </div>

        {/* --- GLOBAL SEARCH AREA (Absolute Overlay Preserved) --- */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-24px', position: 'relative', zIndex: 100 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'flex', flex: 1, minWidth: '320px', alignItems: 'center', background: '#FFFFFF', 
                borderRadius: '24px', border: '1px solid #E2E8F0', padding: '8px 8px 8px 24px',
                boxShadow: '0 12px 32px -8px rgba(17,24,39,0.08)', flexWrap: 'wrap', gap: '12px',
                transition: 'all 0.2s'
              }}>
                <Search size={24} color="#6366F1" />
                <input 
                  value={globalSearch} onChange={e => setGlobalSearch(e.target.value)}
                  placeholder="Search skills, technologies, or topics..." 
                  style={{ flex: 1, minWidth: '150px', padding: '12px 8px', border: 'none', fontSize: '1.1rem', outline: 'none', color: '#111827', background: 'transparent', fontWeight: 500 }}
                />
                
                {/* Tabs inside search */}
                <div style={{ display: 'flex', gap: '4px', background: '#F5F7FC', padding: '6px', borderRadius: '16px', flexWrap: 'nowrap' }}>
                  <button 
                    onClick={() => setGlobalSearchFilter('all')} 
                    style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: globalSearchFilter === 'all' ? '#FFFFFF' : 'transparent', color: globalSearchFilter === 'all' ? '#6366F1' : '#64748B', border: 'none', boxShadow: globalSearchFilter === 'all' ? '0 4px 12px rgba(17,24,39,0.05)' : 'none' }}
                  >All</button>
                  <button 
                    onClick={() => setGlobalSearchFilter('domains')} 
                    style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: globalSearchFilter === 'domains' ? '#FFFFFF' : 'transparent', color: globalSearchFilter === 'domains' ? '#6366F1' : '#64748B', border: 'none', boxShadow: globalSearchFilter === 'domains' ? '0 4px 12px rgba(17,24,39,0.05)' : 'none' }}
                  >Domains</button>
                  <button 
                    onClick={() => setGlobalSearchFilter('skills')} 
                    style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: globalSearchFilter === 'skills' ? '#FFFFFF' : 'transparent', color: globalSearchFilter === 'skills' ? '#6366F1' : '#64748B', border: 'none', boxShadow: globalSearchFilter === 'skills' ? '0 4px 12px rgba(17,24,39,0.05)' : 'none' }}
                  >Skills</button>
                </div>
              </div>

              {globalSearch.trim() && !hasExactMatch && (
                <button 
                  onClick={handleStartSkillGlobally}
                  style={{ padding: '16px 24px', background: '#111827', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 12px 24px -8px rgba(17,24,39,0.3)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <Plus size={20} /> Add Unknown
                </button>
              )}
            </div>

            {/* SEARCH / DISCOVERY RESULTS OVERLAY */}
            <AnimatePresence>
              {showResults && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                  style={{ 
                    position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', 
                    borderRadius: '24px', padding: '32px', boxShadow: '0 32px 64px -16px rgba(17,24,39,0.15)', 
                    border: '1px solid #E2E8F0', marginTop: '16px', maxHeight: '70vh', overflowY: 'auto' 
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#6366F1', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <BookOpen size={18} color="#6366F1" /> Discovery Results
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {/* Render Domain Results */}
                    {searchResultsDomains.map(p => {
                      const isActive = activePathways.includes(p.id);
                      return (
                        <div key={p.id} style={{ padding: '24px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(17,24,39,0.03)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#06B6D4', background: 'rgba(6,182,212,0.1)', padding: '6px 12px', borderRadius: '999px', fontWeight: 800 }}>DOMAIN</span>
                              <h3 style={{ margin: '8px 0 0', fontSize: '1.25rem', color: '#111827', fontWeight: 900 }}>{p.name}</h3>
                            </div>
                          </div>
                          {isActive ? (
                            <div style={{ fontSize: '0.9rem', color: '#16A34A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} /> Already Active</div>
                          ) : (
                            <button 
                              onClick={() => { onStartPathway?.(p.id); setGlobalSearch(''); }}
                              style={{ background: '#6366F1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', width: '100%', boxShadow: '0 8px 16px -4px rgba(99,102,241,0.25)', transition: 'all 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
                              onMouseLeave={e => e.currentTarget.style.background = '#6366F1'}
                            >Start Domain</button>
                          )}
                        </div>
                      );
                    })}

                    {/* Render Skill Results */}
                    {searchResultsSkills.map((s: any) => {
                      const existingSkill = skills.find(sk => (sk.id === s.id || (sk.canonicalName || '').toLowerCase() === (s.canonicalName || '').toLowerCase()) && (sk.isIndependent || (sk.activeDomains && sk.activeDomains.length > 0)));
                      const isStarted = !!existingSkill;
                      const activeDomain = (existingSkill?.activeDomains && existingSkill.activeDomains.length > 0) ? PATHWAY_REGISTRY.find(p => p.id === existingSkill.activeDomains![0]) : null;
                      const domainText = activeDomain ? `In ${activeDomain.name}` : 'Independent Skill';
                      const domain = PATHWAY_REGISTRY.find(p => p.id === s.primaryDomainId);

                      return (
                        <div key={s.id} style={{ padding: '24px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(17,24,39,0.03)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '6px 12px', borderRadius: '999px', fontWeight: 800 }}>SKILL</span>
                              <h3 style={{ margin: '8px 0 0', fontSize: '1.25rem', color: '#111827', fontWeight: 900 }}>{s.canonicalName || s.name}</h3>
                              <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>{domain?.name}</div>
                            </div>
                          </div>
                          {isStarted ? (
                            <div style={{ fontSize: '0.9rem', color: '#16A34A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}><Target size={18} /> {domainText}</div>
                          ) : (
                            <button 
                              onClick={() => { const isDomainActive = activePathways.includes(s.primaryDomainId);
                                  onAddSkill?.({ 
                                    ...s, 
                                    isIndependent: !isDomainActive, 
                                    activeDomains: isDomainActive ? [s.primaryDomainId] : [], 
                                    progress: 0, 
                                    status: 'LEARNING', 
                                    started: new Date().toISOString().slice(0, 10) 
                                  }); setGlobalSearch(''); }}
                              style={{ background: '#F8FAFC', color: '#6366F1', border: '1px solid rgba(99,102,241,0.2)', padding: '12px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#6366F1'; }}
                            >+ Add to Learning Path</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {(searchResultsDomains.length === 0 && searchResultsSkills.length === 0) && (
                     <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>No matching results found in the catalog.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- DOMAIN CONTAINERS (MUST BE ABOVE INDEPENDENT) --- */}
        {activePathways.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ width: '8px', height: '8px', background: '#06B6D4', borderRadius: '50%' }} />
                 YOUR DOMAINS
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                Domain Containers
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#64748B', margin: 0, fontWeight: 500 }}>
                Domains you are actively learning and their related skills.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {activePathways.map((pid: string) => {
                const def = PATHWAY_REGISTRY.find(p => p.id === pid) || { id: pid, name: pid, description: '', aliases: [] };
                const ds = domainSearches[pid] || '';
                const domainSkills = skillsByPathway[pid] || [];
                
                return (
                  <div key={pid} style={{ 
                    background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', 
                    boxShadow: '0 12px 32px -8px rgba(17,24,39,0.05)', position: 'relative', overflow: 'hidden', padding: '40px'
                  }}>
                    {/* Accent Left Border */}
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '8px', background: '#06B6D4' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#06B6D4', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <Target size={16} color="#06B6D4" />
                          DOMAIN CONTAINER
                        </div>
                        <h3 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: 900, letterSpacing: '-0.02em' }}>{def.name}</h3>
                      </div>
                      <button 
                        onClick={() => setDomainToRemove({ id: pid, name: def.name })}
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                      >
                        Remove Domain
                      </button>
                    </div>
                    
                    {/* Domain Skills Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                      {domainSkills.map((skill: any) => (
                        <div key={skill.id} 
                          onClick={() => onSelectSkill?.(skill.id)}
                          style={{ 
                            background: '#FFFFFF', padding: '24px', borderRadius: '20px', 
                            border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s', 
                            boxShadow: '0 4px 12px rgba(17,24,39,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' 
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(6,182,212,0.15)'; e.currentTarget.style.borderColor = '#06B6D4'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(17,24,39,0.02)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#111827' }}>{skill.canonicalName || skill.name}</h4>
                            {(() => {
                              let statusLabel = 'ADDED';
                              let statusColor = '#64748B';
                              let statusBg = '#F1F5F9';
                              if (skill.progress >= 100) {
                                statusLabel = 'COMPLETED';
                                statusColor = '#16A34A';
                                statusBg = '#DCFCE7';
                              } else if ((skill.progress || 0) > 0) {
                                statusLabel = 'IN PROGRESS';
                                statusColor = '#06B6D4';
                                statusBg = 'rgba(6,182,212,0.1)';
                              }
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '0.75rem', color: statusColor, fontWeight: 900, padding: '4px 10px', background: statusBg, borderRadius: '999px', letterSpacing: '0.05em' }}>
                                    {statusLabel}
                                  </span>
                                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800 }}>
                                    {skill.progress || 0}%
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                          <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, skill.progress || 0)}%`, height: '100%', background: 'linear-gradient(90deg, #06B6D4, #3B82F6)', borderRadius: '4px' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>{skill.subtopics?.length || 0} Subtopics</span>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              if (onDisassociateSkill) onDisassociateSkill(skill.id, pid);
                              else setSkillToRemove(skill.id);
                            }} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', transition: 'color 0.2s' }}
                               onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                               onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {domainSkills.length === 0 && (
                        <div style={{ padding: '32px', gridColumn: '1 / -1', color: '#64748B', textAlign: 'center', border: '1px dashed #CBD5E1', borderRadius: '20px', fontWeight: 600 }}>
                          No skills started in this domain yet.
                        </div>
                      )}
                    </div>

                    {/* Domain Scoped Search */}
                    <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#334155', marginBottom: '16px' }}>Add Skills to {def.name}</div>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', background: '#FFFFFF', 
                        border: '1px solid #E2E8F0', borderRadius: '16px',
                        padding: '8px 12px', flex: 1, boxShadow: '0 4px 12px rgba(17,24,39,0.03)',
                        transition: 'all 0.2s'
                      }}>
                        <Search size={20} color="#94A3B8" style={{ margin: '0 12px 0 8px' }} />
                        <input 
                          placeholder={`Search ${def.name} skills...`}
                          value={ds}
                          onChange={(e) => setDomainSearch(pid, e.target.value)}
                          style={{ 
                            flex: 1, border: 'none', background: 'transparent', outline: 'none', 
                            fontSize: '1.05rem', color: '#111827', fontWeight: 500, padding: '10px 0',
                            width: '100%'
                          }}
                        />
                      </div>
                      
                      {ds.trim().length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          {getSkillsForPathway(pid).filter(s => s.canonicalName.toLowerCase().includes(ds.toLowerCase().trim())).map(s => {
                            const existingSkill = skills.find(sk => sk.id === s.id || (sk.canonicalName || sk.name || '').toLowerCase().trim() === (s.canonicalName || '').toLowerCase().trim());
                            const isAssociated = existingSkill?.activeDomains?.includes(pid);
                            const isStarted = !!existingSkill;
                            return (
                              <div key={s.id} style={{ padding: '16px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(17,24,39,0.02)' }}>
                                <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem' }}>{s.canonicalName}</div>
                                {isAssociated ? (
                                  <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 800 }}>Already in domain</span>
                                ) : isStarted ? (
                                  <button style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', color: '#64748B' }} onClick={() => handleStartSkillInDomain(s, pid)}>Add to Domain</button>
                                ) : (
                                  <button style={{ background: '#06B6D4', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }} onClick={() => handleStartSkillInDomain(s, pid)}>Start Learning</button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- INDEPENDENT SKILLS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: '8px', height: '8px', background: '#8B5CF6', borderRadius: '50%' }} />
               YOUR LEARNING QUEUE
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: 0 }}>
              Independent Skills
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', margin: 0, fontWeight: 500 }}>
              Skills you're learning independently of any specific domain.
            </p>
          </div>
          
          <div style={{ 
            background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', 
            boxShadow: '0 12px 32px -8px rgba(17,24,39,0.05)', position: 'relative', overflow: 'hidden', padding: '40px'
          }}>
            {/* Accent Left Border */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '8px', background: '#8B5CF6' }} />

            {standaloneSkills.length === 0 ? (
              <div style={{ padding: '60px 32px', textAlign: 'center', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={32} color="#8B5CF6" />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', marginBottom: '8px' }}>No independent skills yet</div>
                  <div style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 500 }}>Search for a skill above and add it to your learning queue.</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {standaloneSkills.map(skill => (
                  <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => onSelectSkill(skill.id)}
                    style={{ 
                      background: '#FFFFFF', padding: '24px', borderRadius: '20px', 
                      border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s', 
                      boxShadow: '0 4px 12px rgba(17,24,39,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = '#8B5CF6'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(17,24,39,0.02)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#111827' }}>{skill.canonicalName || skill.name}</h4>
                      {(() => {
                        let statusLabel = 'ADDED';
                        let statusColor = '#64748B';
                        let statusBg = '#F1F5F9';
                        if (skill.progress >= 100) {
                          statusLabel = 'COMPLETED';
                          statusColor = '#16A34A';
                          statusBg = '#DCFCE7';
                        } else if ((skill.progress || 0) > 0) {
                          statusLabel = 'IN PROGRESS';
                          statusColor = '#8B5CF6';
                          statusBg = 'rgba(139,92,246,0.1)';
                        }
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: statusColor, fontWeight: 900, padding: '4px 10px', background: statusBg, borderRadius: '999px', letterSpacing: '0.05em' }}>
                              {statusLabel}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800 }}>
                              {skill.progress || 0}%
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, skill.progress || 0)}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>{skill.subtopics?.length || 0} Subtopics</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setSkillToRemove(skill.id);
                      }} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', transition: 'color 0.2s' }}
                         onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                         onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Confirm Dialogs */}
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
  );
}
