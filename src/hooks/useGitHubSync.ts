import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Project } from '../types'

export function useGitHubSync(
  userId: string | undefined,
  projects: Project[],
  onAddProjects?: (projects: Project[]) => void,
  onUpdateProjects?: (projects: Project[]) => void,
  onAddLanguages?: (languages: string[]) => void,
  onAddEvidences?: (evidences: any[]) => void
) {
  const [syncingGithub, setSyncingGithub] = useState(false)
  const [githubMessage, setGithubMessage] = useState('')

  const syncGitHubProjects = async () => {
    if (!userId) {
      setGithubMessage('User not logged in.')
      return
    }
    setSyncingGithub(true)
    setGithubMessage('Connecting to GitHub...')
    try {
      const { getGitHubToken, fetchGitHubRepos, fetchRepoLanguages } = await import('../lib/github')
      const { upsertExternalProject } = await import('../lib/api')

      const token = await getGitHubToken()
      if (!token) {
        setGithubMessage('GitHub token missing. Please click "Connect GitHub" in settings to authorize GitHub API access.')
        setSyncingGithub(false)
        return
      }

      setGithubMessage('Fetching repositories...')
      const repos = await fetchGitHubRepos(token)

      let importedCount = 0
      let updatedCount = 0

      const newProjects: Project[] = []
      const updatedProjects: Project[] = []
      const allNewLanguages = new Set<string>()
      const allEvidences: any[] = []

      const genuinelyNewCount = repos.filter((repo: any) => !repo.fork && !projects?.find(p => p.provider === 'github' && p.externalId === repo.id.toString())).length
      
      if (genuinelyNewCount > 0) {
        setGithubMessage('Verifying rate limits...')
        const { data: rlData, error: rlError } = await supabase!.rpc('preview_rate_limit', {
          p_key: userId + ':create_project',
          p_limit: 10,
          p_cost: genuinelyNewCount
        })

        if (rlError) {
          setGithubMessage('Rate limit check failed. Please try again.')
          setSyncingGithub(false)
          return
        }

        if (rlData && !rlData.allowed) {
          const secs = rlData.retry_after || 3600
          const time = secs > 60 ? `${Math.floor(secs/60)}m ${secs%60}s` : `${secs}s`
          setGithubMessage(`Rate limit exceeded: You can import up to 10 new projects per hour. Please try again in ${time}.`)
          setSyncingGithub(false)
          return
        }
      }

      for (const repo of repos) {
        if (repo.fork) continue

        const externalId = repo.id.toString()
        const existingExternal = projects?.find(p => p.provider === 'github' && p.externalId === externalId)

        const languages = await fetchRepoLanguages(token, repo.owner.login, repo.name)
        const techList = Object.keys(languages).slice(0, 5)
        techList.forEach(l => allNewLanguages.add(l))

        const { analyzeRepository } = await import('../lib/github-analyzer')
        const analysis = await analyzeRepository(repo.owner.login, repo.name, token)
        allEvidences.push(...analysis.evidences)

        await upsertExternalProject({
          user_id: userId!,
          provider: 'github',
          external_id: externalId,
          status: existingExternal?.status === 'COMPLETED' ? 'completed' : 'in_progress',
          xp_awarded: undefined, 
          metadata: { repo, languages, analysis }
        })

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
            syncDate: new Date().toISOString(),
            evidences: analysis.evidences
          })
          importedCount++
        } else {
          updatedCount++
          const updatedProj = {
             ...existingExternal,
             evidences: analysis.evidences,
             syncDate: new Date().toISOString()
          };
          updatedProjects.push(updatedProj);
        }
      }

      if (newProjects.length > 0 && onAddProjects) {
        onAddProjects(newProjects)
      }
      
      if (updatedProjects.length > 0 && onUpdateProjects) {
        onUpdateProjects(updatedProjects)
      }

      if (allNewLanguages.size > 0 && onAddLanguages) {
        onAddLanguages(Array.from(allNewLanguages))
      }

      if (allEvidences.length > 0 && onAddEvidences) {
        onAddEvidences(allEvidences)
      }

      setGithubMessage(`Sync complete: ${newProjects.length} imported, ${updatedCount} updated.`)

    } catch (err: any) {
      if (err.message?.includes('401') || err.status === 401 || err.message?.includes('Bad credentials')) {
        setGithubMessage('GitHub token expired. Please reconnect.')
      } else {
        setGithubMessage('Error syncing GitHub: ' + err.message)
      }
    } finally {
      setSyncingGithub(false)
    }
  }

  return { syncGitHubProjects, syncingGithub, githubMessage }
}
