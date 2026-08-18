import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getGitHubToken, fetchGitHubRepos, fetchRepoLanguages } from '../../lib/github'
import { upsertExternalProject } from '../../lib/api'
import type { Project } from '../../types'
import { calculateExternalProjectXP } from '../../lib/progression'

export function IntegrationsTab({ 
  projects, 
  onAddProjects,
  onAddLanguages,
  userId, 
  onAwardXp 
}: { 
  projects: Project[], 
  onAddProjects: (projects: Project[]) => void, 
  onAddLanguages: (languages: string[]) => void,
  userId: string,
  onAwardXp: (xp: number) => void
}) {
  const [githubConnected, setGithubConnected] = useState(false)
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkConnections()
  }, [])

  const checkConnections = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const githubLinked = user.app_metadata?.providers?.includes('github') || user.identities?.some(i => i.provider === 'github')
    const linkedinLinked = user.app_metadata?.providers?.includes('linkedin') || user.identities?.some(i => i.provider === 'linkedin')

    setGithubConnected(!!githubLinked)
    setLinkedinConnected(!!linkedinLinked)
  }

  const connectGitHub = async () => {
    try {
      setSyncing(true)
      const { supabase } = await import('../../lib/supabase')
      if (!supabase) throw new Error('Supabase not configured')

      const { error } = await supabase.auth.linkIdentity({
        provider: 'github'
      })

      if (error) throw error

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) throw new Error('Could not refresh session for GitHub token')

      const token = sessionData.session.provider_token
      if (!token) throw new Error('GitHub provider token missing. Try disconnecting and reconnecting.')

      const { fetchGitHubRepos, fetchRepoLanguages } = await import('../../lib/github')
      const { upsertExternalProject } = await import('../../lib/api')
      const { calculateExternalProjectXP } = await import('../../lib/progression')

      const repos = await fetchGitHubRepos(token)

      let totalXpGained = 0

      const newProjects: import('../../types').Project[] = []
      const allNewLanguages = new Set<string>()

      for (const repo of repos) {
        if (repo.fork) continue // Skip forks to avoid noise

        const externalId = repo.id.toString()
        const existingExternal = projects.find(p => p.provider === 'github' && p.externalId === externalId)

        const languages = await fetchRepoLanguages(token, repo.owner.login, repo.name)
        const techList = Object.keys(languages).slice(0, 5) // top 5 languages
        techList.forEach(l => allNewLanguages.add(l))

        // Save to external_projects table to track XP cleanly
        const record = await upsertExternalProject({
          user_id: userId,
          provider: 'github',
          external_id: externalId,
          status: (existingExternal?.status === 'COMPLETED') ? 'completed' : 'in_progress', // Preserve completed status
          xp_awarded: 0, // This is a placeholder, real DB state handled next
          metadata: { repo, languages }
        })

        // Determine XP to award
        const targetXp = calculateExternalProjectXP(record.status as 'in_progress' | 'completed', record.xp_awarded)
        if (targetXp > 0) {
          totalXpGained += targetXp
          await upsertExternalProject({
            ...record,
            xp_awarded: record.xp_awarded + targetXp
          })
        }

        if (!existingExternal) {
          newProjects.push({
            id: crypto.randomUUID(),
            name: repo.name,
            description: repo.description || 'GitHub Repository',
            image: '',
            technologies: techList,
            status: 'BUILDING',
            progress: 0,
            github: repo.html_url,
            demo: repo.homepage || '',
            features: [],
            whatILearned: [],
            provider: 'github',
            externalId: externalId,
            syncDate: new Date().toISOString()
          })
        }
      }

      if (newProjects.length > 0) {
        onAddProjects(newProjects)
      }

      if (allNewLanguages.size > 0) {
        onAddLanguages(Array.from(allNewLanguages))
      }

      if (totalXpGained > 0) {
        onAwardXp(totalXpGained)
      }

      setMessage(`Sync complete: ${newProjects.length} imported.`)

    } catch (err: any) {
      setMessage('Error connecting GitHub: ' + err.message)
    } finally {
      setSyncing(false)
    }
  }

  const connectLinkedIn = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.linkIdentity({ provider: 'linkedin_oidc' })
    if (error) setMessage('Failed to connect LinkedIn: ' + error.message)
    else checkConnections()
  }

  const syncGitHubProjects = async () => {
    setSyncing(true)
    setMessage('Connecting to GitHub...')
    try {
      const token = await getGitHubToken()
      if (!token) {
        setMessage('GitHub session expired. Please reconnect.')
        setSyncing(false)
        return
      }

      setMessage('Fetching repositories...')
      const repos = await fetchGitHubRepos(token)

      let importedCount = 0
      let updatedCount = 0
      let totalXpGained = 0

      const newProjects: Project[] = []
      const allNewLanguages = new Set<string>()

      for (const repo of repos) {
        if (repo.fork) continue // Skip forks to avoid noise

        const externalId = repo.id.toString()
        const existingExternal = projects.find(p => p.provider === 'github' && p.externalId === externalId)

        const languages = await fetchRepoLanguages(token, repo.owner.login, repo.name)
        const techList = Object.keys(languages).slice(0, 5) // top 5 languages
        techList.forEach(l => allNewLanguages.add(l))

        // Save to external_projects table to track XP cleanly
        const record = await upsertExternalProject({
          user_id: userId,
          provider: 'github',
          external_id: externalId,
          status: (existingExternal?.status === 'COMPLETED') ? 'completed' : 'in_progress', // Preserve completed status
          xp_awarded: 0, // This is a placeholder, real DB state handled next
          metadata: { repo, languages }
        })

        // Determine XP to award
        const targetXp = calculateExternalProjectXP(record.status as 'in_progress' | 'completed', record.xp_awarded)
        if (targetXp > 0) {
          totalXpGained += targetXp
          await upsertExternalProject({
            ...record,
            xp_awarded: record.xp_awarded + targetXp
          })
        }

        if (!existingExternal) {
          newProjects.push({
            id: crypto.randomUUID(),
            name: repo.name,
            description: repo.description || 'GitHub Repository',
            image: '',
            technologies: techList,
            status: 'BUILDING',
            progress: 0,
            github: repo.html_url,
            demo: repo.homepage || '',
            features: [],
            whatILearned: [],
            provider: 'github',
            externalId: externalId,
            syncDate: new Date().toISOString()
          })
          importedCount++
        } else {
          updatedCount++
        }
      }

      if (newProjects.length > 0) {
        onAddProjects(newProjects)
      }

      if (allNewLanguages.size > 0) {
        onAddLanguages(Array.from(allNewLanguages))
      }

      if (totalXpGained > 0) {
        onAwardXp(totalXpGained)
      }

      setMessage(`Sync complete: ${newProjects.length} imported, ${repos.length - newProjects.length} updated.`)

    } catch (err: any) {
      setMessage('Error syncing GitHub: ' + err.message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'white' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0' }}>Connected Accounts</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Connect external accounts to import your real-world projects and verify your profile.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* GitHub */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                GitHub {githubConnected && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>? Connected</span>}
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Import your repositories as projects.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!githubConnected ? (
                <button className="primary-btn" onClick={connectGitHub}>Connect GitHub</button>
              ) : (
                <button className="secondary-btn" onClick={syncGitHubProjects} disabled={syncing}>
                  {syncing ? 'Syncing...' : 'Sync Projects'}
                </button>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                LinkedIn {linkedinConnected && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>? Verified</span>}
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verify your professional identity.</p>
            </div>
            <div>
              {!linkedinConnected ? (
                <button className="primary-btn" onClick={connectLinkedIn}>Connect LinkedIn</button>
              ) : (
                <button className="secondary-btn" disabled>Connected</button>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
