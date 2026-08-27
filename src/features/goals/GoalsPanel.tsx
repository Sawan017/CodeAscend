import React from 'react';
import { Target, Play, Clock } from 'lucide-react';
import type { Goal } from '../../types';

export const GoalsPanel = ({ goals = [], activeSession, onStartSession, onCompleteActiveSession, onCancelActiveSession, showKnowledgeCheck, setShowKnowledgeCheck }: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="game-title">Quest Board</h1>
        <p className="game-body" style={{ marginTop: '8px' }}>Select an active target to earn XP and rewards.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        
        {/* Left: Available Quests */}
        <div className="game-panel">
          <h2 className="game-section-title">Available Quests</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {goals.filter((g: any) => g.status !== 'COMPLETED').map((goal: any) => (
              <div key={goal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <div>
                  <h3 className="game-card-title">{goal.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 700, marginTop: '4px' }}>Reward: {goal.priority === 'High' ? '150' : '50'} XP</div>
                </div>
                {!activeSession && (
                  <button className="game-btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => onStartSession?.(goal)}>
                    <Play size={16} /> Accept
                  </button>
                )}
              </div>
            ))}
            {goals.length === 0 && <div className="game-body">No quests available.</div>}
          </div>
        </div>

        {/* Right: Active Target */}
        <div className="game-panel" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
          <h2 className="game-section-title">Active Target</h2>
          {activeSession ? (
            <div style={{ textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Target size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
              <h3 className="game-card-title" style={{ marginBottom: '16px' }}>{activeSession.goalTitle}</h3>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} /> In Progress
              </div>
              
              {showKnowledgeCheck ? (
                <div style={{ width: '100%' }}>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '12px' }}>Knowledge Check Ready</h4>
                  <button className="game-btn-primary" onClick={onCompleteActiveSession} style={{ width: '100%' }}>Claim Reward</button>
                </div>
              ) : (
                <button className="game-btn-primary" style={{ width: '100%', background: 'var(--accent-blue)' }} onClick={() => setShowKnowledgeCheck(true)}>Complete Objective</button>
              )}
              <button onClick={onCancelActiveSession} style={{ background: 'transparent', border: '1px solid #FC8181', color: '#E53E3E', padding: '10px 16px', borderRadius: '10px', marginTop: '16px', width: '100%', cursor: 'pointer', fontWeight: 600 }}>Abandon Quest</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>
              <Target size={48} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
              <div className="game-body">No active target selected.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};