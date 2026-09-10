import React, { useState } from 'react';
import { Target, CheckSquare, BookOpen, Plus, Calendar, AlertCircle, XCircle, CheckCircle, Zap, Clock, Lock, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMinimumVerificationTime } from '../../lib/progression';
import { KnowledgeCheckModal } from '../../components/KnowledgeCheckModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const GoalsPanel = ({ goals = [], skills = [], activeSession, activeSessionElapsed = 0, onCancelSession, onCompleteSession, onAddGoal, onUpdateGoal, onRemoveGoal, onCompleteGoal, onNavigate }: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', targetDate: new Date().toISOString().split('T')[0] });
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEndTaskConfirm, setShowEndTaskConfirm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', description: '', priority: 'Medium', targetDate: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmTaskDeleteId, setConfirmTaskDeleteId] = useState<string | null>(null);

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTask.title.trim()) {
      setErrorMsg("Please enter a task name.");
      document.getElementById('todo-title-input')?.focus();
      return;
    }
    setErrorMsg('');
    onAddGoal?.({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      ...newTask,
      targetDate: newTask.targetDate || new Date().toISOString().split('T')[0],
      status: 'IN_PROGRESS',
      category: 'Task',
      milestones: []
    });
    setNewTask({ title: '', description: '', priority: 'Medium', targetDate: new Date().toISOString().split('T')[0] });
    setIsCreating(false);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todos = goals.filter((g: any) => g.status !== 'COMPLETED' && g.status !== 'CANCELLED');
  
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
    background: 'var(--bg-card)',
    borderRadius: '24px',
    border: '1px solid var(--border)',
    boxShadow: '0 8px 24px -8px rgba(17,24,39,0.05)',
    padding: '32px'
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', padding: '0', 
      background: 'var(--bg-main)', color: 'var(--text-main)', 
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

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(var(--secondary-rgb),0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 48px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* --- HERO / HEADER --- */}
        <div className="premium-hero" style={{ 
          background: 'linear-gradient(135deg, rgba(var(--secondary-rgb),0.04) 0%, rgba(var(--secondary-rgb),0.06) 100%)', 
          borderRadius: '32px', padding: '48px', position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(var(--secondary-rgb),0.15)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px -12px rgba(var(--secondary-rgb),0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(var(--cyan-rgb),0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.15em', 
              textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
            }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }} />
              DASHBOARD
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Goals & To Do
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
              Manage your actionable tasks and quickly resume your currently running learning sessions.
            </p>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
             <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                onClick={() => { setNewTask(prev => ({...prev, targetDate: new Date().toISOString().split('T')[0]})); setIsCreating(true); }} 
                style={{ 
                  background: 'var(--secondary)', color: '#fff', border: 'none', padding: '16px 28px', 
                  borderRadius: '20px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  boxShadow: '0 12px 24px -8px rgba(var(--secondary-rgb),0.4)', transition: 'all 0.2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#4F46E5'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--secondary)'; }}
              >
              <Plus size={22} /> Add To Do
            </motion.button>
          </div>
        </div>

        {/* --- CREATE TASK FORM --- */}
        {isCreating && (
          <motion.form onSubmit={handleCreate} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ ...cardStyle, border: '2px solid var(--secondary)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <input 
                id="todo-title-input"
                value={newTask.title} onChange={e => { setNewTask(prev => ({...prev, title: e.target.value})); if (errorMsg) setErrorMsg(''); }}
                placeholder="What needs to be done?" autoFocus
                style={{ width: '100%', fontSize: '1.4rem', fontWeight: 800, border: 'none', borderBottom: errorMsg ? '2px solid #EF4444' : '2px solid var(--border)', paddingBottom: '12px', outline: 'none', color: 'var(--text-main)', background: 'transparent', transition: 'border-color 0.2s' }}
              />
              {errorMsg && <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>{errorMsg}</div>}
            </div>
            <input 
              value={newTask.description} onChange={e => setNewTask(prev => ({...prev, description: e.target.value}))}
              placeholder="Add details (optional)..."
              style={{ fontSize: '1.05rem', border: 'none', outline: 'none', color: 'var(--text-muted)', background: 'transparent' }}
            />
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div 
                onClick={() => (document.getElementById('todo-date-input') as any)?.showPicker()}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <Calendar size={18} color="var(--text-muted)" />
                <input id="todo-date-input" type="date" value={newTask.targetDate} onChange={e => setNewTask(prev => ({...prev, targetDate: e.target.value}))} onClick={e => e.stopPropagation()} style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }} />
              </div>
              <div 
                onClick={() => { try { (document.getElementById('todo-priority-input') as any)?.showPicker(); } catch(e) { document.getElementById('todo-priority-input')?.focus(); } }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <AlertCircle size={18} color="var(--text-muted)" />
                <select id="todo-priority-input" value={newTask.priority} onChange={e => setNewTask(prev => ({...prev, priority: e.target.value}))} onClick={e => e.stopPropagation()} style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} type="button" onClick={() => setIsCreating(false)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', padding: '12px 24px', borderRadius: '12px', transition: 'all 0.2s' }}>Cancel</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} type="submit" style={{ background: 'var(--secondary)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(var(--secondary-rgb),0.3)' }}>Save To Do</motion.button>
            </div>
          </motion.form>
        )}

        {/* --- ACTIVE LEARNING SECTION --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {runningSkill && runningSubtopic ? (
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden', padding: 0, border: `2px solid ${currentMode === 'PRIME' ? 'var(--secondary)' : currentMode === 'FOCUSED' ? 'var(--cyan)' : 'var(--text-muted)'}`, boxShadow: `0 24px 48px -12px ${currentMode === 'PRIME' ? 'rgba(var(--secondary-rgb),0.2)' : 'rgba(var(--cyan-rgb),0.1)'}` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '100%', background: currentMode === 'PRIME' ? 'var(--secondary)' : currentMode === 'FOCUSED' ? 'var(--cyan)' : 'var(--text-muted)' }} />
              
              <div style={{ padding: '40px 48px', display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
                
                {/* LEFT COLUMN: Task Info, Progress, Timer */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         {runningSkill.canonicalName || runningSkill.name}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
                         {runningSubtopic.title}
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 16px', borderRadius: '12px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px rgba(16,185,129,0.8)' }} />
                      <span style={{ color: '#047857', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>IN PROGRESS</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Progress</span>
                    <span style={{ fontSize: '1.2rem', color: currentMode === 'PRIME' ? 'var(--secondary)' : 'var(--cyan)', fontWeight: 900 }}>{runningSkill.progress || 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '16px', background: 'var(--bg-surface-sunken)', borderRadius: '8px', overflow: 'hidden', marginBottom: '48px', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${Math.min(100, runningSkill.progress || 0)}%`, height: '100%', background: currentMode === 'PRIME' ? 'linear-gradient(90deg, var(--secondary), var(--secondary))' : 'linear-gradient(90deg, var(--cyan), var(--primary))', borderRadius: '8px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '48px', alignItems: 'center', marginTop: 'auto' }}>
                     <div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         TIMER
                       </div>
                       <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', fontVariantNumeric: 'tabular-nums' }}>
                         <Clock size={28} color={currentMode === 'PRIME' ? 'var(--secondary)' : 'var(--cyan)'} />
                         {formatTime(activeSessionElapsed)}
                       </div>
                     </div>
                     
                     <div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                         CURRENT REWARD
                       </div>
                       <div style={{ fontSize: '2rem', fontWeight: 900, color: currentMode === 'PRIME' ? 'var(--secondary)' : currentMode === 'FOCUSED' ? 'var(--cyan)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', fontVariantNumeric: 'tabular-nums', textShadow: currentMode === 'PRIME' ? '0 0 16px rgba(var(--secondary-rgb),0.3)' : 'none' }}>
                         <Zap size={28} />
                         +{currentXP} XP
                       </div>
                     </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: XP Rewards, Completion */}
                <div style={{ flex: '1 1 350px', background: 'var(--bg-surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                   
                   <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="#EAB308" />
                      XP TIERS
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                      {/* PRIME */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'PRIME' ? '2px solid var(--secondary)' : '1px solid transparent', background: currentMode === 'PRIME' ? 'linear-gradient(135deg, rgba(var(--secondary-rgb),0.1) 0%, rgba(var(--secondary-rgb),0.05) 100%)' : 'transparent' }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'PRIME' ? 'var(--secondary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'PRIME' && <Target size={16} />} PRIME
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Within {Math.floor(primeLimit / 60)} mins</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'PRIME' ? 'var(--secondary)' : '#94A3B8', textShadow: currentMode === 'PRIME' ? '0 0 16px rgba(var(--secondary-rgb),0.4)' : 'none' }}>
                            +{primeXP} XP
                         </div>
                      </div>

                      {/* FOCUSED */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'FOCUSED' ? '2px solid var(--cyan)' : '1px solid transparent', background: currentMode === 'FOCUSED' ? 'linear-gradient(135deg, rgba(var(--cyan-rgb),0.1) 0%, rgba(var(--primary-rgb),0.05) 100%)' : 'transparent', opacity: activeSessionElapsed > primeLimit || currentMode === 'FOCUSED' ? 1 : 0.5 }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'FOCUSED' ? 'var(--cyan)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'FOCUSED' && <Target size={16} />} FOCUSED
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Within {Math.floor(focusedLimit / 60)} mins</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'FOCUSED' ? 'var(--cyan)' : '#94A3B8', textShadow: currentMode === 'FOCUSED' ? '0 0 16px rgba(var(--cyan-rgb),0.4)' : 'none' }}>
                            +{focusedXP} XP
                         </div>
                      </div>

                      {/* EXTENDED */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: currentMode === 'EXTENDED' ? '2px solid var(--text-muted)' : '1px solid transparent', background: currentMode === 'EXTENDED' ? 'rgba(100,116,139,0.05)' : 'transparent', opacity: activeSessionElapsed > focusedLimit || currentMode === 'EXTENDED' ? 1 : 0.5 }}>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: currentMode === 'EXTENDED' ? '#475569' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentMode === 'EXTENDED' && <Target size={16} />} EXTENDED
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>At your own pace</div>
                         </div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentMode === 'EXTENDED' ? '#475569' : '#94A3B8' }}>
                            +{extendedXP} XP
                         </div>
                      </div>
                   </div>

                   {/* COMPLETION & ACTIONS AREA */}
                   <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                     {isLocked ? (
                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                         disabled
                         style={{ flex: 2, background: 'var(--border)', color: 'var(--text-muted)', border: 'none', padding: '18px 24px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'not-allowed' }}
                       >
                         <Lock size={20} /> AVAILABLE IN {formatTime(minVerificationSeconds - activeSessionElapsed)}
                       </motion.button>
                     ) : (
                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                         onClick={() => setIsVerifying(true)}
                         style={{ flex: 2, background: currentMode === 'PRIME' ? 'var(--secondary)' : currentMode === 'FOCUSED' ? 'var(--cyan)' : '#10B981', color: '#fff', border: 'none', padding: '18px 24px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: `0 12px 24px -8px ${currentMode === 'PRIME' ? 'rgba(var(--secondary-rgb),0.4)' : currentMode === 'FOCUSED' ? 'rgba(var(--cyan-rgb),0.4)' : 'rgba(16,185,129,0.4)'}` }}
                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                         onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'brightness(1)'; }}
                       >
                         <CheckCircle size={20} /> COMPLETE TASK
                       </motion.button>
                     )}
                     
                     {showEndTaskConfirm ? (
                       <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                         <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                           onClick={() => onCancelSession?.()}
                           style={{ flex: 1, background: '#EF4444', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           title="Confirm End Task"
                         >
                           END
                         </motion.button>
                         <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                           onClick={() => setShowEndTaskConfirm(false)}
                           style={{ flex: 1, background: 'var(--bg-surface-sunken)', color: 'var(--text-muted)', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           title="Cancel"
                         >
                           X
                         </motion.button>
                       </div>
                     ) : (
                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                         onClick={() => setShowEndTaskConfirm(true)}
                         style={{ flex: 1, background: 'var(--bg-surface-sunken)', color: 'var(--text-muted)', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                         onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                         onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                       >
                         <Square size={18} fill="currentColor" /> END
                       </motion.button>
                     )}
                   </div>

                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '64px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '32px', border: '2px dashed var(--border-strong)', boxShadow: '0 8px 24px -8px rgba(17,24,39,0.02)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-surface)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--border)' }}>
                <Target size={40} color="#94A3B8" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px' }}>No task currently running</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0 0 24px', maxWidth: '400px', marginInline: 'auto', lineHeight: 1.5 }}>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>To Do</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todos.map((task: any) => (
              <div key={task.id} style={{ ...cardStyle, padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', transition: 'all 0.2s' }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(234,179,8,0.15)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = cardStyle.boxShadow; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                  onClick={() => onCompleteGoal?.(task.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: '#CBD5E1', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#16A34A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '8px', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} style={{ opacity: 0 }} className="check-icon-hover" />
                  </div>
                </motion.button>
                
                <div style={{ flex: 1 }}>
                  {editingTaskId === task.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                      <input 
                        value={editTaskData.title} onChange={e => setEditTaskData(prev => ({...prev, title: e.target.value}))}
                        autoFocus style={{ fontSize: '1.15rem', fontWeight: 800, border: 'none', borderBottom: '2px solid var(--border)', paddingBottom: '4px', outline: 'none', color: 'var(--text-main)', background: 'transparent', width: '100%' }}
                      />
                      <input 
                        value={editTaskData.description} onChange={e => setEditTaskData(prev => ({...prev, description: e.target.value}))}
                        placeholder="Add details..." style={{ fontSize: '1rem', border: 'none', outline: 'none', color: 'var(--text-muted)', background: 'transparent', width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div 
                          onClick={() => (document.getElementById(`edit-date-${task.id}`) as any)?.showPicker()}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                          <Calendar size={14} color="var(--text-muted)" />
                          <input id={`edit-date-${task.id}`} type="date" value={editTaskData.targetDate} onChange={e => setEditTaskData(prev => ({...prev, targetDate: e.target.value}))} onClick={e => e.stopPropagation()} style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }} />
                        </div>
                        <div
                          onClick={() => document.getElementById(`edit-priority-${task.id}`)?.focus()}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                          <AlertCircle size={14} color="var(--text-muted)" />
                          <select id={`edit-priority-${task.id}`} value={editTaskData.priority} onChange={e => setEditTaskData(prev => ({...prev, priority: e.target.value}))} onClick={e => e.stopPropagation()} style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => {
                          if (editTaskData.title.trim()) {
                            onUpdateGoal?.({ ...task, ...editTaskData });
                          }
                          setEditingTaskId(null);
                        }} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>Save</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => setEditingTaskId(null)} style={{ background: 'var(--bg-surface-sunken)', color: 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>Cancel</motion.button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>{task.title}</h3>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => { setEditingTaskId(task.id); setEditTaskData({ title: task.title, description: task.description || '', priority: task.priority, targetDate: task.targetDate || '' }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} title="Edit">
                            ✎
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => setConfirmTaskDeleteId((task.id))} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} title="Remove">
                            <XCircle size={16} />
                          </motion.button>
                        </div>
                      </div>
                      {task.description && <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{task.description}</p>}
                      
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {task.targetDate && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: task.targetDate < todayStr ? '#EF4444' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <Calendar size={14} /> {task.targetDate}
                          </span>
                        )}
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', background: task.priority === 'High' ? 'rgba(239,68,68,0.1)' : 'var(--bg-surface)', color: task.priority === 'High' ? '#EF4444' : 'var(--text-muted)', border: task.priority === 'High' ? 'none' : '1px solid var(--border)' }}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {todos.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border-strong)' }}>
                <CheckSquare size={32} color="#94A3B8" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Nothing to do</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Add a task to keep yourself on track.</div>
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={confirmTaskDeleteId !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmTaskDeleteId) {
            onRemoveGoal?.(confirmTaskDeleteId);
          }
        }}
        onCancel={() => setConfirmTaskDeleteId(null)}
      />

      <style>{`
        .check-icon-hover { opacity: 0; transition: opacity 0.2s; }
        button:hover .check-icon-hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};



