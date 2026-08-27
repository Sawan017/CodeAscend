import React from 'react';
import { Target, Star, BookOpen, Folder, Users, MessageSquare, Rocket, Briefcase, Settings, Bell, ChevronRight, Home } from "lucide-react";
import type { Progression, UserProfile, Route } from "../types";
import { calculateProgressToNextLevel } from "../lib/progression";

type AppLayoutProps = {
  children: React.ReactNode;
  route: Route;
  onNavigate: (route: Route) => void;
  profile: UserProfile;
  progression: Progression;
  unreadCount: number;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
};

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'learning', label: 'Learn', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'achievements', label: 'Achievements', icon: Star },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'future', label: 'Future', icon: Rocket },
  { id: 'career_world', label: 'Career', icon: Briefcase }
];

export const AppLayout = ({
  children, route, onNavigate, profile, progression,
  unreadCount, onOpenSettings, onOpenNotifications
}: AppLayoutProps) => {
  const { level, currentXp, progress, requiredXp } = calculateProgressToNextLevel(progression.xp);

  return (
    <div className="rpg-app-root">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="game-top-nav">
        <div className="nav-brand">
          CODE<span>ASCEND</span>
        </div>
        
        <div className="nav-center">
          {navItems.map(item => {
            const isActive = route.view === item.id;
            return (
              <button 
                key={item.id} 
                className={`nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate({view: item.id as any})}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            )
          })}
        </div>
        
        <div className="nav-right">
          <button className="nav-icon-btn" onClick={onOpenNotifications} style={{ position: 'relative' }}>
            <Bell size={20} />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, background: 'var(--accent-red)', borderRadius: '50%' }} />}
          </button>
          <button className="nav-icon-btn" onClick={onOpenSettings}>
            <Settings size={20} />
          </button>
          
          <div 
            onClick={() => onNavigate({view: 'profile'})}
            style={{ 
              width: 44, height: 44, 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--surface-mid)', 
              overflow: 'hidden', 
              cursor: 'pointer', 
              marginLeft: '8px', 
              border: '2px solid var(--border-medium)',
              transition: 'border-color 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: 'var(--accent-blue)'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-green)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            title="View Profile"
          >
            {profile.avatar ? <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile.displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* 2. MAIN APP CONTENT */}
      <main className="rpg-app-container">
        <div className={route.view === 'dashboard' ? 'rpg-dashboard-canvas' : 'rpg-dashboard-canvas'} style={{ maxWidth: route.view === 'dashboard' ? '1400px' : '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

    </div>
  );
};
