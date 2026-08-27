const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSections = \const sections: Array<{ id: SectionId; label: string; icon: typeof House }> = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'profile', label: 'Profile', icon: House },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'friends', label: 'Network', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'future', label: 'Future', icon: Compass },
  { id: 'career_world', label: 'Career World', icon: Compass },
]\;
const newSections = \const sections: Array<{ id: SectionId; label: string; icon: typeof House }> = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'learning', label: 'Learn', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'future', label: 'Future', icon: Compass },
  { id: 'career_world', label: 'Career', icon: Compass },
]\;
content = content.replace(oldSections, newSections);

const oldRoute = \                    {route.view === 'career_world' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <HUD progression={progression} completedGoals={completedGoals} masteredSkills={masteredSkills} earnedBadges={earnedBadges} />
                        <CareerWorld activeSection={route.view as SectionId} onSelectSection={selectSection} progression={progression} profile={profileState} />
                      </div>
                    )}\;
const newRoute = \                    {route.view === 'career_world' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', maxWidth: '500px' }}>
                          <Compass size={48} style={{ color: 'var(--cyan)', marginBottom: '1rem' }} />
                          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Career is under maintenance</h2>
                          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: '2rem' }}>
                            We're rebuilding this part of your journey. Something better is coming soon.
                          </p>
                          <button onClick={() => navigate({ view: 'dashboard' })} className="primary-btn" style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: '100px' }}>
                            Back to Home
                          </button>
                        </div>
                      </div>
                    )}\;
content = content.replace(oldRoute, newRoute);

fs.writeFileSync('src/App.tsx', content);
