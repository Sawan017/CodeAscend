import { supabase } from './supabase'

export async function getGitHubToken(): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.provider_token || null
}

export async function fetchGitHubRepos(token: string) {
  const res = await fetch('https://api.github.com/user/repos?affiliation=owner,collaborator&sort=updated', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub repos')
  return res.json()
}

export async function fetchRepoLanguages(token: string, owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch repo languages')
  return res.json()
}
