import React from 'react';
import { Folder, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ size = 24, color = "currentColor", ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const card = {
  background: '#fff',
  borderRadius: '20px',
  border: '1px solid rgba(140, 135, 125, 0.12)',
  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
  overflow: 'hidden'
} as const;

const sectionTitle = {
  fontSize: '0.85rem',
  fontWeight: 800 as const,
  color: '#5A5750',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const ProjectsPanel = ({ 
  projects = [], 
  onSelectProject, 
  onSyncGithub,
  isSyncingGithub,
  githubMessage,
  githubConnected,
  onConnectGithub
}: any) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        ...card, padding: '48px', position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #FFFBEB 100%)',
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
              Workshop & Inventions
            </div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Your Projects
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#5A5750', lineHeight: 1.6, margin: '0 0 32px' }}>
              Build, track, and deploy your creations. Turn your ideas into experience points.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {githubConnected ? (
              onSyncGithub && (
                <button
                  onClick={onSyncGithub}
                  disabled={isSyncingGithub}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: isSyncingGithub ? '#E2E8F0' : '#1E293B',
                    color: isSyncingGithub ? '#94A3B8' : '#fff',
                    border: 'none', borderRadius: '12px', padding: '12px 20px',
                    fontSize: '0.95rem', fontWeight: 700, cursor: isSyncingGithub ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSyncingGithub ? 'none' : '0 4px 12px rgba(30, 41, 59, 0.15)'
                  }}
                >
                  {isSyncingGithub ? <RefreshCw size={18} className="spin" /> : <GithubIcon size={18} />}
                  {isSyncingGithub ? 'Syncing GitHub...' : 'Sync GitHub Repos'}
                </button>
              )
            ) : (
              <button
                onClick={onConnectGithub}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#1E293B',
                  color: '#fff',
                  border: 'none', borderRadius: '12px', padding: '12px 20px',
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)'
                }}
              >
                <GithubIcon size={18} />
                Connect GitHub
              </button>
            )}
            
            {githubMessage && (
              <div style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '200px', textAlign: 'right' }}>
                {githubMessage}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <h3 style={sectionTitle}><Folder size={16} color="#F59E0B" /> ACTIVE BLUEPRINTS</h3>
      
      {projects.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ ...card, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', minHeight: '220px', background: 'rgba(245,158,11,0.02)' }}
          >
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <GithubIcon size={32} />
            </div>
            
            {!githubConnected ? (
              <>
                <div style={{ fontWeight: 800, color: '#1E1D1B', fontSize: '1.2rem' }}>Connect GitHub to import your projects</div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#5A5750', textAlign: 'center', maxWidth: '400px' }}>
                  Link your GitHub account to automatically track your repositories, languages, and coding progress.
                </p>
                <button
                  onClick={onConnectGithub}
                  style={{ marginTop: '12px', background: '#F59E0B', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <GithubIcon size={18} /> Connect Account
                </button>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 800, color: '#1E1D1B', fontSize: '1.2rem' }}>No repositories found</div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#5A5750', textAlign: 'center', maxWidth: '400px' }}>
                  We couldn't find any repositories to sync. Create one on GitHub or click Sync to check again.
                </p>
              </>
            )}
          </motion.div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {projects.map((project: any, i: number) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => onSelectProject?.(project)}
              style={{ ...card, padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(245,158,11,0.15)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; e.currentTarget.style.borderColor = card.border.split(' ')[2]; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1E1D1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {project.provider === 'github' && <GithubIcon size={16} color="#64748B" />}
                    {project.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: project.status === 'COMPLETED' ? '#3EA354' : '#F59E0B', textTransform: 'uppercase', fontWeight: 800, padding: '4px 8px', background: project.status === 'COMPLETED' ? 'rgba(62,163,84,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
                    {project.status === 'COMPLETED' ? 'DEPLOYED' : project.status === 'PLANNING' ? 'PLANNING' : 'IN PROGRESS'}
                  </span>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245,158,11,0.08)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Folder size={20} />
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#5A5750', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(project.technologies || []).slice(0, 3).map((tech: string) => (
                  <span key={tech} style={{ background: 'rgba(140,135,125,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#5A5750', fontWeight: 700 }}>
                    {tech}
                  </span>
                ))}
                {(project.technologies?.length || 0) > 3 && <span style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#9A958C', fontWeight: 700 }}>+{project.technologies.length - 3}</span>}
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(140,135,125,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: `${project.progress || 0}%`, height: '100%', background: project.status === 'COMPLETED' ? '#3EA354' : '#F59E0B', borderRadius: '4px' }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
