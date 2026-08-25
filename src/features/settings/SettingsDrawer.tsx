import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, X, Mail, Shield, CheckCircle, Trash2, AlertTriangle, 
  UserCircle, Palette, Bell, Lock, Globe, HardDrive, HelpCircle
} from 'lucide-react'
import type { Settings, ThemeMode, UserProfile } from '../../types'
import { PrivacyModals } from './PrivacyModals'
import { HelpCenterModal } from './HelpCenterModal'
import { SubmitFeedbackModal } from './SubmitFeedbackModal'
import { UserSupportTickets } from '../support/UserSupportTickets'
import { formatAppDateTime } from '../../lib/dateFormatting'
import { supabase } from '../../lib/supabase'



function LiveSettingsClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      bottom: '1rem',
      right: '1.5rem',
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      opacity: 0.8,
      pointerEvents: 'none',
      userSelect: 'none',
      background: 'var(--bg-surface-sunken)',
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 10
    }}>
      {formatAppDateTime(now)}
    </div>
  )
}

type SettingsDrawerProps = {
  open: boolean
  onClose: () => void
  settings: Settings
  onSettingsChange: (next: Settings) => void
  onSignOut?: (forgetAccount: boolean) => void
  profile: UserProfile
  userId?: string
  chatState?: import('../../types').ChatState
  onChatStateChange?: (c: import('../../types').ChatState) => void
  projects?: import('../../types').Project[]
  onAddProjects?: (projects: import('../../types').Project[]) => void
  onUpdateProjects?: (projects: import('../../types').Project[]) => void
  onAddLanguages?: (languages: string[]) => void
  onAddEvidences?: (evidences: import('../../lib/github-analyzer.ts').ConceptEvidence[]) => void
  onRemoveGithubData?: () => void
}

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'aurora', label: 'Aurora' },
]

type TabId = 'account' | 'profile' | 'appearance' | 'notifications' | 'privacy' | 'language' | 'data' | 'help'

const TABS: Array<{ id: TabId, label: string, icon: any }> = [
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'profile', label: 'Profile & Personalization', icon: UserCircle },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Lock },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'data', label: 'Data & Storage', icon: HardDrive },
  { id: 'help', label: 'Help & About', icon: HelpCircle },
]

import { LegalModal } from './LegalModal'
import { privacyPolicyText, termsOfServiceText } from './legalText'

export function SettingsDrawer({ open, onClose, settings, onSettingsChange, onSignOut, profile, userId, chatState, onChatStateChange, projects, onAddProjects, onUpdateProjects, onAddLanguages, onAddEvidences, onRemoveGithubData }: SettingsDrawerProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false)
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState<{ isOpen: boolean, type: 'tos' | 'privacy' }>({ isOpen: false, type: 'privacy' })
  const [activeTab, setActiveTab] = useState<TabId>('account')
  const [socialUpdating, setSocialUpdating] = useState<string | null>(null)
  const [socialError, setSocialError] = useState<string | null>(null)

  const handleSocialSettingChange = async (key: string, value: string, relatedKey?: string, relatedValue?: any) => {
    if (!userId || !supabase) return
    setSocialError(null)
    setSocialUpdating(key)
    const previousSettings = { ...settings }
    
    const newSettings = { ...settings, [key]: value }
    if (relatedKey) {
      (newSettings as any)[relatedKey] = relatedValue
    }
    
    // Optimistic update
    onSettingsChange(newSettings)
    
    try {
      const { error } = await supabase.from('profiles').update({ data: newSettings }).eq('user_id', userId).eq('key', 'settings')
      if (error) throw error
    } catch (err: any) {
      setSocialError('Failed to save settings. Reverting...')
      onSettingsChange(previousSettings)
      setTimeout(() => setSocialError(null), 3000)
    } finally {
      setSocialUpdating(null)
    }
  }

  
  const [githubConnected, setGithubConnected] = useState(false)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)
  const [syncingGithub, setSyncingGithub] = useState(false)
  const [githubMessage, setGithubMessage] = useState('')



  useEffect(() => {
    if (open) {
      checkGithubConnection()
    }
    
    if (!supabase) return
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth Trace] SettingsDrawer onAuthStateChange:', event, 'Session:', session?.user?.id)
      if (open && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        console.log('[Auth Trace] Triggering checkGithubConnection from event:', event)
        checkGithubConnection()
      }
    })

    // Auto-sync if requested from URL
    if (open && window.location.search.includes('sync=github')) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.delete('sync')
      const newSearch = searchParams.toString() ? '?' + searchParams.toString() : ''
      window.history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash)
      // Small delay to ensure state and tokens are flushed
      setTimeout(() => {
        syncGitHubProjects()
      }, 500)
    }

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [open])

  const checkGithubConnection = async () => {
    if (!supabase) return
    const wasPending = sessionStorage.getItem('github_link_pending') === 'true'
    
    // Check for explicit OAuth errors captured by App.tsx
    const oauthError = sessionStorage.getItem('github_oauth_error')
    if (oauthError) {
      sessionStorage.removeItem('github_oauth_error')
      sessionStorage.removeItem('github_link_pending')
      setGithubMessage('GitHub connection failed: ' + oauthError + '. If it says the identity is already linked, please log into the old account and disconnect it first.')
      return
    }

    if (wasPending) {
      sessionStorage.removeItem('github_link_pending')
      console.log('[GitHub OAuth] Link was pending — fetching latest session and user data...')
      
      // If we're returning from a PKCE flow, supabase._initialize is currently exchanging the code.
      // Calling refreshSession concurrently will break the PKCE flow.
      const hasCode = window.location.search.includes('code=')
      
      if (hasCode) {
         console.log('[GitHub OAuth] URL contains PKCE code. Waiting for exchangeCodeForSession instead of forcing refresh.')
         // We don't force a refresh here, we let the onAuthStateChange listener handle the update when it completes.
      } else {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          console.warn('[GitHub OAuth] No session found after OAuth return — session may not have been migrated yet')
        } else {
          // It's implicit flow or no code, safe to refresh
          const { error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            console.warn('[GitHub OAuth] Session refresh warning:', refreshError.message)
          }
        }
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      if (wasPending) {
        setGithubMessage('Could not verify GitHub connection — session expired. Please sign in again.')
      }
      return
    }

    console.log('[GitHub OAuth] checkGithubConnection:', 'identities:', user.identities, 'app_metadata:', user.app_metadata, 'wasPending:', wasPending)

    const githubLinked = user.app_metadata?.providers?.includes('github') || user.identities?.some(i => i.provider === 'github')
    setGithubConnected(!!githubLinked)

    if (githubLinked) {
      const githubIdentity = user.identities?.find(i => i.provider === 'github')
      if (githubIdentity) {
        setGithubUsername(githubIdentity.identity_data?.user_name || githubIdentity.identity_data?.preferred_username || 'Connected')
      } else {
        setGithubUsername('Connected')
      }
      if (wasPending) {
        setGithubMessage('')
      }
    } else if (wasPending && !window.location.search.includes('code=')) {
      setGithubMessage('GitHub connection failed. The identity may still be linked to a deleted account. Try again, or revoke access in GitHub Settings first.')
    }
  }

  const connectGitHub = async (autoSync: boolean = false) => {
    if (!supabase) return
    
    // Verify we have a valid AND UNEXPIRED Supabase session BEFORE attempting linkIdentity.
    // linkIdentity requires an authenticated session (valid Bearer JWT).
    // If the token is expired, Supabase API will return "This endpoint requires a valid Bearer token".
    const { data: { session } } = await supabase.auth.getSession()
    
    // Check if missing or expired (buffer of 60 seconds)
    const isExpired = session ? (session.expires_at ? session.expires_at < (Date.now() / 1000) + 60 : false) : true;
    
    if (!session || isExpired) {
      console.warn('[GitHub OAuth] Session missing or expired. Forcing refresh before linkIdentity...')
      const { data: refreshData, error: refreshErr } = await supabase.auth.refreshSession()
      if (refreshErr || !refreshData.session) {
        console.error('[GitHub OAuth] Session refresh failed:', refreshErr?.message)
        setGithubMessage('Session expired. Please sign out and sign back in before connecting GitHub.')
        return
      }
    }
    
    console.log(`[GitHub OAuth] Initiating ${githubConnected ? 'signInWithOAuth' : 'linkIdentity'} for github`)
    
    // Set pending flag BEFORE the redirect so that on return,
    // checkGithubConnection() knows to refresh the session first.
    sessionStorage.setItem('github_link_pending', 'true')

    const options = {
      redirectTo: window.location.origin + '?settings=account' + (autoSync ? '&sync=github' : '')
    }

    const { data, error } = githubConnected 
      ? await supabase.auth.signInWithOAuth({ provider: 'github', options })
      : await supabase.auth.linkIdentity({ provider: 'github', options })
      
    console.log('[GitHub OAuth] OAuth initiation response:', data, error)
    if (error) {
      sessionStorage.removeItem('github_link_pending')
      setGithubMessage('Failed to connect GitHub: ' + error.message)
    }
  }

  const syncGitHubProjects = async () => {
    setSyncingGithub(true)
    setGithubMessage('Connecting to GitHub...')
    try {
      const { getGitHubToken, fetchGitHubRepos, fetchRepoLanguages } = await import('../../lib/github')
      const { upsertExternalProject } = await import('../../lib/api')

      const token = await getGitHubToken()
      if (!token) {
        setGithubMessage('GitHub token missing. Please click "Connect GitHub" to authorize GitHub API access.')
        setSyncingGithub(false)
        return
      }

      setGithubMessage('Fetching repositories...')
      const repos = await fetchGitHubRepos(token)

      let importedCount = 0
      let updatedCount = 0

      const newProjects: import('../../types').Project[] = []
      const updatedProjects: import('../../types').Project[] = []
      const allNewLanguages = new Set<string>()
      const allEvidences: import('../../lib/github-analyzer.ts').ConceptEvidence[] = []

      // Identify genuinely new projects first
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

        const { analyzeRepository } = await import('../../lib/github-analyzer.ts')
        const analysis = await analyzeRepository(repo.owner.login, repo.name, token)
        allEvidences.push(...analysis.evidences)

        await upsertExternalProject({
          user_id: userId!,
          provider: 'github',
          external_id: externalId,
          status: existingExternal?.status === 'COMPLETED' ? 'completed' : 'in_progress',
          xp_awarded: undefined, // Let the backend trigger or API handle preserving it
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

      setGithubMessage(`Sync complete: ${newProjects.length} imported, ${repos.length - newProjects.length} updated.`)

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

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRemoveGithubDialog, setShowRemoveGithubDialog] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showUserTickets, setShowUserTickets] = useState(false)
  
  const disconnectGitHub = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const githubIdentity = user.identities?.find(i => i.provider === 'github')
    if (githubIdentity) {
      const { error } = await supabase.auth.unlinkIdentity(githubIdentity)
      if (error) {
         setGithubMessage('Failed to disconnect: ' + error.message)
         return
      }
    }
    
    setGithubConnected(false)
    setGithubUsername(null)
    setGithubMessage('GitHub account disconnected.')
    setShowRemoveGithubDialog(false)
    
    if (onRemoveGithubData) {
      onRemoveGithubData()
    }
  }
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  
  const [cacheSize, setCacheSize] = useState('0 B')
  const [showCacheDialog, setShowCacheDialog] = useState(false)
  const [clearSuccess, setClearSuccess] = useState(false)

  const calculateCacheSize = () => {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('futureme-') && !key.includes('force-chooser')) {
        const item = localStorage.getItem(key)
        if (item) {
          total += (key.length + item.length) * 2 // approx in bytes
        }
      }
    }
    if (total === 0) return '0 B'
    if (total < 1024) return `${total} B`
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`
    return `${(total / (1024 * 1024)).toFixed(1)} MB`
  }

  useEffect(() => {
    if (open) setCacheSize(calculateCacheSize())
  }, [open])

  const handleExportData = async () => {
    if (!userId) return
    setIsExporting(true)
    setExportError(null)
    setExportSuccess(false)
    try {
      if (!supabase) throw new Error('Database not configured')
      const { data, error } = await supabase.rpc('export_user_data')
      if (error) throw new Error(error.message)
      if (!data) throw new Error('Failed to fetch account data')
      
      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `Arinova-account-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (err: any) {
      setExportError(err.message || 'Export failed')
      setTimeout(() => setExportError(null), 3000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearCacheConfirm = () => {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('futureme-') && !key.includes('force-chooser')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
    setCacheSize(calculateCacheSize())
    setShowCacheDialog(false)
    setClearSuccess(true)
    setTimeout(() => setClearSuccess(false), 3000)
  }

  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null)
  const [isLinkingEmail, setIsLinkingEmail] = useState(false)
  const [linkEmailError, setLinkEmailError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !open) return
    const sb = supabase

    const isDummyEmail = (email?: string | null) => {
      if (!email) return true
      if (email.includes('@example.com')) return true
      if (email.includes('@internal.arinova.com')) return true
      if (email.includes('...temp...')) return true
      if (email.startsWith('id_')) return true
      return false
    }

    const detectLinkedEmail = async () => {
      // Try getUser() first — this makes an authenticated API call that returns
      // the full user object including identities.
      const { data: { user }, error } = await sb.auth.getUser()
      
      if (!error && user) {
        // Check for a Google identity first (most reliable for linked accounts)
        const googleIdentity = user.identities?.find(id => id.provider === 'google')
        if (googleIdentity?.identity_data?.email) {
          setAuthUserEmail(googleIdentity.identity_data.email)
          return
        }
        // Fallback: check the user's primary email
        if (!isDummyEmail(user.email)) {
          setAuthUserEmail(user.email!)
          return
        }
      }

      // Fallback: try getSession() which reads from local storage
      // This handles the case where getUser() fails due to session timing
      const { data: { session } } = await sb.auth.getSession()
      if (session?.user) {
        const googleIdentity = session.user.identities?.find(id => id.provider === 'google')
        if (googleIdentity?.identity_data?.email) {
          setAuthUserEmail(googleIdentity.identity_data.email)
          return
        }
        if (!isDummyEmail(session.user.email)) {
          setAuthUserEmail(session.user.email!)
          return
        }
      }

      setAuthUserEmail(null)
    }

    detectLinkedEmail()
  }, [open, profile])

  const handleLinkEmail = async () => {
    if (!supabase) return
    setIsLinkingEmail(true)
    setLinkEmailError(null)

    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    
    setIsLinkingEmail(false)
    if (error) {
      setLinkEmailError(error.message)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      // Clean up storage attachments via the frontend Storage API
      try {
        const { data: files } = await supabase!.storage.from('support_attachments').list(userId)
        if (files && files.length > 0) {
          const filePaths = files.map(f => `${userId}/${f.name}`)
          await supabase!.storage.from('support_attachments').remove(filePaths)
        }
      } catch (err) {
        console.warn('Non-fatal: could not clean up storage attachments', err)
      }

      const { error } = await supabase!.rpc('delete_user_account')
      
      if (error) {
        setDeleteError(error.message)
      } else {
        await supabase!.auth.signOut()
        window.location.reload()
      }
    } catch (err: any) {
      setDeleteError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const renderTabContent = () => {
    if (showUserTickets) return <UserSupportTickets userId={userId || ''} onBack={() => setShowUserTickets(false)} />
    switch (activeTab) {

      case 'account':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Account</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Manage your core account identity and recovery options.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>Secure Your Account</h5>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Your permanent User ID never changes. Adding an email lets you recover and access your account on other devices.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Permanent User ID</span>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-sunken)', borderRadius: '8px', color: 'var(--text-main)', border: '1px solid var(--border)', fontSize: '1rem', fontWeight: 500 }}>
                  {profile.login_id || profile.arinova_id || profile.username}
                </div>
              </div>

              {authUserEmail ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-strong)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={18} color="#10b981" />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Linked Email</p>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{authUserEmail}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your account is not secured with an email yet.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="primary-btn" 
                      onClick={handleLinkEmail} 
                      disabled={isLinkingEmail}
                      style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: isLinkingEmail ? 'not-allowed' : 'pointer' }}
                    >
                      <Mail size={16} />
                      {isLinkingEmail ? 'Connecting...' : 'Add Email'}
                    </button>
                  </div>
                  {linkEmailError && (
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem' }}>
                      {linkEmailError}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Display Name</h4>
              <input type="text" disabled value={profile.username} style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', outline: 'none' }} />
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Display name changes are managed in your Profile Panel.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Account Recovery & Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Account Status</span>
                  <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500 }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Connected Accounts</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{authUserEmail ? 'Google' : 'None'}</span>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Connected External Accounts</h4>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '1rem' }}>GitHub</h5>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {githubConnected ? (
                      <>
                        ✓ Connected ({githubUsername})
                        <button 
                          onClick={() => setShowRemoveGithubDialog(true)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.1rem', marginLeft: '0.25rem' }}
                          title="Remove GitHub account"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : '✗ Not connected'}
                  </p>
                </div>
                <div>
                  {!githubConnected ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <button className="primary-btn" onClick={() => connectGitHub()}>Connect GitHub</button>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '250px', textAlign: 'right', lineHeight: '1.4' }}>
                        Connecting will redirect you to authorize read-only access to your public repository metadata (names, descriptions, and language statistics) for import.
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="secondary-btn" onClick={syncGitHubProjects} disabled={syncingGithub}>
                        {syncingGithub ? 'Syncing...' : 'Sync Projects'}
                      </button>
                      {githubMessage?.includes('expired') && (
                        <button className="primary-btn" onClick={() => connectGitHub()}>Reconnect</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {githubMessage && (
                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {githubMessage}
                </div>
              )}
            </div>

            {onSignOut && (
              <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Sign Out</h5>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sign out of your current session.</p>
                </div>
                <button 
                  onClick={() => setShowLogoutDialog(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )
      
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Profile & Personalization</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Customize how you appear to other users.</p>
            </div>
            
            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Visibility</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Profile visibility</span>
                  <select 
                    value={settings.profileVisibility || 'public'}
                    onChange={(e) => onSettingsChange({ ...settings, profileVisibility: e.target.value as 'public' | 'private' | 'friends' })}
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-muted)', outline: 'none' }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Show online status</span>
                  <button 
                    className={`toggle-switch ${settings.showOnlineStatus !== false ? 'on' : ''}`}
                    onClick={() => onSettingsChange({ ...settings, showOnlineStatus: settings.showOnlineStatus === false })}
                    aria-label="Toggle online status" 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Allow friend requests</span>
                  <button 
                    className={`toggle-switch ${settings.allowFriendRequests !== false ? 'on' : ''}`}
                    onClick={() => onSettingsChange({ ...settings, allowFriendRequests: settings.allowFriendRequests === false })}
                    aria-label="Toggle friend requests" 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Allow messages</span>
                  <button 
                    className={`toggle-switch ${settings.allowMessages !== false ? 'on' : ''}`}
                    onClick={() => onSettingsChange({ ...settings, allowMessages: settings.allowMessages === false })}
                    aria-label="Toggle messages" 
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Appearance</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Customize the look and feel of the application.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Theme</h4>
              <select style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }} value={settings.theme} onChange={(event) => onSettingsChange({ ...settings, theme: event.target.value as ThemeMode })}>
                {themeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            
            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Motion & Feedback</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Animations</label>
                  <select style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }} value={settings.animationIntensity} onChange={(event) => onSettingsChange({ ...settings, animationIntensity: event.target.value as Settings['animationIntensity'] })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="off">Off</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Reduced motion</span>
                  <button className={`toggle-switch ${settings.reducedMotion ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion })} aria-label="Toggle reduced motion" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Sound effects</span>
                  <button className={`toggle-switch ${settings.soundEffects ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, soundEffects: !settings.soundEffects })} aria-label="Toggle sound effects" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Notifications</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Manage when and how you are notified.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Enable All Notifications</h4>
                <button 
                  className={`toggle-switch ${settings.enableAllNotifications !== false ? 'on' : ''}`} 
                  onClick={() => onSettingsChange({ ...settings, enableAllNotifications: settings.enableAllNotifications === false ? true : false })} 
                  aria-label="Toggle all notifications" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', opacity: settings.enableAllNotifications === false ? 0.5 : 1, pointerEvents: settings.enableAllNotifications === false ? 'none' : 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Messages</span>
                  <button className={`toggle-switch ${settings.notifyMessages !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyMessages: settings.notifyMessages === false ? true : false })} aria-label="Toggle messages" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Friend requests</span>
                  <button className={`toggle-switch ${settings.notifyFriendRequests !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyFriendRequests: settings.notifyFriendRequests === false ? true : false })} aria-label="Toggle friend requests" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Group activity</span>
                  <button className={`toggle-switch ${settings.notifyGroupActivity !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyGroupActivity: settings.notifyGroupActivity === false ? true : false })} aria-label="Toggle group activity" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Mentions</span>
                  <button className={`toggle-switch ${settings.notifyMentions !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyMentions: settings.notifyMentions === false ? true : false })} aria-label="Toggle mentions" />
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Updates & Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: settings.enableAllNotifications === false ? 0.5 : 1, pointerEvents: settings.enableAllNotifications === false ? 'none' : 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Achievements & Badges</span>
                  <button className={`toggle-switch ${settings.notifyAchievements !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyAchievements: settings.notifyAchievements === false ? true : false })} aria-label="Toggle achievements" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Learning Reminders</span>
                  <button className={`toggle-switch ${settings.notifyLearningReminders !== false ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, notifyLearningReminders: settings.notifyLearningReminders === false ? true : false })} aria-label="Toggle learning reminders" />
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Delivery Methods</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Browser Notifications</span>
                  <button className={`toggle-switch ${settings.notifyBrowser ? 'on' : ''}`} onClick={async () => {
                    if (settings.notifyBrowser) {
                      onSettingsChange({ ...settings, notifyBrowser: false });
                    } else {
                      if (!('Notification' in window)) {
                        alert('Browser notifications are not supported by your browser.');
                        return;
                      }
                      if (Notification.permission === 'granted') {
                        onSettingsChange({ ...settings, notifyBrowser: true });
                      } else if (Notification.permission !== 'denied') {
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                          onSettingsChange({ ...settings, notifyBrowser: true });
                        } else {
                          onSettingsChange({ ...settings, notifyBrowser: false });
                          alert('Browser notification permission is blocked or denied.');
                        }
                      } else {
                        alert('Browser notification permission is currently blocked. Please enable it in your browser settings.');
                      }
                    }
                  }} aria-label="Toggle browser notifications" />
                {(!('Notification' in window) || ('Notification' in window && Notification.permission === 'denied')) && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '-0.5rem' }}>
                    Permission blocked. Please enable notifications in your browser settings.
                  </div>
                )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Notification Sound</span>
                  <select 
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                    value={settings.notificationSound || 'default'}
                    onChange={(e) => onSettingsChange({ ...settings, notificationSound: e.target.value })}
                  >
                    <option value="default">Default (Chime)</option>
                    <option value="pop">Pop</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Privacy & Security</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Keep your account safe and manage data privacy.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Security</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Password</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setIsPasswordModalOpen(true)}>Change</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Active Sessions</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setIsSessionsModalOpen(true)}>View Session(s)</button>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Privacy</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Blocked Users</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setIsBlockedModalOpen(true)}>
                    Manage {Array.isArray(chatState?.blockedUsers) ? `(${chatState?.blockedUsers?.length || 0})` : '(0)'}
                  </button>
                </div>
              </div>
            </div>
            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Social & Permissions</h4>
              {socialError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{socialError}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Who can send me friend requests</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {socialUpdating === 'whoCanFriendRequest' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saving...</span>}
                    <select 
                      style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                      value={settings.whoCanFriendRequest || (settings.allowFriendRequests === false ? 'none' : 'everyone')}
                      onChange={(e) => handleSocialSettingChange('whoCanFriendRequest', e.target.value, 'allowFriendRequests', e.target.value !== 'none')}
                      disabled={socialUpdating === 'whoCanFriendRequest'}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="friends_of_friends">Friends of Friends</option>
                      <option value="none">No One</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Who can message me</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {socialUpdating === 'whoCanMessage' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saving...</span>}
                    <select 
                      style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                      value={settings.whoCanMessage || (settings.allowMessages === false ? 'friends' : 'everyone')}
                      onChange={(e) => handleSocialSettingChange('whoCanMessage', e.target.value, 'allowMessages', true)}
                      disabled={socialUpdating === 'whoCanMessage'}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Who can add me to groups</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {socialUpdating === 'whoCanGroup' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saving...</span>}
                    <select 
                      style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                      value={settings.whoCanGroup || 'everyone'}
                      onChange={(e) => handleSocialSettingChange('whoCanGroup', e.target.value)}
                      disabled={socialUpdating === 'whoCanGroup'}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'language':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Language & Region</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Set your preferred language and date formats.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Localization</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Language</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                    value={settings.language || 'en-US'}
                    onChange={(e) => onSettingsChange({ ...settings, language: e.target.value })}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Region</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                    value={settings.region || 'US'}
                    onChange={(e) => onSettingsChange({ ...settings, region: e.target.value })}
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Time Zone</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                    value={settings.timezone || 'auto'}
                    onChange={(e) => onSettingsChange({ ...settings, timezone: e.target.value })}
                  >
                    <option value="auto">Automatic (Local)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (US/Canada)</option>
                    <option value="America/Chicago">Central Time (US/Canada)</option>
                    <option value="America/Denver">Mountain Time (US/Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US/Canada)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Formats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Date Format</span>
                  <select 
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                    value={settings.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => onSettingsChange({ ...settings, dateFormat: e.target.value })}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Time Format</span>
                  <select 
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                    value={settings.timeFormat || '12h'}
                    onChange={(e) => onSettingsChange({ ...settings, timeFormat: e.target.value })}
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
      case 'data':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Data & Storage</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Manage your personal data, exports, and account deletion.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Manage Data</h4>
              
              {exportError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {exportError}
                </div>
              )}
              {exportSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> Export downloaded successfully.
                </div>
              )}
              {clearSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> Local cache cleared safely.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Export Account Data</span>
                  <button 
                    className="secondary-btn" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} 
                    onClick={handleExportData}
                    disabled={isExporting}
                  >
                    {isExporting ? 'Exporting...' : 'Request Export'}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Clear Local Cache</span>
                  <button 
                    className="secondary-btn" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} 
                    onClick={() => setShowCacheDialog(true)}
                  >
                    Clear ({cacheSize})
                  </button>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'rgba(239,68,68,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Danger Zone
              </h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Deleting your account is permanent. All your profile data, learning progress, and connections will be permanently wiped.
              </p>
              <button 
                onClick={() => setShowDeleteDialog(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ef4444' }}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        )

      case 'help':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Help & About</h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Get support and view app information.</p>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Help Center</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setShowHelpCenter(true)}>Open</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>My Support Tickets</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setShowUserTickets(true)}>View</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Feedback</span>
                  <button className="secondary-btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setShowFeedbackModal(true)}>Submit</button>
                </div>
              </div>
            </div>

            <div className="drawer-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Legal & Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Terms of Service</span>
                  <button className="secondary-btn" onClick={() => setShowLegalModal({ isOpen: true, type: 'tos' })} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>Read</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>Privacy Policy</span>
                  <button className="secondary-btn" onClick={() => setShowLegalModal({ isOpen: true, type: 'privacy' })} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>Read</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Version</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>1.0.0-beta</span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
    <AnimatePresence>
      {open ? (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', zIndex: 998 }}
            onClick={onClose}
          />
          <motion.aside 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="settings-drawer" 
            style={{ 
              position: 'fixed', top: 0, right: 0, bottom: 0, 
              width: '100%', maxWidth: '1100px', 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(16px)', 
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)', 
              zIndex: 999, 
              display: 'flex', flexDirection: 'column', 
              boxShadow: '-25px 0 50px -12px rgba(0, 0, 0, 0.5)' 
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Settings</h2>
              <button 
                className="icon-button" 
                onClick={onClose} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', transition: 'opacity 0.2s' }}
                aria-label="Close settings"
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Split Pane Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} className="settings-split-pane">
              
              {/* Sidebar */}
              <div 
                className="settings-sidebar"
                style={{ 
                  width: '260px', 
                  minWidth: '260px',
                  borderRight: '1px solid rgba(255,255,255,0.05)', 
                  padding: '1.5rem 1rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      fontWeight: activeTab === tab.id ? 500 : 400,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <tab.icon size={18} color={activeTab === tab.id ? '#10b981' : 'currentColor'} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <LiveSettingsClock />
              {/* Main Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
                <div style={{ maxWidth: '640px' }}>
                  {renderTabContent()}
                </div>
              </div>

            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>

    <AnimatePresence>
      {showLogoutDialog && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogoutDialog(false) }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="drawer-card" 
            style={{ 
              width: '100%', 
              maxWidth: '420px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Sign out?</h3>
              <button className="icon-button" style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }} onClick={() => setShowLogoutDialog(false)} aria-label="Cancel sign out">
                <X size={24} />
              </button>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>Do you want to forget this account from this device, or keep it remembered?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button className="primary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(false); }}>
                Remember account
              </button>
              <button className="secondary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(true); }}>
                Forget account
              </button>
              <button className="secondary-btn" style={{ background: 'transparent', border: '1px solid var(--border-strong)', padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>


    <AnimatePresence>
      {showCacheDialog && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCacheDialog(false) }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="drawer-card" 
            style={{ 
              width: '100%', 
              maxWidth: '420px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HardDrive size={24} color="#10b981" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Clear Local Cache</h3>
            </div>
            
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Clear local cache? This will remove temporary data stored on this device. <strong>Your account and cloud data will not be deleted.</strong>
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                className="secondary-btn" 
                style={{ flex: 1, padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center' }} 
                onClick={() => setShowCacheDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="primary-btn" 
                style={{ flex: 1, padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', background: '#10b981', color: '#fff', border: 'none' }} 
                onClick={handleClearCacheConfirm}
              >
                Clear Cache
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showDeleteDialog && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setShowDeleteDialog(false) }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="drawer-card" 
            style={{ 
              width: '100%', 
              maxWidth: '480px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.15)',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={24} /> Delete Account?
              </h3>
              <button 
                className="icon-button" 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', opacity: isDeleting ? 0.5 : 1 }} 
                onClick={() => !isDeleting && setShowDeleteDialog(false)} 
                disabled={isDeleting}
                aria-label="Cancel delete"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5, color: '#e2e8f0' }}>
              This permanently deletes your account, UID, profile, linked email/Google account, projects, progress, XP, achievements, and all other account data. <br/><br/>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Note: Copies of 1-on-1 Direct Messages you have already sent to other users will be retained in their history.
              </span>
              <br/><br/>
              <strong style={{ color: '#ef4444' }}>This action cannot be undone.</strong>
            </p>
            
            {deleteError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem' }}>
                {deleteError}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button 
                style={{ background: '#ef4444', color: 'var(--text-main)', border: 'none', padding: '0.875rem', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: isDeleting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: isDeleting ? 0.7 : 1 }} 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete my account permanently'}
              </button>
              <button 
                className="secondary-btn" 
                style={{ background: 'transparent', border: '1px solid var(--border-strong)', padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showRemoveGithubDialog && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRemoveGithubDialog(false) }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Remove GitHub account?</h3>
              <button 
                className="icon-button" 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }} 
                onClick={() => setShowRemoveGithubDialog(false)} 
                aria-label="Cancel"
              >
                <X size={24} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              This will disconnect this GitHub account and remove all repositories imported from it, along with their associated GitHub evidence/project data.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                className="secondary-btn" 
                style={{ flex: 1, padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center' }} 
                onClick={() => setShowRemoveGithubDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="primary-btn" 
                style={{ flex: 1, padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', background: '#ef4444', color: 'var(--text-main)', border: 'none' }} 
                onClick={disconnectGitHub}
              >
                Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      <LegalModal
        isOpen={showLegalModal.isOpen}
        onClose={() => setShowLegalModal({ isOpen: false, type: 'privacy' })}
        title={showLegalModal.type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        content={showLegalModal.type === 'privacy' ? privacyPolicyText : termsOfServiceText}
      />
      <SubmitFeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} userId={userId || ''} />
      <HelpCenterModal 
        isOpen={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)} 
      />
      <PrivacyModals 

        chatState={chatState}
        onChatStateChange={onChatStateChange}
        isPasswordOpen={isPasswordModalOpen}
        setIsPasswordOpen={setIsPasswordModalOpen}
        isSessionsOpen={isSessionsModalOpen}
        setIsSessionsOpen={setIsSessionsModalOpen}
        isBlockedOpen={isBlockedModalOpen}
        setIsBlockedOpen={setIsBlockedModalOpen}
      />
    </>
  )
}

