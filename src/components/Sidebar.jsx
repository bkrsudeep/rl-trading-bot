import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Cpu, 
  Layers, 
  Wallet, 
  Activity, 
  BookOpen, 
  Settings,
  ShieldAlert,
  Server
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, backendStatus, onOpenSettings }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Stock Analytics', icon: LineChart },
    { id: 'prediction', label: 'AI Prediction Engine', icon: Cpu },
    { id: 'lstm-input', label: 'LSTM Window State', icon: Layers },
    { id: 'portfolio', label: 'Portfolio Simulator', icon: Wallet },
    { id: 'architecture', label: 'Model Architecture', icon: BookOpen },
    { id: 'activity', label: 'Prediction Activity', icon: Activity },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ 
        padding: '24px 20px', 
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#04211A',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)'
        }}>
          <Cpu size={20} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            RL TRADER <span style={{ color: 'var(--teal-400)', fontSize: '11px', fontWeight: 600 }}>LSTM-DQN</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            College Engineering Project
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: 700, 
          color: 'var(--text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em',
          padding: '8px 12px 4px'
        }}>
          Trading System
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(20, 184, 166, 0.12)' : 'transparent',
                color: isActive ? 'var(--teal-400)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid var(--teal-400)' : '3px solid transparent'
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Backend & Settings Footer */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Backend Status indicator */}
        <div style={{
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-dot ${backendStatus.connected ? 'online' : backendStatus.isDemo ? 'demo' : 'offline'}`} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {backendStatus.connected ? 'FastAPI Online' : backendStatus.isDemo ? 'Demo Mode Active' : 'Backend Offline'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {backendStatus.connected ? 'Render Backend' : backendStatus.isDemo ? 'Local Simulator' : 'Unreachable'}
              </div>
            </div>
          </div>
          <button 
            onClick={onOpenSettings}
            title="Configure Backend URL"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Settings size={15} />
          </button>
        </div>

        {/* Academic Project Disclaimer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '8px', 
          fontSize: '10px', 
          color: 'var(--text-muted)',
          lineHeight: '1.4',
          padding: '0 4px'
        }}>
          <ShieldAlert size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
          <span>Academic demo: synthetic dataset. Not validated on real exchange data.</span>
        </div>
      </div>
    </aside>
  );
}
