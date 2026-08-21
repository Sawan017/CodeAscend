import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, ChevronRight, HelpCircle, ChevronLeft } from 'lucide-react'

interface HelpCenterModalProps {
  isOpen: boolean
  onClose: () => void
}

const HELP_DATA = {
  'Account & Profile': [
    { q: 'How do I change my username?', a: 'You can change your username in the Account tab under Profile Settings. Note that changing your username may affect your profile link.' },
    { q: 'How do I update my avatar?', a: 'Go to Profile & Personalization and click on your current avatar to upload a new one.' },
    { q: 'Can I hide my profile?', a: 'Yes, in the Profile & Personalization tab, you can set your profile visibility to Private.' }
  ],
  'Friends & Requests': [
    { q: 'How do I add a friend?', a: 'Navigate to the Friends tab, search for their username, and click Add Friend.' },
    { q: 'Why can I not send a friend request?', a: 'The user may have disabled friend requests in their Privacy settings or restricted them to Friends of Friends.' }
  ],
  'Messages & Groups': [
    { q: 'How do I create a group?', a: 'In the Chat tab, click the plus icon and select Create Group.' },
    { q: 'Can I delete a message?', a: 'Currently, messages cannot be deleted once sent.' }
  ],
  'Learning / XP / Badges': [
    { q: 'How do I earn XP?', a: 'You earn XP by completing courses, participating in chats, and earning achievements.' },
    { q: 'Where are my badges?', a: 'Your earned badges are displayed on your public profile.' }
  ],
  'Notifications': [
    { q: 'How do I turn off email notifications?', a: 'Email notifications have been replaced by browser notifications. You can toggle them in the Notifications tab.' }
  ],
  'Privacy & Security': [
    { q: 'How do I block someone?', a: 'Go to their profile and select Block, or manage blocked users in Privacy & Security.' },
    { q: 'How do I change my password?', a: 'Go to Privacy & Security -> Password -> Change.' },
    { q: 'How do I manage active sessions?', a: 'Go to Privacy & Security -> Active Sessions -> View Sessions.' }
  ],
  'Data & Storage': [
    { q: 'How do I export my data?', a: 'Go to Data & Storage and click Request Export to download a JSON file of your data.' },
    { q: 'What does Clear Local Cache do?', a: 'It removes temporary files from your device to free up space, without deleting your actual account or cloud data.' }
  ]
}

export function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleClose = () => {
    setActiveCategory(null)
    setSearchQuery('')
    onClose()
  }

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const results: { category: string; q: string; a: string }[] = []
    const query = searchQuery.toLowerCase()
    
    Object.entries(HELP_DATA).forEach(([cat, faqs]) => {
      faqs.forEach(faq => {
        if (faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)) {
          results.push({ category: cat, ...faq })
        }
      })
    })
    return results
  }, [searchQuery])

  return (
    <AnimatePresence>
      {isOpen && (
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
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="drawer-card" 
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              maxHeight: '85vh',
              display: 'flex', 
              flexDirection: 'column', 
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeCategory ? (
                  <button 
                    onClick={() => setActiveCategory(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                ) : (
                  <HelpCircle size={22} color="#3b82f6" />
                )}
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  {activeCategory || 'Help Center'}
                </h3>
              </div>
              <button 
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Search (only show if not in category view) */}
            {!activeCategory && (
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search help articles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem 0.75rem 2.5rem', 
                      background: 'var(--bg-surface-sunken)', 
                      border: '1px solid var(--border-strong)', 
                      borderRadius: '8px', 
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {searchQuery.trim() && !activeCategory ? (
                // Search Results
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Search Results ({searchResults.length})
                  </h4>
                  {searchResults.length > 0 ? searchResults.map((result, i) => (
                    <div key={i} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{result.category}</span>
                      <h5 style={{ margin: '0.5rem 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>{result.q}</h5>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{result.a}</p>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                      No articles found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              ) : activeCategory ? (
                // Article List for Category
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {HELP_DATA[activeCategory as keyof typeof HELP_DATA]?.map((faq, i) => (
                    <div key={i} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>{faq.q}</h5>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                // Category List
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.keys(HELP_DATA).map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        textAlign: 'left',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                    >
                      {category}
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
