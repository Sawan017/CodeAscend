import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UserProfile } from '../types'
import { fetchPublicProfiles, fetchPublicProfileByUsername } from '../lib/api'

type UserSearchProps = {
  open: boolean
  onClose: () => void
  onSelectUser: (userId: string) => void
}

export function UserSearch({ open, onClose, onSelectUser }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [profiles, setProfiles] = useState<Array<{ userId: string; username: string; displayName: string; avatar?: string; level: number }>>([])
  const [loading, setLoading] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (open) {
      loadProfiles()
    }
  }, [open])

  async function loadProfiles() {
    setLoading(true)
    const publicProfiles = await fetchPublicProfiles()
    setProfiles(publicProfiles)
    setLoading(false)
  }

  async function handleSearch() {
    if (!query.trim()) {
      loadProfiles()
      return
    }

    setLoading(true)
    const profile = await fetchPublicProfileByUsername(query.trim())
    if (profile) {
      setProfiles([profile])
      setSelectedProfile({
        userId: profile.userId,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        bio: profile.bio,
        title: profile.title || '',
        introduction: '',
        education: '',
        focus: '',
        technologies: [],
        github: '',
        linkedin: '',
        contact: '',
        contactPublic: false,
        level: profile.level,
        xp: profile.xp,
      })
    } else {
      setProfiles([])
      setSelectedProfile(null)
    }
    setLoading(false)
  }

  function handleSelectProfile(profile: UserProfile) {
    setSelectedProfile(profile)
  }

  function handleViewFullProfile() {
    if (selectedProfile && selectedProfile.userId) {
      onSelectUser(selectedProfile.userId)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="user-search-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">DISCOVER</p>
                <h3>Find Developers</h3>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close search">
                <X size={18} />
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="secondary-btn" onClick={handleSearch}>
                <Search size={16} />
              </button>
            </div>

            {!selectedProfile ? (
              <div className="user-list">
                {loading ? (
                  <p className="muted">Loading...</p>
                ) : profiles.length === 0 ? (
                  <p className="muted">No users found</p>
                ) : (
                  profiles.map((profile) => (
                    <motion.button
                      key={profile.userId}
                      whileHover={{ scale: 1.02 }}
                      className="user-card"
                      onClick={() =>
                        handleSelectProfile({
                          userId: profile.userId,
                          username: profile.username,
                          displayName: profile.displayName,
                          avatar: profile.avatar,
                          bio: '',
                          title: '',
                          introduction: '',
                          education: '',
                          focus: '',
                          technologies: [],
                          github: '',
                          linkedin: '',
                          contact: '',
                          contactPublic: false,
                          level: profile.level,
                          xp: 0,
                        })
                      }
                    >
                      <div className="user-avatar">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt={profile.displayName || 'User'} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="user-info">
                        <h4>{profile.displayName}</h4>
                        <p className="muted">@{profile.username} · Level {profile.level}</p>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-preview"
              >
                <div className="preview-header">
                  <div className="avatar-badge large">
                    {selectedProfile.avatar ? (
                      <img src={selectedProfile.avatar} alt={selectedProfile.displayName || 'User'} />
                    ) : (
                      (selectedProfile.displayName?.charAt(0).toUpperCase() || '?')
                    )}
                  </div>
                  <div>
                    <h4>{selectedProfile.displayName}</h4>
                    <p className="muted">@{selectedProfile.username} · Level {selectedProfile.level}</p>
                  </div>
                </div>

                {selectedProfile.bio && <p className="copy">{selectedProfile.bio}</p>}
                {selectedProfile.title && <p className="muted">{selectedProfile.title}</p>}

                <div className="preview-stats">
                  <div><strong>{selectedProfile.xp}</strong><span>XP</span></div>
                  <div><strong>{selectedProfile.level}</strong><span>Level</span></div>
                </div>

                <button className="primary-btn" onClick={handleViewFullProfile}>
                  View Full Profile
                </button>
                <button className="secondary-btn" onClick={() => setSelectedProfile(null)}>
                  Back to Search
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}