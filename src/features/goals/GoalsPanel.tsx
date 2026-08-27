import React, { useState } from 'react';
import { Target, CheckSquare, BookOpen, Plus, Calendar, AlertCircle, XCircle, CheckCircle, Zap, Clock, Lock, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMinimumVerificationTime } from '../../lib/progression';
import { KnowledgeCheckModal } from '../../components/KnowledgeCheckModal';

export const GoalsPanel = ({ goals = [], skills = [], activeSession, activeSessionElapsed = 0, onCancelSession, onCompleteSession, onAddGoal, onCompleteGoal, onNavigate }: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', targetDate: new Date().toISOString().split('T')[0] });
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEndTaskConfirm, setShowEndTaskConfirm] = useState(false);

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    onAddGoal?.({
      id: crypto.randomUUID(),
      ...newTask,
      status: 'IN_PROGRESS',
      category: 'Task',
      milestones: []
    });
    setIsCreating(false);
    setNewTask({ title: '', description: '', priority: 'Medium', targetDate: new Date().toISOString().split('T')[0] });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todos = goals.filter((g: any) => g.status !== 'COMPLETED');
  
  const runningSkill = activeSession ? skills.find((s: any) => s.id === activeSession.skillId) : null;
  const runningSubtopic = activeSession?.subtopic;

  // Active Task Logic
  let primeLimit = 0;
  let focusedLimit = 0;
  let minVerificationSeconds = 0;
  let xpBase = 88;
  let primeXP = 220;
  let focusedXP = 154;
  let extendedXP = 88;
  let currentMode = 'EXTENDED';
  let isLocked = false;
  let currentXP = 88;
  
  if (activeSession && runningSubtopic) {
    const teachingMins = activeSession.teachingMinutes || 60;
    const solvingMins = activeSession.solvingBaselineMinutes || 25;
    primeLimit = (teachingMins + (solvingMins * 0.5)) * 60;
    focusedLimit = (teachingMins + solvingMins) * 60;
    
    xpBase = runningSubtopic.baseXP || 88;
    primeXP = Math.floor(xpBase * 2.5);
    focusedXP = Math.floor(xpBase * 1.75);
    extendedXP = xpBase;
    
    // Exact existing timer eligibility logic
    minVerificationSeconds = calculateMinimumVerificationTime(primeLimit);
    if (activeSessionElapsed < minVerificationSeconds) {
      isLocked = true;
    }
    
    if (activeSessionElapsed <= primeLimit) {
      currentMode = 'PRIME';
      currentXP = primeXP;
    } else if (activeSessionElapsed <= focusedLimit) {
      currentMode = 'FOCUSED';
      currentXP = focusedXP;
    } else {
      currentMode = 'EXTENDED';
      currentXP = extendedXP;
    }
  }

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 8px 24px -8px rgba(17,24,39,0.05)',
    padding: '32px'
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', padding: '0', 
      background: '#F5F7FC', color: '#111827', 
      minHeight: '100%', position: 'relative', overflowX: 'hidden'
    }}>
      {/* Verification Modal */}
      <AnimatePresence>
        {isVerifying && activeSession && (
          <KnowledgeCheckModal 
            activeSession={activeSession} 
            onPass={() => {
              setIsVerifying(false);
              onCompleteSession?.();
            }} 
            onCancel={() => setIsVerifying(false)} 
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 48px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* --- HERO / HEADER --- */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.06) 100%)', 
          borderRadius: '32px', padding: '48px', position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: 'inset 0 0 0 1px #fff, 0 24px 48px -12px rgba(99,102,241,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '0.85rem', fontWeight: 800, color: '#6366F1', letterSpacing: '0.15em', 
              textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
            }}>
              <div style={{ width: '8px', height: '8px', background: '#6366F1', borderRadius: '50%' }} />
              DASHBOARD
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Goals & To Do
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#64748B', margin: 0, maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
              Manage your actionable tasks and quickly resume your currently running learning sessions.
            </p>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
             <button 
                onClick={() => setIsCreating(true)} 
                style={{ 
                  background: '#6366F1', color: '#fff', border: 'none', padding: '16px 28px', 
                  borderRadius: '20px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  boxShadow: '0 12px 24px -8px rgba(99,102,241,0.4)', transition: 'all 0.2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#4F46E5'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#6366F1'; }}
              >
              <Plus size={22} /> Add To Do
            </button>
          </div>
        </div>

        {/* --- CREATE TASK FORM --- */}
        {isCreating && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ ...cardStyle, border: '2px solid #8B5CF6', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="What needs to be done?" autoFocus
              style={{ fontSize: '1.4rem', fontWeight: 800, border: 'none', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', outline: 'none', color: '#111827', background: 'transparent' }}
            />
            <input 
              value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
              placeholder="Add details (optional)..."
              style={{ fontSize: '1.05rem', border: 'none', outline: 'none', color: '#64748B', background: 'transparent' }}
            />
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <Calendar size={18} color="#64748B" />
                <input type="date" value={newTask.targetDate} onChange={e => setNewTask({...newTask, targetDate: e.target.value})} style={{ border: 'none', background: 'transparent', color: '#111827', outline: 'none', fontWeight: 700, fontSize: '0.95rem' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <AlertCircle size={18} color="#64748B" />
                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ border: 'none', background: 'transparent', color: '#111827', outline: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
              <button onClick={() => setIsCreating(false)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontWeight: 800, cursor: 'pointer', padding: '12px 24px', borderRadius: '12px', transition: 'all 0.2s' }}>Cancel</button>
              <button onClick={handleCreate} style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(139,92,246,0.3)' }}>Save To Do</button>
            </div>
          </motion.div>
        )}

        {/* --- ACTIVE LEARNING SECTION --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {runningSkill && runningSubtopic ? (
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden', padding: 0, border: `2px solid ${currentMode === 'PRIME' ? '#8B5CF6' : currentMode === 'FOCUSED' ? '#06B6D4' : '#64748B'}`, boxShadow: `0 24px 48px -12px ${currentMode === 'PRIME' ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.1)'}` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: currentMode === 'PRIME' ? '#8B5CF6' : currentMode === 'FOCUSED' ? '#06B6D4' : '#64748B' }} />
              
              <div style={{ padding: '40px 48px', display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
                
                {/* LEFT COLUMN: Task Info, Progress, Timer */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         {runningSkill.canonicalName || runningSkill.name}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
                         {runningSubtopic.title}
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 16px', borderRadius: '12px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px rgba(16,185,129,0.8)' }} />
                      <span style={{ color: '#047857', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>IN PROGRESS</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Progress</span>
                    <span style={{ fontSize: '1.2rem', color: currentMode === 'PRIME' ? '#8B5CF6' : '#06B6D4', fontWeight: 900 }}>{runningSkill.progress || 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '16px', background: '#F1F5F9', borderRadius: '8px', overflow: 'hidden', marginBottom: '48px', border: '1px solid #E2E8F0' }}>
                    <div style={{ width: `${Math.min(100, runningSkill.progress || 0)}%`, height: '100%', background: currentMode === 'PRIME' ? 'linear-gradient(90deg, #8B5CF6, #6366F1)' : 'linear-gradient(90deg, #06B6D4, #3B82F6)', borderRadius: '8px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '48px', alignItems: 'center', marginTop: 'auto' }}>
                     <div>
                       <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         TIMER
                       </div>
                       <div style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '12px', fontVariantNumeric: 'tabular-nums' }}>
                         <Clock size={28} color={currentMode === 'PRIME' ? '#8B5CF6' : '#06B6D4'} />
                         {formatTime(activeSessionElapsed)}
                       </div>
                     </div>
                     
                     <div>
                       <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         CURRENT REWARD
                       </div>
                       <div style={{ fontSize: '2rem', fontWeight: 900, color: currentMode === 'PRIME' ? '#8B5CF6' : currentMode === 'FOCUSED' ? '#06B6D4' : '#64748B', display: 'flex', alignItems: 'center', gap: '12px', fontVariantNumeric: 'tabular-nums', textShadow: currentMode === 'PRIME' ? '0 0 16px rgba(139,92,246,0.3)' : 'none' }}>
                         <Zap size={28} />
                         +{currentXP} XP
                       </div>
                     </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: XP Rewards, Completion */}
                <div style={{ flex: '1 1 350px', background: '#F8FAFC', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                   
                   <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="#EAB308" />
                      XP TIERS
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                      {/* PRIME */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'PRIME' ? '2px solid #8B5CF6' : '1px solid transparent', background: currentMode === 'PRIME' ? 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 100%)' : 'transparent' }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'PRIME' ? '#8B5CF6' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'PRIME' && <Target size={16} />} PRIME
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>Within {Math.floor(primeLimit / 60)} mins</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'PRIME' ? '#8B5CF6' : '#94A3B8', textShadow: currentMode === 'PRIME' ? '0 0 16px rgba(139,92,246,0.4)' : 'none' }}>
                            +{primeXP} XP
                         </div>
                      </div>

                      {/* FOCUSED */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'FOCUSED' ? '2px solid #06B6D4' : '1px solid transparent', background: currentMode === 'FOCUSED' ? 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.05) 100%)' : 'transparent', opacity: activeSessionElapsed > primeLimit || currentMode === 'FOCUSED' ? 1 : 0.5 }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'FOCUSED' ? '#06B6D4' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'FOCUSED' && <Target size={16} />} FOCUSED
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>Within {Math.floor(focusedLimit / 60)} mins</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'FOCUSED' ? '#06B6D4' : '#94A3B8', textShadow: currentMode === 'FOCUSED' ? '0 0 16px rgba(6,182,212,0.4)' : 'none' }}>
                            +{focusedXP} XP
                         </div>
                      </div>

                      {/* EXTENDED */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'EXTENDED' ? '2px solid #64748B' : '1px solid transparent', background: currentMode === 'EXTENDED' ? 'rgba(100,116,139,0.05)' : 'transparent', opacity: activeSessionElapsed > focusedLimit || currentMode === 'EXTENDED' ? 1 : 0.5 }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'EXTENDED' ? '#475569' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'EXTENDED' && <Target size={16} />} EXTENDED
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>At your own pace</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'EXTENDED' ? '#475569' : '#94A3B8' }}>
                            +{extendedXP} XP
                         </div>
                      </div>
                   </div>

                   {/* COMPLETION & ACTIONS AREA */}
                   <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                     {isLocked ? (
                       <button 
                         disabled
                         style={{ flex: 2, background: '#E2E8F0', color: '#94A3B8', border: 'none', padding: '18px 24px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'not-allowed' }}
                       >
                         <Lock size={20} /> AVAILABLE IN {formatTime(minVerificationSeconds - activeSessionElapsed)}
                       </button>
                     ) : (
                       <button 
                         onClick={() => setIsVerifying(true)}
                         style={{ flex: 2, background: currentMode === 'PRIME' ? '#8B5CF6' : currentMode === 'FOCUSED' ? '#06B6D4' : '#10B981', color: '#fff', border: 'none', padding: '18px 24px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: `0 12px 24px -8px ${currentMode === 'PRIME' ? 'rgba(139,92,246,0.4)' : currentMode === 'FOCUSED' ? 'rgba(6,182,212,0.4)' : 'rgba(16,185,129,0.4)'}` }}
                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                         onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'brightness(1)'; }}
                       >
                         <CheckCircle size={20} /> COMPLETE TASK
                       </button>
                     )}
                     
                     {showEndTaskConfirm ? (
                       <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                         <button 
                           onClick={() => onCancelSession?.()}
                           style={{ flex: 1, background: '#EF4444', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           title="Confirm End Task"
                         >
                           END
                         </button>
                         <button 
                           onClick={() => setShowEndTaskConfirm(false)}
                           style={{ flex: 1, background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           title="Cancel"
                         >
                           X
                         </button>
                       </div>
                     ) : (
                       <button 
                         onClick={() => setShowEndTaskConfirm(true)}
                         style={{ flex: 1, background: '#F1F5F9', color: '#64748B', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                         onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#334155'; }}
                         onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}
                       >
                         <Square size={18} fill="currentColor" /> END
                       </button>
                     )}
                   </div>

                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '64px', textAlign: 'center', background: '#FFFFFF', borderRadius: '32px', border: '2px dashed #CBD5E1', boxShadow: '0 8px 24px -8px rgba(17,24,39,0.02)' }}>
              <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid #E2E8F0' }}>
                <Target size={40} color="#94A3B8" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>No task currently running</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748B', margin: '0 0 24px', maxWidth: '400px', marginInline: 'auto', lineHeight: 1.5 }}>
                Start a task from your learning curriculum to begin the timer and earn XP.
              </p>
            </div>
          )}
        </div>

        {/* --- TO DO SECTION --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ borderBottom: '2px solid rgba(234,179,8,0.1)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(234,179,8,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={18} color="#EAB308" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>To Do</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todos.map((task: any) => (
              <div key={task.id} style={{ ...cardStyle, padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', transition: 'all 0.2s' }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(234,179,8,0.15)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = cardStyle.boxShadow; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
                <button 
                  onClick={() => onCompleteGoal?.(task.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: '#CBD5E1', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#16A34A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '8px', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} style={{ opacity: 0 }} className="check-icon-hover" />
                  </div>
                </button>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: '#111827', fontWeight: 800 }}>{task.title}</h3>
                  {task.description && <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#64748B', lineHeight: 1.5 }}>{task.description}</p>}
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {task.targetDate && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: task.targetDate < todayStr ? '#EF4444' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <Calendar size={14} /> {task.targetDate}
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', background: task.priority === 'High' ? 'rgba(239,68,68,0.1)' : '#F8FAFC', color: task.priority === 'High' ? '#EF4444' : '#64748B', border: task.priority === 'High' ? 'none' : '1px solid #E2E8F0' }}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {todos.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                <CheckSquare size={32} color="#94A3B8" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Nothing to do</div>
                <div style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>Add a task to keep yourself on track.</div>
              </div>
            )}
          </div>
        </div>

      </div>
      <style>{`
        .check-icon-hover { opacity: 0; transition: opacity 0.2s; }
        button:hover .check-icon-hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};
