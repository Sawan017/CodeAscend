import fs from 'fs';

let content = fs.readFileSync('src/features/settings/SettingsDrawer.tsx', 'utf8');

// Remove IntegrationsTab import
content = content.replace(/import \{ IntegrationsTab \} from '\.\/IntegrationsTab'\n/, '');

// Remove integrations from TABS array
content = content.replace(/  \{ id: 'integrations', label: 'Integrations', icon: Globe \},\n/, '');
content = content.replace(/ \| 'integrations'/, '');

// Remove integrations case in renderTabContent
content = content.replace(/      case 'integrations':\n        return <IntegrationsTab [^\n]+\/>\n/, '');

const state_vars = `
  const [githubConnected, setGithubConnected] = useState(false)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)
  const [syncingGithub, setSyncingGithub] = useState(false)
  const [githubMessage, setGithubMessage] = useState('')

  useEffect(() => {
    checkGithubConnection()
  }, [])

  const checkGithubConnection = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const githubLinked = user.app_metadata?.providers?.includes('github') || user.identities?.some(i => i.provider === 'github')
    setGithubConnected(!!githubLinked)

    if (githubLinked) {
      const githubIdentity = user.identities?.find(i => i.provider === 'github')
      if (githubIdentity) {
        setGithubUsername(githubIdentity.identity_data?.user_name || githubIdentity.identity_data?.preferred_username || 'Connected')
      } else {
        setGithubUsername('Connected')
      }
    }
  }

  const connectGitHub = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.linkIdentity({ provider: 'github' })
    if (error) setGithubMessage('Failed to connect GitHub: ' + error.message)
  }

  const syncGitHubProjects = async () => {
    setSyncingGithub(true)
    setGithubMessage('Connecting to GitHub...')
    try {
      const { getGitHubToken, fetchGitHubRepos, fetchRepoLanguages } = await import('../../lib/github')
      const { upsertExternalProject } = await import('../../lib/api')

      const token = await getGitHubToken()
      if (!token) {
        setGithubMessage('GitHub session expired. Please reconnect.')
        setSyncingGithub(false)
        return
      }

      setGithubMessage('Fetching repositories...')
      const repos = await fetchGitHubRepos(token)

      let importedCount = 0
      let updatedCount = 0

      const newProjects: import('../../types').Project[] = []
      const allNewLanguages = new Set<string>()

      for (const repo of repos) {
        if (repo.fork) continue

        const externalId = repo.id.toString()
        const existingExternal = projects?.find(p => p.provider === 'github' && p.externalId === externalId)

        const languages = await fetchRepoLanguages(token, repo.owner.login, repo.name)
        const techList = Object.keys(languages).slice(0, 5)
        techList.forEach(l => allNewLanguages.add(l))

        const record = await upsertExternalProject({
          user_id: userId!,
          provider: 'github',
          external_id: externalId,
          status: existingExternal?.status === 'COMPLETED' ? 'completed' : 'in_progress',
          xp_awarded: existingExternal ? 150 : 0, 
          metadata: { repo, languages }
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
            syncDate: new Date().toISOString()
          })
          importedCount++
        } else {
          updatedCount++
        }
      }

      if (newProjects.length > 0 && onAddProjects) {
        onAddProjects(newProjects)
      }

      if (allNewLanguages.size > 0 && onAddLanguages) {
        onAddLanguages(Array.from(allNewLanguages))
      }

      setGithubMessage("Sync complete: " + newProjects.length + " imported, " + (repos.length - newProjects.length) + " updated.")

    } catch (err: any) {
      setGithubMessage('Error syncing GitHub: ' + err.message)
    } finally {
      setSyncingGithub(false)
    }
  }
`;

content = content.replace("  const [activeTab, setActiveTab] = useState<TabId>('account')", "  const [activeTab, setActiveTab] = useState<TabId>('account')\n" + state_vars);

const old_connected_accounts_html = `                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff' }}>Connected Accounts</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{authUserEmail ? 'Google' : 'None'}</span>
                </div>
              </div>
            </div>`;

const new_connected_accounts_html = `                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff' }}>Connected Accounts</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{authUserEmail ? 'Google' : 'None'}</span>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Connected External Accounts</h4>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1rem' }}>GitHub</h5>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {githubConnected ? "✓ Connected (" + githubUsername + ")" : '— Not connected'}
                  </p>
                </div>
                <div>
                  {!githubConnected ? (
                    <button className="primary-btn" onClick={connectGitHub}>Connect GitHub</button>
                  ) : (
                    <button className="secondary-btn" onClick={syncGitHubProjects} disabled={syncingGithub}>
                      {syncingGithub ? 'Syncing...' : 'Sync Projects'}
                    </button>
                  )}
                </div>
              </div>
              
              {githubMessage && (
                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {githubMessage}
                </div>
              )}
            </div>`;

content = content.replace(old_connected_accounts_html, new_connected_accounts_html);

fs.writeFileSync('src/features/settings/SettingsDrawer.tsx', content);
