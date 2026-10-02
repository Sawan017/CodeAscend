import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useToasts } from '../../../hooks/useToasts'
import { evaluateDynamicMilestones, calculateLevel } from '../../../lib/progression'
import { Shield, ArrowLeft, Activity, Trophy, CheckCircle2, Star, Search, Award, ChevronDown, ChevronRight, Square, CheckSquare } from 'lucide-react'
import { achievements as journeyAchievements } from '../../../data/journeyData'
import { milestoneDefinitions } from '../../../data/milestoneData'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { SKILL_REGISTRY, generateSubtopicsForSkill } from '../../../data/learningData'

const allAchievements = [
  ...journeyAchievements,
  ...milestoneDefinitions.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    image: m.image,
    unlocked: false
  }))
];

export function AdminGodMode({ user, onBack }: { user: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('PROGRESSION')
  const [progression, setProgression] = useState<any>(null)
  const [targetAchievements, setTargetAchievements] = useState<any[]>([])
  const [targetSkills, setTargetSkills] = useState<any[]>([])
  
  const [xpInput, setXpInput] = useState('')
  const [levelInput, setLevelInput] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [awardLoading, setAwardLoading] = useState(false)
  const [skillLoading, setSkillLoading] = useState(false)
  
  const [resetProgressionLoading, setResetProgressionLoading] = useState(false)
  const [resetAchievementsLoading, setResetAchievementsLoading] = useState(false)
  const [resetSkillsLoading, setResetSkillsLoading] = useState(false)
  
  const [confirmResetProgression, setConfirmResetProgression] = useState(false)
  const [confirmResetAchievements, setConfirmResetAchievements] = useState(false)
  const [confirmResetSkills, setConfirmResetSkills] = useState(false)

  const [searchAch, setSearchAch] = useState('')
  const [selectedAchId, setSelectedAchId] = useState<string | null>(null)

  const [searchSkill, setSearchSkill] = useState('')
  
  // Skills UI state
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set())
  
  const { push } = useToasts()

  useEffect(() => {
    console.log('[GOD MODE SKILLS]');
    console.log('Total skills loaded:', SKILL_REGISTRY ? SKILL_REGISTRY.length : 0);
    if (SKILL_REGISTRY && SKILL_REGISTRY.length > 0) {
      console.log('First skill:', SKILL_REGISTRY[0].canonicalName || SKILL_REGISTRY[0].id);
      const subtopics = generateSubtopicsForSkill(SKILL_REGISTRY[0]);
      console.log('Total topics for first skill:', subtopics.length);
    }
  }, []);

  useEffect(() => {
    loadData()
  }, [user.user_id])

  const loadData = async () => {
    setProgression(null)
    setTargetAchievements([])
    setTargetSkills([])

    const { data, error } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single()
    if (data) {
      setProgression(data.data)
      // DO NOT initialize inputs to current level/xp to prevent accidental overrides.
    }
    const { data: achData } = await supabase.from('achievements').select('data').eq('user_id', user.user_id).eq('key', 'achievements').single()
    if (achData?.data) {
      setTargetAchievements(achData.data)
    }
    const { data: skillsData } = await supabase.from('skills').select('data').eq('user_id', user.user_id).eq('key', 'skills').single()
    if (skillsData?.data) {
      setTargetSkills(skillsData.data)
    }
  }

  const handleSaveProgression = async () => {
    if (loading) return;
    const xp = xpInput.trim() === '' ? null : parseInt(xpInput, 10)
    const lvl = levelInput.trim() === '' ? null : parseInt(levelInput, 10)
    
    if (xp !== null && (isNaN(xp) || xp < 0)) return push('XP must be a valid positive number.')
    if (lvl !== null && (isNaN(lvl) || lvl < 1 || lvl > 9999)) return push('Level must be between 1 and 9999.')

    if (xp === null && lvl === null) {
      return push('Nothing to override.');
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc('admin_update_progression', {
        p_target_user_id: user.user_id,
        p_xp: xp,
        p_level: lvl
      })
      if (error) throw error;
      
      push('Progression updated securely.')
      setXpInput('')
      setLevelInput('')
      loadData()
    } catch (e: any) {
      push(`Error: ${e.message}`)
    }
    setLoading(false)
  }

  const handleResetProgression = async () => {
    console.log("PROGRESSION RESET CONFIRMED");
    if (resetProgressionLoading) return;
    setResetProgressionLoading(true);
    try {
      const { data: preProg } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      const expectedLevel = preProg?.data?.legitimate_level;
      const expectedXp = preProg?.data?.legitimate_xp;
      
      const { error } = await supabase.rpc('admin_reset_progression', { p_target_user_id: user.user_id });
      if (error) throw error;
      
      const { data: postProg, error: postErr } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      if (postErr) throw postErr;
      
      if (postProg?.data?.is_god_mode) throw new Error('Verification failed: is_god_mode is still true.');
      if (expectedLevel !== undefined && Number(postProg?.data?.level) !== Number(expectedLevel)) throw new Error(`Verification failed: Level is ${postProg?.data?.level}, expected ${expectedLevel}`);
      if (expectedXp !== undefined && Number(postProg?.data?.xp) !== Number(expectedXp)) throw new Error(`Verification failed: XP is ${postProg?.data?.xp}, expected ${expectedXp}`);
      
      push('Reset to Normal successful');
      setConfirmResetProgression(false);
      loadData();
    } catch (e: any) {
      push(`Error: ${e.message}`);
    }
    setResetProgressionLoading(false);
  }

  const handleResetAchievements = async () => {
    if (resetAchievementsLoading) return;
    setResetAchievementsLoading(true);
    try {
      console.log('[ACHIEVEMENT RESET]');
      console.log('User ID:', user.user_id);
      
      const { data: preProg } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      const expectedLen = preProg?.data?.legitimate_achievements ? preProg.data.legitimate_achievements.length : 0;
      
      const { data: currDbAch } = await supabase.from('achievements').select('data').eq('user_id', user.user_id).eq('key', 'achievements').single();
      const { data: currDbBadges } = await supabase.from('badges').select('data').eq('user_id', user.user_id).eq('key', 'badges').single();
      
      console.log('Achievements before (SNAPSHOT):', preProg?.data?.legitimate_achievements);
      console.log('God Mode achievements (Current DB):', currDbAch?.data);
      console.log('Badges before (SNAPSHOT):', preProg?.data?.legitimate_badges);
      console.log('Badges associated with God Mode achievements (Current DB):', currDbBadges?.data);

      const { error } = await supabase.rpc('admin_reset_achievements', { p_target_user_id: user.user_id });
      
      console.log('Achievement reset result:', error ? error.message : 'Success');
      console.log('Badge reset result:', error ? error.message : 'Success');
      if (error) throw error;
      
      const { data: postAch, error: postErr } = await supabase.from('achievements').select('data').eq('user_id', user.user_id).eq('key', 'achievements').single();
      if (postErr) throw postErr;
      
      const { data: postBadges } = await supabase.from('badges').select('data').eq('user_id', user.user_id).eq('key', 'badges').single();
      
      console.log('Achievements after DB re-fetch:', postAch?.data);
      console.log('Badges after DB re-fetch:', postBadges?.data);

      if (postAch?.data?.length !== expectedLen) {
        throw new Error('Verification failed: Achievements count mismatch');
      }

      push('Reset to Normal successful');
      setConfirmResetAchievements(false);
      loadData();
    } catch (e: any) {
      push(`Error: ${e.message}`);
    }
    setResetAchievementsLoading(false);
  }

  const handleResetSkills = async () => {
    console.log("SKILL RESET CONFIRMED");
    if (resetSkillsLoading) return;
    setResetSkillsLoading(true);
    try {
      const { data: preProg } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      
      const expectedLen = preProg?.data?.legitimate_skills ? preProg.data.legitimate_skills.length : 0;
      const expectedXp = preProg?.data?.legitimate_xp !== undefined ? preProg.data.legitimate_xp : preProg?.data?.xp;

      const { error } = await supabase.rpc('admin_reset_skills', { p_target_user_id: user.user_id });
      if (error) throw error;

      const { data: postSkills, error: postErr } = await supabase.from('skills').select('data').eq('user_id', user.user_id).eq('key', 'skills').single();
      if (postErr) throw postErr;
      
      const { data: postProg, error: postProgErr } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      if (postProgErr) throw postProgErr;

      if (postSkills?.data?.length !== expectedLen) {
        throw new Error(`Verification failed: Skills count mismatch. Expected ${expectedLen}, got ${postSkills?.data?.length}`);
      }
            if (expectedXp !== undefined && Number(postProg?.data?.xp) !== Number(expectedXp)) {
          throw new Error(`Verification failed: XP mismatch. Expected ${expectedXp}, got ${postProg?.data?.xp}`);
        }

      push('Reset to Normal successful');
      setConfirmResetSkills(false);
      loadData();
    } catch (e: any) {
      push(`Error: ${e.message}`);
    }
    setResetSkillsLoading(false);
  }

  const handleAwardAchievement = async () => {
    if (!selectedAchId || awardLoading) return
    setAwardLoading(true)
    try {
      const { data, error } = await supabase.rpc('admin_award_achievement', {
        p_target_user_id: user.user_id,
        p_achievement_id: selectedAchId
      })
      if (error) throw error
      if (data) {
        push('Achievement awarded.')
        setSelectedAchId(null)
        loadData()
      } else {
        push('User already owns this achievement.')
      }
    } catch (e: any) {
      push(`Error: ${e.message}`)
    }
    setAwardLoading(false)
  }

  const handleApplySkillOverride = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log('[GOD MODE] COMPLETE SELECTED TOPICS CLICKED');
    console.log('Selected topic IDs:', Array.from(selectedTopics));
    
    if (!expandedSkillId || skillLoading) return;
    setSkillLoading(true);
    try {
      const skillDef = SKILL_REGISTRY.find(s => s.id === expandedSkillId);
      if (!skillDef) throw new Error("Skill definition not found");

      const subtopics = generateSubtopicsForSkill(skillDef);
      
      const { data: preProg } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single();
      
      const snapshotToSave = preProg?.data?.legitimate_skills === undefined ? JSON.parse(JSON.stringify(targetSkills)) : null;

      const currentSkills = JSON.parse(JSON.stringify(targetSkills));
      let existingSkill = currentSkills.find((s: any) => s.id === expandedSkillId);
      
      if (!existingSkill) {
        existingSkill = {
          id: skillDef.id,
          name: skillDef.canonicalName || skillDef.id,
          progress: 0,
          status: 'IN_PROGRESS',
          started: new Date().toISOString(),
          completed: '',
          relatedProjects: [],
          notes: '',
          subtopics: subtopics.map(t => ({
            ...t,
            status: 'Not Started'
          }))
        };
        currentSkills.push(existingSkill);
      } else if (!existingSkill.subtopics || existingSkill.subtopics.length === 0) {
        existingSkill.subtopics = subtopics.map(t => ({
           ...t,
           status: 'Not Started'
        }));
      }

      let completedCount = 0;
      let alreadyCompleted: string[] = [];
      let newlyCompleted: string[] = [];

      existingSkill.subtopics.forEach((t: any) => {
        const snapshotSkills = preProg?.data?.legitimate_skills || [];
        const snapSkill = snapshotSkills.find((s: any) => s.id === expandedSkillId);
        const snapTopic = snapSkill?.subtopics?.find((st: any) => st.id === t.id);
        const legitimatelyCompleted = snapTopic?.status === 'Completed';

        const isSelected = selectedTopics.has(t.id);
        const currentlyCompletedInDb = t.status === 'Completed';

        if (legitimatelyCompleted) {
          t.status = 'Completed';
          completedCount++;
          if (isSelected) alreadyCompleted.push(t.id);
        } else if (isSelected) {
          if (!currentlyCompletedInDb) {
            newlyCompleted.push(t.id);
          } else {
            alreadyCompleted.push(t.id);
          }
          t.status = 'Completed';
          completedCount++;
        } else {
          t.status = 'Not Started';
        }
      });

      console.log('[GOD MODE TOPIC COMPLETION]');
      console.log('Already completed:', alreadyCompleted);
      console.log('Newly completed:', newlyCompleted);
      
      const totalCount = existingSkill.subtopics.length;
      existingSkill.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
      existingSkill.status = existingSkill.progress === 100 ? 'MASTERED' : 'IN_PROGRESS';
      if (existingSkill.progress === 100 && !existingSkill.completed) {
        existingSkill.completed = new Date().toISOString();
      }

      console.log('Database completion result: Calling admin_override_skills_with_xp');
      
      const xpBeforeDb = preProg?.data?.xp || 0;

      const { data: awardedXp, error } = await supabase.rpc('admin_override_skills_with_xp', {
        p_target_user_id: user.user_id,
        p_skills: currentSkills,
        p_skill_snapshot: snapshotToSave
      });
      if (error) {
        console.error('Database completion result: ERROR', error);
        throw error;
      }
      
      // Select XP and Skills again from DB to verify!
      const { data: vSkills, error: vErr } = await supabase.from('skills').select('data').eq('user_id', user.user_id).eq('key', 'skills').single()
      if (vErr) throw vErr
      
      const { data: vProg, error: pErr } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single()
      if (pErr) throw pErr

      const xpAfterDb = vProg?.data?.xp || 0;

      console.log('[GOD MODE] XP VERIFICATION');
      console.log(`XP BEFORE DB: ${xpBeforeDb}`);
      console.log(`XP AWARDED: ${awardedXp}`);
      console.log(`XP AFTER DB: ${xpAfterDb}`);
      
      const savedSkill = vSkills?.data?.find((s: any) => s.id === expandedSkillId);
      if (!savedSkill || savedSkill.progress !== existingSkill.progress) {
        throw new Error("Verification failed: Skill state not updated in DB correctly")
      }

      push('Complete Selected Topics applied successfully.');
      loadData(); // Re-fetch all data into React state only after SUCCESS
    } catch (e: any) {
      console.error('[GOD MODE COMPLETE] ERROR:', e);
      const errMsg = e?.message || e?.details || e?.error_description || JSON.stringify(e);
      push(`Error: ${errMsg}`);
    }
    setSkillLoading(false);
  };

  const handleSelectAllTopics = (skillId: string) => {
    const skillDef = SKILL_REGISTRY.find(s => s.id === skillId);
    if (!skillDef) return;
    const subtopics = generateSubtopicsForSkill(skillDef);
    setSelectedTopics(new Set(subtopics.map(t => t.id)));
  };

  const handleDeselectAllTopics = () => {
    setSelectedTopics(new Set());
  };

  const toggleTopic = (topicId: string) => {
    const next = new Set(selectedTopics);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    setSelectedTopics(next);
  };

  const filteredAchievements = useMemo(() => {
    const lowerSearch = searchAch.toLowerCase();
    return allAchievements.filter(a => 
      a.title.toLowerCase().includes(lowerSearch) || 
      a.description.toLowerCase().includes(lowerSearch) ||
      a.id.toLowerCase().includes(lowerSearch)
    );
  }, [searchAch]);

  const filteredSkills = useMemo(() => {
    const lowerSearch = searchSkill.toLowerCase();
    const result = SKILL_REGISTRY.filter(s => 
      s.id.toLowerCase().includes(lowerSearch) || 
      (s.canonicalName && s.canonicalName.toLowerCase().includes(lowerSearch))
    );
    console.log('[GOD MODE SKILLS] Filtered skills:', result.length);
    return result;
  }, [searchSkill]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={onBack} style={{ background: 'var(--bg-surface-sunken)', border: '1px solid var(--border)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} color="#f59e0b" />
              God Mode: {user.display_name || user.username}
            </h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{user.login_id} &middot; {user.email} &middot; {user.role.toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 220, borderRight: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          {['PROGRESSION', 'ACHIEVEMENTS', 'SKILLS'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1rem', textAlign: 'left', background: activeTab === tab ? 'rgba(245,158,11,0.1)' : 'transparent', color: activeTab === tab ? '#f59e0b' : 'var(--text-muted)', border: 'none', borderRight: activeTab === tab ? '3px solid #f59e0b' : '3px solid transparent', fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer' }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {activeTab === 'PROGRESSION' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> Level & XP Control</h3>
              </div>
              
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Level</label>
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', color: '#f59e0b', fontSize: '1.1rem', fontWeight: 700 }}>
                        {progression ? calculateLevel(progression) : 1}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current XP</label>
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
                        {progression?.xp || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Override Level</label>
                      <input type="number" min="1" placeholder="Enter level" value={levelInput} onChange={e => setLevelInput(e.target.value)} style={{ width: '100%', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Override XP</label>
                      <input type="number" min="0" placeholder="Enter XP" value={xpInput} onChange={e => setXpInput(e.target.value)} style={{ width: '100%', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        console.log("RESET TO NORMAL CLICKED"); 
                        setConfirmResetProgression(true); 
                      }} 
                      disabled={resetProgressionLoading} 
                      style={{ background: 'transparent', border: '1px solid #ff4400', color: '#ff4400', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: resetProgressionLoading ? 'not-allowed' : 'pointer', opacity: resetProgressionLoading ? 0.7 : 1, position: 'relative', zIndex: 10 }}
                    >
                      {resetProgressionLoading ? 'Resetting...' : 'Reset to Normal'}
                    </button>
                    <button onClick={handleSaveProgression} disabled={loading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)', transition: 'all 0.2s', position: 'relative', zIndex: 10 }}>
                      {loading ? 'Processing...' : 'Override Progression'} <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ACHIEVEMENTS' && (
            <div style={{ maxWidth: 800 }}>
              <style>{`
                .admin-achievements-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .admin-achievements-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .admin-achievements-scroll::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.15);
                  border-radius: 10px;
                }
                .admin-achievements-scroll::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.25);
                }
              `}</style>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={20} /> Award Achievement</h3>
              </div>
              
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Search achievements..." 
                      value={searchAch}
                      onChange={(e) => setSearchAch(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem' }} 
                    />
                  </div>
                </div>

                <div className="admin-achievements-scroll" style={{ height: '350px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                  {filteredAchievements.map(ach => {
                    const isOwned = targetAchievements.some(a => a.id === ach.id && a.unlocked);
                    return (
                      <div 
                        key={ach.id} 
                        onClick={() => !isOwned && setSelectedAchId(ach.id)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                          minHeight: '80px', flexShrink: 0,
                          background: selectedAchId === ach.id ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-surface)', 
                          border: '1px solid', borderColor: selectedAchId === ach.id ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-strong)', 
                          borderRadius: '12px', cursor: isOwned ? 'default' : 'pointer', transition: 'all 0.15s',
                          boxShadow: selectedAchId === ach.id ? '0 0 0 1px #f59e0b' : 'none',
                          opacity: isOwned ? 0.6 : 1
                        }}
                      >
                        <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                          {ach.image ? (
                            <img src={ach.image} alt={ach.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}><Award size={20} color="var(--text-muted)" /></div>
                          )}
                        </div>
                        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedAchId === ach.id ? '#f59e0b' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ach.title}
                            </div>
                            {isOwned && (
                              <span style={{ flexShrink: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                                Owned
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {ach.description}
                          </div>
                        </div>
                        {selectedAchId === ach.id && <CheckCircle2 size={20} color="#f59e0b" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />}
                      </div>
                    )
                  })}
                  {filteredAchievements.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No achievements found.</div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        console.log("ACHIEVEMENT RESET CLICKED"); 
                        setConfirmResetAchievements(true); 
                      }} 
                      disabled={resetAchievementsLoading} 
                      style={{ background: 'transparent', border: '1px solid #ff4400', color: '#ff4400', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: resetAchievementsLoading ? 'not-allowed' : 'pointer', opacity: resetAchievementsLoading ? 0.7 : 1, position: 'relative', zIndex: 10 }}
                    >
                      {resetAchievementsLoading ? 'Resetting...' : 'Reset to Normal'}
                    </button>

                    {selectedAchId && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {(() => {
                          const selectedAch = allAchievements.find(a => a.id === selectedAchId);
                          if (selectedAch?.id.startsWith('m-lvl-')) {
                            return <span style={{ color: '#f59e0b' }}>Provide Level: {selectedAch.id.replace('m-lvl-', '')}</span>;
                          }
                          return <span>Not a level achievement</span>;
                        })()}
                      </div>
                    )}
                  </div>
                  <button onClick={handleAwardAchievement} disabled={!selectedAchId || awardLoading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: (!selectedAchId || awardLoading) ? 'not-allowed' : 'pointer', opacity: (!selectedAchId || awardLoading) ? 0.5 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
                    {awardLoading ? 'Awarding...' : 'Award Selected Achievement'} <Trophy size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'SKILLS' && (
            <div style={{ maxWidth: 800 }}>
              <style>{`
                .admin-achievements-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .admin-achievements-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .admin-achievements-scroll::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.15);
                  border-radius: 10px;
                }
                .admin-achievements-scroll::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.25);
                }
              `}</style>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={20} /> Granular Skill Override</h3>
              </div>
              
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Search skills by name or ID..." 
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem' }} 
                    />
                  </div>
                </div>

                <div className="admin-achievements-scroll" style={{ height: '400px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                  {filteredSkills.map(skillDef => {
                    const existingSkill = targetSkills.find(s => s.id === skillDef.id);
                    const isExpanded = expandedSkillId === skillDef.id;
                    const subtopics = isExpanded ? generateSubtopicsForSkill(skillDef) : [];
                    
                    return (
                      <div key={skillDef.id} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, background: isExpanded ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-surface)', border: '1px solid', borderColor: isExpanded ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-strong)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedSkillId(null);
                              setSelectedTopics(new Set());
                            } else {
                              setExpandedSkillId(skillDef.id);
                              setSelectedTopics(new Set());
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', cursor: 'pointer', minHeight: '60px' }}
                        >
                          <div style={{ color: 'var(--text-muted)' }}>
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </div>
                          <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {skillDef.canonicalName || skillDef.id}
                              </div>
                              {existingSkill ? (
                                <span style={{ flexShrink: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: existingSkill.status === 'MASTERED' ? '#10b981' : 'var(--text-muted)', background: existingSkill.status === 'MASTERED' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: existingSkill.status === 'MASTERED' ? 700 : 500 }}>
                                  {existingSkill.status} ({existingSkill.progress}%)
                                </span>
                              ) : (
                                <span style={{ flexShrink: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                                  0%
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              ID: {skillDef.id}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ padding: '0 1rem 1rem 3rem', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                                  <button onClick={() => handleSelectAllTopics(skillDef.id)} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}>Select All Topics</button>
                                  <button onClick={handleDeselectAllTopics} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>Deselect All</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {subtopics.map(topic => {
                                    const isSelected = selectedTopics.has(topic.id);
                                    
                                    // Check if legitimately completed in snapshot
                                    const snapshotSkills = progression?.legitimate_skills || [];
                                    const snapSkill = snapshotSkills.find((s: any) => s.id === skillDef.id);
                                    const snapTopic = snapSkill?.subtopics?.find((st: any) => st.id === topic.id);
                                    const legitimatelyCompleted = snapTopic?.status === 'Completed';

                                    // Check if currently completed (which may include God Mode changes)
                                    const currTopic = existingSkill?.subtopics?.find((st: any) => st.id === topic.id);
                                    const isCurrentlyCompleted = currTopic?.status === 'Completed';

                                    return (
                                      <div 
                                        key={topic.id}
                                        onClick={() => !legitimatelyCompleted && toggleTopic(topic.id)}
                                        style={{ 
                                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', 
                                          background: isSelected ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-panel)', 
                                          borderRadius: '8px', cursor: legitimatelyCompleted ? 'default' : 'pointer',
                                          opacity: legitimatelyCompleted ? 0.6 : 1, flexShrink: 0
                                        }}
                                      >
                                        <div style={{ color: legitimatelyCompleted ? '#10b981' : (isSelected ? '#f59e0b' : 'var(--text-muted)') }}>
                                          {legitimatelyCompleted || isSelected || isCurrentlyCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </div>
                                        <div style={{ flex: 1, fontSize: '0.9rem', color: isSelected || isCurrentlyCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                          {topic.title}
                                        </div>
                                        {legitimatelyCompleted && (
                                          <div style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                            Legitimate
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                  {filteredSkills.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No skills found.</div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      console.log("SKILL RESET CLICKED"); 
                      setConfirmResetSkills(true); 
                    }} 
                    disabled={resetSkillsLoading} 
                    style={{ background: 'transparent', border: '1px solid #ff4400', color: '#ff4400', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: resetSkillsLoading ? 'not-allowed' : 'pointer', opacity: resetSkillsLoading ? 0.7 : 1, position: 'relative', zIndex: 10 }}
                  >
                    {resetSkillsLoading ? 'Resetting...' : 'Reset to Normal'}
                  </button>
                  <button onClick={handleApplySkillOverride} disabled={!expandedSkillId || skillLoading || selectedTopics.size === 0} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: (!expandedSkillId || skillLoading || selectedTopics.size === 0) ? 'not-allowed' : 'pointer', opacity: (!expandedSkillId || skillLoading || selectedTopics.size === 0) ? 0.5 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
                    {skillLoading ? 'Processing...' : `Complete ${selectedTopics.size} Selected Topics`} <Star size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmResetProgression}
        title="Reset Progression to Normal"
        message="Are you sure you want to remove the God Mode override for Level and XP?"
        subMessage="The original Level and XP will be restored. This will not affect achievements or skills."
        confirmLabel={resetProgressionLoading ? "Resetting..." : "Reset to Normal"}
        cancelLabel="Cancel"
        onConfirm={handleResetProgression}
        onCancel={() => { if (!resetProgressionLoading) setConfirmResetProgression(false) }}
        isProcessing={resetProgressionLoading}
      />
      <ConfirmDialog
        isOpen={confirmResetAchievements}
        title="Reset Achievements to Normal"
        message="Are you sure you want to remove achievements granted by God Mode?"
        subMessage="Only manually granted achievements or God Mode milestones will be removed. Legitimate achievements will remain."
        confirmLabel={resetAchievementsLoading ? "Resetting..." : "Reset to Normal"}
        cancelLabel="Cancel"
        onConfirm={handleResetAchievements}
        onCancel={() => { if (!resetAchievementsLoading) setConfirmResetAchievements(false) }}
        isProcessing={resetAchievementsLoading}
      />
      <ConfirmDialog
        isOpen={confirmResetSkills}
        title="Reset Skills to Normal"
        message="Are you sure you want to revert God Mode skill overrides?"
        subMessage="Legitimate skill progress will be safely restored."
        confirmLabel={resetSkillsLoading ? "Resetting..." : "Reset to Normal"}
        cancelLabel="Cancel"
        onConfirm={handleResetSkills}
        onCancel={() => { if (!resetSkillsLoading) setConfirmResetSkills(false) }}
        isProcessing={resetSkillsLoading}
      />
    </motion.div>
  )
}
